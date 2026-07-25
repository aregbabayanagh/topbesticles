import { defineMarkdocConfig, nodes, component } from '@astrojs/markdoc/config';

// Any table written into a listicle's markdoc body content renders through
// this override, which wraps it in the shared `.table-scroll` container
// (see src/components/ScrollableTable.astro) so it scrolls horizontally on
// narrow screens instead of squashing — no per-listicle changes needed.
export default defineMarkdocConfig({
  nodes: {
    table: {
      ...nodes.table,
      render: component('./src/components/ScrollableTable.astro'),
    },
  },
});
