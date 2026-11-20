# Diagnóstico Primero Tú

## Descripción

Mini app web (lead magnet) marca "Aprendices" para padres jóvenes, basada en el e-book "¡Primero Tú!" (11 estaciones + audiolibro). Test interactivo de diagnóstico emocional que deriva a compra en Hotmart. ESTÉTICA: minimalista, cálida, acuarela/editorial.

## Stack

React 19 · TypeScript · Vite · Tailwind CSS · PWA

## Estructura

- `/src/App.tsx` — punto de entrada: rutas públicas del recorrido (bienvenida, test, resultado) y página "No encontramos lo que buscas" para direcciones desconocidas.
- `/src/components/WelcomeScreen.tsx` — Presenta la marca Aprendices, la promesa del diagnóstico emocional gratuito, la ilustración de portada y el inicio del test.
- `/src/components/QuizScreen.tsx` — Muestra las cinco preguntas del diagnóstico, una por pantalla, con progreso, tema, ilustración propia y respuestas puntuables. Si una ilustración no carga, muestra una mancha de acuarela en su lugar.
- `/src/components/ResultScreen.tsx` — Calcula la categoría ganadora con desempate por primera categoría en alcanzar el máximo, presenta la estación correspondiente (11 en total, cada una con su propia frase ancla cuando la tiene) junto con la frase ancla, el CTA a Hotmart y el formulario de lead.
- `/src/components/ErrorBoundary.tsx` — Barrera de error alrededor de las pantallas: mensaje claro, botón "Reintentar" y enlace al inicio.
- `/src/lib/leads.ts` — Registro del lead del diagnóstico: envía nombre, correo, estación y diagnóstico al Web App de Google Apps Script (Google Sheets) y guarda el lead en la base de datos. Ambos envíos son best-effort: nunca bloquean el acceso a la oferta.

## Archivos que no forman parte del recorrido

El proyecto todavía incluye pantallas del andamio inicial que hoy no tienen ruta ni se usan: `/src/components/SignIn.tsx`, `/src/components/RequireSession.tsx`, `/src/components/ProtectedRoute.tsx`, `/src/components/OfferCta.tsx`, `/src/components/LeadCaptureForm.tsx`, `/src/lib/auth.ts` y `/src/lib/useSession.ts`. No rompen el build, pero se pueden eliminar cuando confirmes que no los quieres.

## Instalación

```bash
npm install
npm run dev    # desarrollo (Vite)
npm run build  # build de producción → dist/
```

## Datos (Supabase)

Dentro de Cosmos, la conexión se elige en «Conectores» → «Proyecto de Supabase de esta app»: Cosmos toma la URL y la clave pública y las inyecta en la vista previa y en el sitio publicado. No hay que crear ningún archivo `.env` ni copiar credenciales a mano.

Las variables `VITE_*` son públicas en el navegador: **nunca** pongas la `service_role` ni otros secretos ahí.

Mientras no haya proyecto conectado, la app funciona en **modo demo**: los leads quedan solo en el navegador de quien hace el test.

### Migraciones

- `0001_initial_schema.sql` — tabla de leads del diagnóstico, con RLS y políticas por usuario.
- `0002_public_lead_capture.sql` — el recorrido es público: la tabla acepta el alta de un lead anónimo (solo INSERT, con validación de nombre, correo y estación en el servidor).
- `0003_eleven_stations.sql` — la validación de la política acepta también las claves de la Estación 10 y de la Estación 11.

### Edge Function de aviso por correo

`notify-lead` avisa a `info.tuobog@gmail.com` de cada lead nuevo:

1. Comprueba con la clave de servicio que el lead exista en la tabla (no sirve como reenviador de correo suelto).
2. Envía el aviso con Resend.

Antes de desplegarla, agrega el secreto en tu proyecto de Supabase → Project Settings → Edge Functions → Secrets con el nombre exacto `RESEND_API_KEY` (se obtiene en [resend.com](https://resend.com) → API Keys). Cosmos nunca ve ni guarda ese valor.

Nota: el remitente por defecto `onboarding@resend.dev` solo puede escribir a la dirección dueña de la cuenta de Resend. Cuando verifiques tu propio dominio, cambia el campo `from` en `notify-lead/index.ts`.

### Leads en Google Sheets (Apps Script)

Cada envío del formulario final hace un POST, en segundo plano, al Web App de Google Apps Script publicado por el dueño de la app. El Web App guarda en su hoja de cálculo:

- `nombre`, `correo`, `estacion` (nombre de la estación, sin el prefijo "Estación 1 ·") y `diagnostico` (el texto mostrado en pantalla).

La petición usa `mode: 'no-cors'` con cuerpo `application/x-www-form-urlencoded`: un Web App de Apps Script no devuelve cabeceras CORS legibles, así que la respuesta llega opaca y el envío se da por hecho. Si el envío falla, la persona pasa igualmente a la oferta: nunca ve un error técnico. El enlace del Web App vive en la constante `APPS_SCRIPT_ENDPOINT` de `/src/lib/leads.ts`; para cambiarlo, publica de nuevo el Web App y sustituye esa constante.

## Salida al exterior (exportar el repo)

Solo si exportas el proyecto a GitHub y lo ejecutas fuera de Cosmos: copia `.env.example` a `.env.local` y completa `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` con los valores de tu proyecto (Settings → API). Dentro de Cosmos ese archivo no se usa.

## Configuración Hotmart

1. Crea tus credenciales en Hotmart (Herramientas → Credenciales de desarrollador).
2. Configura estos secrets en las Edge Functions de TU Supabase (nunca en el código): `HOTMART_CLIENT_ID`, `HOTMART_CLIENT_SECRET`, `HOTMART_BASIC_TOKEN`, `HOTMART_HOTTOK` y `HOTMART_RECONCILE_SECRET` (32 bytes aleatorios).
3. Registra el webhook (Webhook 2.0) apuntando a la function `hotmart-webhook` de tu proyecto y envía el evento de prueba.
4. La reconciliación programada usa `HOTMART_RECONCILE_SECRET`; guárdalo también en Vault si programas el cron con pg_cron.

## Deploy en Vercel

1. Importa el repositorio en [vercel.com](https://vercel.com) (framework: Vite).
2. Build command `npm run build`, output `dist/`.
3. Carga tus propias variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en Settings → Environment Variables (solo fuera de Cosmos).
4. En Supabase → Auth → URL Configuration agrega el dominio de Vercel a los redirects si tu app usa login.

## Integración continua

El workflow `.github/workflows/cosmos-build.yml` valida el build en cada push y, si falta `package-lock.json`, lo genera y propone un PR con el lockfile.

## Navegación

SPA con React Router y fallback de navegación para publicación.

---

_Generado con Cosmos Code_
