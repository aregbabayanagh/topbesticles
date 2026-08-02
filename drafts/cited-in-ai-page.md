# "Cited in AI" Page — Copy + Claude Code Prompt

Written in the plain style: short sentences, one idea each, industry terms kept.

---

## PAGE FIELDS

- **URL:** /cited-in-ai
- **H1:** How our lists get cited in AI answers
- **metaTitle:** How TopBesticles Lists Get Cited in AI Answers
- **metaDescription:** More people now ask AI which product to buy. Here's how AI systems pick their sources, and how we build our lists so they can be read, trusted, and cited.

---

## THE COPY

### The way people search has changed

People used to search, open five tabs, and compare. Now a lot of them just ask.

They ask ChatGPT which CRM to use. They ask Perplexity for the best SEO agency. Google answers directly with AI Overviews before anyone scrolls.

The answer comes back as a short recommendation, usually with a few sources cited underneath. Those sources get the visit. Everything else gets skipped.

### So the question becomes: where does the AI get its answer?

It reads. Then it decides which sources to trust.

That decision isn't random. AI systems favour sources that are clear, current, specific, and easy to parse. A page that states a direct answer beats a page that circles one. A page with real prices beats a page that says "contact for pricing." A page dated last month beats a page dated three years ago.

Most "best of" content fails these tests. It's vague, undated, and written to fill space rather than answer a question.

### How we build for it

**We answer the question first.** Every list opens with a quick answer — two or three sentences naming the best pick and who it's for. That block is written to be lifted and quoted on its own.

**We use real structure.** Every list has a comparison table, clear headings, and labelled facts like founded, headquarters, and pricing. We also add schema markup — ItemList, FAQPage, BreadcrumbList — so machines can read the ranking as data, not just paragraphs.

**We date everything.** Every page shows when it was last checked. The date is in the page and in our sitemap. We only change it when we've actually re-verified the facts.

**We keep the facts checkable.** Pricing comes from the company's own site. When we researched real estate CRMs, we found lists still recommending LionDesk — a product that shut down in September 2025. If a source gets that wrong, everything else it says is suspect.

**We publish the trade-offs.** Every entry has real cons. A list where nothing has a downside reads like an advert, to people and to machines.

### What this means if you're reading

You get a straight answer, whether you found us through Google, through an AI assistant, or directly.

The same things that make a page easy for a machine to read make it easy for a person to skim. Clear structure isn't a trick — it's just better writing.

### What this means if you sell something

Buyers are increasingly asking AI before they ever visit your site. If your product isn't in the sources those answers draw on, you're invisible at the exact moment someone is deciding.

Getting listed puts you in front of that moment. We're always evaluating products and services for our category lists.

[Get in touch](/contact) · [How we rank](/how-we-rank)

### One honest note

Nobody controls what an AI cites. Any agency promising guaranteed placement in AI answers is selling something they can't deliver.

What we can do is publish accurate, current, well-structured research and make it easy to read. That's the whole method. It's also just what a good source looks like.

---

## CLAUDE CODE PROMPT

```
Create a "Cited in AI" page at /cited-in-ai using the copy below. Don't push — I'll review.

- Use the existing design system (global.css tokens, Poppins, gradient accents, card styling,
  same section spacing as /about and /how-we-rank). It should feel like the rest of the site.
- Structure: H1, then the sections as H2s. Keep paragraphs short and scannable.
- Style the "How we build for it" points as cards with the gradient icon treatment used in the
  Benefits section, so they're scannable rather than a wall of text.
- Add breadcrumbs: Home → Cited in AI.
- SEO: use the metaTitle and metaDescription below; add to the sitemap; generate its OG image.
- Update the header nav "Cited in AI" link to point to /cited-in-ai (it currently points to an
  on-page anchor). Check the whole project for any other link to a #cited anchor and repoint it.
- Link to /cited-in-ai from the footer.
- Link "Get in touch" to /contact and "How we rank" to /how-we-rank.
- Add BreadcrumbList JSON-LD.

[paste the copy here]

Then run npm run dev and show me /cited-in-ai.
```

---

## NOTE

The nav-link change matters: your header currently links "Cited in AI" to an on-page anchor, the
same problem the Categories button had. This prompt fixes it at the same time.
