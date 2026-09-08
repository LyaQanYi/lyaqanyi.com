import type {
  EducationItem,
  ExperienceItem,
  Principle,
  SkillGroup,
} from "./types";

/* ------------------------------------------------------------------ */
/* EDIT ME — placeholder résumé. Replace with your real history.       */
/* ------------------------------------------------------------------ */

/** Unverified examples, never rendered on the public site. */
export const experienceDrafts: ExperienceItem[] = [
  {
    id: "independent",
    org: "独立设计与开发",
    role: "设计工程师",
    period: "2024 — 至今",
    start: "2024-01",
    location: "安徽 / 远程",
    summary: "与早期团队合作，把模糊的产品想法推进到可用的第一版。同时维护自己的开源项目与写作。",
    highlights: [
      "为 5 个早期产品完成从概念到上线的设计与前端实现。",
      "把「设计令牌单一来源」的做法带进每个团队，平均减少 40% 的视觉走查返工。",
    ],
  },
  {
    id: "studio",
    org: "某产品工作室",
    role: "高级产品设计师",
    period: "2021 — 2024",
    start: "2021-03",
    location: "安徽",
    summary: "负责一条消费级产品线的体验设计与设计系统建设，与工程团队共同维护组件库。",
    highlights: [
      "从零搭建了覆盖 42 个组件的设计系统，设计与研发首次共用同一份令牌。",
      "主导核心流程改版，关键路径转化率提升 23%。",
      "带过两名初级设计师，建立了团队的走查与复盘机制。",
    ],
  },
  {
    id: "first-job",
    org: "一家互联网公司",
    role: "前端工程师",
    period: "2019 — 2021",
    start: "2019-07",
    location: "上海",
    summary: "在业务团队做前端开发，第一次意识到「设计稿到页面」之间那段被忽略的距离。",
    highlights: [
      "维护日活十万级的 Web 端，主导了一次首屏性能优化，LCP 从 4.1s 降到 1.8s。",
      "自发整理了一份团队内部的样式规范，成为后来设计系统的雏形。",
    ],
  },
];

/** Add verified history here when ready to publish it. */
export const experience: ExperienceItem[] = [];
export const education: EducationItem[] = [];

/** Technologies used by this site, not a claim about professional expertise. */
export const skillGroups: SkillGroup[] = [
  { name: "界面", items: ["Next.js", "React", "TypeScript"] },
  { name: "样式与交互", items: ["Tailwind CSS", "CSS Animation", "Intersection Observer"] },
  { name: "内容与订阅", items: ["Static Rendering", "RSS", "Open Graph"] },
];

export const educationDrafts: EducationItem[] = [
  {
    school: "某大学",
    degree: "工业设计 · 学士",
    period: "2015 — 2019",
    note: "毕业设计做的是一套面向老年人的公共设施导视系统，第一次认真考虑「不用的人」的感受。",
  },
];

export const principles: Principle[] = [
  {
    title: "先想清楚，再动手",
    body: "大多数返工不是执行问题，而是问题没被定义清楚。我愿意在开始前多花时间，把「到底要解决什么」写下来。",
  },
  {
    title: "约束是生产力",
    body: "无限自由只会带来犹豫。有限的色板、有限的间距档位、有限的组件，反而让人更快做出好决定。",
  },
  {
    title: "设计要能跑起来",
    body: "静态稿无法回答交互问题。我习惯把想法直接做成可以点的原型，让真实的手感来说服人。",
  },
  {
    title: "把过程写下来",
    body: "写作是对思考的检验。能写清楚的部分说明真的想明白了，写不下去的地方通常就是问题所在。",
  },
];

/** Newest first. */
export const sortedExperience = [...experience].sort((a, b) =>
  b.start.localeCompare(a.start),
);
