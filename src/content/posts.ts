import type { Block, Post } from "./types";

/* ------------------------------------------------------------------ */
/* EDIT ME — placeholder posts. Replace with your own writing.         */
/* `body` uses typed blocks instead of Markdown, so headings carry     */
/* stable ids and the table of contents can be derived from them.      */
/* ------------------------------------------------------------------ */

const spacingPost: Block[] = [
  {
    type: "paragraph",
    text: "我们习惯把间距当成一个数值问题：8 的倍数、4 的网格、一套严整的 spacing scale。这套方法很好用，但它解决的是「一致」，而不是「舒服」。",
  },
  {
    type: "heading",
    id: "the-grid-is-not-the-answer",
    text: "网格不是答案",
  },
  {
    type: "paragraph",
    text: "把两个元素都吸附到 8px 网格上，它们之间的距离就是「对」的吗？不一定。间距真正承担的工作是表达关系：靠得近意味着属于同一组，离得远意味着是两个独立的事。",
  },
  {
    type: "quote",
    text: "间距不是留出来的空白，而是被设计过的关系。",
  },
  {
    type: "paragraph",
    text: "所以我在实际项目里会先问一个问题：这两个东西是不是一组？得到答案之后，数值反而变得次要了。",
  },
  {
    type: "heading",
    id: "three-rules-i-actually-use",
    text: "我真正在用的三条规则",
  },
  {
    type: "list",
    items: [
      "组内间距永远小于组间间距，且比例不低于 1:1.5。",
      "标题与它所描述的内容之间的距离，要小于它与上一段内容的距离。",
      "当犹豫不决时，加大区块之间的距离，而不是加大元素内部的距离。",
    ],
  },
  {
    type: "heading",
    id: "what-about-the-scale",
    text: "那 spacing scale 还要吗",
  },
  {
    type: "paragraph",
    text: "要。但它的角色是「限制选项数量」，而不是「决定正确答案」。我通常只保留 5 到 6 个档位，档位之间差距足够大，逼着自己做出明确的分组判断，而不是在 12 和 16 之间反复纠结。",
  },
  {
    type: "paragraph",
    text: "工具应该替你把不重要的选择做掉，好让你把注意力留给真正重要的那个判断。",
  },
];

const cssApiPost: Block[] = [
  {
    type: "paragraph",
    text: "CSS 变量最容易被误用的地方，是把它们当成「可以改名的颜色值」。真正有价值的用法是把它们当成一层 API：对外承诺语义，对内保留实现自由。",
  },
  {
    type: "heading",
    id: "name-the-purpose-not-the-colour",
    text: "命名要写用途，不要写颜色",
  },
  {
    type: "paragraph",
    text: "--blue-500 描述的是实现，--accent 描述的是意图。前者一旦要换成绿色，所有引用它的地方都变成了谎言；后者换什么都成立。",
  },
  {
    type: "code",
    lang: "css",
    code: `/* implementation layer — free to change */
:root {
  --blue-500: oklch(62% 0.19 259);
}

/* semantic layer — this is the API */
:root {
  --accent: var(--blue-500);
  --accent-contrast: oklch(99% 0 0);
}`,
  },
  {
    type: "heading",
    id: "keep-the-token-count-small",
    text: "把令牌数量压到最小",
  },
  {
    type: "paragraph",
    text: "一个健康的语义层通常不超过二十个令牌。超过这个数量，往往说明你在用令牌描述组件，而不是描述系统——那是组件自己的事。",
  },
  {
    type: "list",
    ordered: true,
    items: [
      "先列出界面里所有「角色」：背景、前景、边框、强调。",
      "为每个角色定义最少的变体：默认、柔和、强烈。",
      "只有当同一个角色在明暗下需要不同实现时，才引入第二层。",
    ],
  },
  {
    type: "heading",
    id: "themes-become-trivial",
    text: "换主题会变成一件小事",
  },
  {
    type: "paragraph",
    text: "一旦语义层稳定，新增一套主题就只是重写二十个变量的赋值。组件代码一行都不用动。这也是这个网站曾经能同时提供四种风格的唯一原因。",
  },
];

