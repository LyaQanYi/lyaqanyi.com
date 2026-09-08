import { Icon } from "@/components/icon";
import { ScrollReveal } from "@/components/scroll-reveal";
import { uiCopy } from "@/content/copy";
import { absoluteUrl, feedPath, profile } from "@/content/site";

export function PostContact({ title, slug }: { title: string; slug: string }) {
  const subject = encodeURIComponent(`关于《${title}》`);
  const body = encodeURIComponent(`${absoluteUrl(`/writing/${slug}`)}\n\n`);

  return (
    <section className="mt-10 border-t border-line pt-8 print:hidden">
      <ScrollReveal>
        <h2 className="font-display text-2xl text-fg">{uiCopy.writing.contactHeading}</h2>
        <p className="mt-3 text-sm leading-relaxed text-fg-muted">{uiCopy.writing.contactBody}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={`mailto:${profile.email}?subject=${subject}&body=${body}`}
            className="action-link inline-flex items-center gap-2 border border-line-strong bg-accent px-4 py-2.5 text-sm text-accent-contrast hover:bg-accent-hover"
          >
            <Icon name="mail" size={15} />
            {uiCopy.writing.contactAction}
          </a>
          <a
            href={feedPath}
            className="action-link inline-flex items-center gap-2 border border-line px-4 py-2.5 text-sm text-fg-muted hover:border-line-strong hover:text-fg"
          >
            <Icon name="rss" size={15} />
            {uiCopy.writing.subscribeAction}
          </a>
        </div>
      </ScrollReveal>
    </section>
  );
}
