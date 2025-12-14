# CBT 评估与建议（PHQ-9 / GAD-7）

本地运行的认知行为疗法（CBT）辅助评估与教育性建议工具，集成 PHQ-9 与 GAD-7 自评量表，用于了解近两周抑郁与焦虑症状强度，并提供基于 CBT 的自助建议与安全提示。该工具不提供医疗诊断或治疗，不可替代专业服务。

## 快速开始
- 需要 Node.js ≥ 18
- 安装与启动
```bash
npm install
npm run dev
```
- 生产构建与本地预览
```bash
npm run build
npm run preview
```

## 主要特性
- **本地隐私**：默认不存储任何数据；可勾选“允许在本地保存结果”后，仅将结果保存到本机浏览器。
- **标准量表**：内置 PHQ-9 与 GAD-7 题项与计分逻辑，展示总分与严重度分级。
- **安全分诊**：结合 PHQ-9 第9题及总分阈值，对潜在风险给出明显提示（非紧急服务）。
- **CBT 建议**：基于严重度提供行为激活、担忧管理、证据法、呼吸/地面化等自助练习建议。
- **现代前端**：Vite + React + TypeScript + TailwindCSS。

## 项目结构
- `index.html`：应用入口
- `src/main.tsx`：渲染入口
- `src/App.tsx`：评估流程与结果展示（PHQ-9 → GAD-7 → 结果）
- `src/components/Questionnaire.tsx`：通用问卷组件
- `src/data/scales.ts`：量表题项与选项
- `src/utils/scoring.ts`：计分函数、严重度分级与分诊逻辑
- `src/utils/cbt.ts`：基于严重度的 CBT 建议生成
- `tailwind.config.cjs`、`postcss.config.cjs`、`src/index.css`：样式与 Tailwind 配置

## 计分与严重度分级
- **PHQ-9 总分**：0-27（每题 0-3）
  - 0-4 最轻（minimal）
  - 5-9 轻度（mild）
  - 10-14 中度（moderate）
  - 15-19 中重度（moderately severe）
  - 20-27 重度（severe）
- **GAD-7 总分**：0-21（每题 0-3）
  - 0-4 最轻（minimal）
  - 5-9 轻度（mild）
  - 10-14 中度（moderate）
  - 15-21 重度（severe）

## 分诊与安全提示（非紧急服务）
- 若 PHQ-9 第9题出现任何频率（≥“几天”），将给予明显提示。
- 若 PHQ-9 总分 ≥ 20 或 GAD-7 总分 ≥ 15，建议尽快联系专业人员评估。
- 若 PHQ-9 第9题频率达到“一半以上的天数”及以上，将显示更高等级的危机提示。

## 隐私
- 默认不做任何持久化存储。
- 用户可手动勾选“允许在本地保存结果”，以便在同一设备/浏览器查看最近一次结果；数据存储于 `localStorage`，可手动清除。

## 免责声明
- 本工具仅用于健康教育与自助管理，不提供医疗诊断或治疗建议。
- 如出现持续的自伤/自杀想法或计划，请立即联系当地紧急服务或就近医院急诊。

## 参考文献（常用阈值与量表）
- Kroenke K, Spitzer RL, Williams JBW. The PHQ-9: Validity of a brief depression severity measure. J Gen Intern Med. 2001.
- Spitzer RL, Kroenke K, Williams JBW, Löwe B. A brief measure for assessing generalized anxiety disorder: the GAD-7. Arch Intern Med. 2006.
- Löwe B, et al. Measuring depression outcome with a brief self-report instrument: sensitivity to change of the PHQ-9. J Affect Disord. 2004.
- Löwe B, et al. Validation and standardization of the GAD-7 in the general population. Med Care. 2008.

## 许可
- 本项目示例以教育为目的提供，按实际团队政策选择合适的许可证（如 MIT）。

## 部署

- **GitHub Pages（推荐）**
  - 将仓库推送至 GitHub，并在仓库设置中将默认分支设为 `main`
  - 本项目已内置工作流 `.github/workflows/deploy-gh-pages.yml`
  - 当你 push 到 `main` 时将自动构建并发布到 Pages
  - 首次启用：在仓库 Settings → Pages 中选择 `GitHub Actions` 作为来源
  - 自定义路径：Vite 会自动根据 `GITHUB_REPOSITORY` 推断 `base`，也可设置环境变量 `VITE_BASE="/your-repo/"`

- **Netlify**
  - 一键导入仓库，构建命令：`npm run build`，发布目录：`dist`
  - 已内置 `netlify.toml`，且配置了 SPA 回退（重定向到 `index.html`）

- **Vercel**
  - 选择 `@vercel/static-build` 方案，使用 `vercel.json` 中已配置的 `dist` 目录
  - 或在面板中设置构建命令 `npm run build` 与输出目录 `dist`

- **本地预览生产包**
  - `npm run build && npm run preview`

## 脚本与规范
- `npm run dev`：开发服务器
- `npm run build`：生产构建
- `npm run preview`：本地预览生产包
- `npm run typecheck`：TypeScript 检查
- `npm run lint` / `npm run lint:fix`：ESLint 规则检查与修复
- `npm run format`：Prettier 全量格式化
- `npm run check`：类型 + Lint 组合检查
- `npm run deploy:gh`：使用 `gh-pages` 手动发布 `dist`（若不使用 Actions）

## 贡献
- 请先阅读 `CONTRIBUTING.md` 与 `CODE_OF_CONDUCT.md`
- 开发前：`npm install && npm run dev`
- 提交前：`npm run check` 保证类型与 Lint 通过
- 建议遵循约定式提交（`feat:`、`fix:`、`docs:` 等）

## 安全
- 请阅读 `SECURITY.md`，若发现安全问题优先私下报告

## 许可
- 采用 MIT 许可证，详见 `LICENSE`
