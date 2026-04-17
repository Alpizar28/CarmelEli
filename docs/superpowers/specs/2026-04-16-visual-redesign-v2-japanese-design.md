# Carmel Eli — Visual Redesign v2 Spec (Japanese Art + Flower of Life)
**Date:** 2026-04-16
**Stack:** Vite + React + TypeScript + Tailwind CSS + Framer Motion
**Deploy target:** Hostinger (static, `dist/` → `public_html/`)
**Supersedes:** `2026-04-16-visual-redesign-design.md` (dark glassmorphism — discarded)

---

## Overview

Full visual redesign of carmeleli.com. Japanese minimalist aesthetic — wabi-sabi, ink brush SVG accents, negative space, light paper-like backgrounds. Flower of Life as interactive SVG centerpiece in the Methods section, representing 6 therapeutic pillars. Framer Motion for expressive scroll animations. Brand palette from official brand doc.

**Key principle from brand doc:** "Nothing feels rushed. Everything feels intentional." Minimal, soft, spacious.

---

## Visual Direction

**Aesthetic:** Japanese minimalism — ink brush strokes as background decoration, enso circle motif, fine botanical SVG elements, generous negative space.

**Theme:** Light, not dark. Backgrounds are cream/misty white. One dark section (Methods, `#2F5D50`) for visual contrast.

**Color tokens (official brand palette):**
```ts
colors: {
  primary:    '#2F5D50',  // deep river green
  secondary:  '#8FAEA3',  // sage
  accent:     '#F6D982',  // soft yellow gold
  bg:         '#F2F4F3',  // misty white (main background)
  divider:    '#C9CECC',  // subtle UI
  text:       '#2E2E2E',  // charcoal
}
```

**Typography:**
- Display/headings: `Cormorant Garamond` (serif, weight 300–400, italic for quotes/taglines)
- Body/UI: `DM Sans` (weight 300–500) — closest free equivalent to Codec Pro
- Scale (bumped for legibility):
  - Hero name: 80px
  - Section titles: 48px
  - Service card titles: 30px
  - Quote: 20px / italic
  - Body: 15–17px
  - Labels/eyebrows: 12px / letter-spacing 4px / uppercase

---

## Project Structure

```
CarmelEli/
├── src/
│   ├── components/
│   │   ├── Nav.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Methods.tsx          # Flower of Life SVG
│   │   ├── Services.tsx
│   │   ├── Credentials.tsx
│   │   ├── Blog.tsx
│   │   ├── Contact.tsx
│   │   └── Footer.tsx
│   ├── lib/
│   │   └── animations.ts        # Shared Framer Motion variants
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── tailwind.config.ts
├── vite.config.ts
├── tsconfig.json
└── index.html
```

---

## Component Specs

### Nav.tsx
- Fixed, `bg-bg/85 backdrop-blur-xl border-b border-primary/8`
- Brand: uppercase letter-spaced, `text-primary`
- Links: 12px uppercase, muted → primary on hover
- Scroll >50px: opacity increases slightly
- Mobile: hamburger drawer

### Hero.tsx
- Full `h-screen`, centered content
- Background: light gradient (`#e8eeeb → #dde8e3`) simulating river light — real site uses Pixabay video loop
- **Japanese ink SVG layer** (absolute, opacity 6%): vertical bamboo strokes left, flowing water strokes right, enso circle hint center, botanical dot clusters
- Content stack: eyebrow → name (Cormorant 80px) → MSW badge → gold brush divider → italic tagline → 2 CTAs
- Framer Motion: stagger mount animation, each element fades + slides up

### About.tsx
- Background: `#F2F4F3`
- 2-column grid (intro + quote | timeline)
- Quote card: `border-l-2 border-accent` with Cormorant italic 20px
- Timeline: gold year labels, 15px role, 14px description

### Methods.tsx — **Flower of Life**
- Background: `#2F5D50` (only dark section)
- **SVG Flower of Life** (320×320): center circle + 6 overlapping circles at 60° intervals, `r=60`. Gold stroke `rgba(246,217,130,0.35)`, hover → `rgba(246,217,130,0.9)`. Outer dashed boundary circle.
- 6 pillars (from client diagram):
  1. Processing Past & Present Experiences
  2. Solution-Focused and Change-Oriented Therapy
  3. Body–Mind Connection
  4. Systemic Approach
  5. Differentiation
  6. Self-Love as a Key
- Layout: SVG left, pillar labels right (gold dot + title 15px + description 13px)
- Hover on label highlights corresponding circle (via React state)
- Framer Motion: SVG draws in on scroll (`pathLength` animation), labels stagger in

### Services.tsx
- Background: `#F2F4F3`
- 2×2 grid (4 services)
- White cards, `border border-primary/8`, hover: `border-secondary`
- Cormorant 30px titles, 15px body, 12px price label in secondary color
- Services + pricing:
  - Individual Therapy — ₡55,000 CRC/hour
  - Couples Therapy — ₡70,000 CRC/hour
  - Parental Guidance — ₡70,000 CRC/hour
  - Collaborative Care — By arrangement
- "Begin the Journey" link with gold underline

### Credentials.tsx
- Minimal — 2 col: highlights text | area tags
- Area tags: `rounded-full border border-primary/15 text-xs px-4 py-1.5`

### Blog.tsx
- 3 cards, placeholder image area (gradient block), Cormorant titles
- "Read More →" in secondary green

### Contact.tsx
- White background, centered max-w-xl
- Borderless inputs (only bottom border), 16px body
- Formspree action: `https://formspree.io/f/FORM_ID_AQUI`
- Async submit: loading → success/error state in TypeScript
- Geo note below form

### Footer.tsx
- `bg-primary`, 11px uppercase, muted white text

---

## Animation System (Framer Motion)

```ts
// lib/animations.ts
export const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
}

export const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

export const slideInLeft = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
}

// Flower of Life SVG path draw-in
export const drawPath = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 1, transition: { duration: 1.4, ease: 'easeInOut' } },
}
```

Viewport trigger: `whileInView="visible" viewport={{ once: true, margin: '-80px' }}`

Card hover: `whileHover={{ y: -3 }}` + CSS border transition.

---

## Dependencies

```json
{
  "dependencies": {
    "react": "^18",
    "react-dom": "^18",
    "framer-motion": "^11"
  },
  "devDependencies": {
    "vite": "^5",
    "@vitejs/plugin-react": "^4",
    "typescript": "^5",
    "tailwindcss": "^3",
    "postcss": "^8",
    "autoprefixer": "^10",
    "@tailwindcss/forms": "^0.5",
    "@types/react": "^18",
    "@types/react-dom": "^18"
  }
}
```

---

## Build & Deploy

```bash
npm run build  # → dist/
```

Upload `dist/` contents to Hostinger `public_html/`. Git push → Hostinger auto-deploys via configured webhook.

**`.gitignore` additions:** `dist/`, `node_modules/`, `.superpowers/`

---

## Out of Scope

- Formspree account setup (placeholder ID in code)
- Blog CMS / real blog posts
- Hebrew / i18n version
- Carmel's personal photo (placeholder until provided)
