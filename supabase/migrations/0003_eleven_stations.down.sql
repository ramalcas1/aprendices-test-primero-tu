-- Rollback de 0003: la validación vuelve a aceptar solo las 9 estaciones anteriores.
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
      'presente'
    )
    AND submitted_at IS NOT NULL
  );
