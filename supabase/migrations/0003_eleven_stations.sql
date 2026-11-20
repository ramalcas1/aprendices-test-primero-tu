-- 0003: el e-book creció de 9 a 11 estaciones.
-- La validación de la política de inserción pública solo aceptaba las 9 claves
-- anteriores: sin este cambio, un lead de la Estación 10 o de la Estación 11
-- sería rechazado por el servidor. Solo se recrea la política, no se toca la tabla.
SET lock_timeout = '5s';
SET statement_timeout = '60s';

DROP POLICY IF EXISTS "diagnostic_fa6b9e_quiz_lead_insert_public" ON public.diagnostic_fa6b9e_quiz_lead;
CREATE POLICY "diagnostic_fa6b9e_quiz_lead_insert_public"
  ON public.diagnostic_fa6b9e_quiz_lead
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(btrim(name)) BETWEEN 2 AND 80
    AND email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]{2,}$'
    AND diagnosed_station IN (
      'nino_interior',
      'emociones',
      'heridas',
      'proceso',
      'abundancia',
      'bendiciones',
      'intuicion',
      'compasion',
      'presente',
      'futuro',
      'pausa_reparacion'
    )
    AND submitted_at IS NOT NULL
  );
