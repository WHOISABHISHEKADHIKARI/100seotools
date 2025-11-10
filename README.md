# 100 SEO Tools

Free, no‑login, no‑card SEO tools built with Next.js 14 and Tailwind CSS. This project provides category pages, tool detail pages, blog guides, and an SEO‑friendly layout with JSON‑LD, canonical URLs, and a sitemap.

> **Latest Update**: Fixed build issues and added global navigation layout.

## Performance: Selective Transpilation & Polyfills

This project implements selective transpilation via modern `browserslist` targets and differential polyfill loading (module/nomodule + feature detection) to reduce bundle size and improve performance.

- Targets: Chrome ≥90, Firefox ≥88, Safari ≥14, Edge ≥90
- Docs: `docs/performance/selective-transpilation.md`
- Analyzer: `npm run build:analyze` to inspect vendors/common chunks
- Polyfills: minimal shims loaded only when baseline features are missing


## 依赖冲突解决：PostCSS 与 cssnano 工具链

本项目在安装/构建过程中出现与 cssnano 工具链相关的 peer 依赖冲突警告：`postcss-calc@10.1.1` 要求 `postcss@^8.4.38`，而项目原本使用 `postcss@8.4.35`。

### 原因分析
- `cssnano@7.1.2` 依赖 `cssnano-preset-default@7.0.10`，该预设内部包含多个基于 PostCSS 的插件（如 `postcss-calc@10.1.1` 等）。
- 这些子插件对 `postcss` 的版本要求更严格（多数要求 `^8.4.38`）。
- 项目直接声明的 `postcss@8.4.35` 低于所需最小版本，导致 `npm ls` 报出 `invalid` 标记。

### 依赖树确认
使用 `npm ls postcss postcss-calc cssnano cssnano-preset-default` 验证：
- `cssnano -> cssnano-preset-default@7.0.10 -> postcss-calc@10.1.1` 为冲突来源。
- 多数子插件标记为 `invalid: "^8.4.38"`，确认需要提升 `postcss` 版本。

### 解决方案与实施
已选择并实施以下方案：
- 将项目中的 `postcss` 从 `8.4.35` 升级为 `8.5.6`（兼容 `^8.4.38` 要求）。
  - 命令：`npm install --save-dev postcss@8.5.6`
  - 升级后再次执行 `npm ls ...`，所有 `invalid` 标记消失，依赖树一致。
- 说明：`cssnano-preset-default@7.0.10` 为当前最新版本（`npm info cssnano-preset-default versions`），暂无更高版本可用来放宽要求。
- 备选方案（不推荐长期使用）：`npm install --legacy-peer-deps` 暂时忽略 peer 依赖冲突，但会增加未来维护风险。

### 兼容性评估
- `tailwindcss@3.4.10` 与其相关的 PostCSS 插件（import、nested、load-config、js 等）均兼容 `postcss@8.5.6`。
- `autoprefixer@10.4.20` 兼容 PostCSS 8.x 系列，工作正常。
- `next@14.2.33` 内部依赖 `postcss@8.4.31`（子依赖），与顶层 `postcss@8.5.6` 并存不冲突，构建验证通过。

### 验证与测试
- 执行 `npm run build`：构建成功，无新的警告或错误（除 `next.config.js` 的 `legacyBrowsers` 提示）。
- 如需进一步验证，可运行项目内的校验脚本：`npm run validate`。

### 后续维护建议
- 保持 `postcss` 在 `8.5.6` 或更高兼容版本，避免再次触发 cssnano 子插件的严格要求。
- 定期检查 `cssnano` 与 `cssnano-preset-default` 的更新日志，以便在发布新版本时评估升级的必要性。

## Features
- 100+ tools with client‑side runners
- Category landing pages with structured data
- Blog guides with shareable slugs
- Dark mode (default) with theme toggle
- Canonical/OG/Twitter metadata and expanded sitemap
- Fast, modern stack: Next.js 14 (App Router), Tailwind CSS

## Tech Stack
- `Next.js 14` (App Router)
- `React 18`
- `Tailwind CSS`
- `Node.js` (>= 18)

