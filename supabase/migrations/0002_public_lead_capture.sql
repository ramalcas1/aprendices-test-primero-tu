-- 0002: captura pública de leads para el lead magnet "Primero Tú".
-- El recorrido es público (sin inicio de sesión), así que un lead puede llegar
-- sin usuario autenticado. La tabla sigue protegida: anon solo puede INSERTAR.
SET lock_timeout = '5s';
SET statement_timeout = '60s';

-- Un lead anónimo no tiene usuario asociado.
ALTER TABLE public.diagnostic_fa6b9e_quiz_lead ALTER COLUMN user_id DROP NOT NULL;

-- Permisos: anon únicamente INSERT (nunca leer, editar ni borrar los datos de otras familias).
REVOKE ALL ON public.diagnostic_fa6b9e_quiz_lead FROM anon;
GRANT INSERT ON public.diagnostic_fa6b9e_quiz_lead TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.diagnostic_fa6b9e_quiz_lead TO authenticated;

-- Política de inserción pública: valida el contenido en el servidor antes de guardar.
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

CREATE INDEX IF NOT EXISTS idx_diagnostic_fa6b9e_quiz_lead_station
  ON public.diagnostic_fa6b9e_quiz_lead(diagnosed_station);