import { config, collection, fields } from '@keystatic/core';

export default config({
  storage: { kind: 'local' },
  collections: {
    listicles: collection({
      label: 'Listicles',
      slugField: 'slug',
      path: 'src/content/listicles/*',
      format: { contentField: 'intro' },
      schema: {
        title: fields.text({ label: 'Title' }),
        slug: fields.text({ label: 'Slug' }),
        category: fields.text({ label: 'Category' }),
        dek: fields.text({ label: 'Dek (subtitle)' }),
        heroImage: fields.image({
          label: 'Hero Image',
          directory: 'public/images/listicles',
          publicPath: '/images/listicles/',
        }),
        quickAnswer: fields.text({ label: 'Quick Answer' }),
        lastUpdated: fields.date({ label: 'Last Updated' }),
        intro: fields.markdoc({ label: 'Intro' }),
        items: fields.array(
          fields.object({
            rank: fields.integer({ label: 'Rank' }),
            name: fields.text({ label: 'Name' }),
            image: fields.image({
              label: 'Image / Logo',
              directory: 'public/images/items',
              publicPath: '/images/items/',
            }),
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
            url: fields.url({ label: 'URL' }),
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

