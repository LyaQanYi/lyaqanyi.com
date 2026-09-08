# 更新网站内容

- `site.ts`：姓名、简介、地区、邮箱和社交链接。微信公众号有真实文章地址或二维码后再添加。
- `now.ts`：首页和关于页共用的近况。修改内容时手动更新 `nowUpdated`，不要使用构建日期。
- `projects.ts`：项目简介、技术、链接和过程记录；`sections` 可写起因、选择、难点与结果。`status` 必填，`ongoing` 显示在“进行的项目”，`past` 显示在“以往项目”；各组内按年份倒序，同年项目按数组中的顺序展示，`period` 仅用于显示时间。项目结束或恢复时手动更新状态。
- `posts.ts`：文章及正文。每个标题的 `id` 应唯一且稳定，供目录和外部链接定位。
- `resume.ts`：真实经历和教育信息填入 `experience`、`education`。空数组会隐藏对应栏目；`experienceDrafts` 和 `educationDrafts` 仅保留原示例。

项目或文章设置 `draft: true` 后，不出现在页面、详情路由、RSS、相关推荐或 sitemap 中。核实正文、数据、日期和链接后，移除标记或设为 `false` 即可展示。

首页精选项目设置 `featured: true`，并用 `featuredOrder` 指定顺序（数字越小越靠前，未设置的排在后面）。当前为 N.E.K.O.、LyaQanYi.com、OmniCopilot；该顺序独立于作品页分组和排列。

当前展示的网站项目和建设笔记根据本次网站迭代撰写；个人介绍采用中性文案，可继续调整为自己的语气。原有示例项目和文章保留为草稿，不代表真实经历。

N.E.K.O. 的参与时间（2025 — 至今）由本人提供，项目简介和技术根据[官方仓库](https://github.com/Project-N-E-K-O/N.E.K.O)整理。个人角色暂记为项目参与者；具体贡献确认后再填写 `highlights`，空数组会隐藏成果栏目。

四个以往项目的简介与功能来自各自仓库：[OmniCopilot](https://github.com/LyaQanYi/OmniCopilot)、[KiraOS Plugin](https://github.com/LyaQanYi/KiraOS_Plugin)、[QQ 自动禁言脚本](https://github.com/LyaQanYi/QQ-Auto-Mute-Script)、[Hippocampus Memory](https://github.com/LyaQanYi/kira_plugin_hippocampus_memory)。时间暂按 GitHub 仓库创建记录标注为 2026 年，不推定个人投入的起止月份；“以往项目”按本人指定分类，不表示所有仓库均已停止维护。海马体记忆插件的归档日期与合并去向以仓库说明为依据。

目前预览使用 `next start`，修改内容后需要重新构建并重启预览进程。
