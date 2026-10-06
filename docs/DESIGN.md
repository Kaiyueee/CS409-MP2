# Little Paws：列表、画廊与详情

采用奶油白、蜜桃色、深棕色的猫咪品种图鉴设计。网页使用英语，方便课堂演示；本文使用中文。
已完成页面设计、数据结构，以及使用真实 API 数据的列表、画廊与详情页。

## 页面与路由

| 路由 | 页面 | 内容 |
| --- | --- | --- |
| `/` | 品种列表 | 介绍区、实时搜索、名称/寿命排序、横向品种条目 |
| `/gallery` | 图片画廊 | 图片卡片、实时搜索与排序、性格多选和来源筛选 |
| `/breeds/:breedId` | 品种详情 | 大图、简介、来源、寿命、性格、上一项和下一项 |
| 其他地址 | 未找到页面 | 提示信息和返回列表链接 |

使用 React Router 的 BrowserRouter，从 `import.meta.env.BASE_URL` 读取 basename。
站内导航使用 Link/NavLink；“Meet the cats”是同页锚点链接。
q、sort、order 参数保存在网址中，画廊另使用 origin 和可重复的 trait 参数；刷新后仍然保留。
详情链接用 from 标识列表/画廊来源，并保留搜索、排序和画廊筛选条件；返回时恢复这些条件。
上一项/下一项在当前筛选结果与排序顺序内循环。只有一个结果时显示提示并隐藏切换按钮。
手动修改网址进入筛选范围以外的品种时，会显示该品种并提示返回筛选结果。
无效品种 ID 显示未找到页，并保留返回原集合的链接。
直接打开详情默认使用全部品种的名称升序。

## 文件职责

- `src/App.tsx`：共享页头、页脚和路由。
- `src/pages/`：列表/画廊、详情、未找到页面。
- `src/components/`：品种条目、图片、图标及加载/错误提示。
- `src/components/Icons.tsx`：引用从 Lucide 官方下载的 SVG；原文件与许可保存在 `public/icons/lucide/`。
- `src/components/CollectionHero.tsx`、`CollectionHero.css`：紧凑的首页图文封面、品种照片拼贴与性格快捷入口。
- `src/types/cat.ts`：API 原始类型、页面数据类型及字段转换。
- `src/services/catApi.ts`：Axios 请求、分页、去重、缓存和友好错误提示。
- `src/hooks/useBreeds.ts`：供页面共享数据、加载状态和重试操作。
- `src/lib/breedQuery.ts`：共享查询参数解析、搜索、属性筛选和排序逻辑。
- `tests/breedQuery.test.mjs`：14 项搜索、排序和筛选边界条件测试。
- `src/data/previewBreeds.ts`：设计阶段的 6 条预览数据；目前只用于介绍区照片的初始展示，列表不使用它们作为请求失败后的替代数据。
- `src/index.css`、`src/App.css`：全局样式、组件布局与响应式规则。

## 数据与排序约定

页面使用 CatBreed：id、name、origin、lifeSpan、temperament、description、image。
性格从 API 的逗号分隔字符串转换为数组。缺失的来源、寿命、图片保留为空值。
图片直接使用 API 返回的 URL；缺图或加载失败时显示猫咪轮廓。
占位说明区分“Photo not provided”（数据未提供照片）与“Photo could not load”（已有地址但加载失败）。
Axios 从 `.env.local` 的 VITE_CAT_API_KEY 读取配置，并通过 x-api-key 请求头调用 The Cat API。
不会把密钥写进源码或错误提示。Vite 的 VITE_ 配置会进入浏览器，不是服务器端保密存储。

请求按页读取品种，并以 ID 去重；只有完整加载成功才更新共享缓存。
列表、画廊和详情复用同一份数据及进行中的请求。出错时提供重试，空搜索结果提供清空搜索。
搜索按名称进行部分匹配，忽略大小写及首尾空格，输入时立即更新结果。
名称按英语自然顺序排序；寿命区间按下限数值排序，例如 9–15 在 12–18 之前。
两种属性均支持升序/降序；缺失或无法解析的寿命始终放在最后。
寿命相同时按名称、ID 排序，保证列表与详情顺序一致。排序不修改原始数组。

