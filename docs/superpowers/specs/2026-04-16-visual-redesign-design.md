# Carmel Eli — Visual Redesign Spec
**Date:** 2026-04-16  
**Stack:** Vite + React + TypeScript + Tailwind CSS + Framer Motion  
**Deploy target:** Hostinger (static, `dist/` → `public_html/`)

---

## Overview

Full visual redesign of carmeleli.com. Migrate from vanilla HTML/CSS/JS to a React + TypeScript + Tailwind stack. Apply glassmorphism design system over a dark forest-green base. Add expressivo scroll animations via Framer Motion. Keep all existing content — no copy changes.

---

## Visual Direction

**Theme:** Dark forest green, friendly and warm — not black/noir. Base color `#1a3028`, alternating sections at `#1e3a2c`.

**Glassmorphism:** Cards use `bg-white/7 backdrop-blur-xl border border-white/13 rounded-2xl`. Hover state: `bg-white/11 border-white/25 -translate-y-1`.

**Color tokens (tailwind.config.ts):**

```ts
colors: {
  base:    '#1a3028',
  surface: '#1e3a2c',
  glass: {
    DEFAULT: 'rgba(255,255,255,0.07)',
    hover:   'rgba(255,255,255,0.11)',
    accent:  'rgba(100,180,140,0.10)',
  },
  border: {
    DEFAULT: 'rgba(255,255,255,0.13)',
    accent:  'rgba(142,207,176,0.25)',
    gold:    'rgba(246,217,130,0.20)',
  },
  accent: {
    green: '#8ecfb0',
    gold:  '#f6d982',
  },
}
```

**Typography:** Inter (Google Fonts). Weights: 300, 400, 500, 600.

---

## Project Structure

```
CarmelEli/
├── src/
│   ├── components/
│   │   ├── Nav.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Methods.tsx
│   │   ├── Services.tsx
│   │   ├── Credentials.tsx
│   │   ├── Blog.tsx
│   │   ├── Contact.tsx
│   │   └── Footer.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css          # Tailwind directives + global resets
├── tailwind.config.ts
├── vite.config.ts
├── tsconfig.json
├── index.html             # Vite entry
├── css/                   # DELETED after migration
├── js/                    # DELETED after migration
└── dist/                  # Build output → Hostinger
```

---

## Component Specs

### Nav.tsx
- Fixed top, full width
- `bg-base/40 backdrop-blur-2xl border-b border-white/10`
- On scroll > 50px: increase blur + slight opacity bump (via `useScroll` or scroll listener + state)
- Mobile: hamburger menu toggles vertical nav drawer
- Links: smooth scroll to section IDs

### Hero.tsx
- Full viewport height (`h-screen`)
- `<video>` background: `https://cdn.pixabay.com/video/2023/04/21/158877-819998163_large.mp4`, `autoPlay muted loop playsInline`, `object-cover absolute inset-0`
- Overlay: `bg-base/40` gradient over video
- Centered glass card: `bg-white/10 backdrop-blur-3xl border border-white/20 rounded-3xl px-16 py-12`
- Content: badge → name → subtitle → gold divider → tagline → CTA buttons
- Framer Motion mount animation: stagger children with `fadeInUp` variants
- Scroll hint: animated line at bottom

### About.tsx
- 2-column layout (left: intro + quote card, right: timeline)
- Quote card: `bg-[#f6d982]/7 border border-[#f6d982]/20 rounded-2xl italic`
- Timeline items: date in `accent-gold`, slide-in-left on `whileInView`

### Methods.tsx
- Section label + title + 3 glass cards in `grid-cols-3`
- Each card: icon chip + title + description
- Stagger animation: cards enter bottom-up with 0.1s delay each

### Services.tsx
- 3 cards in `grid-cols-3`
- Center card highlighted: `bg-glass-accent border-border-accent`
- Each card has CTA button at bottom
- Same stagger animation as Methods

### Credentials.tsx
- 2-column: highlights glass card (left) + tags (right)
- Area tags: `bg-white/7 border border-white/13 rounded-full px-4 py-1.5 text-xs`

### Blog.tsx
- 3 cards with image placeholder area (dark gradient block)
- "Read More →" link in `accent-green`

### Contact.tsx
- Centered, max-width 580px
- Form inside glass card
- Action: `https://formspree.io/f/FORM_ID_AQUI` (to be replaced)
- Async submit with loading/success/error states in TypeScript
- Geographical note below form

### Footer.tsx
- `border-t border-white/8`, minimal, centered copyright

---

## Animation System (Framer Motion)

**Shared variants:**

```ts
// fadeInUp — used for most elements
const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

// staggerContainer — wraps grid cards
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

// slideInLeft — timeline items
const slideInLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
}
```

**Usage pattern:**
```tsx
<motion.div
  variants={staggerContainer}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: '-80px' }}
>
  {cards.map(card => (
    <motion.div key={card.id} variants={fadeInUp}>
      ...
    </motion.div>
  ))}
</motion.div>
```

**Card hover:** `whileHover={{ y: -4 }}` + CSS transition for border/shadow.

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
npm run build   # outputs to dist/
```

Upload contents of `dist/` to Hostinger `public_html/`. Existing `index.html`, `css/`, `js/` replaced by build output.

**`.gitignore` additions:** `dist/`, `node_modules/`, `.superpowers/`

---

## Out of Scope

- Blog actual content / CMS
- Formspree account setup (placeholder ID left in code)
- i18n / Hebrew version
- Dark/light mode toggle
