import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Clock, Compass, Sparkles } from 'lucide-react';

/**
 * Ilustración de portada: acuarela suave de un adulto mirando con ternura
 * la foto de su infancia en un desván iluminado.
 * Es decorativa pero describe la escena, por eso lleva aria-label.
 */
function AtticWatercolor() {
  const [failed, setFailed] = useState(false);

  // Si la ilustración no responde, mostramos una mancha de acuarela cálida en su lugar:
  // la portada nunca queda con un icono de imagen rota.
  if (failed) {
    return (
      <div
        role="img"
        aria-label="Acuarela de una persona adulta que mira con ternura una fotografía de su infancia"
        className="h-full w-full"
        style={{
          backgroundImage:
            'radial-gradient(circle at 32% 36%, rgba(199,154,59,0.55), transparent 60%), radial-gradient(circle at 70% 62%, rgba(178,87,43,0.42), transparent 64%), radial-gradient(circle at 50% 86%, rgba(58,66,48,0.32), transparent 62%)',
        }}
      />
    );
  }

  return (
    <img
      src="https://fzfncffjekempswnjilr.supabase.co/storage/v1/object/public/cosmos-code-sites/_assets/p9cdNQcq34XVgvbVHe9smHBKTOS2/9f77d2b0-adfe-44b9-ab44-6a7b64f5bda4/e4f3b6301a3aec50f91f40386689bd83d8e20d4673aa06c6d16335ec26b520a0.jpg"
      alt="Acuarela de una persona adulta que mira con ternura una fotografía de su infancia"
      className="h-full w-full object-cover object-center"
      width="928"
      height="1160"
      loading="eager"
      decoding="async"
      fetchPriority="high"
      onError={() => setFailed(true)}
    />
  );
}

const steps = [
  {
    icon: Sparkles,
    title: '5 preguntas sobre tu día a día',
    detail: 'Una por pantalla, sin respuestas correctas ni incorrectas.',
  },
  {
    icon: Clock,
    title: 'Menos de 3 minutos',
    detail: 'Puedes responder desde el celular, con honestidad.',
  },
  {
    icon: Compass,
    title: 'Tu estación de crecimiento',
    detail: 'De las 11 estaciones de "¡Primero Tú!", la que hoy te toca transitar.',
  },
];

export default function WelcomeScreen() {
  const reduce = useReducedMotion();

  return (
    <main className="min-h-screen w-full bg-[#FAF3E6] px-4 py-8 dark:bg-[#1F1B16]">
      <div className="mx-auto w-full max-w-[460px]">
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="flex flex-col gap-6"
        >
          {/* Marca */}
          <header className="flex items-center justify-between gap-3">
            <p className="font-[Georgia,'Times_New_Roman',serif] text-[13px] font-semibold tracking-[0.18em] text-[#A97E29] uppercase dark:text-[#D9B25F]">
              Aprendices · Primero Tú
            </p>
          </header>

          {/* Héroe */}
          <section className="overflow-hidden rounded-[28px] bg-[#FFFDF8] shadow-[0_12px_32px_rgba(59,47,35,0.10)] dark:bg-[#262119] dark:shadow-[0_12px_32px_rgba(0,0,0,0.35)]">
            <div className="aspect-[4/3] w-full">
              <AtticWatercolor />
            </div>

            <div className="flex flex-col gap-4 p-6">
              <p className="text-[13px] font-semibold tracking-[0.14em] text-[#B2572B] uppercase dark:text-[#D98A5F]">
                Diagnóstico gratuito
              </p>

              <h1 className="font-[Georgia,'Times_New_Roman',serif] text-[32px] leading-[1.2] font-bold text-[#3B2F23] dark:text-[#F3E9D8]">
                ¿Cuánto te estás dejando de lado en la crianza de tus hijos?
              </h1>

              <p className="text-[16px] leading-[1.6] text-[#6B5D4C] dark:text-[#C4B7A4]">
                Descubre en 3 minutos cuál de las 11 estaciones de crecimiento personal necesitas
                transitar hoy para dejar de criar en piloto automático y empezar a sanar en familia.
              </p>

              <Link
                to="/quiz"
                className="mt-1 flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-[#3A4230] px-6 text-center text-[17px] font-semibold text-[#FAF3E6] transition duration-200 ease-out outline-none hover:bg-[#2F3627] focus-visible:ring-2 focus-visible:ring-[#C79A3B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFFDF8] active:scale-[0.97] active:bg-[#2A3123] dark:bg-[#465138] dark:text-[#FFFDF8] dark:hover:bg-[#525E42] dark:focus-visible:ring-offset-[#262119]"
              >
                Comenzar mi diagnóstico gratuito
                <ArrowRight className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden="true" />
              </Link>

              <p className="text-center text-[14px] leading-[1.5] text-[#6B5D4C] dark:text-[#C4B7A4]">
                Gratis · 5 preguntas · resultado inmediato
              </p>
            </div>
          </section>

          {/* Cómo funciona */}
          <section
            aria-labelledby="como-funciona"
            className="rounded-[28px] bg-[#FFFDF8] p-6 shadow-[0_8px_24px_rgba(59,47,35,0.07)] dark:bg-[#262119] dark:shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
          >
            <h2
              id="como-funciona"
              className="font-[Georgia,'Times_New_Roman',serif] text-[20px] leading-[1.25] font-bold text-[#3B2F23] dark:text-[#F3E9D8]"
            >
              Cómo funciona
            </h2>

            <ul className="mt-4 flex flex-col gap-4">
              {steps.map((step) => (
                <li key={step.title} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FAF3E6] text-[#A97E29] dark:bg-[#332C22] dark:text-[#D9B25F]"
                    aria-hidden="true"
                  >
                    <step.icon className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[16px] leading-[1.4] font-semibold text-[#3B2F23] dark:text-[#F3E9D8]">
                      {step.title}
                    </span>
                    <span className="block text-[14px] leading-[1.5] text-[#6B5D4C] dark:text-[#C4B7A4]">
                      {step.detail}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Frase ancla */}
          <p className="px-2 text-center font-[Georgia,'Times_New_Roman',serif] text-[18px] leading-[1.4] font-bold text-[#B2572B] italic dark:text-[#D98A5F]">
            No vienes a ser perfecto. Vienes a ser aprendiz.
          </p>
        </motion.div>
      </div>
    </main>
  );
}