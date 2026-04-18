# Carmel Eli Website

Sitio web en React + Vite para Carmel Eli (MSW), con video de fondo, soporte de i18n y secciones de servicios terapéuticos.

## Requisitos

- Node.js 18+
- npm 9+

## Desarrollo local

1. Instalar dependencias:
   - `npm install`
2. Levantar entorno local:
   - `npm run dev`

## Build para produccion

1. Generar carpeta `dist`:
   - `npm run build`
2. Probar build localmente (opcional):
   - `npm run preview`

## Deploy en Hostinger (Hosting compartido)

Este proyecto queda listo para deploy estatico en Hostinger.

### Opcion A: File Manager

1. Ejecuta `npm run build` en tu maquina.
2. En Hostinger abre `public_html` del dominio.
3. Borra el contenido anterior de `public_html` (si aplica).
4. Sube todo el contenido de `dist/` dentro de `public_html`.
5. Verifica que `index.html` quede en `public_html/index.html`.

### Opcion B: FTP

1. Ejecuta `npm run build`.
2. Conecta por FTP al dominio de Hostinger.
3. Sincroniza el contenido de `dist/` contra `public_html/`.

## Notas importantes para Hostinger

- Se configuro `base: './'` en Vite para que los assets funcionen tanto en raiz como en subcarpeta.
- Se agrego `public/.htaccess` para compatibilidad con rutas SPA y cache basica en Apache.
- Si cambias de dominio o carpeta, vuelve a correr `npm run build` antes de subir.

## Estructura principal

- `src/` componentes y logica de la app
- `public/` assets estaticos y `.htaccess`
- `dist/` build final listo para subir a Hostinger

## Scripts

- `npm run dev` inicia Vite en desarrollo
- `npm run build` compila TypeScript y genera `dist`
- `npm run preview` sirve el build localmente