const themesPost: Block[] = [
  {
    type: "paragraph",
    text: "这个网站曾经在右上角有一个风格切换器，可以在四种设计之间来回切换。现在它没有了——因为我选完了。这篇文章记录的是那个过程。",
  },
  {
    type: "heading",
    id: "taste-is-comparative",
    text: "审美是比较出来的",
  },
  {
    type: "paragraph",
    text: "单独看一个设计，很难判断它好不好——因为没有参照。把它和三个明显不同的方案并排放在一起，偏好会立刻浮现出来，而且往往和你原本以为的不一样。",
  },
  {
    type: "quote",
    text: "我不知道自己喜欢什么，但我知道自己更喜欢哪一个。",
  },
  {
    type: "heading",
    id: "what-made-them-different",
    text: "四种风格的差异在哪",
  },
  {
    type: "paragraph",
    text: "如果只换颜色，四个主题看起来仍然是同一个设计。真正拉开差距的是排版与结构：标题用什么字体、圆角有多大、边框是否可见、留白有多慷慨。",
  },
  {
    type: "list",
    items: [
      "留白：衬线标题、几乎不可见的边框、克制的中性色。",
      "科技：冷调底色、青蓝强调、等宽字体细节与工程网格。",
      "暖意：奶油底色、珊瑚强调、大圆角与柔和阴影。",
      "编辑：硬边框、超大标题、明确的栏线与印刷感。",
    ],
  },
  {
    type: "heading",
    id: "the-cost",
    text: "代价",
  },
  {
    type: "paragraph",
    text: "代价是真实的：所有视觉决定都必须经过令牌，不能在任何组件里写死一个颜色或圆角。这在前期会慢一些，但它带来的约束恰好是设计系统该有的约束。",
  },
  {
    type: "heading",
    id: "what-was-left",
    text: "留下来的",
  },
  {
    type: "paragraph",
    text: "最后选中的是「编辑」。其余三套连同它们的字体、装饰层和色板一起删掉了，样式表少了两百多行，切换器一路瘦到只剩明暗两档。但那二十个令牌一个没动，删主题时组件代码一行都没改。",
  },
  {
    type: "paragraph",
    text: "这大概就是那次实验真正的产出：不是四套主题，而是一个被四套主题验证过的语义层。",
  },
];

