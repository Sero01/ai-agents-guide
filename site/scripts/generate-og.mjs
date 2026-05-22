// Generate 1200x630 PNG OG images for the major sections.
// Run: node scripts/generate-og.mjs
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, '..', 'public', 'og');

const BG = '#0c0c0c';
const PANEL = '#141414';
const BORDER = '#222222';
const ACCENT = '#c8a882';
const TEXT = '#e8e4df';
const MUTED = '#8a8580';

function escape(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function svg({ eyebrow, title, subtitle, badge }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${BG}"/>
      <stop offset="100%" stop-color="#1a1a1a"/>
    </linearGradient>
    <linearGradient id="accentLine" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0"/>
      <stop offset="20%" stop-color="${ACCENT}" stop-opacity="1"/>
      <stop offset="80%" stop-color="${ACCENT}" stop-opacity="1"/>
      <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0"/>
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${BORDER}" stroke-width="1" opacity="0.5"/>
    </pattern>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#grid)"/>

  <!-- Editorial accent line -->
  <rect x="0" y="100" width="1200" height="1" fill="url(#accentLine)"/>
  <rect x="0" y="530" width="1200" height="1" fill="url(#accentLine)"/>

  <!-- Branding row -->
  <g transform="translate(80, 70)">
    <text font-family="'Cormorant Garamond', Georgia, serif" font-size="34" font-weight="500" fill="${TEXT}">
      <tspan>agent</tspan><tspan fill="${ACCENT}" font-style="italic">guide</tspan>
    </text>
    <text x="1040" y="0" font-family="'Libre Franklin', system-ui, sans-serif" font-size="14" font-weight="500" fill="${MUTED}" letter-spacing="2" text-anchor="end">AGENTGUIDES.DEV</text>
  </g>

  <!-- Eyebrow -->
  <text x="80" y="200" font-family="'Libre Franklin', system-ui, sans-serif" font-size="20" font-weight="500" fill="${ACCENT}" letter-spacing="4">${escape(eyebrow.toUpperCase())}</text>

  <!-- Title -->
  <text x="80" y="290" font-family="'Cormorant Garamond', Georgia, serif" font-size="86" font-weight="500" fill="${TEXT}" letter-spacing="-1">${escape(title)}</text>

  <!-- Optional second-line title or subtitle -->
  <text x="80" y="380" font-family="'Cormorant Garamond', Georgia, serif" font-size="58" font-style="italic" font-weight="400" fill="${ACCENT}" letter-spacing="-0.5">${escape(subtitle)}</text>

  <!-- Tag pill -->
  <g transform="translate(80, 470)">
    <rect x="0" y="0" width="${badge.length * 11 + 36}" height="40" rx="20" fill="${PANEL}" stroke="${BORDER}"/>
    <circle cx="20" cy="20" r="4" fill="${ACCENT}"/>
    <text x="32" y="26" font-family="'Libre Franklin', system-ui, sans-serif" font-size="14" font-weight="500" fill="${TEXT}" letter-spacing="1">${escape(badge.toUpperCase())}</text>
  </g>

  <!-- Footer URL -->
  <text x="80" y="580" font-family="'JetBrains Mono', monospace" font-size="16" fill="${MUTED}">agentguides.dev · tested · numbers-first</text>
</svg>`;
}

const variants = [
  {
    file: 'reviews.png',
    eyebrow: 'Reviews',
    title: 'AI tool reviews.',
    subtitle: 'Tested. Numbers-first.',
    badge: 'Head-to-head comparisons',
  },
  {
    file: 'best.png',
    eyebrow: 'Best-Of Guides',
    title: 'Curated shortlists.',
    subtitle: 'Tested, not assembled.',
    badge: 'Verdict per use case',
  },
  {
    file: 'build.png',
    eyebrow: 'Build Tutorials',
    title: 'Working code, end-to-end.',
    subtitle: 'Real cost. Real diagrams.',
    badge: 'Step-by-step builds',
  },
  {
    file: 'leaderboard.png',
    eyebrow: 'AI Models Leaderboard',
    title: 'Fifty models, one table.',
    subtitle: 'Benchmarks. Pricing. Context.',
    badge: 'Updated monthly',
  },
];

for (const v of variants) {
  const buf = Buffer.from(svg(v));
  const outPath = resolve(outDir, v.file);
  await sharp(buf).png({ compressionLevel: 9 }).toFile(outPath);
  console.log('wrote', outPath);
}
