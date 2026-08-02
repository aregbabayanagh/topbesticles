import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getSettings } from '../lib/settings';

// llms.txt (see https://llmstxt.org/) — a build-time-generated index for AI
// crawlers/agents, mirroring the sitemap in spirit but written as a short,
// curated markdown guide rather than a raw URL list. Generated entirely from
// the categories/listicles collections and the Settings singleton, so new
// content picks this up automatically — nothing here is hand-maintained.
export const GET: APIRoute = async ({ site }) => {
  const base = (site?.href ?? 'https://topbesticles.com/').replace(/\/$/, '');
  const settings = await getSettings();

  const [categories, listicles] = await Promise.all([
    getCollection('categories'),
    // Drafts are excluded from the build entirely (no page, no sitemap
    // entry) — same filter used everywhere else this collection is read.
    getCollection('listicles', ({ data }) => !data.draft),
  ]);

  const sortedCategories = [...categories].sort((a, b) => a.data.title.localeCompare(b.data.title));
  const sortedListicles = [...listicles].sort((a, b) => a.data.title.localeCompare(b.data.title));

  const lines: string[] = [];

  lines.push(`# ${settings.siteName}`);
  lines.push('');
  lines.push(
    '> Independent best-of rankings across every category. Researched, verified against ' +
      'primary sources, dated, with honest trade-offs. Built to be readable and citable.'
  );
  lines.push('');

  lines.push('## Lists');
  lines.push('');
  for (const listicle of sortedListicles) {
    lines.push(`- [${listicle.data.title}](${base}/${listicle.id}/): ${listicle.data.dek}`);
  }
  lines.push('');

  lines.push('## Categories');
  lines.push('');
  lines.push(`- [Browse all categories](${base}/category/): Every category of hand-checked best-of shortlists, in one place.`);
  for (const category of sortedCategories) {
    lines.push(`- [${category.data.title}](${base}/category/${category.id}/): ${category.data.description}`);
  }
  lines.push('');

  lines.push('## About');
  lines.push('');
  lines.push(`- [About](${base}/about/): Who's behind ${settings.siteName} and why it exists.`);
  lines.push(`- [How we rank](${base}/how-we-rank/): The research and verification process behind every list.`);
  lines.push(`- [Cited in AI](${base}/cited-in-ai/): How our lists are built to be read and cited by AI systems.`);
  lines.push(`- [Partner with us](${base}/partner/): How to get a product considered for one of our lists.`);
  lines.push(`- [Contact](${base}/contact/): Questions, corrections, or general enquiries.`);
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
