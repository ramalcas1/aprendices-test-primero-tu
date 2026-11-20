import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { confirmEmailNotice, getSessionUser, signIn, signUp, useSession } from '../lib/session';

const TEXT = {
  titleIn: "Inicia sesión", titleUp: "Crea tu cuenta", email: "Correo electrónico", password: "Contraseña", name: "Nombre",
  submitIn: "Entrar", submitUp: "Crear cuenta", toUp: "¿No tienes cuenta? Crea una", toIn: "¿Ya tienes cuenta? Inicia sesión",
  wrong: "El correo o la contraseña no son correctos.", exists: "Ya existe una cuenta con ese correo. Inicia sesión.", short: "La contraseña debe tener al menos 6 caracteres.", generic: "No pudimos completar la acción. Inténtalo de nuevo.", demo: "Modo demo: la cuenta se guarda solo en este navegador hasta que conectes Supabase.", back: "Volver al inicio",
};

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const { demo } = useSession();
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  // Back to the page the visitor asked for, only when it is a path of this app.
  const asked = (location.state as { from?: string } | null)?.from;
  const from = typeof asked === 'string' && asked.startsWith('/') && !asked.startsWith('//') ? asked : "/";
  const [notice, setNotice] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (password.length < 6) { setError(TEXT.short); return; }
    setBusy(true);
    setError(null);
    try {
      if (mode === 'in') await signIn(email, password);
      else {
        const created = await signUp(email, password, fullName);
        // Supabase with e-mail confirmation creates the account without a session: say so, on screen, instead of bouncing back here.
        if (created.needsConfirmation || !getSessionUser()) { setMode('in'); setNotice(confirmEmailNotice(created.email)); return; }
      }
      navigate(from, { replace: true });
    } catch (reason) {
      const code = reason instanceof Error ? reason.message : '';
      setError(code === 'invalid_credentials' ? TEXT.wrong : code === 'account_exists' ? TEXT.exists : code || TEXT.generic);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800" noValidate>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{mode === 'in' ? TEXT.titleIn : TEXT.titleUp}</h1>
        {mode === 'up' && (
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            {TEXT.name}
            <input className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white" value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="name" />
          </label>
        )}
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          {TEXT.email}
          <input type="email" required className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </label>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          {TEXT.password}
          <input type="password" required minLength={6} className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === 'in' ? 'current-password' : 'new-password'} />
        </label>
        {error && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        {notice && <p role="status" className="text-sm text-emerald-700 dark:text-emerald-400">{notice}</p>}
        <button type="submit" disabled={busy} className="w-full rounded-lg px-4 py-3 text-base font-semibold text-white disabled:opacity-60" style={{ backgroundColor: "#3a4230" }}>
          {mode === 'in' ? TEXT.submitIn : TEXT.submitUp}
        </button>
        <button type="button" className="w-full text-sm text-slate-600 underline dark:text-slate-300" onClick={() => { setMode(mode === 'in' ? 'up' : 'in'); setError(null); }}>
          {mode === 'in' ? TEXT.toUp : TEXT.toIn}
        </button>

        {demo && <p className="text-xs text-slate-500 dark:text-slate-400">{TEXT.demo}</p>}
        <Link to="/" className="block text-center text-sm text-slate-600 underline dark:text-slate-300">{TEXT.back}</Link>
      </form>
    </main>
  );
}
