import { config, collection, fields, singleton } from "@keystatic/core";

export default config({
  storage: { kind: "local" },
  singletons: {
    // ── Settings ──────────────────────────────────────────────────────
    // Site-wide values editable without touching code. Stored as a single
    // flat file at src/content/settings.yaml (see src/lib/settings.ts for
    // the shared reader every component uses).
    settings: singleton({
      label: "Settings",
      path: "src/content/settings",
      format: { data: "yaml" },
      schema: {
        siteName: fields.text({
          label: "Site Name",
          description: 'e.g. "TopBesticles". Used in the header and footer wordmark, and page title suffixes.',
        }),
        tagline: fields.text({
          label: "Tagline",
          description: "Short line shown under the wordmark in the footer.",
          multiline: true,
        }),
        contactEmail: fields.text({
          label: "Contact Email",
          description: "Not shown directly on the site, but available to components that need it.",
        }),
        metaDescription: fields.text({
          label: "Default Meta Description (SEO)",
          description: "Fallback meta description for pages that don't set their own.",
          multiline: true,
        }),
        footerDisclosure: fields.text({
          label: "Footer Disclosure",
          description: 'The reader-supported / affiliate disclosure line shown above the copyright in the footer.',
          multiline: true,
        }),
        social: fields.object(
          {
            twitter: fields.url({
              label: "Twitter / X URL",
              validation: { isRequired: false },
            }),
            linkedin: fields.url({
              label: "LinkedIn URL",
              validation: { isRequired: false },
            }),
            instagram: fields.url({
              label: "Instagram URL",
              validation: { isRequired: false },
            }),
          },
          { label: "Social Links" }
        ),
      },
    }),
  },
  collections: {
    // ── Categories ────────────────────────────────────────────────────
    // Parent buckets that listicles belong to. Data-only (no body), stored
    // as YAML files in src/content/categories/<slug>.yaml.
    categories: collection({
      label: "Categories",
      slugField: "slug",
      path: "src/content/categories/*",
      format: { data: "yaml" },
      schema: {
        title: fields.text({
          label: "Title",
          description: 'e.g. "CRM Software"',
        }),
        slug: fields.text({ label: "Slug", description: 'e.g. "crm"' }),
        heading: fields.text({
          label: "Heading (H1 override)",
          description:
            "Optional. Used as the category page H1 instead of Title. Falls back to Title if empty.",
        }),
        description: fields.text({
          label: "Description",
          description: "Short blurb shown at the top of the category page.",
          multiline: true,
        }),
        featured: fields.checkbox({
          label: "Featured on homepage",
          description:
            "If any category is featured, only featured categories compete for the homepage grid’s 4 slots.",
          defaultValue: false,
        }),
        order: fields.integer({
          label: "Order",
          description:
            "Lower numbers appear first in the homepage grid. Leave empty to fall back to alphabetical.",
          validation: { isRequired: false },
        }),
        coverImage: fields.image({
          label: "Cover Image",
          directory: "public/images/categories",
          publicPath: "/images/categories/",
          validation: { isRequired: false },
        }),
        metaTitle: fields.text({ label: "Meta Title (SEO)" }),
        metaDescription: fields.text({
          label: "Meta Description (SEO)",
          multiline: true,
        }),
      },
    }),

    // ── Listicles ─────────────────────────────────────────────────────
    listicles: collection({
      label: "Listicles",
      slugField: "slug",
      path: "src/content/listicles/*",
      // `body` is the rich-text article stored as the file body. Only ONE
      // field can be the contentField, so the short lede lives in `intro`.
      format: { contentField: "body" },
      schema: {
        title: fields.text({ label: "Title" }),
        slug: fields.text({ label: "Slug" }),
        // Parent link — a listicle belongs to exactly one category.
        category: fields.relationship({
          label: "Category",
          collection: "categories",
          validation: { isRequired: true },
        }),
        tags: fields.array(fields.text({ label: "Tag" }), {
          label: "Tags",
          description:
            'Used for search/filtering, e.g. "roofing", "contractors".',
          itemLabel: (props) => props.value ?? "Tag",
        }),
        dek: fields.text({ label: "Dek (subtitle)" }),
        heroImage: fields.image({
          label: "Hero Image",
          directory: "public/images/listicles",
          publicPath: "/images/listicles/",
          validation: { isRequired: false },
        }),
        quickAnswer: fields.text({ label: "Quick Answer" }),
        lastUpdated: fields.date({ label: "Last Updated" }),
        metaTitle: fields.text({ label: "Meta Title (SEO)" }),
        metaDescription: fields.text({
          label: "Meta Description (SEO)",
          multiline: true,
        }),
        intro: fields.text({
          label: "Intro (lede)",
          description: "Short intro paragraph shown above the article body.",
          multiline: true,
        }),
        body: fields.markdoc({
          label: "Body",
          description:
            "Full article. Supports H2/H3, bold, bullet lists, and links.",
        }),
        items: fields.array(
          fields.object({
            rank: fields.integer({ label: "Rank" }),
            name: fields.text({ label: "Name" }),
            logo: fields.image({
              label: "Logo",
              directory: "public/images/items",
              publicPath: "/images/items/",
              validation: { isRequired: false },
            }),
            url: fields.url({ label: "URL" }),
            startingPrice: fields.text({ label: "Starting Price" }),
            bestFor: fields.text({ label: "Best For" }),
            description: fields.text({ label: "Description", multiline: true }),
            pros: fields.array(fields.text({ label: "Pro" }), {
              label: "Pros",
              itemLabel: (props) => props.value ?? "Pro",
            }),
            cons: fields.array(fields.text({ label: "Con" }), {
              label: "Cons",
              itemLabel: (props) => props.value ?? "Con",
            }),
            founded: fields.text({
              label: "Founded",
              description: 'e.g. "2006"',
              validation: { isRequired: false },
            }),
            headquarters: fields.text({
              label: "Headquarters",
              description: 'e.g. "Sarasota, Florida"',
              validation: { isRequired: false },
            }),
            founders: fields.text({
              label: "Founders",
              description: 'e.g. "Jeremiah Smith, Sean Smith"',
              validation: { isRequired: false },
            }),
            notableClients: fields.text({
              label: "Notable Clients",
              description: "Comma-separated",
              validation: { isRequired: false },
            }),
            reviewScore: fields.text({
              label: "Review Score",
              description: 'e.g. "5.0 on Clutch"',
              validation: { isRequired: false },
            }),
            sponsored: fields.checkbox({
              label: "Sponsored",
              description:
                'Paid/partner placement. Drives the visible "Sponsored" badge and adds rel="sponsored" to the outbound link.',
              defaultValue: false,
            }),
            linkRel: fields.select({
              label: "Link follow/nofollow",
              description:
                'Independent of Sponsored — controls whether the outbound link adds rel="nofollow".',
              options: [
                { label: "Follow", value: "follow" },
                { label: "Nofollow", value: "nofollow" },
              ],
              defaultValue: "follow",
            }),
          }),
          {
            label: "Items",
            itemLabel: (props) => props.fields.name.value ?? "Item",
          },
        ),
        faq: fields.array(
          fields.object({
            question: fields.text({ label: "Question" }),
            answer: fields.text({ label: "Answer", multiline: true }),
          }),
          {
            label: "FAQ",
            itemLabel: (props) => props.fields.question.value ?? "FAQ",
          },
        ),
      },
    }),
  },
});
