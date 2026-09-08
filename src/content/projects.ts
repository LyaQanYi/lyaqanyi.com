import type { Project } from "./types";

/* ------------------------------------------------------------------ */
/* Sample projects stay as drafts until replaced with verified work.  */
/* Sort by year; entries in the same year keep this display order.     */
/* ------------------------------------------------------------------ */

export const projects: Project[] = [
  {
    slug: "personal-website",
    title: "LyaQanYi.com",
    summary: "给项目、笔记和近况留一个自己的入口。这个个人网站，也是一份持续更新的作品。",
    body: [
      "这个项目就是你正在浏览的网站。它把原本分散的介绍、作品与文章放在一起，让访问者能从一个入口了解浅忆QanYi，也能找到继续交流的方式。",
    ],
    sections: [
      {
        title: "从一个自己的入口开始",
        paragraphs: ["网站围绕首页、作品、写作和关于展开。首页只放最值得先看的内容，完整记录留给独立页面，让内容可以随着时间慢慢增加。"],
      },
      {
        title: "让细节服务于阅读",
        paragraphs: [
          "视觉上采用黑白配色和较大的文字层级，保留留白。向下滚动或窗口变窄时，页头收起姓名，只保留 @LyaQanYi，让导航有更充足的空间。",
          "动效集中在首次出现、按钮反馈和项目封面。文章提供跟随阅读位置的目录，手机上可以折叠；减少动态效果的系统偏好也会被尊重。",
        ],
      },
      {
        title: "继续完善的部分",
        paragraphs: ["这一轮先完成网站本身的介绍、近况入口与阅读体验。之后再逐步补充真实项目的过程记录和文章，让这个地方的内容比形式更丰富。"],
      },
    ],
    category: "experiment",
    categoryLabel: "个人项目",
    status: "ongoing",
    year: 2026,
    period: "2026.09 — 持续更新",
    role: "个人网站的规划与迭代",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    highlights: [
      "统一姓名、账号与社交入口，并提供带更新时间的近况。",
      "兼顾桌面和手机阅读，文章目录支持定位与当前章节高亮。",
      "提供 RSS 订阅，以及附带文章标题和地址的邮件交流入口。",
    ],
    links: [{ label: "浏览网站", href: "/", kind: "live" }],
    featured: true,
    featuredOrder: 2,
    cover: { from: "#1e293b", to: "#374151", label: "LyaQanYi" },
  },
  {
    slug: "neko",
    title: "N.E.K.O.",
    summary: "开源 AI 伙伴项目「猫娘计划」，把实时对话、记忆与虚拟角色带进日常陪伴。",
    body: [
      "我从 2025 年起参与 N.E.K.O.（猫娘计划），目前仍在持续参与。",
    ],
    sections: [
      {
        title: "关于这个项目",
        paragraphs: [
          "N.E.K.O. 是一个开源 AI 伙伴平台，支持实时语音、文字对话和视觉理解，并通过持久记忆延续交流。角色可以以 Live2D、VRM 等形态出现，融入桌面上的日常互动。",
          "项目也提供插件扩展与工具调用能力。完整介绍、源代码和最新进展可以在 GitHub 仓库查看。",
        ],
      },
    ],
    category: "opensource",
    categoryLabel: "参与项目",
    status: "ongoing",
    year: 2025,
    period: "2025 — 至今",
    role: "项目参与者",
    stack: ["Python", "React", "Live2D", "VRM"],
    highlights: [],
    links: [
      { label: "GitHub 仓库", href: "https://github.com/Project-N-E-K-O/N.E.K.O", kind: "source" },
    ],
    featured: true,
    featuredOrder: 1,
    cover: { from: "#292544", to: "#475569", label: "N.E.K.O." },
  },
  {
    slug: "omnicopilot",
    title: "OmniCopilot",
    summary: "为 VS Code Copilot Chat 接入多家模型服务，在熟悉的编程环境里选择合适的 AI。",
    body: [
      "OmniCopilot 是一个面向 VS Code Copilot Chat 的模型提供者扩展，通过统一的适配层接入 DeepSeek、Kimi 等模型服务。配置服务商与 API Key 后，就能在 Copilot 的模型选择器中切换使用。",
      "扩展围绕对话中的实际体验展开：流式回答、思考内容展示、工具调用，以及可用模型的图像理解。不同服务商的接口差异由适配层处理。",
    ],
    category: "opensource",
    categoryLabel: "编辑器扩展",
    status: "past",
    year: 2026,
    period: "2026",
    role: "扩展开发",
    stack: ["TypeScript", "VS Code API", "Node.js"],
    highlights: [
      "在 Copilot Chat 的模型选择器中接入多家模型服务。",
      "为支持的模型提供思考强度选择、思考内容展示和工具调用。",
      "回传实际 Token 用量，并为中文等文本提供上下文用量估算。",
    ],
    links: [
      { label: "GitHub 仓库", href: "https://github.com/LyaQanYi/OmniCopilot", kind: "source" },
    ],
    featured: true,
    featuredOrder: 3,
    cover: { from: "#1f2937", to: "#334155", label: "Omni" },
  },
  {
    slug: "kiraos-plugin",
    title: "KiraOS Plugin",
    summary: "为 KiraAI 提供技能路由和长期记忆，让工具按需加载，让交流中的信息持续积累。",
    body: [
      "KiraOS 是 KiraAI 的扩展插件，把技能路由和用户记忆整合在一起。技能先以轻量清单出现，需要使用时再加载完整指令；记忆则在对话检索和后台整理之间分工。",
      "记忆以 TOML 文件保存，并用 SQLite 建立可重建的检索索引。后台任务从对话中提取事实、整理反思和更新画像，WebUI 提供查看与编辑入口。",
    ],
    sections: [
      {
        title: "从独立记忆插件到统一入口",
        paragraphs: [
          "v4 将原先独立的 Hippocampus Memory 插件合并进 KiraOS，延续记忆提取、实体画像和检索能力，并提供旧数据迁移。技能与记忆由同一个插件管理。",
        ],
      },
    ],
    category: "opensource",
    categoryLabel: "AI 插件",
    status: "past",
    year: 2026,
    period: "2026",
    role: "插件开发",
    stack: ["Python", "SQLite", "FTS5", "TOML"],
    highlights: [
      "用轻量清单与按需加载组织技能指令。",
      "结合实时检索与后台记忆提取、去重和反思。",
      "按用户、群组和频道管理记忆，并提供可视化管理界面。",
    ],
    links: [
      { label: "GitHub 仓库", href: "https://github.com/LyaQanYi/KiraOS_Plugin", kind: "source" },
    ],
    featured: false,
    cover: { from: "#252445", to: "#3f3b59", label: "KiraOS" },
  },
  {
    slug: "qq-auto-mute-script",
    title: "QQ 自动禁言脚本",
    summary: "基于 NoneBot2 的 QQ 群管理机器人，支持自动禁言、分群策略和可视化配置。",
    body: [
      "这个项目把 QQ 群里的自动禁言规则做成了一个可配置的机器人，基于 NoneBot2 和 OneBot V11 连接群聊。每个群可以分别设置监控名单、触发阈值和时间段。",
      "配置通过内置 WebUI 完成：查看群组和成员、调整规则、设置按星期重复的时间段，保存后即可生效。",
    ],
    category: "opensource",
    categoryLabel: "自动化工具",
    status: "past",
    year: 2026,
    period: "2026",
    role: "机器人与配置界面开发",
    stack: ["Python", "NoneBot2", "OneBot V11", "JavaScript"],
    highlights: [
      "各群独立配置，连续触发时按阶梯调整禁言时长。",
      "支持按星期设置禁言时段，并处理跨夜时间段。",
      "提供群成员选择与规则编辑界面，配置保存后即时生效。",
    ],
    links: [
      { label: "GitHub 仓库", href: "https://github.com/LyaQanYi/QQ-Auto-Mute-Script", kind: "source" },
    ],
    featured: false,
    cover: { from: "#253b35", to: "#456257", label: "QQ Mute" },
  },
  {
    slug: "hippocampus-memory",
    title: "Hippocampus Memory",
    summary: "KiraAI 的海马体记忆插件，探索事实提取、记忆检索与反思；后续已合并至 KiraOS。",
    body: [
      "Hippocampus Memory 是一个为 KiraAI 提供长期记忆的独立插件。它在后台整理对话，提取事实与实体画像，并通过检索让这些信息回到后续交流中。",
      "记忆采用 TOML 与 SQLite 双重存储，支持全文检索、事实去重、反思整理和随时间变化的保留策略。",
    ],
    sections: [
      {
        title: "项目的后续",
        paragraphs: [
          "独立仓库于 2026 年 8 月 18 日归档，功能已合并至 KiraOS Plugin v4。KiraOS 提供旧数据迁移，这里保留独立插件阶段的记录。",
        ],
      },
    ],
    category: "opensource",
    categoryLabel: "AI 插件",
    status: "past",
    year: 2026,
    period: "2026",
    role: "插件开发",
    stack: ["Python", "SQLite", "FTS5", "TOML"],
    highlights: [
      "后台提取事实，并结合内容哈希、全文检索与模型判断去重。",
      "管理用户、群组和频道画像，积累事实并生成反思。",
      "独立插件的能力与数据迁移入口延续到 KiraOS v4。",
    ],
    links: [
      { label: "GitHub 仓库（已归档）", href: "https://github.com/LyaQanYi/kira_plugin_hippocampus_memory", kind: "source" },
      { label: "后续项目：KiraOS Plugin", href: "/work/kiraos-plugin", kind: "case" },
    ],
    featured: false,
    cover: { from: "#41303d", to: "#645265", label: "Memory" },
  },
  {
    draft: true,
    slug: "tidal-notes",
    title: "潮汐笔记",
    summary: "一款按「想法的涨落」组织内容的写作工具，让未成形的念头也有存放之处。",
    body: [
      "大多数笔记工具的隐喻是「文件柜」：你先决定它属于哪里，再把它放进去。但真实的想法不是这样长出来的——它们先模糊地出现，被反复触碰，很久之后才归类。潮汐笔记试图顺着这个过程来设计。",
      "核心交互是一块会随时间「退潮」的画布：新写下的内容浮在上层，长期未被访问的逐渐沉入底部，但仍可被搜索与召回。这让「记录」的成本降到最低，同时避免了无限堆积带来的焦虑。",
      "我负责从概念、交互设计到前端实现的全过程，并与一位后端工程师协作完成了同步层。项目上线三个月内积累了约四千名活跃用户，其中留存最好的人群是每天写不满一百字的人。",
    ],
    category: "product",
    categoryLabel: "产品",
    status: "past",
    year: 2025,
    period: "2024 — 2025",
    role: "主设计师 / 前端负责人",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "CRDT"],
    highlights: [
      "重写了编辑器渲染层，把万字长文的输入延迟从 180ms 降到 12ms。",
      "设计了「退潮」算法的三个可调参数，让不同写作频率的人都觉得节奏合适。",
      "上线三个月达到约 4,000 名月活，30 日留存 41%。",
    ],
    links: [
      { label: "访问产品", href: "https://example.com", kind: "live" },
      { label: "案例研究", href: "https://example.com/case", kind: "case" },
    ],
    featured: true,
    cover: { from: "#6366f1", to: "#0ea5e9" },
  },
  {
    draft: true,
    slug: "palette-lab",
    title: "Palette Lab",
    summary: "开源的色彩工具：从一张图片提取可用的配色，并直接输出符合无障碍对比度的色阶。",
    body: [
      "起因很私人：我总是不满意设计系统里自动生成的灰色。它们在色相上偏蓝或偏黄，堆在一起就显得脏。于是我写了一个小工具，把「感知均匀」作为第一原则。",
      "工具在 OKLCH 色彩空间中工作，先从图片聚类出主色，再沿感知亮度轴生成 11 级色阶，并实时标注每一对颜色的 WCAG 对比度结果。所有计算都在浏览器里完成，不上传图片。",
      "项目开源后收到了不少设计系统团队的反馈，其中关于「色阶步长不应等分」的讨论最终改变了核心算法。这是我从开源里得到的最好的东西。",
    ],
    category: "opensource",
    categoryLabel: "开源",
    status: "ongoing",
    year: 2025,
    period: "2023 — 至今",
    role: "作者与维护者",
    stack: ["TypeScript", "OKLCH", "Vite", "Web Workers", "Canvas"],
    highlights: [
      "GitHub 上约 1.8k star，被多个设计系统作为配色起点。",
      "把聚类计算移入 Web Worker，主线程再也不会因为大图而卡住。",
      "零依赖核心包，gzip 后 6.2KB。",
    ],
    links: [
      { label: "在线试用", href: "https://example.com", kind: "live" },
      { label: "源代码", href: "https://github.com/LyaQanYi", kind: "source" },
    ],
    featured: true,
    cover: { from: "#f59e0b", to: "#ef4444" },
  },
  {
    draft: true,
    slug: "su-design-system",
    title: "素 · 设计系统",
    summary: "为一支十二人的产品团队建立的设计系统，重点是「让正确的做法成为最省事的做法」。",
    body: [
      "团队之前的问题不是没有组件库，而是组件库和真实产品脱节：设计稿里的间距和代码里的间距是两套数字，改一处要同步三个地方。",
      "我们把设计令牌作为唯一事实来源，用同一份 JSON 同时生成 Figma 变量与 TypeScript 常量，并在 CI 里校验两端一致。视觉层收敛到 3 种圆角、5 级阴影与 12 个间距值。",
      "半年后，新页面的搭建时间从平均四天缩短到一天半，设计评审里关于「这个间距应该是多少」的讨论基本消失了。",
    ],
    category: "design",
    categoryLabel: "设计系统",
    status: "past",
    year: 2024,
    period: "2023 — 2024",
    role: "设计系统负责人",
    stack: ["Design Tokens", "Figma API", "Storybook", "React", "Style Dictionary"],
    highlights: [
      "令牌单一来源，Figma 与代码由同一份 JSON 生成并在 CI 中校验。",
      "覆盖 42 个组件，全部通过 WCAG 2.1 AA 键盘与对比度检查。",
      "新页面平均搭建时间从 4 天降到 1.5 天。",
    ],
    links: [
      { label: "文档站", href: "https://example.com", kind: "live" },
    ],
    featured: true,
    cover: { from: "#0f172a", to: "#64748b" },
  },
  {
    draft: true,
    slug: "city-sound-map",
    title: "城市声音地图",
    summary: "一个声音实验：把城市里录下的环境声按地理与时间铺开，用听觉重新认识一条熟悉的街。",
    body: [
      "我用两年时间在安徽录下了六百多段环境声：清晨的菜市场、雨天的天桥、深夜的便利店门口。它们被标注了坐标、时间与天气。",
      "网页端把地图与声音绑定：拖动视角时，进入视野的录音会以极低的音量淡入，形成一种「听觉漫游」。技术上用 Web Audio API 做了空间化与淡入淡出的调度。",
      "这不是一个有商业目标的项目，我更愿意把它当成一次关于「注意力」的练习——我们几乎从不主动去听自己所在的地方。",
    ],
    category: "experiment",
    categoryLabel: "实验",
    status: "past",
    year: 2024,
    period: "2022 — 2024",
    role: "独立完成",
    stack: ["Web Audio API", "MapLibre", "Svelte", "Field Recording"],
    highlights: [
      "收录 600+ 段带坐标与环境标注的城市录音。",
      "自制的音频调度器，同时播放 12 路声音仍保持在 60fps。",
    ],
    links: [
      { label: "在线体验", href: "https://example.com", kind: "live" },
      { label: "源代码", href: "https://github.com/LyaQanYi", kind: "source" },
    ],
    featured: false,
    cover: { from: "#10b981", to: "#0d9488" },
  },
];

/** Newest first; stable sorting preserves the editorial order within a year. */
export const sortedProjects = projects.filter((project) => !project.draft).sort(
  (a, b) => b.year - a.year,
);

export const featuredProjects = sortedProjects
  .filter((project) => project.featured)
  .sort((a, b) =>
    (a.featuredOrder ?? Number.MAX_SAFE_INTEGER) -
    (b.featuredOrder ?? Number.MAX_SAFE_INTEGER),
  );

export function getProject(slug: string): Project | undefined {
  return sortedProjects.find((project) => project.slug === slug);
}
