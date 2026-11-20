import { Component, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Barrera de error de la app: si una pantalla falla al renderizar,
 * mostramos un mensaje claro y un botón para reintentar, sin pantalla en blanco.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  private reset = (): void => {
    this.setState({ hasError: false });
  };

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="min-h-screen bg-[#FAF3E6] px-4 py-10 dark:bg-[#1C1712]">
        <div className="mx-auto w-full max-w-[460px]">
          <section className="rounded-[24px] border border-[#E7D9C0] bg-[#FFFDF8] p-6 shadow-[0_10px_30px_-18px_rgba(59,47,35,0.35)] dark:border-[#3D342A] dark:bg-[#2A231C]">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F6EAD5] text-[#A94438] dark:bg-[#31281F] dark:text-[#E5A79C]">
              <AlertCircle className="h-6 w-6" aria-hidden="true" />
            </span>
            <h1 className="mt-4 font-[Georgia,serif] text-[24px] leading-[1.25] font-bold text-[#3B2F23] dark:text-[#F5EDE0]">
              Algo salió mal en esta pantalla
            </h1>
            <p className="mt-3 text-base leading-[1.6] text-[#6B5D4C] dark:text-[#C4B7A5]">
              Puedes reintentar; si el problema sigue, vuelve al inicio y comienza de nuevo tu diagnóstico.
            </p>
            <button
              type="button"
              onClick={this.reset}
              className="mt-6 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-[14px] bg-[#3A4230] px-5 text-base font-semibold text-[#FFFDF8] transition duration-200 hover:bg-[#46503A] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C79A3B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFFDF8] dark:bg-[#46503A] dark:focus-visible:ring-offset-[#2A231C]"
            >
              <RefreshCw className="h-5 w-5" aria-hidden="true" />
              Reintentar
            </button>
            <Link
              to="/"
              className="mt-3 flex min-h-[48px] w-full items-center justify-center rounded-[14px] border border-[#E4D8C2] px-5 text-base font-semibold text-[#3B2F23] transition duration-200 hover:bg-[#FAF3E6] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C79A3B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFFDF8] dark:border-[#3D3428] dark:text-[#F5EDE0] dark:hover:bg-[#241E17] dark:focus-visible:ring-offset-[#2A231C]"
            >
              Volver al inicio
            </Link>
          </section>
        </div>
      </main>
    );
  }
}