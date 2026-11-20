import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Mail,
  RefreshCw,
} from 'lucide-react';
import { quiz_leads } from '../lib/data';
import { useSession } from '../lib/session';

/* ------------------------------------------------------------------ *
 * Estaciones del diagnóstico (9 categorías posibles).
 * ------------------------------------------------------------------ */

type StationKey =
  | 'nino_interior'
  | 'emociones'
  | 'heridas'
  | 'proceso'
  | 'abundancia'
  | 'bendiciones'
  | 'intuicion'
  | 'compasion'
  | 'presente'
  | 'futuro'
  | 'pausa_reparacion';

interface StationContent {
  title: string;
  text: string;
  /** Frase ancla propia; si falta, se usa la frase genérica de la marca. */
  anchor?: string;
}

const FRASE_ANCLA_GENERICA = 'No vienes a ser perfecto. Vienes a ser aprendiz.';

const STATIONS: Record<StationKey, StationContent> = {
  nino_interior: {
    title: 'Estación 1 · Sanación del Niño Interior',
    text: 'Cuando tus hijos se desbordan, algo muy antiguo se activa en ti: el niño que fuiste, que quizás no tuvo quién lo acompañara. Sanar esa parte de ti es el primer paso para responder desde el adulto que eres, y no desde la herida que cargas.',
  },
  emociones: {
    title: 'Estación 2 · Comprendiendo las Emociones',
    text: 'Tus emociones se acumulan como agua sin salida, hasta desbordarse en el peor momento. Aprender a nombrarlas, validarlas y soltarlas a tiempo te ayuda a acompañar mejor las de tus hijos.',
  },
  heridas: {
    title: 'Estación 3 · Recordando las Heridas',
    text: 'Hay heridas del pasado que siguen influyendo en cómo reaccionas hoy. Reconocerlas es el primer paso para soltar un peso que ya no te corresponde cargar, y evitar que tus hijos hereden las mismas cicatrices.',
  },
  proceso: {
    title: 'Estación 4 · Confiando en el Proceso de la Vida',
    text: 'Vives aferrado/a a que las cosas salgan de forma específica, y eso trae angustia. La crianza no se controla: se acompaña. Soltar el control excesivo te permite respirar y confiar.',
  },
  abundancia: {
    title: 'Estación 5 · Creando un Espacio de Abundancia',
    text: 'Tienes más recursos internos de los que crees, pero el ruido diario no te deja verlos. Crear espacio físico, emocional y mental es criar desde la abundancia, no desde la carencia.',
  },
  bendiciones: {
    title: 'Estación 6 · Reconociendo las Bendiciones Ocultas',
    text: 'Ya tienes una mirada capaz de encontrar aprendizaje incluso en lo difícil. El siguiente paso es sostener esa mirada también en los días más duros.',
  },
  intuicion: {
    title: 'Estación 7 · El Poder de la Intuición',
    text: 'Tienes una intuición que empieza a hablarte, pero todavía dudas de ella. Aprender a escucharla te permitirá criar con más presencia y menos ansiedad por la perfección.',
  },
  compasion: {
    title: 'Estación 8 · Cultivando la Compasión Hacia Uno Mismo',
    text: 'Eres mucho más duro/a contigo mismo/a de lo que serías con otra persona en tu misma situación. Tratarte con la compasión que le das a tus hijos es el cambio más urgente que necesitas hoy.',
  },
  presente: {
    title: 'Estación 9 · Conectando con el Momento Presente',
    text: 'Vives entre el pasado y la preocupación por el futuro, y eso te roba los pequeños momentos presentes con tus hijos. Volver al aquí y ahora puede devolverte la paz que sientes que te falta.',
  },
  futuro: {
    title: 'Estación 10 · Tú y Yo del Futuro',
    anchor: 'Cada día me parezco un poco más a quien quiero ser.',
    text: 'Imaginar con detalle a la persona que quieres ser en casa dentro de un año le da a tu mente y a tu cuerpo un lugar hacia donde caminar. No se trata de fingir que ya llegaste, sino de ensayar con cariño el camino: lo que de verdad mueve el cambio es lo que sientes al imaginar esa escena. Tu yo del futuro no es un juez ni una meta imposible, sino una invitación a caminar hacia quien ya empieza a asomarse.',
  },
  pausa_reparacion: {
    title: 'Estación 11 · Cuando Todo Explota: Pausa y Reparación',
    anchor: 'Puedo pausar. Puedo reparar. Puedo volver a empezar.',
    text: 'Todos los padres pierden la calma alguna vez; lo que más enseña no es no equivocarse, sino saber volver. Una pausa consciente de minuto y medio —nombrar la emoción, ubicarla en el cuerpo, exhalar largo y elegir qué necesitas— marca la diferencia antes de reaccionar. Reparar después, con palabras sencillas y sinceras, no es perder autoridad: muestra que el amor sigue ahí, y cada pausa y cada reparación acercan a un hogar más seguro.',
  },
};

