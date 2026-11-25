import { useMemo, useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { AlertCircle, CheckCircle2, ExternalLink, MessageCircle, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { submitLead } from '../lib/leads';

// Cada estación puede llevar su propia frase ancla (si no la tiene, se usa la frase genérica de la marca)
// y su propia ilustración (hoy solo la Estación 10 y la Estación 11 tienen una).
const ESTACIONES: Record<
  string,
  { titulo: string; texto: string; frase_ancla?: string; imagen?: { src: string; alt: string } }
> = {
  nino_interior: {
    titulo: 'Estación 1 · Sanación del Niño Interior',
    texto:
      'Cuando tus hijos se desbordan, algo muy antiguo se activa en ti: el niño que fuiste, que quizás no tuvo quién lo acompañara. Sanar esa parte de ti es el primer paso para responder desde el adulto que eres, y no desde la herida que cargas.',
  },
  emociones: {
    titulo: 'Estación 2 · Comprendiendo las Emociones',
    texto:
      'Tus emociones se acumulan como agua sin salida, hasta desbordarse en el peor momento. Aprender a nombrarlas, validarlas y soltarlas a tiempo te ayuda a acompañar mejor las de tus hijos.',
  },
  heridas: {
    titulo: 'Estación 3 · Recordando las Heridas',
    texto:
      'Hay heridas del pasado que siguen influyendo en cómo reaccionas hoy. Reconocerlas es el primer paso para soltar un peso que ya no te corresponde cargar, y evitar que tus hijos hereden las mismas cicatrices.',
  },
  proceso: {
    titulo: 'Estación 4 · Confiando en el Proceso de la Vida',
    texto:
      'Vives aferrado/a a que las cosas salgan de forma específica, y eso trae angustia. La crianza no se controla: se acompaña. Soltar el control excesivo te permite respirar y confiar.',
  },
  abundancia: {
    titulo: 'Estación 5 · Creando un Espacio de Abundancia',
    texto:
      'Tienes más recursos internos de los que crees, pero el ruido diario no te deja verlos. Crear espacio físico, emocional y mental es criar desde la abundancia, no desde la carencia.',
  },
  bendiciones: {
    titulo: 'Estación 6 · Reconociendo las Bendiciones Ocultas',
    texto:
      'Ya tienes una mirada capaz de encontrar aprendizaje incluso en lo difícil. El siguiente paso es sostener esa mirada también en los días más duros.',
  },
  intuicion: {
    titulo: 'Estación 7 · El Poder de la Intuición',
    texto:
      'Tienes una intuición que empieza a hablarte, pero todavía dudas de ella. Aprender a escucharla te permitirá criar con más presencia y menos ansiedad por la perfección.',
  },
  compasion: {
    titulo: 'Estación 8 · Cultivando la Compasión Hacia Uno Mismo',
    texto:
      'Eres mucho más duro/a contigo mismo/a de lo que serías con otra persona en tu misma situación. Tratarte con la compasión que le das a tus hijos es el cambio más urgente que necesitas hoy.',
  },
  presente: {
    titulo: 'Estación 9 · Conectando con el Momento Presente',
    texto:
      'Vives entre el pasado y la preocupación por el futuro, y eso te roba los pequeños momentos presentes con tus hijos. Volver al aquí y ahora puede devolverte la paz que sientes que te falta.',
  },
  futuro: {
    titulo: 'Estación 10 · Tú y Yo del Futuro',
    frase_ancla: 'Cada día me parezco un poco más a quien quiero ser.',
    imagen: {
      src: 'https://fzfncffjekempswnjilr.supabase.co/storage/v1/object/public/cosmos-code-sites/_assets/p9cdNQcq34XVgvbVHe9smHBKTOS2/9f77d2b0-adfe-44b9-ab44-6a7b64f5bda4/49f5b5341c285fc76e5ce6a8fcc82dce9f5ebe854400e08ad809109b7b03027e.jpg',
      alt: 'Ilustración en acuarela que acompaña la Estación 10 · Tú y Yo del Futuro',
    },
    texto:
      'Imaginar con detalle a la persona que quieres ser en casa dentro de un año le da a tu mente y a tu cuerpo un lugar hacia donde caminar. No se trata de fingir que ya llegaste, sino de ensayar con cariño el camino: lo que de verdad mueve el cambio es lo que sientes al imaginar esa escena. Tu yo del futuro no es un juez ni una meta imposible, sino una invitación a caminar hacia quien ya empieza a asomarse.',
  },
  pausa_reparacion: {
    titulo: 'Estación 11 · Cuando Todo Explota: Pausa y Reparación',
    frase_ancla: 'Puedo pausar. Puedo reparar. Puedo volver a empezar.',
    imagen: {
      src: 'https://fzfncffjekempswnjilr.supabase.co/storage/v1/object/public/cosmos-code-sites/_assets/p9cdNQcq34XVgvbVHe9smHBKTOS2/9f77d2b0-adfe-44b9-ab44-6a7b64f5bda4/2d99898f2a9827c58cddd887bc82f2adf47c86bf4a3b429a3de140828a4f02e8.jpg',
      alt: 'Acuarela de una madre y su hijo juntos y en calma después de un momento difícil',
    },
    texto:
      'Todos los padres pierden la calma alguna vez; lo que más enseña no es no equivocarse, sino saber volver. Una pausa consciente de minuto y medio —nombrar la emoción, ubicarla en el cuerpo, exhalar largo y elegir qué necesitas— marca la diferencia antes de reaccionar. Reparar después, con palabras sencillas y sinceras, no es perder autoridad: muestra que el amor sigue ahí, y cada pausa y cada reparación acercan a un hogar más seguro.',
  },
};

const FRASE_ANCLA = 'No vienes a ser perfecto. Vienes a ser aprendiz.';
const ENLACE_HOTMART = 'https://pay.hotmart.com/F108620230F';
const ENLACE_WHATSAPP = 'https://wa.me/573053708446';

function calcularGanadora(respuestas: string[]): string | null {
  const puntos: Record<string, number> = {};
  let ganadora: string | null = null;
  let max = 0;
  for (const respuesta of respuestas) {
    if (!ESTACIONES[respuesta]) continue;
    puntos[respuesta] = (puntos[respuesta] ?? 0) + 1;
    if (puntos[respuesta] > max) {
      max = puntos[respuesta];
      ganadora = respuesta;
    }
  }
  return ganadora;
}

const SHELL = 'min-h-screen bg-[#FAF3E6] px-4 py-8 text-[#3B2F23] dark:bg-[#1E1913] dark:text-[#FAF3E6]';
const CARD =
  'relative overflow-hidden rounded-[28px] bg-[#FFFDF8] p-6 shadow-[0_14px_34px_-20px_rgba(59,47,35,0.45)] dark:bg-[#2A231A]';
const MUTED = 'text-[#6B5D4C] dark:text-[#D9CDB8]';
const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C79A3B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF3E6] dark:focus-visible:ring-offset-[#1E1913]';
const BUTTON =
  'inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl px-5 text-base font-semibold transition duration-150 ease-out active:scale-[0.97] motion-reduce:transition-none';

function Shell({ children }: { children: ReactNode }) {
  return (
    <main className={SHELL}>
      <div className="mx-auto w-full max-w-[460px] pb-10">
        <p className="font-serif text-[13px] font-semibold tracking-[0.14em] text-[#6B5D4C] dark:text-[#C9BBA6]">
          APRENDICES · Primero Tú
        </p>
        {children}
      </div>
    </main>
  );
}

/**
 * Ilustración de una estación en el resultado. Si la imagen no carga, desaparece del todo:
 * nunca se muestra el icono de imagen rota con su texto alternativo.
 */
function StationIllustration({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <img
      src={src}
      alt={alt}
      width="928"
      height="696"
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="relative mb-5 aspect-[4/3] w-full rounded-[20px] object-cover"
    />
  );
}

export default function ResultScreen() {
  const { perfil } = useParams();
  const location = useLocation();

  const respuestas = (location.state as { answers?: string[] } | null)?.answers;

  const estacionId = useMemo(() => {
    const ganadora = respuestas && respuestas.length ? calcularGanadora(respuestas) : null;
    return ganadora ?? perfil ?? '';
  }, [respuestas, perfil]);

  const estacion = ESTACIONES[estacionId] ?? (location.pathname === '/ventas' ? ESTACIONES.futuro : undefined);

  // Nombre de la estación sin el prefijo ("Estación 1 · ") para el registro del lead.
  const estacionNombre = estacion ? estacion.titulo.split('·').slice(1).join('·').trim() || estacion.titulo : '';

  // Enviamos el lead una sola vez, aunque se pulse el formulario y luego el botón de la oferta.
  const yaEnviado = useRef(false);

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [errores, setErrores] = useState<{ nombre?: string; correo?: string }>({});
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  function validarNombre(valor: string) {
    return valor.trim().length < 2 ? 'Escribe tu nombre (al menos 2 letras) para poder saludarte.' : undefined;
  }
  function validarCorreo(valor: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor.trim())
      ? undefined
      : 'Revisa tu correo: falta el arroba o el dominio (ejemplo: ana@correo.com).';
  }

  /**
   * Registra el lead (Google Sheets + base de datos) en segundo plano.
   * Es best-effort: un fallo nunca interrumpe el camino hacia la oferta.
   */
  async function enviarDatos(nombreLimpio: string, correoLimpio: string) {
    if (yaEnviado.current) return;
    yaEnviado.current = true;
    await submitLead({
      name: nombreLimpio,
      email: correoLimpio,
      station: estacionId,
      stationName: estacionNombre,
      diagnosis: estacion?.texto ?? '',
    });
  }

  /**
   * Si la persona ya escribió sus datos y pulsa el botón de la oferta, los registramos
   * igualmente, sin bloquear la apertura del enlace.
   */
  function alPulsarHotmart() {
    if (yaEnviado.current) return;
    if (validarNombre(nombre) || validarCorreo(correo)) return;
    void enviarDatos(nombre.trim(), correo.trim().toLowerCase());
  }

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const nuevos = { nombre: validarNombre(nombre), correo: validarCorreo(correo) };
    setErrores(nuevos);
    if (nuevos.nombre || nuevos.correo) {
      toast.error('Revisa los campos marcados e inténtalo otra vez.');
      return;
    }
    setEnviando(true);
    // El registro es best-effort: pase lo que pase, confirmamos y mostramos la oferta.
    try {
      await enviarDatos(nombre.trim(), correo.trim().toLowerCase());
    } finally {
      setEnviando(false);
      setEnviado(true);
      toast.success('¡Gracias! Te hemos registrado.');
    }
  }

  function reiniciarTest() {
    return (
      <Link
        to="/quiz"
        className={`${FOCUS} mt-6 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl border border-[#E4D8C2] px-5 text-base font-semibold text-[#3B2F23] transition duration-150 ease-out hover:bg-[#FAF3E6] active:scale-[0.97] motion-reduce:transition-none dark:border-[#3D3428] dark:text-[#FAF3E6] dark:hover:bg-[#241E17]`}
      >
        <RotateCcw className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
        Volver a hacer el test
      </Link>
    );
  }

  if (!estacion) {
    return (
      <Shell>
        <section className={`${CARD} mt-6`}>
          <AlertCircle className="h-7 w-7 text-[#B2572B]" strokeWidth={1.75} aria-hidden="true" />
          <h1 className="mt-3 font-serif text-2xl font-bold leading-snug">No encontramos ese resultado</h1>
          <p className={`mt-3 text-base leading-relaxed ${MUTED}`}>
            Puede que el enlace esté incompleto. Responde las 5 preguntas del test y te mostraremos la estación que te
            toca transitar hoy.
          </p>
          <Link
            to="/quiz"
            className={`${BUTTON} ${FOCUS} mt-5 bg-[#3A4230] text-[#FAF3E6] hover:bg-[#2F3627]`}
          >
            Hacer el quiz
          </Link>
        </section>
      </Shell>
    );
  }

  return (
    <Shell>
      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#6B5D4C] dark:text-[#C9BBA6]">
        TU DIAGNÓSTICO
      </p>

      <section className={`${CARD} mt-3`}>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#C79A3B]/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-14 -left-10 h-36 w-36 rounded-full bg-[#B2572B]/15 blur-3xl"
        />
        {estacion.imagen ? <StationIllustration src={estacion.imagen.src} alt={estacion.imagen.alt} /> : null}
        <h1 className="relative font-serif text-2xl font-bold leading-snug">{estacion.titulo}</h1>
        <p className={`relative mt-4 text-base leading-relaxed ${MUTED}`}>{estacion.texto}</p>
      </section>

      <blockquote className="mt-6 rounded-r-[24px] rounded-l-md border-l-4 border-[#B2572B] bg-[#FFFDF8] py-5 pr-5 pl-5 shadow-[0_10px_26px_-22px_rgba(59,47,35,0.5)] dark:bg-[#2A231A]">
        <p className="font-serif text-lg font-bold italic leading-snug text-[#3B2F23] dark:text-[#FAF3E6]">
          «{estacion.frase_ancla ?? FRASE_ANCLA}»
        </p>
      </blockquote>

      <section className="mt-6 rounded-[28px] bg-[#3A4230] p-6 text-[#FAF3E6] shadow-[0_16px_34px_-22px_rgba(58,66,48,0.9)]">
        <p className="font-serif text-lg font-bold leading-snug">
          Transita las 11 estaciones completas con ejercicios prácticos y audios cortos para llevar en el bolsillo
          en nuestra experiencia «Primero Tú».
        </p>
        <a
          href={ENLACE_HOTMART}
          target="_blank"
          rel="noopener noreferrer"
          onClick={alPulsarHotmart}
          className={`${BUTTON} ${FOCUS} mt-5 bg-[#C79A3B] text-[#3B2F23] hover:bg-[#A97E29]`}
        >
          <ExternalLink className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
          Obtener el E-book y el Audiolibro completo
        </a>
        <a
          href={ENLACE_WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
          className={`${BUTTON} ${FOCUS} mt-3 border border-[#E4D8C2] bg-[#FFFDF8] text-[#3B2F23] hover:bg-[#FAF3E6]`}
        >
          <MessageCircle className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
          Escribir por WhatsApp · +57 305 370 8446
        </a>
      </section>

      <section className={`${CARD} mt-6`}>
        {enviado ? (
          <div role="status" aria-live="polite">
            <CheckCircle2 className="h-7 w-7 text-[#58724A] dark:text-[#8CA87B]" strokeWidth={1.75} aria-hidden="true" />
            <p className="mt-3 font-serif text-xl font-bold leading-snug">¡Gracias! Te hemos registrado.</p>
            <p className={`mt-3 text-base leading-relaxed ${MUTED}`}>
              Guardamos tu correo junto a tu estación diagnosticada: {estacion.titulo}. En breve recibirás más
              información sobre «Primero Tú».
            </p>
            <a
              href={ENLACE_HOTMART}
              target="_blank"
              rel="noopener noreferrer"
              className={`${BUTTON} ${FOCUS} mt-5 bg-[#C79A3B] text-[#3B2F23] hover:bg-[#A97E29]`}
            >
              <ExternalLink className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
              Obtener el E-book y el Audiolibro completo
            </a>
          </div>
        ) : (
          <form onSubmit={enviar} noValidate>
            <h2 className="font-serif text-xl font-bold leading-snug">
              Déjanos tu correo y te enviamos tu resultado + un regalo
            </h2>
            <label htmlFor="lead-nombre" className="mt-5 block text-sm font-semibold">
              Nombre
            </label>
            <input
              id="lead-nombre"
              name="nombre"
              type="text"
              autoComplete="name"
              value={nombre}
              onChange={(evento) => setNombre(evento.target.value)}
              onBlur={() => setErrores((previo) => ({ ...previo, nombre: validarNombre(nombre) }))}
              aria-invalid={errores.nombre ? true : undefined}
              aria-describedby={errores.nombre ? 'error-nombre' : undefined}
              className={`mt-2 min-h-[48px] w-full rounded-xl border bg-[#FFFDF8] px-4 text-base text-[#3B2F23] placeholder:text-[#6B5D4C] focus-visible:ring-2 focus-visible:ring-[#C79A3B] focus-visible:outline-none dark:bg-[#241E17] dark:text-[#FAF3E6] ${
                errores.nombre ? 'border-[#A94438]' : 'border-[#E4D8C2] dark:border-[#3D3428]'
              }`}
            />
            {errores.nombre ? (
              <p id="error-nombre" role="alert" className="mt-2 text-sm font-medium text-[#A94438] dark:text-[#E5887C]">
                {errores.nombre}
              </p>
            ) : null}

            <label htmlFor="lead-correo" className="mt-5 block text-sm font-semibold">
              Correo
            </label>
            <input
              id="lead-correo"
              name="correo"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={correo}
              onChange={(evento) => setCorreo(evento.target.value)}
              onBlur={() => setErrores((previo) => ({ ...previo, correo: validarCorreo(correo) }))}
              aria-invalid={errores.correo ? true : undefined}
              aria-describedby={errores.correo ? 'error-correo' : undefined}
              className={`mt-2 min-h-[48px] w-full rounded-xl border bg-[#FFFDF8] px-4 text-base text-[#3B2F23] placeholder:text-[#6B5D4C] focus-visible:ring-2 focus-visible:ring-[#C79A3B] focus-visible:outline-none dark:bg-[#241E17] dark:text-[#FAF3E6] ${
                errores.correo ? 'border-[#A94438]' : 'border-[#E4D8C2] dark:border-[#3D3428]'
              }`}
            />
            {errores.correo ? (
              <p id="error-correo" role="alert" className="mt-2 text-sm font-medium text-[#A94438] dark:text-[#E5887C]">
                {errores.correo}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={enviando}
              className={`${BUTTON} ${FOCUS} mt-6 bg-[#3A4230] text-[#FAF3E6] hover:bg-[#2F3627] disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {enviando ? 'Enviando…' : 'Enviar y quiero saber más'}
            </button>
          </form>
        )}
      </section>

      {reiniciarTest()}
    </Shell>
  );
}