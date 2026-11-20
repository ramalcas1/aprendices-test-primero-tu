# Diagnóstico Primero Tú

## Descripción

Mini app web (lead magnet) de la marca "Aprendices" para padres jóvenes, basada en el e-book "¡Primero Tú!" (11 estaciones + audiolibro). Test interactivo de diagnóstico emocional que deriva a la compra en Hotmart. Estética: minimalista, cálida, acuarela/editorial.

## Stack

React 19 · TypeScript · Vite · Tailwind CSS · React Router · Framer Motion · PWA

Sin backend propio: la app no usa Supabase ni ninguna base de datos. Los leads se envían a Google Sheets.

## Rutas

| Ruta | Pantalla |
| --- | --- |
| `/` | Bienvenida e inicio del test |
| `/quiz` | Las 5 preguntas del diagnóstico, una por pantalla |
| `/resultado/:perfil` | Resultado personalizado + oferta + formulario de lead |
| `/ventas` | Página de ventas (mismo resultado, con la Estación 10 por defecto) |
| `*` | "No encontramos lo que buscas" |

Todas las rutas son públicas: no hay inicio de sesión.

## Estructura

- `/src/App.tsx` — punto de entrada: rutas públicas del recorrido y pantalla para direcciones desconocidas.
- `/src/components/WelcomeScreen.tsx` — presenta la marca, la promesa del diagnóstico gratuito, la ilustración de portada y el inicio del test.
- `/src/components/QuizScreen.tsx` — las cinco preguntas, una por pantalla, con progreso, tema, ilustración propia y respuestas puntuables. Si una ilustración no carga, entra su respaldo y, por debajo, la acuarela dibujada.
- `/src/components/ResultScreen.tsx` — calcula la categoría ganadora (desempate: la primera categoría en alcanzar el máximo) y muestra la estación correspondiente (11 en total, cada una con su propia frase ancla cuando la tiene), el CTA de Hotmart, el botón de WhatsApp y el formulario de lead.
- `/src/components/ErrorBoundary.tsx` — barrera de error: mensaje claro, botón "Reintentar" y enlace al inicio.
- `/src/lib/leads.ts` — registro del lead: envía nombre, correo, estación y diagnóstico al Web App de Google Apps Script (Google Sheets), en segundo plano.
- `/src/lib/theme.ts` — tema claro/oscuro (sigue al sistema por defecto).

## Leads en Google Sheets (Apps Script)

Cada envío del formulario final hace un POST, en segundo plano, al Web App de Google Apps Script publicado por el dueño de la app. El Web App guarda en su hoja de cálculo:

- `nombre`, `correo`, `estacion` (nombre de la estación, sin el prefijo "Estación 1 ·") y `diagnostico` (el texto mostrado en pantalla).

La petición usa `mode: 'no-cors'` con cuerpo `application/x-www-form-urlencoded`: un Web App de Apps Script no devuelve cabeceras CORS legibles, así que la respuesta llega opaca y el envío se da por hecho. Si el envío falla, la persona pasa igualmente a la oferta: nunca ve un error técnico.

El enlace del Web App vive en la constante `APPS_SCRIPT_ENDPOINT` de `/src/lib/leads.ts`; para cambiarlo, publica de nuevo el Web App y sustituye esa constante.

## Configuración Hotmart

El enlace de compra vive en la constante `ENLACE_HOTMART` de `/src/components/ResultScreen.tsx`. Sustitúyelo por la URL de checkout de Hotmart (Hotmart → Producto → Enlaces de venta) cuando la oferta esté publicada; no construyas la URL a mano.

## Variables de entorno

Ninguna. La app no lee credenciales ni secretos: no hay archivo `.env` ni hace falta configurar nada para publicarla.

## Instalación (solo si exportas el repositorio)

```bash
npm install
npm run dev    # desarrollo (Vite)
npm run build  # build de producción → dist/
```

## Deploy en Vercel

1. Importa el repositorio en [vercel.com](https://vercel.com) (framework: Vite).
2. Build command `npm run build`, output `dist/`.
3. No hay variables de entorno que cargar.

## Navegación

SPA con React Router y fallback de navegación para publicación (`/vercel.json`).

---

_Generado con Cosmos Code_
