import { useState } from 'react';
import type { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

type Category =
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

type Variant = 1 | 2 | 3 | 4 | 5;

type Option = { texto: string; categoria: Category };
type Question = { tema: string; texto: string; variant: Variant; opciones: Option[] };

const QUESTIONS: Question[] = [
  {
    tema: 'Niño Interior',
    variant: 1,
    texto:
      '¿Qué pasa en tu interior cuando tus hijos se desbordan con una rabieta o un llanto intenso?',
    opciones: [
      {
        texto: 'Me desbordo yo también: me sale enojo, gritos o impaciencia que no reconozco.',
        categoria: 'nino_interior',
      },
      {
        texto: 'Me paralizo o me alejo emocionalmente, sin saber cómo contenerlo.',
        categoria: 'nino_interior',
      },
      { texto: 'Logro respirar y acompañar, aunque me cuesta un poco.', categoria: 'emociones' },
      {
        texto: 'Siento que puedo sostenerlo con calma la mayoría de las veces.',
        categoria: 'presente',
      },
    ],
  },
  {
    tema: 'Presencia y piloto automático',
    variant: 2,
    texto: '¿Cómo notas que manejas tu atención y el estrés a lo largo de la semana?',
    opciones: [
      {
        texto: 'Siento que vivo en piloto automático: reacciono más de lo que elijo.',
        categoria: 'presente',
      },
      {
        texto: 'Acumulo estrés durante la semana y exploto en los momentos menos indicados.',
        categoria: 'emociones',
      },
      {
        texto: 'Intento estar presente, pero las distracciones y la rutina me ganan seguido.',
        categoria: 'presente',
      },
      {
        texto: 'Tengo momentos de verdadera conexión y calma con mis hijos.',
        categoria: 'abundancia',
      },
    ],
  },
  {
    tema: 'Autocompasión',
    variant: 3,
    texto:
      'Cuando cometes un error en la crianza (como perder la paciencia), ¿cómo te tratas después?',
    opciones: [
      {
        texto: 'Soy muy duro/a conmigo mismo/a, me juzgo y me repito que no soy suficiente.',
        categoria: 'compasion',
      },
      {
        texto: 'Me siento culpable por horas, aunque trato de disimularlo.',
        categoria: 'compasion',
      },
      {
        texto: 'Reconozco el error, pero me cuesta perdonarme del todo.',
        categoria: 'heridas',
      },
      {
        texto: 'Logro verlo como aprendizaje y seguir adelante con amabilidad hacia mí.',
        categoria: 'intuicion',
      },
    ],
  },
  {
    tema: 'Control e intuición',
    variant: 4,
    texto:
      "¿Qué tan fácil te resulta soltar el control de cómo 'deberían' ser las cosas en casa y confiar en tu intuición?",
    opciones: [
      {
        texto: 'Casi nada: necesito que todo salga como lo planeé o me angustio.',
        categoria: 'proceso',
      },
      {
        texto: 'Me cuesta, siento que si suelto el control algo va a salir mal.',
        categoria: 'proceso',
      },
      {
        texto: 'A veces logro confiar, pero me cuesta sostenerlo en el día a día.',
        categoria: 'intuicion',
      },
      {
        texto: 'Cada vez confío más en mi intuición y en que las cosas se acomodan.',
        categoria: 'bendiciones',
      },
    ],
  },
  {
    tema: 'Pausa y reparación',
    variant: 5,
    texto:
      'Cuando pierdes la calma con tus hijos y el momento difícil ya pasó, ¿qué suele ocurrir después?',
    opciones: [
      {
        texto: 'Pierdo la calma seguido y me cuesta reparar después: la tensión queda flotando en casa.',
        categoria: 'pausa_reparacion',
      },
      {
        texto: 'Me quedo con culpa por horas, sin saber cómo reparar el vínculo con mis hijos.',
        categoria: 'pausa_reparacion',
      },
      {
        texto: 'A veces imagino cómo sería criar con más calma, pero no sé cómo llegar ahí.',
        categoria: 'futuro',
      },
      {
        texto: 'Tengo clara la persona que quiero ser, y practico pequeños gestos para parecerme a ella.',
        categoria: 'futuro',
      },
    ],
  },
];

type Blob = [number, number, number, number, string];

const SCENES: Record<Variant, { alt: string; bg: string; blobs: Blob[]; art: ReactElement }> = {
  1: {
    alt: 'Ilustración en acuarela: una persona mira la foto de su niñez en medio de un campo de girasoles',
    bg: '#FDF6E7',
    blobs: [
      [72, 42, 76, 42, '#E8CE8E'],
      [246, 50, 84, 48, '#E4C177'],
      [164, 172, 156, 58, '#C9CFA6'],
      [38, 148, 62, 34, '#B9C39A'],
    ],
    art: (
      <g>
        <path d="M0 150 Q80 138 160 150 T320 146 L320 200 L0 200 Z" fill="#8A9163" opacity="0.45" />
        {[46, 92, 258, 296].map((x) => (
          <g key={x}>
            <path
              d={`M${x} 152 Q${x - 4} 122 ${x} 98`}
              stroke="#6F7A48"
              strokeWidth="3"
              fill="none"
            />
            <circle cx={x} cy={94} r={10} fill="#C79A3B" opacity="0.85" />
            <circle cx={x} cy={94} r={4} fill="#8A5A22" />
          </g>
        ))}
        <path d="M132 100 Q156 112 172 120" stroke="#B2572B" strokeWidth="4" fill="none" />
        <path d="M206 100 Q186 112 178 120" stroke="#B2572B" strokeWidth="4" fill="none" />
        <path d="M169 76 Q164 74 163 68 Q163 58 172 56 Q182 54 185 63 Q187 70 181 75 Z" fill="#5A4632" />
        <circle cx="173" cy="66" r="12" fill="#E7B79B" />
        <path d="M173 80 Q150 94 150 152 L198 152 Q198 94 173 80 Z" fill="#B2572B" opacity="0.8" />
        <rect x="162" y="118" width="28" height="22" rx="3" fill="#FFFDF8" stroke="#A97E29" />
        <circle cx="176" cy="126" r="4" fill="#C79A3B" />
      </g>
    ),
  },
  2: {
    alt: 'Ilustración en acuarela: una persona se agacha con ternura para quedar a la altura de un niño',
    bg: '#FCEFE9',
    blobs: [
      [80, 52, 82, 46, '#E7B9A8'],
      [250, 66, 78, 44, '#EFCFC2'],
      [160, 176, 158, 52, '#D9A794'],
    ],
    art: (
      <g>
        <path d="M0 152 Q90 142 180 152 T320 148 L320 200 L0 200 Z" fill="#D9A794" opacity="0.4" />
        <path d="M118 82 Q98 100 94 152 L148 152 Q146 104 118 82 Z" fill="#CF8A7A" opacity="0.85" />
        <circle cx="126" cy="66" r="14" fill="#E7B79B" />
        <path d="M112 62 Q118 48 132 50 Q142 52 141 62 Q132 56 112 62 Z" fill="#5A4632" />
        <circle cx="132" cy="68" r="1.8" fill="#3B2F23" />
        <circle cx="122" cy="68" r="1.8" fill="#3B2F23" />
        <path d="M110 100 Q142 108 168 116" stroke="#B2572B" strokeWidth="4" fill="none" />
        <path d="M196 104 Q184 114 185 152 L214 152 Q214 114 196 104 Z" fill="#C79A3B" opacity="0.8" />
        <circle cx="197" cy="94" r="10" fill="#E7B79B" />
        <path d="M188 90 Q197 82 206 90 Q204 100 190 98 Z" fill="#3B2F23" opacity="0.8" />
        <circle cx="176" cy="118" r="4.5" fill="#A97E29" />
      </g>
    ),
  },
  3: {
    alt: 'Ilustración en acuarela: una persona de espaldas junto a una ventana con lluvia sostiene una taza caliente',
    bg: '#EDEFE6',
    blobs: [
      [72, 62, 76, 52, '#A9B2A2'],
      [244, 84, 74, 62, '#3A4230'],
      [150, 178, 150, 46, '#8E9A82'],
    ],
    art: (
      <g>
        <rect x="34" y="26" width="112" height="92" rx="8" fill="#E7EDE9" stroke="#3A4230" strokeOpacity="0.35" strokeWidth="2" />
        {[52, 68, 84, 100, 116, 132].map((x) => (
          <path
            key={x}
            d={`M${x} 36 L${x - 10} 108`}
            stroke="#8FA3AE"
            strokeWidth="2"
            opacity="0.7"
          />
        ))}
        <path d="M34 118 L146 118" stroke="#3A4230" strokeOpacity="0.35" strokeWidth="3" />
        <path d="M92 128 h26 a4 4 0 0 1 4 4 v14 a6 6 0 0 1 -6 6 h-22 a6 6 0 0 1 -6 -6 v-14 a4 4 0 0 1 4 -4 z" fill="#B2572B" opacity="0.9" />
        <path d="M122 136 q12 2 0 12" stroke="#B2572B" strokeWidth="3" fill="none" />
        <path d="M224 92 Q196 104 194 162 L254 162 Q252 104 224 92 Z" fill="#3A4230" opacity="0.8" />
        <circle cx="224" cy="76" r="15" fill="#5A4632" />
        <path d="M0 152 Q90 146 180 152 T320 150 L320 200 L0 200 Z" fill="#8E9A82" opacity="0.35" />
      </g>
    ),
  },
  4: {
    alt: 'Ilustración en acuarela: una persona y una niña caminan de la mano sobre hojas de otoño',
    bg: '#FBF1E3',
    blobs: [
      [70, 48, 78, 44, '#E0B584'],
      [252, 58, 76, 46, '#D9977A'],
      [160, 176, 160, 50, '#C79A3B'],
    ],
    art: (
      <g>
        <path d="M0 154 Q90 146 180 154 T320 150 L320 200 L0 200 Z" fill="#B2572B" opacity="0.25" />
        {[
          [42, 168, -18],
          [268, 172, 14],
          [96, 180, 8],
          [216, 182, -12],
          [150, 174, 20],
        ].map(([x, y, r]) => (
          <ellipse
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            rx="12"
            ry="7"
            fill={x % 2 === 0 ? '#C79A3B' : '#B2572B'}
            opacity="0.55"
            transform={`rotate(${r} ${x} ${y})`}
          />
        ))}
        <path d="M130 78 Q110 92 108 152 L152 152 Q150 92 130 78 Z" fill="#3A4230" opacity="0.8" />
        <circle cx="132" cy="64" r="13" fill="#E7B79B" />
        <path d="M119 60 Q126 46 139 50 Q146 52 144 62 Q134 54 119 60 Z" fill="#3B2F23" />
        <path d="M146 96 Q160 116 172 126" stroke="#3A4230" strokeWidth="4" fill="none" />
        <path d="M188 96 Q176 108 178 152 L202 152 Q202 108 188 96 Z" fill="#B2572B" opacity="0.8" />
        <circle cx="189" cy="86" r="10" fill="#E7B79B" />
        <path d="M180 82 Q189 70 199 80 Q196 92 183 90 Z" fill="#5A4632" />
        <path d="M181 102 Q176 114 172 126" stroke="#B2572B" strokeWidth="4" fill="none" />
        <circle cx="172" cy="126" r="5" fill="#A97E29" />
      </g>
    ),
  },
  5: {
    alt: 'Ilustración en acuarela: una persona adulta y un niño encuentran calma y cercanía después de un momento difícil',
    bg: '#F4F1E4',
    blobs: [
      [76, 56, 78, 48, '#B9C0A6'],
      [248, 64, 76, 46, '#DFC79A'],
      [160, 178, 158, 50, '#9FA98C'],
    ],
    art: (
      <g>
        <path d="M0 152 Q90 144 180 152 T320 148 L320 200 L0 200 Z" fill="#9FA98C" opacity="0.4" />
        <circle cx="164" cy="58" r="26" fill="#E8C98A" opacity="0.5" />
        <path d="M120 96 Q104 116 102 160 L152 160 Q148 120 120 96 Z" fill="#3A4230" opacity="0.85" />
        <circle cx="122" cy="82" r="13" fill="#E7B79B" />
        <path d="M109 78 Q116 62 130 68 Q138 72 134 80 Q124 72 109 78 Z" fill="#5A4632" />
        <path d="M150 118 Q162 128 176 132" stroke="#3A4230" strokeWidth="4" fill="none" />
        <path d="M196 112 Q182 126 184 160 L208 160 Q208 126 196 112 Z" fill="#B2572B" opacity="0.8" />
        <circle cx="197" cy="104" r="10" fill="#E7B79B" />
        <path d="M188 100 Q197 88 207 98 Q204 110 191 108 Z" fill="#5A4632" />
        <path d="M186 120 Q176 128 176 134" stroke="#B2572B" strokeWidth="4" fill="none" />
        <circle cx="176" cy="134" r="5" fill="#A97E29" />
      </g>
    ),
  },
};

function Watercolor({ variant }: { variant: Variant }) {
  // Las ilustraciones pertenecen al proyecto y se mantienen en el flujo del test.
  const scene = SCENES[variant];
  const imageByVariant: Partial<Record<Variant, { src: string; alt: string; fallback?: string }>> = {
    1: {
      src: 'https://fzfncffjekempswnjilr.supabase.co/storage/v1/object/public/cosmos-code-sites/_assets/p9cdNQcq34XVgvbVHe9smHBKTOS2/9f77d2b0-adfe-44b9-ab44-6a7b64f5bda4/e4f3b6301a3aec50f91f40386689bd83d8e20d4673aa06c6d16335ec26b520a0.jpg',
      alt: 'Acuarela de una persona adulta que mira una fotografía de su infancia en un campo de girasoles',
    },
    2: {
      src: 'https://fzfncffjekempswnjilr.supabase.co/storage/v1/object/public/cosmos-code-sites/_assets/p9cdNQcq34XVgvbVHe9smHBKTOS2/9f77d2b0-adfe-44b9-ab44-6a7b64f5bda4/e7d801c5bb1dde9e5b825b6164c07f12f999c3088ad64ab659af87d84dd5e7fe.jpg',
      alt: 'Acuarela de una persona adulta que se inclina con ternura hacia un niño',
    },
    3: {
      src: 'https://fzfncffjekempswnjilr.supabase.co/storage/v1/object/public/cosmos-code-sites/_assets/p9cdNQcq34XVgvbVHe9smHBKTOS2/9f77d2b0-adfe-44b9-ab44-6a7b64f5bda4/9e3a4e336a46b1660ccc639cc9ff90c24db1ee647b619ebeeebc81c7c3c93693.jpg',
      alt: 'Acuarela de una persona junto a una ventana lluviosa sosteniendo una taza caliente',
    },
    // Pregunta 4: referencia directa al asset proporcionado para «Confiando en el Proceso de la Vida».
    4: {
      src: 'https://fzfncffjekempswnjilr.supabase.co/storage/v1/object/public/cosmos-code-sites/_assets/p9cdNQcq34XVgvbVHe9smHBKTOS2/9f77d2b0-adfe-44b9-ab44-6a7b64f5bda4/767aff04671d33767b755b5456d8e098ba0ca3d451bdde6b3ff61c91440cf5d6.jpg',
      alt: 'Acuarela de una persona adulta y una niña caminando de la mano sobre hojas de otoño',
    },
    5: {
      // Pregunta de «Pausa y Reparación»: la imagen principal es la ilustración definitiva del
      // capítulo 11 (una madre y su hijo en calma), y la secundaria, la que sostiene la escena de
      // reconexión. Si la principal no responde, entra la secundaria y, por debajo, la acuarela
      // dibujada de esta escena, que nunca aparece rota.
      src: 'https://fzfncffjekempswnjilr.supabase.co/storage/v1/object/public/cosmos-code-sites/_assets/p9cdNQcq34XVgvbVHe9smHBKTOS2/9f77d2b0-adfe-44b9-ab44-6a7b64f5bda4/2d99898f2a9827c58cddd887bc82f2adf47c86bf4a3b429a3de140828a4f02e8.jpg',
      alt: 'Acuarela de una madre y su hijo juntos y en calma después de un momento difícil',
      fallback:
        'https://fzfncffjekempswnjilr.supabase.co/storage/v1/object/public/cosmos-code-sites/_assets/p9cdNQcq34XVgvbVHe9smHBKTOS2/9f77d2b0-adfe-44b9-ab44-6a7b64f5bda4/e7d801c5bb1dde9e5b825b6164c07f12f999c3088ad64ab659af87d84dd5e7fe.jpg',
    },
  };
  // Cada pregunta con ilustración propia la declara en imageByVariant; la acuarela dibujada
  // queda siempre debajo como último respaldo.
  const image = imageByVariant[variant];
  // Tres niveles, para que la pantalla nunca muestre un icono de imagen rota:
  // 1) la ilustración del proyecto, 2) su imagen de respaldo (si la tiene), 3) la acuarela
  // dibujada aquí abajo, que siempre se ve porque va dentro del propio documento.
  const sources: string[] = image ? (image.fallback ? [image.src, image.fallback] : [image.src]) : [];
  const [sourceIndex, setSourceIndex] = useState(0);
  const showPhoto = sources.length > 0 && sourceIndex < sources.length;
  const imageAlt = image?.alt ?? scene.alt;

  return (
    <figure className="m-0 overflow-hidden rounded-[24px] border border-[#E6DCC8] bg-[#FFFDF8] shadow-[0_10px_28px_rgba(59,47,35,0.08)] dark:border-[#3E3527] dark:bg-[#2E271C]">
      <div
        className="relative aspect-[4/3] w-full"
        style={{ backgroundColor: scene.bg }}
        role={showPhoto ? undefined : 'img'}
        aria-label={showPhoto ? undefined : imageAlt}
      >
        {/* Acuarela vectorial de respaldo: vive en el documento, no depende de la red. */}
        <svg
          viewBox="0 0 320 200"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
        >
          <g opacity="0.55" style={{ filter: 'blur(6px)' }}>
            {scene.blobs.map(([cx, cy, rx, ry, fill]) => (
              <ellipse key={`${cx}-${cy}`} cx={cx} cy={cy} rx={rx} ry={ry} fill={fill} />
            ))}
          </g>
          {scene.art}
        </svg>

        {showPhoto ? (
          <img
            key={sources[sourceIndex]}
            src={sources[sourceIndex]}
            alt={imageAlt}
            width="928"
            height="696"
            loading="lazy"
            decoding="async"
            onError={() => setSourceIndex((index) => index + 1)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
      </div>
    </figure>
  );
}

function resolveProfile(answers: Category[]): Category {
  const score = new Map<Category, number>();
  let leader: Category = answers[0] ?? 'presente';
  let best = 0;
  for (const categoria of answers) {
    const total = (score.get(categoria) ?? 0) + 1;
    score.set(categoria, total);
    if (total > best) {
      best = total;
      leader = categoria;
    }
  }
  return leader;
}

export default function QuizScreen() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => QUESTIONS.map(() => null));

  const question = QUESTIONS[step];
  const selected = answers[step];
  const percent = Math.round(((step + 1) / QUESTIONS.length) * 100);
  // Una marca por pregunta: 20/40/60/80/100 % con las cinco preguntas actuales.
  const progressMarks = QUESTIONS.map((_, index) => Math.round(((index + 1) / QUESTIONS.length) * 100));
  const isLast = step === QUESTIONS.length - 1;

  const choose = (index: number) =>
    setAnswers((prev) => prev.map((value, i) => (i === step ? index : value)));

  const goToStep = (next: number) => {
    setStep(next);
    if (!reduceMotion && typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const advance = () => {
    if (selected === null) return;
    if (!isLast) {
      goToStep(step + 1);
      return;
    }
    const respuestas = answers.map((index, i) =>
      index === null ? question.opciones[0].categoria : QUESTIONS[i].opciones[index].categoria,
    );
    const perfil = resolveProfile(respuestas);
    navigate(`/resultado/${perfil}`);
  };

  const fade = { duration: reduceMotion ? 0 : 0.22, ease: 'easeOut' as const };

  return (
    <div className="min-h-screen bg-[#FAF3E6] text-[#3B2F23] dark:bg-[#241E16] dark:text-[#F5EDDD]">
      <div className="mx-auto flex min-h-screen w-full max-w-[460px] flex-col gap-6 px-4 py-8">
        <header className="flex items-center justify-between gap-3">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#6B5D4C] dark:text-[#C9BCA6]">
            APRENDICES · Primero Tú
          </p>
          <p className="font-[Georgia,'Times New Roman',serif] text-[12px] italic text-[#A97E29] dark:text-[#DCC17C]">
            Diagnóstico Primero Tú
          </p>
        </header>

        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-3">
            <p aria-live="polite" className="text-[16px] font-semibold">
              Pregunta {step + 1} de {QUESTIONS.length} · {question.tema}
            </p>
            <span className="shrink-0 text-[14px] font-semibold text-[#A97E29] dark:text-[#DCC17C]">
              {percent}%
            </span>
          </div>
          <div
            role="progressbar"
            aria-label="Progreso del diagnóstico"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            className="h-2 w-full overflow-hidden rounded-full bg-[#E6DCC8] dark:bg-[#3E3527]"
          >
            <motion.div
              className="h-full w-full origin-left rounded-full bg-[#C79A3B]"
              style={{ transformOrigin: 'left' }}
              initial={false}
              animate={{ scaleX: (step + 1) / QUESTIONS.length }}
              transition={{ duration: reduceMotion ? 0 : 0.3, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between text-[12px] font-semibold text-[#6B5D4C] dark:text-[#C9BCA6]" aria-label="Etapas del progreso">
            {progressMarks.map((mark) => (
              <span key={mark} className={mark <= percent ? 'text-[#A97E29] dark:text-[#DCC17C]' : undefined}>
                {mark}%
              </span>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.section
            key={step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={fade}
            className="flex flex-1 flex-col gap-6"
            aria-label={`Pregunta ${step + 1} de ${QUESTIONS.length}`}
          >
            <Watercolor variant={question.variant} />
            <h1 className="font-[Georgia,'Times New Roman',serif] text-[24px] font-bold leading-[1.3]">
              {question.texto}
            </h1>
            <div
              role="group"
              aria-label="Elige la respuesta que más se parezca a lo que vives hoy"
              className="flex flex-col gap-3"
            >
              {question.opciones.map((opcion, index) => {
                const active = selected === index;
                return (
                  <button
                    key={opcion.texto}
                    type="button"
                    aria-pressed={active}
                    onClick={() => choose(index)}
                    className={clsx(
                      'flex min-h-[44px] w-full items-start gap-3 rounded-[24px] border px-4 py-4 text-left text-[16px] leading-[1.5] transition-colors duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A97E29] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF3E6]',
                      active
                        ? 'border-[#C79A3B] bg-[#FFF7E4] dark:border-[#C79A3B] dark:bg-[#3A3121]'
                        : 'border-[#E6DCC8] bg-[#FFFDF8] hover:border-[#C79A3B] dark:border-[#3E3527] dark:bg-[#2E271C]',
                    )}
                  >
                    <span aria-hidden="true" className="mt-[2px] shrink-0">
                      {active ? (
                        <CheckCircle2 className="h-5 w-5 text-[#A97E29]" />
                      ) : (
                        <span className="block h-5 w-5 rounded-full border-2 border-[#D8CBB1] dark:border-[#4A4030]" />
                      )}
                    </span>
                    <span>{opcion.texto}</span>
                  </button>
                );
              })}
            </div>
          </motion.section>
        </AnimatePresence>

        <div className="mt-auto flex flex-col gap-3 pt-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => goToStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="flex min-h-[48px] shrink-0 items-center gap-2 rounded-[24px] border border-[#E6DCC8] bg-[#FFFDF8] px-5 text-[16px] font-semibold text-[#3B2F23] transition-transform duration-150 active:scale-[0.97] disabled:opacity-40 dark:border-[#3E3527] dark:bg-[#2E271C] dark:text-[#F5EDDD]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Atrás
            </button>
            <button
              type="button"
              onClick={advance}
              disabled={selected === null}
              className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-[24px] bg-[#3A4230] px-6 text-[16px] font-semibold text-[#FFFDF8] transition-transform duration-150 active:scale-[0.97] disabled:opacity-50"
            >
              {isLast ? 'Ver mi resultado' : 'Continuar'}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <p className="text-[14px] leading-[1.5] text-[#6B5D4C] dark:text-[#C9BCA6]">
            Elige la respuesta que más se parezca a lo que vives hoy. Puedes volver con "Atrás"
            antes de terminar.
          </p>
        </div>
      </div>
    </div>
  );
}
