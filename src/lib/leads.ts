// Envío del lead del diagnóstico.
// 1) Manda los datos al Web App de Google Apps Script (Google Sheets): best-effort, sin bloquear nada.
// El registro se envía a Google Sheets; no requiere conexión a Supabase.

/**
 * Web App de Google Apps Script que guarda los leads en su hoja de cálculo.
 * Está publicado con acceso para cualquiera que tenga el enlace.
 */
const APPS_SCRIPT_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbwtXXoj9qLkPJWIL9pLTGcSUkeZhgg8Jnq3iiivOAqzxFMAyi3XayEPWPa4IuMz645H/exec';

export interface LeadInput {
  name: string;
  email: string;
  station: string;
  /** Nombre de la estación tal como lo ve la persona, sin el prefijo "Estación 1 ·". */
  stationName?: string;
  /** Texto del diagnóstico personalizado que se mostró en pantalla. */
  diagnosis?: string;
}

/**
 * Envía el lead al Web App de Google Apps Script.
 *
 * Usa mode: 'no-cors' porque un Web App de Apps Script no devuelve cabeceras CORS
 * legibles desde el navegador: la respuesta llega opaca, así que se da el envío por hecho.
 * Cualquier fallo se ignora en silencio: es un extra y nunca debe bloquear a la persona.
 */
function sendToAppsScript(input: LeadInput): void {
  try {
    const body = new URLSearchParams({
      nombre: input.name,
      correo: input.email,
      estacion: input.stationName ?? input.station,
      diagnostico: input.diagnosis ?? '',
    });

    // Disparar el envío antes de continuar hacia la oferta; Apps Script recibe
    // form-urlencoded y el navegador no necesita leer su respuesta CORS opaca.
    void fetch(APPS_SCRIPT_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: body.toString(),
      keepalive: true,
    }).catch(() => {
      /* El envío a Sheets es independiente de Supabase y no bloquea la oferta. */
    });
  } catch {
    /* Nunca interrumpe el camino hacia la oferta. */
  }
}

/**
 * Envía el lead a Google Sheets. No depende de Supabase y nunca bloquea
 * el acceso a la oferta, incluso si falla la conexión con Apps Script.
 */
export async function submitLead(input: LeadInput): Promise<void> {
  sendToAppsScript(input);
}
