# ProrisePromptMinder Vercel 部署指南

从零开始，手把手教你部署 ProrisePromptMinder 到 Vercel。

---

## 准备工作

需要注册以下账号（均免费）：

| 服务 | 地址 | 用途 |
|------|------|------|
| GitHub | https://github.com | 代码托管 |
| Vercel | https://vercel.com | 应用部署 |
| Supabase | https://supabase.com | 数据库 |
| Clerk | https://clerk.com | 用户认证 |

---

## 第一步：Fork 项目

1. 打开 [Prorise-cool/ProrisePromptMinder](https://github.com/Prorise-cool/ProrisePromptMinder)
2. 点击右上角 **Fork** 按钮
3. 等待 Fork 完成

---

## 第二步：配置 Supabase 数据库

### 2.1 创建项目

1. 登录 [Supabase](https://supabase.com)
2. 点击 **New Project**
3. 填写：
   - **Name**: `ProrisePromptMinder`（或任意名称）
   - **Database Password**: 设置一个强密码（记住它）
   - **Region**: 选择离你最近的区域（推荐 Singapore 或 Tokyo）
4. 点击 **Create new project**
5. 等待项目创建完成

### 2.2 获取 API 密钥

1. 进入项目后，停留在Project OverView页面
2. 点击 **API**
3. 记录以下信息：
   - **Project URL** → 这是 `SUPABASE_URL`
   - **Publishable API Key** → 这是 `SUPABASE_ANON_KEY`

![image-20260108103004156](https://prorise-blog.oss-cn-guangzhou.aliyuncs.com/cover/image-20260108103004156.png)

### 2.3 创建数据表

1. 点击左侧 **SQL Editor**
2. 点击 **New query**
3. **按顺序**执行以下 SQL（每次粘贴一段，点击 **Run**）：

**第一步：创建 teams 表**

```sql
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    avatar_url TEXT,
    is_personal BOOLEAN NOT NULL DEFAULT false,
    created_by TEXT NOT NULL,
    owner_id TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_team_name_not_empty CHECK (char_length(trim(name)) > 0),
    CONSTRAINT chk_personal_owner_matches_creator CHECK (is_personal = false OR created_by = owner_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_teams_personal_owner ON teams(owner_id) WHERE is_personal;
CREATE INDEX IF NOT EXISTS idx_teams_owner_id ON teams(owner_id);
CREATE INDEX IF NOT EXISTS idx_teams_created_by ON teams(created_by);
```

**第二步：创建 team_members 表**

```sql
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    email TEXT,
    role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('pending', 'active', 'left', 'removed', 'blocked')),
    invited_by TEXT,
    invited_at TIMESTAMPTZ,
    joined_at TIMESTAMPTZ,
    left_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by TEXT,
    UNIQUE(team_id, user_id),
    CONSTRAINT chk_owner_must_be_active CHECK (role <> 'owner' OR status = 'active')
);

CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_team_members_single_owner ON team_members(team_id) WHERE role = 'owner' AND status = 'active';
CREATE INDEX IF NOT EXISTS idx_team_members_email ON team_members(email);
```

**第三步：创建 projects 表**

```sql
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_by TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_project_name_not_empty CHECK (char_length(trim(name)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_projects_team_id ON projects(team_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON projects(created_by);
CREATE UNIQUE INDEX IF NOT EXISTS idx_projects_team_name ON projects(team_id, lower(name));
```

**第四步：创建 prompts 表**

```sql
CREATE TABLE IF NOT EXISTS prompts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    description TEXT,
    created_by TEXT NOT NULL,
    user_id TEXT,
    version TEXT,
    tags TEXT,
    is_public BOOLEAN NOT NULL DEFAULT false,
    cover_img TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_prompt_title_not_empty CHECK (char_length(trim(title)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_prompts_team_id ON prompts(team_id);
CREATE INDEX IF NOT EXISTS idx_prompts_created_by ON prompts(created_by);
CREATE INDEX IF NOT EXISTS idx_prompts_project_id ON prompts(project_id);
```

**第五步：创建 tags 表**

```sql
CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    user_id TEXT,
    created_by TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(name, team_id, user_id),
    CONSTRAINT chk_tag_name_not_empty CHECK (char_length(trim(name)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_tags_team_id ON tags(team_id);
CREATE INDEX IF NOT EXISTS idx_tags_user_id ON tags(user_id);
```

**第六步：创建 prompt_contributions 表（可选，用于社区贡献功能）**

```sql
CREATE TABLE prompt_contributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    role_category TEXT NOT NULL,
    content TEXT NOT NULL,
    contributor_email TEXT,
    contributor_name TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by TEXT,
    published_prompt_id UUID,
    CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'rejected'))
);

CREATE INDEX idx_prompt_contributions_status ON prompt_contributions(status);
CREATE INDEX idx_prompt_contributions_created_at ON prompt_contributions(created_at DESC);
```

---
## 第三步：配置 Clerk 认证

### 3.1 创建应用

1. 登录 Clerk
2. 点击 **Create application**
3. 输入应用名称，如 `ProrisePromptMinder`
4. 选择登录方式（推荐勾选 **Email** 和 **Google** 与 **Github**）
5. 点击 **Create application**

### 3.2 获取密钥

创建应用后会自动跳转到 **Quick Start** 引导页，**直接在当前页面获取密钥**（无需进入 API Keys 菜单）：

1. 找到页面中间的 **Step 2. Set your environment keys**。
2. 默认选中的是 `.env.local` 标签，直接复制黑色代码框中的两行内容：
* `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`（以 `pk_` 开头）
* `CLERK_SECRET_KEY`（以 `sk_` 开头）

### 3.3 配置域名（部署后再做）

部署完成后，需要回来添加你的 Vercel 域名（**注意：此时需点击页面左上角的 X 或 Back to home 进入控制台主页**）：

1. 点击左侧侧边栏的 **Domains**
2. 添加你的 Vercel 域名（如 `your-app.vercel.app`）

---

## 第四步：部署到 Vercel

### 4.1 导入项目

1. 登录 [Vercel](https://vercel.com)
2. 点击 **Add New** → **Project**
3. 选择 **Import Git Repository**
4. 找到你 Fork 的 `ProrisePromptMinder` 仓库，点击 **Import**

### 4.2 配置环境变量

在部署页面，展开 **Environment Variables**，添加以下变量，或是使用import env一键导入项目内env.example：

| 变量名 | 值 |
|--------|-----|
| `SUPABASE_URL` | 你的 Supabase Project URL |
| `SUPABASE_ANON_KEY` | 你的 Supabase anon key |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk 公钥 (pk_xxx) |
| `CLERK_SECRET_KEY` | Clerk 密钥 (sk_xxx) |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` |
| `AUTH_SECRET` | 随机字符串（见下方生成方法） |
| `NEXT_PUBLIC_BASE_URL` | 先填 `https://example.com`，部署后改成真实域名 |

**生成 AUTH_SECRET：**

在终端运行：
```bash
openssl rand -base64 32
```
或者访问 https://generate-secret.vercel.app/32 生成

### 4.3 部署

1. 点击 **Deploy**
2. 等待 2-3 分钟构建完成
3. 部署成功后，你会得到一个域名，如 `https://prompt-minder-xxx.vercel.app`

### 4.4 更新配置

1. **更新 Vercel 环境变量**：
   - 进入 Vercel 项目 → **Settings** → **Environment Variables**
   - 将 `NEXT_PUBLIC_BASE_URL` 改为你的真实域名
   - 点击 **Redeploy** 重新部署

2. **更新 Clerk 域名**：
   - 回到 Clerk 控制台 → **Domains**
   - 添加你的 Vercel 域名

---

## 完成！

访问你的 Vercel 域名即可使用 ProrisePromptMinder。

---

## 可选配置

### AI 生成功能

如需使用 AI 智能生成提示词功能，添加环境变量：

```
ZHIPU_API_KEY=你的智谱API密钥
```

获取地址：https://open.bigmodel.cn/

### 管理员配置

设置管理员邮箱（用于审核社区贡献）：

```
ADMIN_EMAILS=admin@example.com,admin2@example.com
```

---

## 常见问题

**Q: 登录后页面报错？**
A: 检查 Clerk 的 Domains 是否添加了你的 Vercel 域名

**Q: 数据保存失败？**
A: 检查 Supabase 的 API 密钥是否正确，可以在 Supabase 的 Table Editor 中查看是否有数据

**Q: 构建失败？**
A: 检查环境变量是否都已正确填写，特别是 `SUPABASE_URL` 和 `CLERK_SECRET_KEY`

---

## 本地开发

如需本地开发：

```bash
# 克隆项目
git clone https://github.com/你的用户名/ProrisePromptMinder.git
cd ProrisePromptMinder

# 安装依赖
pnpm install

# 复制环境变量
cp .env.example .env.local
# 编辑 .env.local 填入你的配置

# 启动开发服务器
pnpm dev
```

访问 http://localhost:3000
