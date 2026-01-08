<div align="center">
  <h1>ProrisePromptMinder</h1>
  <p>
    <a href="README.md">中文</a> | 
    <a href="README_EN.md">English</a>
  </p>
  <p>A professional prompt management platform that makes AI prompt management simpler and more efficient</p>
</div>
![HomeImage](https://prorise-blog.oss-cn-guangzhou.aliyuncs.com/cover/main-page.png)


## 🌟 Features

### Core Functions

- ✅ **Prompt Version Management** - Support for version history and rollback
- ✅ **Version Diff Comparison** - Git-like side-by-side diff view to quickly identify prompt changes
- ✅ **Tag Management** - Custom tags for quick categorization and retrieval
- ✅ **Public/Private Mode** - Support for private prompts and public sharing
- ✅ **AI Smart Generation** - Integrated AI models for generating quality prompts
- ✅ **Team Collaboration** - Support for team creation and member management (in development)
- ✅ **Prompt Contributions** - Community contribution features with review and publishing process

### User Experience

- 📱 **Mobile Responsive** - Responsive design, perfect support for mobile devices
- 🌍 **Internationalization** - Support for Chinese and English
- 🎨 **Modern Interface** - Beautiful design based on Shadcn UI
- 🔍 **Smart Search** - Quick search and filtering functionality
- 📋 **One-Click Copy** - Convenient copy and share functions

### Technical Features

- ⚡ **High Performance** - Next.js 16 + React 19, lightning-fast loading
- 🔐 **Secure Authentication** - Enterprise-grade user authentication with Clerk
- 💾 **Reliable Storage** - Supabase + PostgreSQL database
- 🚀 **Easy Deployment** - Support for one-click deployment with Vercel and Zeabur

## 🚀 Quick Start

### Requirements

- Node.js 20.0 or higher
- npm or pnpm package manager
- Git

### Local Development

1. **Clone the project**

```bash
git clone https://github.com/your-username/ProrisePromptMinder.git
cd ProrisePromptMinder
```

2. **Install dependencies**

```bash
# recommend using pnpm
pnpm install
```

3. **Configure environment variables**
   Create a `.env.local` file and configure the following variables:

```env
# Supabase configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Clerk authentication configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# NextAuth configuration
AUTH_SECRET=your_auth_secret

# AI API configuration
ZHIPU_API_KEY=your_zhipu_api_key

# GitHub OAuth (optional)
GITHUB_ID=your_github_app_id
GITHUB_SECRET=your_github_app_secret

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. **Start the development server**

```bash
npm run dev
# or use pnpm
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

## 📦 Deployment Guide

For detailed deployment instructions, please refer to: [**DEPLOY_GUIDE.md**](./DEPLOY_GUIDE.md)

### Quick Deployment

#### Vercel Deployment (Recommended)

📖 **Full Tutorial**: See [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md) for detailed step-by-step instructions.

**Quick Steps**:
1. Fork this project to your GitHub account
2. Import the project in [Vercel](https://vercel.com)
3. Configure environment variables (see environment variables above)
4. Click Deploy and wait for completion

#### Zeabur Deployment

1. Visit [Zeabur](https://zeabur.com) and log in
2. Create a new project and connect your GitHub repository
3. Configure environment variables
4. Deploy and get the access address

[![Deployed on Zeabur](https://zeabur.com/deployed-on-zeabur-dark.svg)](https://zeabur.com/referral?referralCode=prorise-cool&utm_source=prorise-cool&utm_campaign=oss)

## 🗃 Database Configuration

### Supabase Setup

For detailed database configuration steps, please refer to: [**DEPLOY_GUIDE.md - Step 2: Configure Supabase Database**](./DEPLOY_GUIDE.md#第二步配置-supabase-数据库)

**Quick Steps**:
1. Register for a [Supabase](https://supabase.com) account and create a project
2. Get the project URL and anonymous key
3. Execute SQL files from the `/sql` directory in order in Supabase SQL Editor:
   - `sql/teams.sql` - Create team-related tables
   - `sql/project.sql` - Create project table
   - `sql/prompts.sql` - Create prompts table
   - `sql/tags.sql` - Create tags table
   - `sql/provider_keys.sql` - Create API keys table
   - `sql/contributions.sql` - Create contributions table (optional)

> 💡 **Tip**: All SQL files include `IF NOT EXISTS` checks, so they can be safely executed multiple times.

## 🔐 Authentication Configuration

### Clerk Setup

For detailed authentication configuration steps, please refer to: [**DEPLOY_GUIDE.md - Step 3: Configure Clerk Authentication**](./DEPLOY_GUIDE.md#第三步配置-clerk-认证)

**Quick Steps**:
1. Visit [Clerk](https://clerk.com) and create a new application
2. Select authentication methods (recommended: Email, Google, GitHub)
3. Get the Publishable Key and Secret Key
4. Add them to your environment variables

For more information, refer to the [Clerk official documentation](https://clerk.com/docs)

## 🌍 Internationalization

The project supports multiple languages, currently:

- 🇨🇳 Simplified Chinese
- 🇺🇸 English

Language files are located in the `/messages` directory:

- `zh.json` - Chinese translations
- `en.json` - English translations

### Adding a new language

1. Create a new language file in the `/messages` directory
2. Copy the structure of an existing translation file
3. Add support for the new language in `LanguageContext`

## 🛠 Development Guide

### Project Structure

```
ProrisePromptMinder/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── prompts/           # Prompt-related pages
│   ├── tags/              # Tag management pages
│   └── ...
├── components/            # React components
│   ├── ui/                # Basic UI components
│   ├── prompt/            # Prompt-related components
│   └── ...
├── contexts/              # React Context
├── hooks/                 # Custom Hooks
├── lib/                   # Utility libraries and configurations
├── messages/              # Internationalization files
├── public/                # Static resources
└── sql/                   # Database scripts
```

### Code Standards

For detailed code standards, please refer to: [**AGENTS.md**](./AGENTS.md)

**Main Standards**:
- ✅ Use ESLint for code checking
- ✅ Follow React Hooks best practices
- ✅ Use JavaScript (jsx/js files)
- ✅ CSS uses Tailwind CSS
- ✅ Use absolute path imports (`@/components/...`)
- ✅ Export components at the bottom of files

### Contribution Guidelines

1. Fork this project
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

## 🤝 Community

### User Feedback

Use [Canny](https://canny.io) to collect user feedback and feature requests.

1. Register for a Canny account and create a project
2. Get the Canny URL
3. Configure the link in the application's Footer component

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 💖 Support the Project

If this project has been helpful to you, welcome to:

- ⭐ Star the project
- 🍴 Fork and improve
- 🐛 Submit bug reports
- 💡 Suggest new features


---

<div align="center">
  <strong>ProrisePromptMinder</strong> - Making AI prompt management simpler ✨
</div>