## Requirements
- Node.js `>= 18`
- npm `>= 9` (or `pnpm`/`yarn` if you prefer)
- Git (recommended) for cloning and versioning

## Quick Start (Windows)
1. Install Node.js 18+ from https://nodejs.org
2. Install Git:
   - Using Winget: `winget install --id Git.Git -e`
   - Or download: https://git-scm.com/downloads and run the installer
3. Clone the repo:
   ```powershell
   git clone https://github.com/<your-org-or-user>/100SeoTools.git
   cd 100SeoTools
   ```
4. Install dependencies:
   ```powershell
   npm install
   ```
5. Start in development:
   ```powershell
   npm.cmd run dev
   # Open http://localhost:3000
   ```

## Production Build & Start
```powershell
npm.cmd run build
npm.cmd run start
# Open http://localhost:3000
```

If you need a different port:
```powershell
set PORT=4000 && npm.cmd run start
# Open http://localhost:4000
```

## Environment Configuration
- `NEXT_PUBLIC_SITE_URL`: set to your canonical origin, e.g. `https://www.example.com`

Where to set: `.env.local`
```env
NEXT_PUBLIC_SITE_URL=https://www.example.com
```

## Project Structure
```
app/                # Next.js App Router pages
components/         # UI components (Navbar, ToolGrid, ToolRunner, etc.)
tools/              # Tool definitions and runners
lib/                # Utilities and templates
public/             # Static assets (if added)
tailwind.config.js  # Tailwind setup and brand colors
next.config.js      # Next.js configuration
```

## Common Tasks
- Develop locally: `npm.cmd run dev`
- Build for production: `npm.cmd run build`
- Start production server: `npm.cmd run start`
- Clear Next cache (fix stale assets): delete `.next/` then restart dev

## Troubleshooting
### PowerShell script execution error (PSSecurityException)
Symptoms: `running scripts is disabled on this system` when using `npm run build`.

Fix options:
- Prefer `npm.cmd run <script>` on Windows (used above) to bypass policy issues.
- Or relax execution policy for current user:
  ```powershell
  Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
  ```
  You can revert later with:
  ```powershell
  Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Restricted
  ```

### Dev shows 404 for `/_next/static/...` assets
Cause: stale `.next/` cache or HMR churn.

Fix:
1. Stop dev server
2. Delete `.next/`
3. `npm.cmd run dev`

### Prefetch abort warnings in dev
Cause: Next.js dev overlay cancels in‑flight prefetches during HMR.

Fix: Avoid explicit `prefetch` props on `Link`. This project already removed those where applicable.

### Next.js proxy migration (middleware deprecation)
- The legacy `middleware.js` file convention has been renamed to `proxy.js` in Next.js.
- We have migrated to `proxy.js` and renamed `export function middleware` to `export function proxy`.
- Existing `config.matcher` remains unchanged.
- Reference: https://nextjs.org/docs/messages/middleware-to-proxy
- Verify locally: `npm.cmd run build` should complete without the deprecation warning.

## Deployment
- Vercel: push to a Git repo and import the project. Ensure `NEXT_PUBLIC_SITE_URL` is set in Project → Settings → Environment Variables.
- Self‑hosted Node: run `npm.cmd run build` and `npm.cmd run start` behind a reverse proxy (Nginx/Caddy) with HTTPS.

### Analytics configuration
- Set `NEXT_PUBLIC_GA_ID` to enable Google Analytics (gtag) loading in production.
- Set `NEXT_PUBLIC_DISABLE_ANALYTICS=true` to disable GA (useful for local prod testing).
- Example (PowerShell):
  - `setx NEXT_PUBLIC_GA_ID G-XXXXXXX` (persist), or `setx NEXT_PUBLIC_DISABLE_ANALYTICS true`
  - One‑off start: `$env:NEXT_PUBLIC_DISABLE_ANALYTICS='true'; $env:PORT=3004; npm.cmd run start`

## Contributing
- Fork and create a feature branch
- Ensure pages render cleanly in both dev and production
- Run a production build before submitting PR: `npm.cmd run build`

## License
Unspecified. Provide a license if you plan to open source.
