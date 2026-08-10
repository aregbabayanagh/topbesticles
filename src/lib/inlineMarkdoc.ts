import Markdoc from '@markdoc/markdoc';
import { isNofollowDomain } from './nofollowDomains';

const { nodes, Tag } = Markdoc;

// Same nofollow-by-domain rule as MarkdocLink.astro (the body-content
// renderer), reimplemented here because this path renders straight to an
// HTML string via Markdoc.renderers.html — Astro component node overrides
// (component()) only work through Astro's own content-rendering pipeline.
function linkNode() {
  return {
    ...nodes.link,
    transform(node: any, config: any) {
      const attributes = node.transformAttributes(config);
      const children = node.transformChildren(config);
      if (isNofollowDomain(attributes.href)) attributes.rel = 'nofollow';
      return new Tag('a', attributes, children);
    },
  };
}

// Renders short Markdoc source to a flat HTML string with no wrapping
// <article>/<p> tags — for fields that render inside an existing block
// element (a keyTakeaways <li>, a faq <p>). Multiple paragraphs in the
// source are not expected here; if present, they're concatenated with no
// separator, since there's nowhere for a block break to go once unwrapped.
export function renderMarkdocInline(source: string): string {
  if (!source) return '';
  const ast = Markdoc.parse(source);
  const content = Markdoc.transform(ast, {
    nodes: {
      document: { ...nodes.document, render: undefined },
      paragraph: { ...nodes.paragraph, render: undefined },
      link: linkNode(),
    },
  });
  return Markdoc.renderers.html(content);
}

// Renders Markdoc source to an HTML string with paragraph breaks preserved —
// each output <p> tagged with `paragraphClass` — for fields that hold
// multiple blank-line-separated paragraphs (intro).
export function renderMarkdocParagraphs(source: string, paragraphClass: string): string {
  if (!source) return '';
  const ast = Markdoc.parse(source);
  const content = Markdoc.transform(ast, {
    nodes: {
      document: { ...nodes.document, render: undefined },
      paragraph: {
        ...nodes.paragraph,
        transform(node: any, config: any) {
          const attributes = node.transformAttributes(config);
          const children = node.transformChildren(config);
          return new Tag('p', { ...attributes, class: paragraphClass }, children);
        },
      },
      link: linkNode(),
    },
  });
  return Markdoc.renderers.html(content);
}