function isStationKey(value: string | undefined): value is StationKey {
  return value !== undefined && Object.prototype.hasOwnProperty.call(STATIONS, value);
}

/* ------------------------------------------------------------------ *
 * Formulario de lead: nombre y correo requeridos.
 * ------------------------------------------------------------------ */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: 'Escribe tu nombre (mínimo 2 letras).' })
    .max(80, { error: 'El nombre es demasiado largo.' }),
  email: z
    .string()
    .trim()
    .min(1, { error: 'Escribe tu correo electrónico.' })
    .refine((value) => EMAIL_PATTERN.test(value), {
      error: 'Escribe un correo válido, por ejemplo nombre@correo.com.',
    }),
  website: z.string().optional(),
});

type LeadFormValues = z.infer<typeof leadSchema>;

const FIELD_BASE =
  'mt-1 h-12 w-full rounded-[14px] border bg-[#FAF3E6] px-4 text-base text-[#3B2F23] placeholder-[#9C8B77] transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C79A3B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFFDF8] dark:bg-[#221C16] dark:text-[#F5EDE0] dark:placeholder-[#8C7E6C] dark:focus-visible:ring-offset-[#2A231C]';

const FIELD_OK = 'border-[#D9C9AE] dark:border-[#3D342A]';
const FIELD_ERROR = 'border-[#A94438] dark:border-[#E5A79C]';

/* ------------------------------------------------------------------ */

