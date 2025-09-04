# Blynk Next.js (App Router) + Tailwind

Pixel-aligned, component-based build of your Figma export using Next.js 14 and Tailwind CSS.

## Quick start

```bash
pnpm i   # or npm i / yarn
pnpm dev # or npm run dev
```

Open http://localhost:3000

## Notes

- Mulish font is loaded with `next/font`.
- Remote images from Builder.io are allowed in `next.config.mjs`.
- Colors are taken from your Figma file:
  - Primary `#401B60`
  - Gray text `#6F6C90`
  - Neutral 800 `#170F49`
- Sections are split as components in `/components`.
- The "Plans" section uses a glass card style similar to the design.
