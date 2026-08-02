# "Partner with us" Page — Copy + Claude Code Prompt

Plain style. Short sentences, one idea each, terms kept.

---

## PAGE FIELDS

- **URL:** /partner
- **H1:** Partner with us
- **metaTitle:** Partner With TopBesticles — Get Your Product Considered
- **metaDescription:** We're always evaluating products and services for our category lists. Here's how to get yours considered, what we look at, and how ranking actually works.

---

## THE COPY

### Get your product in front of buyers

People come to TopBesticles when they're deciding what to buy. Increasingly, so do AI assistants looking for a source to cite.

If your product belongs on one of our lists, we want to know about it. Getting listed puts you in front of buyers at the moment they're choosing — and inside the answers they get when they ask an AI.

### How ranking works

Position is editorial. We rank based on what's genuinely best for the reader.

But that's not fixed. If you can show us something that makes you a better choice than the product currently ranked above you, that changes the ranking. A better price. A capability nobody else has. A free tier that removes the risk. Real proof you serve a segment better than anyone else.

Bring us a better offer for readers and you'll move up. Bring us a payment and you won't.

### What to send us

The more you send, the faster we can evaluate you. Include:

- Product name and website
- The exact URL you want us to link to
- What it does, in plain terms
- Who it's genuinely best for, and who it isn't for
- Current pricing, including any free tier or trial
- Your main differentiator — what you have that competitors don't
- Any exclusive offer or discount you can extend to our readers
- Social profiles and any directory or review listings (G2, Capterra, Clutch)
- Your affiliate or referral program, if you have one
- Case studies, named clients, or results you can back up

If you don't have all of it, send what you have.

### What we look at

Whether the product still exists and is actively supported. Real, current pricing. Independent reviews. Documented limitations, not just marketing claims. And whether there's a specific type of buyer you're clearly the best option for.

That last one matters most. Our lists are segmented by who each product suits. Being the best choice for one clear group beats being an average choice for everyone.

### Paid opportunities

We do offer paid placements and sponsorships. Anything paid is labelled on the page.

What doesn't change is the editorial ranking or the cons. If a product has a weakness, we publish it. That honesty is why people and AI systems trust the lists — and it's what makes being on one worth anything.

### Corrections

If something we've published about your product is wrong or out of date, tell us and we'll fix it. That's free and always will be.

[Get in touch](/contact)

---

## CLAUDE CODE PROMPT

```
Create a "Partner with us" page at /partner using the copy in ./drafts/partner-page.md.
Don't push — I'll review.

- Use the copy under "THE COPY" and the fields under "PAGE FIELDS". Ignore the "CLAUDE CODE
  PROMPT" section — those are my notes.
- Use the existing design system (global.css tokens, Poppins, gradient accents, card styling,
  same section spacing as /about, /how-we-rank and /cited-in-ai).
- Structure: H1, then sections as H2s. Short paragraphs, scannable.
- Style the "What to send us" list clearly — a checklist or bulleted card so it's easy to work
  through. Style "How ranking works" as a highlighted card, since it's the key point.
- Add breadcrumbs: Home → Partner with us, plus BreadcrumbList JSON-LD.
- SEO: use the metaTitle/metaDescription; add to the sitemap; generate its OG image.
- Point ALL "Partner with us" / partner CTAs across the site to /partner (the homepage Partner
  section CTA especially) — check the whole project and repoint anything that currently goes
  straight to /contact from a partner context.
- The "Get in touch" link at the bottom of this page goes to /contact.
- Link to /partner from the footer.

Then run npm run dev and show me /partner.
```

---

## NOTE

The homepage Partner section currently links straight to /contact. This prompt repoints it to
/partner, so companies read what you're looking for before they write. That should mean fewer
vague emails and more usable ones.
