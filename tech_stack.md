Tech Stack + Deployment Spec (Hostinger) — Carmel Eli Website (Modern + Content-Locked)

Objetivo del stack
Construir una web muy moderna, con animaciones y un hero video en loop, manteniendo el contenido 100% “content-locked” (sin inventar ni reescribir).
Contacto: solo botón directo a WhatsApp (sin formulario por ahora).
Deploy: Hostinger.

Núcleo y Framework

Next.js 14.2.x (App Router)

React 18

TypeScript

UI / Estilos

Tailwind CSS 3.3.x

PostCSS + Autoprefixer

Lucide React (iconos)

Utilidad de clases

clsx + tailwind-merge → helper cn() para manejar clases condicionales sin conflictos.

Animaciones (moderno pero elegante)

Framer Motion (recomendado)

Animaciones de entrada, hover, micro-interacciones, scroll reveals.

Regla: usar Motion solo en componentes con "use client" (App Router).

Soporte prefers-reduced-motion

Si el usuario prefiere menos movimiento: reducir/desactivar animaciones y evitar autoplay agresivo.

Video Hero “Loop-friendly”
Formato de assets (en public/media/)

hero-loop.webm (principal, más liviano)

hero-loop.mp4 (fallback)

hero-poster.jpg (fallback/primer frame)

Reglas para que el loop se sienta perfecto

Duración sugerida: 6–12s

Sin cortes bruscos: el último frame debe volver al primero sin notarse

Exportar optimizado (bitrate moderado), sin audio

Siempre: muted, playsInline, autoPlay, loop

preload="metadata" (o "auto" si pesa poco y es crítico)

Contenido en un solo archivo (editable y “content-locked”)
Requisito
Todo el texto visible del sitio vive en un solo archivo para editarlo fácil sin tocar la estructura del proyecto. Nada de placeholders inventados.

Implementación recomendada

Archivo único: content/siteContent.ts

Exporta un objeto SITE_CONTENT con todas las secciones:

home

about

therapyMethods

services

sessionInvestment

credentials

contact

El resto del proyecto solo consume este objeto.

Ejemplo conceptual (sin copy inventado)

SITE_CONTENT.home.headline = texto exacto aprobado

SITE_CONTENT.services.items[] = textos exactos aprobados

etc.

Guardrails anti “inventos” (recomendado)

Modo estricto de contenido: si una clave obligatoria está vacía, el build de producción falla.

No se muestran textos default.

WhatsApp (solo botón directo)
Requisito
Un botón que abre WhatsApp con deep-link. El número se define después, pero debe quedar listo el sistema.

Implementación

Botón WhatsApp en header y/o secciones clave.

Link: https://wa.me/
<E164_NUMBER>?text=<ENCODED_MESSAGE>

Guardar el número en NEXT_PUBLIC_WHATSAPP_NUMBER (para no hardcodear).

Mensaje prellenado solo si la clienta aprueba el texto; se guarda en SITE_CONTENT.contact.whatsappPrefill.

Estructura de carpetas (simple y escalable a blog)
Recomendación
/app
/(site)
page.tsx
about/page.tsx
therapy-methods/page.tsx
services/page.tsx
credentials/page.tsx
contact/page.tsx
/components
hero/HeroVideo.tsx
ui/Button.tsx
layout/Header.tsx
layout/Footer.tsx
/content
siteContent.ts ← ÚNICO archivo editable de contenido
/lib
cn.ts
whatsapp.ts
/public
/media
hero-loop.webm
hero-loop.mp4
hero-poster.jpg
/styles
globals.css

Preparación para futuro blog (sin implementarlo ahora)
Cuando toque, se agrega:
/content/blog
post-1.mdx
post-2.mdx
y un loader (Contentlayer o MDX) sin tocar siteContent.ts.

Deploy en Hostinger (recomendación práctica)
Como el sitio es content-locked, sin blog y sin backend, lo más simple es Static Export.

Opción A (recomendada): Static Export a public_html

Configurar next.config.js con output export:

output: "export"

trailingSlash: true

images: { unoptimized: true } (para compatibilidad con export estático)

Build: npm run build → genera carpeta out/

Subir a Hostinger: subir el contenido de out/ a public_html/ (File Manager o FTP)

