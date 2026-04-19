# Guía de configuración — Carmel Eli CMS

Sigue estos pasos **en orden**. Al final tendrás Firebase + Google Translate funcionando.

---

## PARTE 1 — Firebase

### 1.1 Crear proyecto

1. Ve a https://console.firebase.google.com
2. Clic en **"Agregar proyecto"**
3. Nombre: `carmel-eli` (o el que quieras)
4. Desactiva Google Analytics (no lo necesitas)
5. Clic **"Crear proyecto"** → espera ~30 segundos

---

### 1.2 Activar Authentication

1. En el menú izquierdo: **Build → Authentication**
2. Clic **"Comenzar"**
3. Pestaña **"Sign-in method"**
4. Clic en **"Correo electrónico/contraseña"**
5. Activa el primer toggle → **Guardar**

---

### 1.3 Crear tu usuario admin

1. Pestaña **"Users"**
2. Clic **"Agregar usuario"**
3. Email: el tuyo (ej: `carmel@example.com`)
4. Contraseña: elige una segura
5. **Guardar** — ese email y contraseña son los que usarás para entrar al panel `/admin`

---

### 1.4 Crear base de datos Firestore

1. Menú izquierdo: **Build → Firestore Database**
2. Clic **"Crear base de datos"**
3. Elige **"Comenzar en modo producción"**
4. Selecciona la región más cercana (ej: `us-central1` o `europe-west1`)
5. Clic **"Habilitar"**

---

### 1.5 Reglas de seguridad Firestore

1. En Firestore, pestaña **"Reglas"**
2. Reemplaza todo el contenido con esto:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /siteContent/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. Clic **"Publicar"**

---

### 1.6 Obtener credenciales Firebase

1. Clic en el ícono ⚙️ (rueda) → **"Configuración del proyecto"**
2. Baja hasta **"Tus apps"**
3. Clic en el ícono `</>` (Web)
4. Nombre de la app: `carmel-eli-web`
5. **NO** actives Firebase Hosting
6. Clic **"Registrar app"**
7. Verás un bloque con valores — **copia cada uno** según la tabla:

| Valor en Firebase | Variable en .env |
|---|---|
| `apiKey` | `VITE_FIREBASE_API_KEY` |
| `authDomain` | `VITE_FIREBASE_AUTH_DOMAIN` |
| `projectId` | `VITE_FIREBASE_PROJECT_ID` |
| `storageBucket` | `VITE_FIREBASE_STORAGE_BUCKET` |
| `messagingSenderId` | `VITE_FIREBASE_MESSAGING_SENDER_ID` |
| `appId` | `VITE_FIREBASE_APP_ID` |

---

## PARTE 2 — Google Translate API

### 2.1 Crear proyecto en Google Cloud

1. Ve a https://console.cloud.google.com
2. Arriba a la izquierda, clic en el selector de proyecto → **"Nuevo proyecto"**
3. Nombre: `carmel-eli-translate`
4. Clic **"Crear"**

---

### 2.2 Activar la API de traducción

1. Menú izquierdo: **APIs y servicios → Biblioteca**
2. Busca: `Cloud Translation API`
3. Clic en el resultado → **"Habilitar"**

---

### 2.3 Crear API Key

1. Menú izquierdo: **APIs y servicios → Credenciales**
2. Clic **"+ Crear credenciales"** → **"Clave de API"**
3. Copia la clave generada (empieza con `AIzaSy...`)
4. Clic en el lápiz ✏️ para editar la clave:
   - En **"Restricciones de API"** → selecciona **"Restringir clave"**
   - Elige `Cloud Translation API`
5. Guardar

> **Sobre el costo:** Google Translation API incluye **500,000 caracteres gratis por mes**.
> Para este uso (editar textos de una web) nunca llegarás a ese límite.
> Necesitarás agregar una tarjeta de crédito al proyecto de Google Cloud,
> pero no se cobrará nada mientras no superes el límite gratuito.

---

## PARTE 3 — Crear el archivo .env

En la carpeta raíz del proyecto, crea un archivo llamado exactamente `.env` (con el punto adelante) con este contenido, reemplazando los valores:

```env
VITE_FIREBASE_API_KEY=AIzaSy_TU_CLAVE_AQUI
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_GOOGLE_TRANSLATE_KEY=AIzaSy_TU_CLAVE_DE_TRANSLATE
```

---

## PARTE 4 — Arrancar el proyecto

Con el `.env` listo, en la terminal:

```bash
npm run dev
```

Luego abre: http://localhost:5173/admin/login

Entra con el email y contraseña que creaste en el paso 1.3.

---

## Diagnóstico de errores comunes

| Error | Causa probable | Solución |
|---|---|---|
| "Permission denied" en Firestore | Reglas mal configuradas | Repite el paso 1.5 |
| "Invalid API key" al entrar | `.env` mal escrito | Verifica que no haya espacios ni comillas |
| Traducción no funciona | API no habilitada | Confirma paso 2.2 |
| Página en blanco en `/admin` | Firebase no inicializado | Verifica que el `.env` existe y tiene todos los campos |
