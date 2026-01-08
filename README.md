<div align="center">
  <h1> ProrisePromptMinder </h1>
  <p>
    <a href="README.md"> 中文 </a> | 
    <a href="README_EN.md"> English </a>
  </p>
  <p> 一个专业的提示词管理平台，让 AI 提示词管理更简单、更高效 </p>
</div>
![首页图片](public/main-page.png)

## 🌟 特性

### 核心功能

- ✅ **提示词版本管理** - 支持版本回溯和历史记录查看
- ✅ **版本差异对比** - 类似 Git diff 的并排对比视图，快速识别提示词更新变化
- ✅ **标签化管理** - 自定义标签，快速分类和检索
- ✅ **公私有模式** - 支持私有提示词和公共分享
- ✅ **AI 智能生成** - 集成 AI 模型，智能生成优质提示词
- ✅ **团队协作** - 支持团队创建、成员管理与权限控制
- ✅ **提示词贡献** - 社区贡献功能，审核发布流程

### 用户体验

- 📱 **移动端适配** - 响应式设计，完美支持移动设备
- 🌍 **国际化支持** - 支持中文和英文双语
- 🎨 **现代化界面** - 基于 Shadcn UI 的精美设计
- 🔍 **智能搜索** - 快速搜索和过滤功能
- 📋 **一键复制** - 方便的复制和分享功能

### 技术特性

- ⚡ **高性能** - Next.js 16 + React 19，极速加载
- 🔐 **安全认证** - Clerk 提供企业级用户认证
- 💾 **可靠存储** - Supabase + PostgreSQL 数据库
- 🚀 **易部署** - 支持 Vercel、Zeabur 一键部署

## 🚀 快速开始

### 环境要求

- Node.js 20.0 或更高版本
- npm 或 pnpm 包管理器
- Git

### 本地开发

1. **克隆项目**

```bash
git clone https://github.com/your-username/ProrisePromptMinder.git
cd ProrisePromptMinder
```

2. **安装依赖**

```bash
# 推荐使用 pnpm
pnpm install
```

3. **配置环境变量**
   创建 `.env.local` 文件并配置以下变量：

```env
# Supabase 配置
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Clerk 认证配置
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# NextAuth 配置
AUTH_SECRET=your_auth_secret

# AI API 配置
ZHIPU_API_KEY=your_zhipu_api_key

# GitHub OAuth (可选)
GITHUB_ID=your_github_app_id
GITHUB_SECRET=your_github_app_secret

# 基础 URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. **启动开发服务器**

```bash
npm run dev
# 或者使用 pnpm
pnpm dev
```

访问 [http://localhost: 3000](http://localhost:3000) 查看应用。

## 📦 部署指南

详细的部署教程请参考：[**DEPLOY_GUIDE.md**](./DEPLOY_GUIDE.md)

### 快速部署

#### Vercel 部署（推荐）

📖 **完整教程**：请查看 [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md) 获取详细的步骤说明。

**快速步骤**：
1. Fork 本项目到你的 GitHub 账户
2. 在 [Vercel](https://vercel.com) 中导入项目
3. 配置环境变量（参考上方环境变量说明）
4. 点击部署，等待完成

#### Zeabur 部署

1. 访问 [Zeabur](https://zeabur.com) 并登录
2. 创建新项目并连接 GitHub 仓库
3. 配置环境变量
4. 部署并获取访问地址

[![Deployed on Zeabur](https://zeabur.com/deployed-on-zeabur-dark.svg)](https://zeabur.com/referral?referralCode=aircrushin&utm_source=aircrushin&utm_campaign=oss)

## 🗃 数据库配置

### Supabase 设置

详细的数据库配置步骤请参考：[**DEPLOY_GUIDE.md - 第二步：配置 Supabase 数据库**](./DEPLOY_GUIDE.md#第二步配置-supabase-数据库)

**快速步骤**：
1. 注册 [Supabase](https://supabase.com) 账户并创建项目
2. 获取项目 URL 和匿名密钥
3. 在 Supabase SQL Editor 中按顺序执行 `/sql` 目录下的 SQL 文件：
   - `sql/teams.sql` - 创建团队相关表
   - `sql/project.sql` - 创建项目表
   - `sql/prompts.sql` - 创建提示词表
   - `sql/tags.sql` - 创建标签表
   - `sql/provider_keys.sql` - 创建 API 密钥表
   - `sql/contributions.sql` - 创建贡献表（可选）

> 💡 **提示**：所有 SQL 文件都包含 `IF NOT EXISTS` 检查，可以安全地重复执行。

## 🔐 认证配置

### Clerk 设置

详细的认证配置步骤请参考：[**DEPLOY_GUIDE.md - 第三步：配置 Clerk 认证**](./DEPLOY_GUIDE.md#第三步配置-clerk-认证)

**快速步骤**：
1. 访问 [Clerk](https://clerk.com) 并创建新应用
2. 选择认证方式（推荐：Email、Google、GitHub）
3. 获取 Publishable Key 和 Secret Key
4. 添加到环境变量中

更多信息请参考 [Clerk 官方文档](https://clerk.com/docs)

## 🌍 国际化

项目支持多语言，目前支持：

- 🇨🇳 简体中文
- 🇺🇸 English

语言文件位于 `/messages` 目录：

- `zh.json` - 中文翻译
- `en.json` - 英文翻译

### 添加新语言

1. 在 `/messages` 目录创建新的语言文件
2. 复制现有翻译文件的结构
3. 在 `LanguageContext` 中添加新语言支持

## 🛠 开发指南

### 项目结构

```
ProrisePromptMinder/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   ├── prompts/           # 提示词相关页面
│   ├── tags/              # 标签管理页面
│   └── ...
├── components/            # React 组件
│   ├── ui/                # 基础 UI 组件
│   ├── prompt/            # 提示词相关组件
│   └── ...
├── contexts/              # React Context
├── hooks/                 # 自定义 Hooks
├── lib/                   # 工具库和配置
├── messages/              # 国际化文件
├── public/                # 静态资源
└── sql/                   # 数据库脚本
```

### 代码规范

详细的代码规范请参考：[**AGENTS.md**](./AGENTS.md)

**主要规范**：
- ✅ 使用 ESLint 进行代码检查
- ✅ 遵循 React Hooks 最佳实践
- ✅ 使用 JavaScript (jsx/js 文件)
- ✅ CSS 使用 Tailwind CSS
- ✅ 使用绝对路径导入 (`@/components/...`)
- ✅ 组件导出在文件底部

### 贡献指南

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交变更 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 🤝 社区

### 用户反馈

使用 [Canny](https://canny.io) 收集用户反馈和功能请求。

1. 注册 Canny 账号并创建项目
2. 获取 Canny URL
3. 在应用的 Footer 组件中配置链接

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE)。

## 💖 支持项目

如果这个项目对你有帮助，欢迎：

- ⭐ 给项目点个星
- 🍴 Fork 并改进
- 🐛 提交 Bug 报告
- 💡 提出新功能建议


---

<div align="center">
  <strong> ProrisePromptMinder </strong> - 让 AI 提示词管理更简单 ✨
</div>
