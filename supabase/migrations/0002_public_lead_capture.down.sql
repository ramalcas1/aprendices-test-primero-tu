-- Rollback de 0002: la tabla vuelve a exigir un usuario autenticado.
SET lock_timeout = '5s';
SET statement_timeout = '60s';

DROP POLICY IF EXISTS "diagnostic_fa6b9e_quiz_lead_insert_public" ON public.diagnostic_fa6b9e_quiz_lead;
REVOKE INSERT ON public.diagnostic_fa6b9e_quiz_lead FROM anon;
DROP INDEX IF EXISTS public.idx_diagnostic_fa6b9e_quiz_lead_station;

-- Solo volvemos a exigir user_id si no quedaron leads anónimos guardados.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.diagnostic_fa6b9e_quiz_lead WHERE user_id IS NULL) THEN
    ALTER TABLE public.diagnostic_fa6b9e_quiz_lead ALTER COLUMN user_id SET NOT NULL;
  END IF;
END $$;