export const posts: Post[] = [
  {
    slug: "building-a-personal-home",
    title: "把个人网站慢慢写成自己的样子",
    description: "从姓名和近况，到一点克制的动效与更方便的阅读，记录这个网站的这一轮调整。",
    date: "2026-09-06",
    topic: "notes",
    topicLabel: "随笔",
    tags: ["personal", "website", "design"],
    minutes: 3,
    featured: true,
    body: [
      { type: "paragraph", text: "这个网站正在慢慢成形。这一轮的调整，从一个很小的地方开始：把页面上的名字统一为浅忆QanYi，再让它更像一个可以长期留下记录的地方。" },
      { type: "heading", id: "a-place-of-my-own", text: "给内容一个自己的入口" },
      { type: "paragraph", text: "首页不需要讲完所有事情。它可以先回答几个简单的问题：这是谁的网站，这里有什么，最近在做什么，以及怎样联系。项目和文章各自有完整的页面，愿意继续了解的人可以顺着读下去。" },
      { type: "paragraph", text: "所以这次把近况放到了首页，并标上实际更新日期。它不需要是一份郑重的公告，几句话就能说明眼下正在推进的事；日期则让读者知道，这些内容是什么时候写下的。" },
      { type: "heading", id: "a-familiar-name", text: "名字也要适应屏幕" },
      { type: "paragraph", text: "在宽屏顶部，页头显示「浅忆QanYi · @LyaQanYi」。往下读，或者把窗口缩小时，前半部分渐隐，只留下账号。这样既保留了身份，也给导航和正文让出空间。" },
      { type: "paragraph", text: "这个变化很小，却让桌面和手机不必强行使用同一种排布。名称、所在地和社交入口也统一到了共享配置里，后续修改时不必逐页寻找。" },
      { type: "heading", id: "quiet-motion", text: "动效留在合适的地方" },
      { type: "paragraph", text: "首屏文字依次出现，向下滚动时区块轻轻进入视野，悬停项目卡片时封面略微放大。这些变化的作用是提示顺序和可操作性，文字本身仍然保持稳定，方便阅读。" },
      { type: "paragraph", text: "已经读过的区块不会反复消失再出现。系统开启减少动态效果时，页面也会相应收起动画，让内容可以直接被看到。" },
      { type: "heading", id: "comfortable-reading", text: "让长文更容易读下去" },
      { type: "paragraph", text: "文章在桌面端使用侧边目录，当前章节随阅读位置高亮。手机屏幕有限，目录放在正文之前，默认折叠，需要跳转时再展开。选中章节后，目录收起，把空间还给正文。" },
      { type: "paragraph", text: "读完之后也留了两个简单的出口：通过邮件聊聊这篇文章，或者通过 RSS 订阅后续更新。邮件入口会带上文章标题和地址，省去重新解释上下文的步骤。" },
      { type: "heading", id: "keep-building", text: "接下来，慢慢把内容填进去" },
      { type: "paragraph", text: "页面搭起来只是开始。这次先把网站本身记成一个项目，把调整过程写成第一篇建设笔记。其他示例内容留作草稿，等有了真实的过程和材料，再逐步补充。" },
      { type: "paragraph", text: "比起一次填满所有栏目，更希望每次更新都留下点具体的东西：做了什么，为什么这么做，还有什么没有想完。这个网站会和这些记录一起继续生长。" },
    ],
  },
  {
    draft: true,
    slug: "spacing-is-not-a-math-problem",
    title: "间距不是一个数学问题",
    description: "8 的倍数解决了一致性，但没有解决关系。谈谈我在实际项目里真正在用的间距判断方式。",
    date: "2025-11-18",
    topic: "design",
    topicLabel: "设计",
    tags: ["design", "spacing", "craft", "design-systems"],
    minutes: 4,
    featured: true,
    body: spacingPost,
  },
  {
    draft: true,
    slug: "css-variables-as-an-api",
    title: "把 CSS 变量当成 API 来设计",
    description: "语义层与实现层分离之后，换主题会从一次重构变成改二十行赋值。",
    date: "2025-09-02",
    topic: "engineering",
    topicLabel: "工程",
    tags: ["css", "design-systems", "architecture", "theming"],
    minutes: 5,
    featured: true,
    body: cssApiPost,
  },
  {
    draft: true,
    slug: "four-themes-one-site",
    title: "为什么我给一个个人网站做了四套主题",
    description: "不是因为无法取舍，而是因为并排比较才是我做决定的方式。选完之后，其余三套就被删掉了。",
    date: "2025-06-14",
    topic: "notes",
    topicLabel: "随笔",
    tags: ["process", "theming", "personal", "css"],
    minutes: 3,
    featured: false,
    body: themesPost,
  },
];

/** Newest first. */
export const sortedPosts = posts.filter((post) => !post.draft).sort((a, b) => b.date.localeCompare(a.date));

export const featuredPosts = sortedPosts.filter((post) => post.featured);

export function getPost(slug: string): Post | undefined {
  return sortedPosts.find((post) => post.slug === slug);
}

/** Posts sharing at least one tag, most overlap first. */
export function getRelatedPosts(slug: string, limit = 2): Post[] {
  const current = getPost(slug);
  if (!current) return [];

  return sortedPosts
    .filter((post) => post.slug !== slug)
    .map((post) => ({
      post,
      overlap: post.tags.filter((tag) => current.tags.includes(tag)).length,
    }))
    .filter(({ overlap }) => overlap > 0)
    .sort((a, b) => b.overlap - a.overlap || b.post.date.localeCompare(a.post.date))
    .slice(0, limit)
    .map(({ post }) => post);
}

/** Topic chips derived from the data, ordered by most recent post. */
export function getPostTopics(): { key: string; label: Post["topicLabel"]; count: number }[] {
  const seen = new Map<string, { label: Post["topicLabel"]; count: number; latest: string }>();

  for (const post of sortedPosts) {
    const entry = seen.get(post.topic);
    if (entry) {
      entry.count += 1;
    } else {
      seen.set(post.topic, { label: post.topicLabel, count: 1, latest: post.date });
    }
  }

  return [...seen.entries()]
    .sort((a, b) => b[1].latest.localeCompare(a[1].latest))
    .map(([key, { label, count }]) => ({ key, label, count }));
}

/** Headings pulled out of the body, used to build the table of contents. */
export function getTableOfContents(post: Post): { id: string; text: Post["title"] }[] {
  return post.body
    .filter((block): block is Extract<Block, { type: "heading" }> => block.type === "heading")
    .map(({ id, text }) => ({ id, text }));
}
