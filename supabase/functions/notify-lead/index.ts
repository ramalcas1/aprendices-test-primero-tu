// Edge Function: avisa por correo cada lead del diagnóstico "Primero Tú"
// a info.tuobog@gmail.com. El navegador nunca ve la clave de correo.
//
// Secreto necesario (Supabase → Project Settings → Edge Functions → Secrets):
//   RESEND_API_KEY
// SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY los inyecta Supabase automáticamente.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const DESTINATION = 'info.tuobog@gmail.com';
const TABLE = 'diagnostic_fa6b9e_quiz_lead';

const STATIONS: Record<string, string> = {
  nino_interior: 'Estación 1 · Sanación del Niño Interior',
  emociones: 'Estación 2 · Comprendiendo las Emociones',
  heridas: 'Estación 3 · Recordando las Heridas',
  proceso: 'Estación 4 · Confiando en el Proceso de la Vida',
  abundancia: 'Estación 5 · Creando un Espacio de Abundancia',
  bendiciones: 'Estación 6 · Reconociendo las Bendiciones Ocultas',
  intuicion: 'Estación 7 · El Poder de la Intuición',
  compasion: 'Estación 8 · Cultivando la Compasión Hacia Uno Mismo',
  presente: 'Estación 9 · Conectando con el Momento Presente',
  futuro: 'Estación 10 · Tú y Yo del Futuro',
  pausa_reparacion: 'Estación 11 · Cuando Todo Explota: Pausa y Reparación',
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  let payload: { name?: unknown; email?: unknown; station?: unknown };
  try {
    payload = await req.json();
  } catch {
    return json({ error: 'invalid_json' }, 400);
  }

  const name = typeof payload.name === 'string' ? payload.name.trim() : '';
  const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '';
  const station = typeof payload.station === 'string' ? payload.station.trim() : '';

  if (name.length < 2 || name.length > 80) return json({ error: 'invalid_name' }, 400);
  if (!EMAIL_PATTERN.test(email)) return json({ error: 'invalid_email' }, 400);
  if (!Object.prototype.hasOwnProperty.call(STATIONS, station)) {
    return json({ error: 'invalid_station' }, 400);
  }

  // Antes de enviar nada, comprobamos que el lead exista de verdad en la base:
  // así esta función no se puede usar para mandar correos sueltos.
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );

  const { data: leads, error: lookupError } = await supabase
    .from(TABLE)
    .select('id, submitted_at')
    .eq('email', email)
    .eq('diagnosed_station', station)
    .order('submitted_at', { ascending: false })
    .limit(1);

  if (lookupError) return json({ error: 'lookup_failed' }, 500);
  if (!leads || leads.length === 0) return json({ error: 'lead_not_found' }, 404);

  const apiKey = Deno.env.get('RESEND_API_KEY');
  if (!apiKey) return json({ error: 'mail_not_configured' }, 503);

  const submittedAt = new Date().toISOString();
  const body = [
    'Nuevo lead del diagnóstico "Primero Tú".',
    '',
    `Nombre: ${name}`,
    `Correo: ${email}`,
    `Estación diagnosticada: ${STATIONS[station]}`,
    `Fecha del envío: ${submittedAt}`,
    '',
    'Escribe a esta persona para enviarle su diagnóstico completo y el regalo de bienvenida.',
  ].join('\n');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Primero Tú <onboarding@resend.dev>',
      to: [DESTINATION],
      reply_to: email,
      subject: `Nuevo lead · ${STATIONS[station]}`,
      text: body,
    }),
  });

  if (!response.ok) return json({ error: 'mail_failed' }, 502);
  return json({ ok: true });
});