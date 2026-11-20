// Cosmos completa estos dos valores públicos cuando conectas un proyecto de Supabase en «Conectores».
export const backendConfigured = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