画廊中的多个性格标签按“匹配任意一个”筛选；来源与名称搜索和性格结果共同生效。
来源选项来自完整 API 数据；性格按钮支持多选和取消。“All personalities”只清空性格条件。
“Clear search & filters”清空搜索、来源和性格，但保留排序。空结果也提供重置按钮。
集合内部的 List/Gallery 切换保留查询参数；来源和性格条件只在画廊中生效。
快速连续操作控件会合并最近的查询参数，避免尚未完成的路由更新覆盖新输入。

## 验证与后续工作

- 构建：`npm run build`
- 代码检查：`npm run lint`
- 搜索排序测试（Node 24）：`node --test tests/breedQuery.test.mjs`
- 浏览器验证真实 API 加载、名称搜索、两种双向排序、快速操作、画廊多条件筛选、空结果重置，以及列表/画廊与详情往返。
- 验证详情首尾循环、单结果、无效 ID、直接刷新，并检查桌面与 320px 手机布局。

部署前还需配置 Vite base，处理 GitHub Pages 直接访问/刷新详情路由，并完成部署验证。
本阶段不更改 .env.local、作业说明、仓库名称或部署工作流。

## 首页设计与缺图检查（2026-10-06）

首页取消宽屏下固定的首屏最小高度和靠右单图，改为暖奶油色封面、一张主图及两张小图。
Ragdoll、Abyssinian、British Shorthair 照片各自标明品种名称并链接详情。
封面下方的 Gentle souls、Playful pals、Curious minds 直接进入相应画廊筛选。
手机端采用更短的图组，窄屏保留两张；搜索与列表入口更早出现。

使用项目已配置的密钥只读检查 `/v1/breeds?limit=200&page=0`：本次返回 107 个品种，66 个提供 `image.url`，41 个未提供；这 41 个也都没有 `reference_image_id`。
进一步对 Brazilian Shorthair（braz）、British Tipped（brit）、European Shorthair（eshr）查询 `/v1/images/search?breed_ids=…&limit=1&include_breeds=1`，三者原始返回均为 `[]`。
因此这些已抽查品种缺图来自数据源；不能据此断言其余所有缺图品种的图片搜索也为空。
保留完整品种资料和明确占位，不使用其他品种或随机照片替代，不为每个缺图品种自动增加额外请求。
统计是本次检查结果，API 将来可能更新；密钥未写入说明或源代码。

## 手动演示顺序

1. 列表输入 british，观察即时结果；切换名称升降序，再用 shorthair 演示寿命升降序。
2. 点击列表品种，检查资料、上一项/下一项，再返回查看搜索和排序保留。
3. 画廊依次选择 Gentle、Curious，观察多选结果；选择 United States 缩小来源范围。
4. 进入画廊中的第一项，点击 Previous 验证跳到最后一项，再点击 Next 回到第一项。
5. 返回画廊，输入不存在的名称，检查空结果后重置；输入 ragdoll，检查单品种详情提示。
6. 刷新详情网址，确认能够重新加载资料；将屏幕缩小检查响应式显示。

## 参考资料

- 实际 SVG 来源、许可和其他参考资料见 [SOURCES.md](./SOURCES.md)；每个 SVG 的原始下载地址和校验值见 [icon-sources.json](./icon-sources.json)。
- The Cat API 品种字段：https://docs.thecatapi.com/docs/examples/breeds
- React Router 路由：https://reactrouter.com/start/declarative/routing
- Vite 基础配置：https://vite.dev/guide/

本阶段代码有 LLM 辅助。按作业要求，提交时需要附相关聊天记录并填写使用调查；含密钥的聊天内容应先遮盖密钥。