export default function LeadCaptureForm() {
  const { perfil } = useParams<{ perfil: string }>();
  const navigate = useNavigate();
  const { demo } = useSession();

  const [saved, setSaved] = useState(false);
  const [savedName, setSavedName] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    mode: 'onBlur',
    defaultValues: { name: '', email: '', website: '' },
  });

  const station = isStationKey(perfil) ? STATIONS[perfil] : null;
  const stationKey = isStationKey(perfil) ? perfil : null;

  const onSubmit = async (values: LeadFormValues) => {
    // Trampa anti-robots: si viene completa, se descarta el envío.
    if (values.website && values.website.trim().length > 0) return;

    const cleanName = values.name.trim();
    const cleanEmail = values.email.trim().toLowerCase();

    try {
      await quiz_leads.create({
        name: cleanName,
        email: cleanEmail,
        diagnosed_station: stationKey ?? 'sin_diagnostico',
        submitted_at: new Date().toISOString(),
      });
      setSavedName(cleanName);
      setSaved(true);
      reset({ name: '', email: '', website: '' });
      toast.success('Guardamos tu diagnóstico. Te escribiremos pronto.');
    } catch (error) {
      const detail = error instanceof Error ? error.message : '';
      if (detail && detail.toLowerCase().includes('email')) {
        toast.error('Revisa tu correo: parece que no es válido.');
      } else {
        toast.error('No pudimos guardar tus datos. Revisa tu conexión e inténtalo otra vez.');
      }
      // Los valores se conservan: el usuario no vuelve a escribir nada.
    }
  };

  /* --------------------------- Estado inválido --------------------------- */

  if (!station) {
    return (
      <main className="min-h-screen bg-[#FAF3E6] px-4 py-10 dark:bg-[#1C1712]">
        <div className="mx-auto w-full max-w-[460px]">
          <section className="rounded-[20px] border border-[#E7D9C0] bg-[#FFFDF8] p-6 shadow-[0_10px_30px_-18px_rgba(59,47,35,0.35)] dark:border-[#3D342A] dark:bg-[#2A231C]">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F6EAD5] text-[#A94438] dark:bg-[#31281F] dark:text-[#E5A79C]">
              <AlertCircle className="h-6 w-6" aria-hidden="true" />
            </span>
            <h1 className="mt-4 font-[Georgia,serif] text-[24px] leading-[1.25] font-bold text-[#3B2F23] dark:text-[#F5EDE0]">
              No encontramos ese diagnóstico
            </h1>
            <p className="mt-3 text-base leading-[1.6] text-[#6B5D4C] dark:text-[#C4B7A5]">
              El enlace no corresponde a ninguna de las 11 estaciones. Vuelve a hacer el test y te mostraremos tu
              resultado al terminar.
            </p>
            <Link
              to="/quiz"
              className="mt-6 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-[14px] bg-[#3A4230] px-5 text-base font-semibold text-[#FFFDF8] transition duration-200 hover:bg-[#46503A] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C79A3B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFFDF8] dark:bg-[#46503A] dark:focus-visible:ring-offset-[#2A231C]"
            >
              <RefreshCw className="h-5 w-5" aria-hidden="true" />
              Hacer el test de nuevo
            </Link>
          </section>
        </div>
      </main>
    );
  }

  /* ------------------------------- Pantalla ------------------------------ */

  return (
    <main className="min-h-screen bg-[#FAF3E6] px-4 py-8 dark:bg-[#1C1712]">
      <div className="mx-auto w-full max-w-[460px] space-y-6">
        {/* Encabezado de marca (en el flujo, no fijo) */}
        <header className="flex items-center justify-between gap-3">
          <Link
            to="/"
            className="text-[13px] font-semibold tracking-[0.16em] text-[#A97E29] uppercase transition duration-200 hover:text-[#B2572B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C79A3B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF3E6] dark:text-[#E0BE6C] dark:focus-visible:ring-offset-[#1C1712]"
          >
            APRENDICES · Primero Tú
          </Link>
        </header>

        {/* Mancha de acuarela: firma visual de la app */}
        <div
          aria-hidden="true"
          className="mx-auto h-20 w-full max-w-[300px] rounded-[20px] opacity-90"
          style={{
            background:
              'radial-gradient(circle at 28% 40%, rgba(199,154,59,0.38), transparent 62%), radial-gradient(circle at 72% 62%, rgba(178,87,43,0.28), transparent 66%), radial-gradient(circle at 52% 18%, rgba(58,66,48,0.20), transparent 60%)',
          }}
        />

        {/* Diagnóstico */}
        <section
          aria-labelledby="resultado-titulo"
          className="rounded-[20px] border border-[#E7D9C0] bg-[#FFFDF8] p-6 shadow-[0_10px_30px_-18px_rgba(59,47,35,0.35)] dark:border-[#3D342A] dark:bg-[#2A231C]"
        >
          <p className="text-[13px] font-semibold tracking-[0.18em] text-[#A97E29] uppercase dark:text-[#E0BE6C]">
            TU DIAGNÓSTICO
          </p>
          <h1
            id="resultado-titulo"
            className="mt-3 font-[Georgia,serif] text-[26px] leading-[1.2] font-bold text-[#3B2F23] dark:text-[#F5EDE0]"
          >
            {station.title}
          </h1>
          <p className="mt-3 text-base leading-[1.6] text-[#6B5D4C] dark:text-[#C4B7A5]">{station.text}</p>
        </section>

        {/* Frase ancla obligatoria */}
        <blockquote className="rounded-r-[20px] border-l-4 border-[#B2572B] bg-[#F6EAD5] py-5 pr-5 pl-5 dark:bg-[#31281F]">
          <p className="font-[Georgia,serif] text-lg leading-[1.4] font-bold italic text-[#3B2F23] dark:text-[#F5EDE0]">
            {station.anchor ?? FRASE_ANCLA_GENERICA}
          </p>
        </blockquote>

        {/* CTA final */}
        <section
          aria-labelledby="cta-titulo"
          className="rounded-[20px] bg-[#3A4230] p-6 text-[#FFFDF8] shadow-[0_10px_30px_-18px_rgba(59,47,35,0.45)]"
        >
          <h2 id="cta-titulo" className="font-[Georgia,serif] text-xl leading-[1.25] font-bold">
            Sigue transitando tus estaciones
          </h2>
          <p className="mt-3 text-base leading-[1.6] text-[#F0EADF]">
            Transita las 11 estaciones completas con ejercicios prácticos y audios cortos para llevar en el bolsillo
            en nuestra experiencia 'Primero Tú'.
          </p>
          <a
            href="https://hotmart.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-[14px] bg-[#C79A3B] px-5 text-center text-base font-semibold text-[#3B2F23] transition duration-200 hover:bg-[#D9AE55] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FAF3E6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#3A4230]"
          >
            Obtener el E-book y el Audiolibro completo
            <ExternalLink className="h-5 w-5 shrink-0" aria-hidden="true" />
          </a>
        </section>

        {/* Formulario de lead */}
        <section
          aria-labelledby="lead-form-title"
          className="rounded-[20px] border border-[#E7D9C0] bg-[#FFFDF8] p-6 shadow-[0_10px_30px_-18px_rgba(59,47,35,0.35)] dark:border-[#3D342A] dark:bg-[#2A231C]"
        >
          {saved ? (
            <div role="status" aria-live="polite">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E7EEDF] text-[#58724A] dark:bg-[#2F3A26] dark:text-[#A8C093]">
                <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
              </span>
              <h2 className="mt-4 font-[Georgia,serif] text-[22px] leading-[1.25] font-bold text-[#3B2F23] dark:text-[#F5EDE0]">
                ¡Gracias! Te enviamos tu diagnóstico completo y en breve recibirás más información sobre 'Primero Tú'.
              </h2>
              <p className="mt-3 text-base leading-[1.6] text-[#6B5D4C] dark:text-[#C4B7A5]">
                {savedName ? `Guardamos el resultado de ${savedName}: ${station.title}.` : `Guardamos tu ${station.title}.`}
              </p>
              <Link
                to="/quiz"
                className="mt-6 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-[14px] bg-[#3A4230] px-5 text-base font-semibold text-[#FFFDF8] transition duration-200 hover:bg-[#46503A] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C79A3B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFFDF8] dark:bg-[#46503A] dark:focus-visible:ring-offset-[#2A231C]"
              >
                <RefreshCw className="h-5 w-5" aria-hidden="true" />
                Volver a hacer el test
              </Link>
            </div>
          ) : (
            <>
              <h2
                id="lead-form-title"
                className="font-[Georgia,serif] text-[22px] leading-[1.25] font-bold text-[#3B2F23] dark:text-[#F5EDE0]"
              >
                Déjanos tu correo y te enviamos tu resultado + un regalo
              </h2>
              <p className="mt-3 text-base leading-[1.6] text-[#6B5D4C] dark:text-[#C4B7A5]">
                Guardamos tu diagnóstico y te enviamos los detalles de tu estación junto con un regalo de bienvenida.
              </p>

              <form noValidate onSubmit={handleSubmit(onSubmit)} className="relative mt-5 space-y-5">
                {/* Trampa anti-robots */}
                <div className="absolute h-0 w-0 overflow-hidden opacity-0" aria-hidden="true">
                  <label htmlFor="lead-website">No completar este campo</label>
                  <input
                    id="lead-website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    {...register('website')}
                  />
                </div>

                <div>
                  <label
                    htmlFor="lead-name"
                    className="block text-sm font-semibold text-[#3B2F23] dark:text-[#F5EDE0]"
                  >
                    Nombre <span className="text-[#B2572B] dark:text-[#E0A085]">*</span>
                  </label>
                  <input
                    id="lead-name"
                    type="text"
                    inputMode="text"
                    autoComplete="name"
                    placeholder="Ana"
                    aria-required="true"
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={errors.name ? 'lead-name-error' : undefined}
                    className={`${FIELD_BASE} ${errors.name ? FIELD_ERROR : FIELD_OK}`}
                    {...register('name')}
                  />
                  {errors.name ? (
                    <p
                      id="lead-name-error"
                      role="alert"
                      className="mt-1 flex items-start gap-1.5 text-sm text-[#A94438] dark:text-[#E5A79C]"
                    >
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      {errors.name.message}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label
                    htmlFor="lead-email"
                    className="block text-sm font-semibold text-[#3B2F23] dark:text-[#F5EDE0]"
                  >
                    Correo electrónico <span className="text-[#B2572B] dark:text-[#E0A085]">*</span>
                  </label>
                  <input
                    id="lead-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="ana@correo.com"
                    aria-required="true"
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={errors.email ? 'lead-email-error' : undefined}
                    className={`${FIELD_BASE} ${errors.email ? FIELD_ERROR : FIELD_OK}`}
                    {...register('email')}
                  />
                  {errors.email ? (
                    <p
                      id="lead-email-error"
                      role="alert"
                      className="mt-1 flex items-start gap-1.5 text-sm text-[#A94438] dark:text-[#E5A79C]"
                    >
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      {errors.email.message}
                    </p>
                  ) : null}
                </div>

                {errors.root ? (
                  <p role="alert" className="flex items-start gap-1.5 text-sm text-[#A94438] dark:text-[#E5A79C]">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    {errors.root.message}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-[14px] bg-[#3A4230] px-5 text-base font-semibold text-[#FFFDF8] transition duration-200 hover:bg-[#46503A] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C79A3B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFFDF8] disabled:cursor-not-allowed disabled:opacity-70 dark:bg-[#46503A] dark:focus-visible:ring-offset-[#2A231C]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                      Enviando…
                    </>
                  ) : (
                    'Enviar y quiero saber más'
                  )}
                </button>

                <p className="flex items-start gap-1.5 text-sm leading-[1.5] text-[#6B5D4C] dark:text-[#C4B7A5]">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  Cada envío se notifica por correo a info.tuobog@gmail.com cuando conectas Supabase en Connectors →
                  Supabase y configuras el servicio de correo.
                </p>

                {demo ? (
                  <p className="text-sm leading-[1.5] text-[#A97E29] dark:text-[#E0BE6C]">
                    Modo demo: los datos no se guardan en la nube, quedan solo en este navegador.
                  </p>
                ) : null}
              </form>
            </>
          )}
        </section>

        <div className="pb-2">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="min-h-[44px] w-full rounded-[14px] px-4 text-sm font-semibold text-[#6B5D4C] transition duration-200 hover:text-[#3B2F23] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C79A3B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF3E6] dark:text-[#C4B7A5] dark:hover:text-[#F5EDE0] dark:focus-visible:ring-offset-[#1C1712]"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </main>
  );
}
