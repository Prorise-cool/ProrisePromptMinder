'use client';
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Roadmap() {
    const { t } = useLanguage();

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">
                {t?.header?.roadmap || '路线图'}
            </h1>

            <div className="space-y-6">
                <section>
                    <p className="text-gray-700">
                        {t?.header?.roadmap || '路线图'} 页面正在建设中，敬请期待。
                    </p>
                </section>
            </div>
        </div>
    );
}

