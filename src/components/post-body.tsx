import type { Block } from "@/content/types";

/**
 * Renders the typed block list into the markup `.prose-post` styles.
 *
 * Blocks never reorder or change after build, so positional keys are stable
 * here; heading `id`s are the anchors the table of contents links to and are
 * emitted as attributes rather than used as keys.
 */
export function PostBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="prose-post">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "paragraph":
            return <p key={index}>{block.text}</p>;

          case "heading":
            return (
              <h2 key={index} id={block.id} tabIndex={-1}>
                {block.text}
              </h2>
            );

          case "quote":
            return (
              <blockquote key={index}>
                <p>{block.text}</p>
                {block.cite ? (
                  /* The quote itself is set in the display face at 22px, so the
                     attribution has to opt back out of both. */
                  <cite className="mt-3 block font-mono text-xs not-italic text-fg-subtle">
                    {block.cite}
                  </cite>
                ) : null}
              </blockquote>
            );

          case "list": {
            const items = block.items.map((item, position) => (
              <li key={position}>{item}</li>
            ));
            return block.ordered ? (
              <ol key={index}>{items}</ol>
            ) : (
              <ul key={index}>{items}</ul>
            );
          }

          case "code":
            /* No highlighter is bundled; the conventional `language-*` class
               records the intent and is the hook one would attach to later. */
            return (
              <pre key={index}>
                <code className={`language-${block.lang}`}>{block.code}</code>
              </pre>
            );
        }
      })}
    </div>
  );
}
