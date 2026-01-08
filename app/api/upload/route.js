import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

// 初始化 Supabase 客户端
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
);

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // 将 File 对象转换为 Buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // 使用 sharp 压缩图片，支持多种格式和尺寸
    const sharpInstance = sharp(buffer);
    const metadata = await sharpInstance.metadata();
    
    // Generate multiple sizes for responsive images
    const sizes = [
      { width: 400, suffix: '-sm' },
      { width: 800, suffix: '-md' },
      { width: 1200, suffix: '-lg' }
    ];
    
    const uploadPromises = [];
    const baseFileName = `${Date.now()}`;
    
    // Generate WebP versions for better compression
    for (const size of sizes) {
      const webpBuffer = await sharp(buffer)
        .resize(size.width, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
        .webp({ quality: 80 })
        .toBuffer();
        
      const webpFileName = `${baseFileName}${size.suffix}.webp`;
      uploadPromises.push(
        supabase.storage
          .from('cover')
          .upload(webpFileName, webpBuffer, {
            contentType: 'image/webp'
          })
      );
    }
    
    // Also generate a fallback JPEG
    const compressedImageBuffer = await sharp(buffer)
      .resize(800, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .jpeg({ quality: 85, progressive: true })
      .toBuffer();

    // Upload the fallback JPEG
    const fileName = `${baseFileName}.jpg`;
    const { data, error } = await supabase.storage
      .from('cover')
      .upload(fileName, compressedImageBuffer, {
        contentType: 'image/jpeg'
      }); 

    if (error) {
      throw error;
    }

    // Wait for all WebP uploads to complete
    await Promise.all(uploadPromises);

    // 获取文件的公共URL
    const { data: { publicUrl } } = supabase.storage
      .from('cover')
      .getPublicUrl(fileName);
    
    // Return URLs for all formats
    const webpUrls = sizes.reduce((acc, size) => {
      const webpUrl = supabase.storage
        .from('cover')
        .getPublicUrl(`${baseFileName}${size.suffix}.webp`).data.publicUrl;
      acc[size.suffix.replace('-', '')] = webpUrl;
      return acc;
    }, {});
    
    return NextResponse.json({ 
      url: publicUrl,
      webp: webpUrls,
      metadata: {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format
      }
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
} 