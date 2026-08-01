import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import { getSettings } from './settings';

const WIDTH = 1200;
const HEIGHT = 630;

// Brand tokens duplicated from src/layouts/Base.astro's :root — Satori can't
// read CSS custom properties, so the gradient/colors are hardcoded here.
const GRADIENT = 'linear-gradient(135deg, #6D4DFB 0%, #8B5CF6 55%, #22D3EE 130%)';
const INK = '#13151B';

const require_ = createRequire(import.meta.url);

let assetsPromise: Promise<{
  fonts: { name: string; data: Buffer; weight: 400 | 700; style: 'normal' }[];
  logoDataUri: string;
  siteName: string;
}> | null = null;

// Loads fonts/logo/settings once per build process and reuses them across
// every generated image — reading disk + resizing the logo per-page would
// otherwise repeat for every category/listicle.
function loadAssets() {
  if (!assetsPromise) {
    assetsPromise = (async () => {
      const regularPath = require_.resolve('@fontsource/poppins/files/poppins-latin-400-normal.woff');
      const boldPath = require_.resolve('@fontsource/poppins/files/poppins-latin-700-normal.woff');
      // Resolved from process.cwd() (the project root Astro builds from),
      // not import.meta.url — this module gets bundled to a build-time chunk
      // at an unpredictable depth, so a relative-to-this-file path breaks.
      const logoPath = join(process.cwd(), 'public/logo/top-besticles-logo.png');

      const [regular, bold, logoBuffer, settings] = await Promise.all([
        readFileSync(regularPath),
        readFileSync(boldPath),
        sharp(logoPath)
          .resize(160, 160, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .png()
          .toBuffer(),
        getSettings(),
      ]);

      return {
        fonts: [
          { name: 'Poppins', data: regular, weight: 400 as const, style: 'normal' as const },
          { name: 'Poppins', data: bold, weight: 700 as const, style: 'normal' as const },
        ],
        logoDataUri: `data:image/png;base64,${logoBuffer.toString('base64')}`,
        siteName: settings.siteName,
      };
    })();
  }
  return assetsPromise;
}

// Longer titles get a smaller font so they still fit within two lines at
// 1200x630 instead of overflowing the card.
function titleFontSize(title: string) {
  const len = title.length;
  if (len <= 24) return 68;
  if (len <= 40) return 56;
  if (len <= 60) return 46;
  if (len <= 90) return 38;
  return 32;
}

function buildTree({
  title,
  subtitle,
  logoDataUri,
  siteName,
  backgroundImageDataUri,
}: {
  title: string;
  subtitle?: string;
  logoDataUri: string;
  siteName: string;
  backgroundImageDataUri?: string;
}) {
  // Content layer (brand lockup + title) is identical whether the backdrop
  // is the flat brand gradient or a listicle's own featured image — it's
  // absolutely positioned so it can stack over either.
  const contentLayer = {
    type: 'div',
    props: {
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: WIDTH,
        height: HEIGHT,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 72,
        fontFamily: 'Poppins',
      },
      children: [
        // Brand lockup: logo mark (on a white chip for contrast) + site name.
        {
          type: 'div',
          props: {
            style: { display: 'flex', alignItems: 'center', gap: 18 },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    width: 72,
                    height: 72,
                    borderRadius: 20,
                    background: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                  children: {
                    type: 'img',
                    props: { src: logoDataUri, width: 50, height: 50 },
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: { fontSize: 32, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' },
                  children: siteName,
                },
              },
            ],
          },
        },
        // Title (+ optional subtitle, used for the homepage's tagline).
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 1020 },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    fontSize: titleFontSize(title),
                    fontWeight: 700,
                    color: '#fff',
                    lineHeight: 1.15,
                    letterSpacing: '-0.02em',
                  },
                  children: title,
                },
              },
              ...(subtitle
                ? [
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          fontSize: 30,
                          fontWeight: 400,
                          color: 'rgba(255,255,255,0.88)',
                        },
                        children: subtitle,
                      },
                    },
                  ]
                : []),
            ],
          },
        },
      ],
    },
  };

  if (!backgroundImageDataUri) {
    return {
      type: 'div',
      props: {
        style: { width: WIDTH, height: HEIGHT, position: 'relative', display: 'flex', backgroundImage: GRADIENT },
        children: [contentLayer],
      },
    };
  }

  // Listicle has its own featured image: use it as the backdrop, with a
  // bottom-weighted dark scrim so the white brand/title text stays legible
  // over arbitrary photo content.
  return {
    type: 'div',
    props: {
      style: { width: WIDTH, height: HEIGHT, position: 'relative', display: 'flex' },
      children: [
        {
          type: 'img',
          props: {
            src: backgroundImageDataUri,
            width: WIDTH,
            height: HEIGHT,
            style: { position: 'absolute', top: 0, left: 0, objectFit: 'cover' },
          },
        },
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              width: WIDTH,
              height: HEIGHT,
              backgroundImage:
                'linear-gradient(180deg, rgba(10,8,30,0.1) 0%, rgba(8,6,24,0.45) 55%, rgba(6,4,20,0.88) 100%)',
            },
          },
        },
        contentLayer,
      ],
    },
  };
}

export async function renderOgImage({
  title,
  subtitle,
  backgroundImagePath,
}: {
  title: string;
  subtitle?: string;
  backgroundImagePath?: string;
}): Promise<Buffer> {
  const { fonts, logoDataUri, siteName } = await loadAssets();

  let backgroundImageDataUri: string | undefined;
  if (backgroundImagePath) {
    // backgroundImagePath is the public-relative path Keystatic wrote (e.g.
    // "/images/listicles/foo.jpg") — resolve it under public/ from cwd, same
    // reasoning as the logo path above.
    const resolvedPath = join(process.cwd(), 'public', backgroundImagePath);
    const buffer = await sharp(resolvedPath)
      .resize(WIDTH, HEIGHT, { fit: 'cover' })
      .png()
      .toBuffer();
    backgroundImageDataUri = `data:image/png;base64,${buffer.toString('base64')}`;
  }

  const svg = await satori(buildTree({ title, subtitle, logoDataUri, siteName, backgroundImageDataUri }) as never, {
    width: WIDTH,
    height: HEIGHT,
    fonts,
  });

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH }, background: INK });
  return resvg.render().asPng();
}
