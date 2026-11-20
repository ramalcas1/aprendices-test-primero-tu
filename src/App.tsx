// Rutas de la app, generadas por Cosmos a partir del plan. Cada pantalla vive en su propio archivo.
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import WelcomeScreen from './components/WelcomeScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';

/** Pantalla para direcciones que no existen: nunca una pantalla en blanco. */
function NotFound() {
  return (
    <main className="min-h-screen bg-[#FAF3E6] px-4 py-10 dark:bg-[#1C1712]">
      <div className="mx-auto w-full max-w-[460px]">
        <section className="rounded-[24px] border border-[#E7D9C0] bg-[#FFFDF8] p-6 shadow-[0_10px_30px_-18px_rgba(59,47,35,0.35)] dark:border-[#3D342A] dark:bg-[#2A231C]">
          <h1 className="font-[Georgia,serif] text-[24px] leading-[1.25] font-bold text-[#3B2F23] dark:text-[#F5EDE0]">
            No encontramos lo que buscas
          </h1>
          <p className="mt-3 text-base leading-[1.6] text-[#6B5D4C] dark:text-[#C4B7A5]">
            Puede que el enlace esté incompleto. Te invitamos a comenzar tu diagnóstico desde el inicio.
          </p>
          <Link
            to="/"
            className="mt-6 flex min-h-[48px] w-full items-center justify-center rounded-[14px] bg-[#3A4230] px-5 text-base font-semibold text-[#FFFDF8] transition duration-200 hover:bg-[#46503A] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C79A3B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFFDF8] dark:bg-[#46503A] dark:focus-visible:ring-offset-[#2A231C]"
          >
            Ir al inicio
          </Link>
        </section>
      </div>
    </main>
  );
}

/**
 * Recorrido público del lead magnet: bienvenida → 5 preguntas → diagnóstico.
 * No hay inicio de sesión: cualquier padre o madre puede hacer el test.
 * Todo el contenido va dentro de una barrera de error.
 */
export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/quiz" element={<QuizScreen />} />
          <Route path="/resultado/:perfil" element={<ResultScreen />} />
          <Route path="/ventas" element={<ResultScreen />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
