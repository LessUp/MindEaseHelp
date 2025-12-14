# 贡献指南

感谢你对本项目的兴趣！欢迎通过 Issue 与 Pull Request 贡献。

## 开发流程
- Fork 仓库并新建分支：`feat/*`、`fix/*`、`docs/*`
- 安装依赖并本地运行：`npm install && npm run dev`
- 提交前检查：`npm run check`（类型检查 + Lint）
- 确保通过构建：`npm run build`

## 代码规范
- TypeScript 严格模式，避免 `any`
- React 18 + Hooks，组件函数尽量纯
- 使用 ESLint/Prettier：`npm run lint:fix`、`npm run format`
- 提交信息遵循约定式提交：`feat: ...`、`fix: ...`、`docs: ...`、`refactor: ...`

## 界面与可访问性
- 基于 TailwindCSS 的原子类；优化对比度、焦点状态
- 表单元素需有可读标签；语义化 HTML

## 测试（可选）
- 若新增复杂逻辑，请补充单元测试（可后续引入 Vitest）

## 交流
- 使用 Issue 进行 Bug 报告与功能建议
