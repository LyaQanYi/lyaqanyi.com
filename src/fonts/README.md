# 标题字体

`source-han-sans-cn.woff2` 由用户提供的 `Source Han Sans CN.ttf` 转换而来，作为完整源文件保留。网页使用它生成的分包，合计保留源文件全部字符和文字度量。

显示名称沿用用户提供的文件名；文件的内嵌字体族名仍为 `cmdysj`，Regular / 400。

- 原始文件：8,470,944 字节。
- 完整 WOFF2：3,861,616 字节，不再整包预加载。
- 常用字包 `source-han-sans-cn/core.woff2`：504,696 字节，4,351 个字符，包含 GB2312 一级汉字、拉丁字母、标点和全角字符。
- 其余字符按 Unicode 区间拆分，由 `source-han-sans-cn-subsets.css` 中的 `unicode-range` 按需加载。
- 字符映射合计仍为 30,786；没有删除生僻字，也没有替换字形。

共享加载配置在 `src/lib/fonts.ts`，仅预加载常用字包。`globals.css` 将常用字字体和扩展字体合并为 `--font-source-han-sans-cn`，全站通过 `--f-display` 使用；正文和导航沿用 `--f-sans`，辅助信息沿用 `--f-mono`。

所有分包通过 Next.js 构建为带内容哈希的静态资源，沿用一年不可变缓存。字符分组不随文章内容变化，新文章使用生僻字时自动加载对应扩展包，不需要重新生成。把字体转成 Base64 写进 HTML 会增加页面体积，且无法独立复用字体缓存，因此保留独立静态资源。

分包及 CSS 已提交到仓库，日常开发、构建和部署无需安装 Python 依赖。只有更换源字体或调整分包策略时才需要重新生成：

```bash
python3 -m venv /tmp/qanyi-font-tools
/tmp/qanyi-font-tools/bin/python -m pip install 'fonttools[woff]==4.61.1'
/tmp/qanyi-font-tools/bin/python scripts/build-font-subsets.py
/tmp/qanyi-font-tools/bin/python scripts/build-font-subsets.py --check
```

生成脚本校验每个分包的字符范围、字宽、边距及行高，并核对所有分包的字符并集与完整源文件一致。

原版 Instrument Serif 仅在 `/font-preview` 对比页加载。
