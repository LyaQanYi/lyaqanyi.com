/**
 * Every string the interface renders, in one place.
 *
 * This is not a dictionary and there is no lookup step: the site is Chinese
 * only, so the table is imported directly. It stays a module of its own rather
 * than being inlined into components because these strings are shared — the
 * footer and the header both label the nav, the list pages and the detail pages
 * both say "返回" — and because it is the first file to open when the wording of
 * the site needs changing.
 *
 * Content (projects, posts, the résumé) lives in its own files next to this
 * one; this module holds only interface chrome.
 *
 * Server components import this directly. Client components do not: they take a
 * plain `copy` prop assembled by the server instead (`HeaderCopy`,
 * `ShareCopy`, `ModeSwitcherCopy`), which keeps this table — and the content
 * modules it sits beside — out of the client bundle.
 */
export const uiCopy = {
  nav: {
    label: "主导航",
    home: "首页",
    work: "作品",
    writing: "写作",
    about: "关于",
    openMenu: "打开导航",
    closeMenu: "关闭导航",
  },
  common: {
    skipToContent: "跳到正文",
    viewAll: "查看全部",
    readMore: "阅读全文",
    viewProject: "查看项目",
    backTo: "返回",
    copyEmail: "复制邮箱",
    copied: "已复制到剪贴板",
    copyFailed: "复制失败，请手动选择",
    opensInNewTab: "在新标签页打开",
    minuteRead: "{minutes} 分钟读完",
    allTopics: "全部",
    featured: "精选",
    externalLink: "外部链接",
    placeholder: "占位内容，替换成你自己的",
    page: "页面",
    channelLabel: "渠道",
  },
  appearance: {
    switchLabel: "深色模式",
    modeLight: "浅色",
    modeDark: "深色",
  },
  hero: {
    eyebrow: "个人网站",
    greeting: "你好，我是",
    availability: "目前可接受新的合作",
    scrollHint: "向下滚动",
    primaryCta: "看看我的作品",
    secondaryCta: "联系我",
  },
  home: {
    aboutLabel: "关于我",
    aboutHeading: "简单介绍",
    aboutMore: "更多了解我",
    workLabel: "作品集",
    workHeading: "精选项目",
    workMore: "浏览全部项目",
    writingLabel: "写作",
    writingHeading: "最近的文字",
    writingMore: "阅读全部文章",
    contactLabel: "联系",
    contactHeading: "一起做点有意思的事",
    contactBody: "关于项目、文章，或是一个想继续聊下去的问题，都欢迎给我写信。",
    linksHeading: "在别处找到我",
    nowUpdated: "更新于",
    nowMore: "看看我的近况",
  },
  work: {
    title: "作品",
    intro: "我做过和参与过的一些项目，记录正在进行的探索，也留存以往的实践。",
    groups: {
      ongoing: {
        title: "进行的项目",
        empty: "暂无正在进行的项目。",
      },
      past: {
        title: "以往项目",
        empty: "暂无以往项目。",
      },
    },
    projectsCount: "共 {count} 个项目",
    scrollHint: "左右滑动查看更多",
    scrollKeyboardHint: "，也可聚焦列表后使用左右方向键浏览。",
    fields: {
      role: "我的角色",
      period: "时间",
      stack: "技术栈",
      links: "链接",
      highlights: "关键成果",
    },
    nextProject: "下一个项目",
    backToWork: "返回作品列表",
  },
  writing: {
    title: "写作",
    intro: "关于设计、工程与思考的零散记录。",
    topicLabel: "按主题筛选",
    empty: "这个主题下暂时还没有文章。",
    archiveHeading: "归档",
    postsCount: "共 {count} 篇",
    publishedOn: "发表于 {date}",
    updatedOn: "更新于 {date}",
    tableOfContents: "本文目录",
    backToWriting: "返回文章列表",
    relatedHeading: "相关阅读",
    contactHeading: "聊聊这篇文章",
    contactBody: "有不同的想法，或是想继续聊聊？欢迎给我写信。也可以通过 RSS 订阅后续更新。",
    contactAction: "给我写信",
    subscribeAction: "RSS 订阅",
  },
  about: {
    title: "关于",
    intro: "我是谁，我在做什么，我相信什么。",
    roleLabel: "这里的主题",
    locationLabel: "所在地",
    experienceHeading: "经历",
    experienceLabel: "工作与实践",
    skillsHeading: "这个网站用到的工具",
    skillsLabel: "技术与实现",
    educationHeading: "教育",
    educationLabel: "学习经历",
    nowHeading: "最近在忙",
    nowLabel: "当下",
    principlesHeading: "我相信的事",
    principlesLabel: "原则",
    printResume: "打印 / 存为 PDF",
  },
  footer: {
    copyright: "© {year} {name}。保留所有权利。",
    builtWith: "用 Next.js 与 Tailwind CSS 手工搭建",
    colophon: "字体：标题 Source Han Sans CN · 正文 Geist / 系统字体",
    backToTop: "回到顶部",
  },
  notFound: {
    title: "页面不存在",
    description: "这个地址没有对应的内容，也许它被移动或删除了。",
    backHome: "回到首页",
  },
};

/**
 * Fills `{name}` placeholders in a copy string.
 * Returns the template untouched when no values are supplied, so a string with
 * no placeholders can be passed through without a second argument.
 */
export function fill(
  template: string,
  values?: Record<string, string | number>,
): string {
  if (!values) return template;
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
