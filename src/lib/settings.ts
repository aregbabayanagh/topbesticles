import { getEntry } from 'astro:content';

// Shared reader for the Settings singleton (src/content/settings.yaml,
// editable at /keystatic). Every component that needs a site-wide value —
// site name, tagline, footer disclosure, default meta description, etc. —
// should go through this instead of hardcoding it.
export async function getSettings() {
  const entry = await getEntry('settings', 'settings');
  if (!entry) {
    throw new Error('Settings singleton is missing — check src/content/settings.yaml');
  }
  return entry.data;
}
