// Domains that get rel="nofollow" on any outbound citation link inside a
// listicle's rich-text fields (body content, keyTakeaways, intro, faq
// answers). Every other outbound link is followed. Shared by
// MarkdocLink.astro (body content, via markdoc.config.mjs) and
// inlineMarkdoc.ts (the inline rich-text fields) so the two stay in sync.
export const NOFOLLOW_DOMAINS = new Set([
  'beomniscient.com',
  'nogood.io',
  'siegemedia.com',
  'directiveconsulting.com',
  'skale.so',
  'revenuezen.com',
  'yesoptimist.com',
  'embarque.io',
  'omnius.so',
  'interodigital.com',
  'breadchaser.ai',
]);

export function isNofollowDomain(href: string): boolean {
  try {
    return NOFOLLOW_DOMAINS.has(new URL(href).hostname.replace(/^www\./, ''));
  } catch {
    return false;
  }
}
