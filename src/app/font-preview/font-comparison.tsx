"use client";

import { useEffect, useState } from "react";

import styles from "./font-comparison.module.css";

interface SampleContent {
  name: string;
  handle: string;
  role: string;
  tagline: string;
  email: string;
  location: string;
  paragraphs: string[];
  projectTitle: string;
  projectSummary: string;
  postTitle: string;
  postDescription: string;
}

type Scope = "headings" | "all";
type View = "compare" | "original" | "uploaded";

export function FontComparison({ fontFamily, sample }: { fontFamily: string; sample: SampleContent }) {
  const [scope, setScope] = useState<Scope>("headings");
  const [view, setView] = useState<View>("compare");
  const [fontStatus, setFontStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let active = true;
    document.fonts.load(`400 24px ${fontFamily}`, "浅忆QanYi").then(
      (faces) => { if (active) setFontStatus(faces.length > 0 ? "ready" : "error"); },
      () => { if (active) setFontStatus("error"); },
    );
    return () => { active = false; };
  }, [fontFamily]);

  return (
    <div className="mt-8">
      <div className="sticky top-[65px] z-10 flex flex-wrap items-center justify-between gap-4 border-y border-line bg-bg py-4">
        <div role="group" aria-label="新字体应用范围" className="flex flex-wrap gap-2">
          {([
            ["headings", "仅替换标题"],
            ["all", "标题与正文"],
          ] as const).map(([value, label]) => (
            <button key={value} type="button" aria-pressed={scope === value} onClick={() => setScope(value)} className={`action-link border px-3 py-2 text-xs ${scope === value ? "border-accent bg-accent text-accent-contrast" : "border-line text-fg-muted hover:bg-surface-hover"}`}>
              {label}
            </button>
          ))}
        </div>
        <div role="group" aria-label="对比视图" className="flex flex-wrap gap-1">
          {([
            ["compare", "并排对比"],
            ["original", "只看原版"],
            ["uploaded", "只看新字体"],
          ] as const).map(([value, label]) => (
            <button key={value} type="button" aria-pressed={view === value} onClick={() => setView(value)} className={`action-link px-3 py-2 text-xs ${view === value ? "bg-bg-alt text-fg underline underline-offset-4" : "text-fg-muted hover:text-fg"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <p role="status" className="mt-4 min-h-5 text-xs text-fg-subtle">
        {fontStatus === "ready" ? "cmdysj 已加载，可切换查看效果。" : fontStatus === "error" ? "字体未能加载，当前显示后备字体。刷新页面可重试。" : "正在加载 cmdysj，请稍候…"}
      </p>

      <div className={`mt-5 grid items-start gap-6 ${view === "compare" ? "lg:grid-cols-2" : "mx-auto max-w-3xl"}`}>
        {(["original", "uploaded"] as const).map((font) => (
          <section key={font} aria-label={font === "original" ? "原版字体示例" : "cmdysj 字体示例"} className={`min-w-0 border border-line ${view !== "compare" && view !== font ? "hidden" : ""}`}>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-bg-alt px-5 py-3 text-xs">
              <span>{font === "original" ? "A · 原版字体" : "B · cmdysj"}</span>
              <span className="text-fg-subtle">{font === "original" ? "原版排版" : scope === "headings" ? "仅替换标题（已采用）" : "标题与正文"}</span>
            </div>
            <div className={styles.sample} data-font={font} data-scope={scope}>
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line pb-5 text-xs">
                <span className="font-display text-xl">{sample.name}</span>
                <span className="font-mono text-fg-subtle">@{sample.handle}</span>
              </div>

              <p className="mt-9 text-sm text-fg-muted">你好，我是</p>
              <h2 className={styles.name}>{sample.name}</h2>
              <p className="mt-5 font-display text-2xl leading-snug">{sample.role}</p>
              <p className="mt-4 text-base leading-relaxed text-fg-muted">{sample.tagline}</p>

              <div className="mt-10 border-t border-line pt-7">
                <h3 className="font-display text-3xl leading-snug">简单介绍</h3>
                <div className="mt-5 space-y-4 text-base leading-[1.9] text-fg-muted">
                  {sample.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              </div>

              <div className="mt-9 border-t border-line pt-7">
                <h3 className="font-display text-2xl leading-snug">{sample.projectTitle}</h3>
                <p className="mt-3 text-base leading-relaxed text-fg-muted">{sample.projectSummary}</p>
              </div>

              <div className="mt-9 border-t border-line pt-7">
                <h3 className="font-display text-2xl leading-snug">{sample.postTitle}</h3>
                <p className="mt-3 text-base leading-relaxed text-fg-muted">{sample.postDescription}</p>
              </div>

              <div className="mt-9 space-y-3 border-t border-line pt-7 text-base">
                <p>{sample.location} · 2026.09.06</p>
                <p className="break-words">{sample.email}</p>
                <p className="text-sm text-fg-muted">标点：，。！？「」 · Aa Bb QanYi 0123456789</p>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
