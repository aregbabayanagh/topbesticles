import { config, collection, fields } from '@keystatic/core';

export default config({
  storage: { kind: 'local' },
  collections: {
    // ── Categories ────────────────────────────────────────────────────
    // Parent buckets that listicles belong to. Data-only (no body), stored
    // as YAML files in src/content/categories/<slug>.yaml.
    categories: collection({
      label: 'Categories',
      slugField: 'slug',
      path: 'src/content/categories/*',
      format: { data: 'yaml' },
      schema: {
        title: fields.text({ label: 'Title', description: 'e.g. "CRM Software"' }),
        slug: fields.text({ label: 'Slug', description: 'e.g. "crm"' }),
        heading: fields.text({
          label: 'Heading (H1 override)',
          description: 'Optional. Used as the category page H1 instead of Title. Falls back to Title if empty.',
        }),
        description: fields.text({
          label: 'Description',
          description: 'Short blurb shown at the top of the category page.',
          multiline: true,
        }),
        coverImage: fields.image({
          label: 'Cover Image',
          directory: 'public/images/categories',
          publicPath: '/images/categories/',
          validation: { isRequired: false },
        }),
        metaTitle: fields.text({ label: 'Meta Title (SEO)' }),
        metaDescription: fields.text({ label: 'Meta Description (SEO)', multiline: true }),
      },
    }),

    // ── Listicles ─────────────────────────────────────────────────────
    listicles: collection({
      label: 'Listicles',
      slugField: 'slug',
      path: 'src/content/listicles/*',
      // `body` is the rich-text article stored as the file body. Only ONE
      // field can be the contentField, so the short lede lives in `intro`.
      format: { contentField: 'body' },
      schema: {
        title: fields.text({ label: 'Title' }),
        slug: fields.text({ label: 'Slug' }),
        // Parent link — a listicle belongs to exactly one category.
        category: fields.relationship({
          label: 'Category',
          collection: 'categories',
          validation: { isRequired: true },
        }),
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tags',
          description: 'Used for search/filtering, e.g. "roofing", "contractors".',
          itemLabel: (props) => props.value ?? 'Tag',
        }),
        dek: fields.text({ label: 'Dek (subtitle)' }),
        heroImage: fields.image({
          label: 'Hero Image',
          directory: 'public/images/listicles',
          publicPath: '/images/listicles/',
        }),
        quickAnswer: fields.text({ label: 'Quick Answer' }),
        lastUpdated: fields.date({ label: 'Last Updated' }),
        metaTitle: fields.text({ label: 'Meta Title (SEO)' }),
        metaDescription: fields.text({ label: 'Meta Description (SEO)', multiline: true }),
        intro: fields.text({
          label: 'Intro (lede)',
          description: 'Short intro paragraph shown above the article body.',
          multiline: true,
        }),
        body: fields.markdoc({
          label: 'Body',
          description: 'Full article. Supports H2/H3, bold, bullet lists, and links.',
        }),
        items: fields.array(
          fields.object({
            rank: fields.integer({ label: 'Rank' }),
            name: fields.text({ label: 'Name' }),
            logo: fields.image({
              label: 'Logo',
              directory: 'public/images/items',
              publicPath: '/images/items/',
            }),
            url: fields.url({ label: 'URL' }),
            startingPrice: fields.text({ label: 'Starting Price' }),
            bestFor: fields.text({ label: 'Best For' }),
            description: fields.text({ label: 'Description', multiline: true }),
            pros: fields.array(fields.text({ label: 'Pro' }), {
              label: 'Pros',
              itemLabel: (props) => props.fields.value.value ?? 'Pro',
            }),
            cons: fields.array(fields.text({ label: 'Con' }), {
              label: 'Cons',
              itemLabel: (props) => props.fields.value.value ?? 'Con',
            }),
          }),
          {
            label: 'Items',
            itemLabel: (props) => props.fields.name.value ?? 'Item',
          }
        ),
        faq: fields.array(
          fields.object({
            question: fields.text({ label: 'Question' }),
            answer: fields.text({ label: 'Answer', multiline: true }),
          }),
          {
            label: 'FAQ',
            itemLabel: (props) => props.fields.question.value ?? 'FAQ',
          }
        ),
      },
    }),
  },
});
