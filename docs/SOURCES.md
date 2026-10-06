# Little Paws：素材来源与参考资料

## SVG 图标（实际使用）

本项目使用从 Lucide 官方仓库下载的现成 SVG，没有自行生成这些图标的绘图路径。

| 图标 | 页面用途 | 官方来源页面 |
| --- | --- | --- |
| Cat | 品牌、缺图占位、状态提示、网站图标 | https://lucide.dev/icons/cat |
| List | 列表导航和视图切换 | https://lucide.dev/icons/list |
| Layout grid | 画廊导航和视图切换 | https://lucide.dev/icons/layout-grid |
| Arrow right | 页面链接、上一项和下一项 | https://lucide.dev/icons/arrow-right |
| Search | 搜索框 | https://lucide.dev/icons/search |

- 下载日期：2026-10-06。
- 固定来源版本：[Lucide commit 1fae58d0a9c661a338036838caf3399b5507bab6](https://github.com/lucide-icons/lucide/tree/1fae58d0a9c661a338036838caf3399b5507bab6)。
- 每个原始 SVG 的下载网址和 SHA-256 校验值见 [icon-sources.json](./icon-sources.json)。
- 本地文件在 `public/icons/lucide/`；只给 SVG 根元素增加 `id="icon"`，供组件通过外部 `<use>` 引用。路径、形状与原始绘图属性保持不变。
- 左箭头使用同一个 Arrow right，通过独立 CSS 文件中的旋转规则显示。
- 已保存官方完整 [LICENSE](../public/icons/lucide/LICENSE)，包含 Lucide 的 ISC 许可及部分源自 Feather 的图标所适用的 MIT 许可；[官方许可说明](https://lucide.dev/license)。

开源许可允许使用素材，不代表课程一定将第三方 SVG 视为可直接使用的素材。作业禁止复制他人代码，未明确说明图标素材的边界；如课程未另行说明，应向助教确认能否使用并声明来源。

## 数据、照片与开发参考

- [The Cat API](https://thecatapi.com/)：猫咪品种数据与照片。
- [The Cat API 品种示例](https://docs.thecatapi.com/docs/examples/breeds)：品种字段与接口说明。
- [React Router 路由文档](https://reactrouter.com/start/declarative/routing)：页面路由与导航参考。
- [Vite 指南](https://vite.dev/guide/)：React + TypeScript 初始化模板和开发、构建配置参考。

照片 URL 来自 The Cat API；API 未提供某品种的照片时显示明确占位。介绍区初始预览数据也使用同一 API 的品种信息和图片地址。

## 用户提到的图标网站（未用于当前图标）

- [OpenSVG](https://opensvg.dev/icons)
- [SVG Repo](https://www.svgrepo.com/)

以上两个网站是用户提出的候选资源，当前项目的 SVG 并非从它们下载，不应将它们写成已使用素材的来源。

## LLM 使用说明

页面结构、样式、数据处理和功能实现使用了 LLM 辅助。依作业政策，最终提交需附相关聊天记录，并在评分表单中回答 LLM 使用调查。提交聊天记录前遮盖其中的 API 密钥；本文件不能替代聊天记录或调查。
