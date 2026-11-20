import { Check, ExternalLink, Lock } from 'lucide-react';

/**
 * Enlace de compra de la experiencia "Primero Tú".
 *
 * PLACEHOLDER: reemplaza esta constante por la URL de checkout de Hotmart
 * (la que aparece en Hotmart → Producto → Enlaces de venta) cuando la oferta
 * esté publicada. No construyas la URL a mano.
 */
export const HOTMART_CHECKOUT_URL = 'https://hotmart.com';

const BENEFITS = [
  'Las 11 estaciones completas',
  'Ejercicios prácticos para hacer en casa',
  'Audios cortos para escuchar donde estés',
] as const;

export default function OfferCta() {
  return (
    <section
      aria-labelledby="offer-cta-title"
      className="relative overflow-hidden rounded-[24px] bg-[#3A4230] p-6 text-[#FAF3E6] shadow-[0_18px_40px_-24px_rgba(58,66,48,0.7)] dark:bg-[#2F362A] dark:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.6)]"
    >
      {/* Mancha de acuarela decorativa */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[#C79A3B] opacity-[0.18] blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-14 h-48 w-48 rounded-full bg-[#3A4230] opacity-40 blur-2xl dark:bg-[#C79A3B] dark:opacity-10"
      />

      <div className="relative">
        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#C79A3B]">
          Experiencia completa
        </p>

        <h2
          id="offer-cta-title"
          className="mt-3 text-balance text-[22px] leading-[1.35] font-bold [font-family:Georgia,'Times_New_Roman',serif] sm:text-[24px]"
        >
          {
            "Transita las 11 estaciones completas con ejercicios prácticos y audios cortos para llevar en el bolsillo en nuestra experiencia 'Primero Tú'."
          }
        </h2>

        <ul className="mt-5 space-y-2">
          {BENEFITS.map((benefit) => (
            <li key={benefit} className="flex items-start gap-2 text-[16px] leading-[1.5] text-[#E8DDC8]">
              <Check
                aria-hidden="true"
                className="mt-[3px] h-4 w-4 shrink-0 text-[#C79A3B]"
                strokeWidth={2.4}
              />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>

        <a
          href={HOTMART_CHECKOUT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[16px] bg-[#C79A3B] px-5 py-3 text-center text-[16px] font-semibold text-[#2A2418] transition-[background-color,transform] duration-200 ease-out hover:bg-[#A97E29] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FAF3E6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#3A4230] active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 dark:bg-[#C79A3B] dark:hover:bg-[#D5AC54]"
        >
          <span>Obtener el E-book y el Audiolibro completo</span>
          <ExternalLink aria-hidden="true" className="h-[18px] w-[18px] shrink-0" strokeWidth={2.2} />
          <span className="sr-only">(se abre en una pestaña nueva)</span>
        </a>

        <p className="mt-3 flex items-center justify-center gap-1.5 text-[13px] leading-[1.4] text-[#E8DDC8]">
          <Lock aria-hidden="true" className="h-[14px] w-[14px] shrink-0" strokeWidth={2.2} />
          <span>Pago seguro por Hotmart</span>
        </p>
      </div>
    </section>
  );
}
