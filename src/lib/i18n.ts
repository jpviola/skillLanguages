// Lightweight i18n: UI strings + enum label maps for each interface locale.
// The interface locale also drives the language the LLM writes plan content in.
import { usePlan } from "@/context/PlanContext";
import type {
  Locale,
  Level,
  LearningStyle,
  ResourcePreference,
  TopicType,
  ResourceType,
  Cost,
  WeekStatus,
  WeekDifficulty,
  Difficulty,
} from "./types";

export const LOCALES: Locale[] = ["es", "en"];
export const localeName: Record<Locale, string> = { es: "Español", en: "English" };
// Name of the language the LLM should WRITE the plan in (the user's native/UI language).
export const outputLanguageName: Record<Locale, string> = { es: "Spanish", en: "English" };

type Dict = Record<string, string>;

const es: Dict = {
  // sidebar / nav
  "nav.dashboard": "Panel",
  "nav.resources": "Recursos",
  "nav.progress": "Progreso y feedback",
  "nav.settings": "Ajustes",
  "sidebar.learner": "Estudiante",
  "sidebar.freePlan": "Plan gratis",
  "a11y.openMenu": "Abrir menú",
  "a11y.closeMenu": "Cerrar menú",
  // landing
  "landing.getStarted": "Empezar",
  "landing.badge": "Hecho para quienes aprenden idiomas",
  "landing.heroPre": "Tu camino personalizado hacia un",
  "landing.heroEm": "nuevo idioma",
  "landing.sub":
    "SkillPath AI crea planes de estudio adaptativos, semana a semana, para español, inglés, francés, italiano, alemán, griego antiguo y latín — priorizando la práctica real y recursos gratuitos.",
  "landing.ctaBuild": "Crear mi ruta de aprendizaje",
  "landing.ctaDemo": "Ver un plan de ejemplo",
  "landing.chip1": "Input comprensible",
  "landing.chip2": "Gratis y económico",
  "landing.chip3": "Se adapta a tu ritmo",
  "landing.howItWorks": "Cómo funciona",
  "step1.title": "Cuéntanos sobre ti",
  "step1.text": "Tu idioma, nivel, objetivo, tiempo semanal y estilo de aprendizaje.",
  "step2.title": "Recibe un plan semana a semana",
  "step2.text": "Vocabulario, gramática, escucha y habla con recursos reales.",
  "step3.title": "Califica y adapta",
  "step3.text": "La IA reajusta las próximas semanas según tu feedback.",
  // onboarding
  "onb.s1.title": "¿Qué idioma quieres aprender?",
  "onb.s1.sub": "Elige uno o escribe el tuyo.",
  "onb.s1.placeholder": "O escribe otro idioma…",
  "onb.s2.title": "Tu nivel y objetivo",
  "onb.s2.sub": "Sé honesto: ajustamos el ritmo a ti.",
  "onb.goal": "Tu objetivo",
  "onb.goal.placeholder": "ej. Mantener una conversación en 3 meses, leer noticias, aprobar B1…",
  "onb.takeTest": "¿No sabes tu nivel? Haz una prueba de nivelación",
  "onb.tested": "Nivel estimado por la prueba: {level}",
  "onb.s3.title": "Tiempo y estilo de aprendizaje",
  "onb.s3.sub": "Cómo aprendes mejor.",
  "onb.weeklyTime": "Tiempo semanal: {h}-{h2} horas",
  "onb.style": "Estilo de aprendizaje",
  "onb.s4.title": "Presupuesto de recursos",
  "onb.s4.sub": "Por defecto, gratis y bajo costo.",
  "onb.s5.title": "Listo para crear tu ruta",
  "onb.s5.sub": "Revisa y genera.",
  "review.language": "Idioma",
  "review.level": "Nivel",
  "review.goal": "Objetivo",
  "review.time": "Tiempo",
  "review.style": "Estilo",
  "review.resources": "Recursos",
  "onb.timeShort": "{h}-{h2} h/semana",
  "onb.demoLink": "O explora un plan de ejemplo al instante (sin usar IA)",
  "onb.back": "Atrás",
  "onb.next": "Siguiente",
  "onb.build": "Crear mi ruta de aprendizaje",
  "onb.gen.title": "Creando tu plan de {skill}…",
  "onb.gen.sub": "Organizando vocabulario, gramática, escucha y práctica oral para ti.",
  "onb.gen.draft": "Borrador de {n} de {total} semanas…",
  "onb.gen.hint": "Esto puede tardar 1-2 minutos.",
  "onb.error": "La IA está trabajando. Inténtalo de nuevo.",
  // placement
  "place.loading.title": "Preparando tu prueba de {skill}…",
  "place.loading.sub": "La IA está creando las preguntas. Puede tardar ~1 minuto.",
  "place.back": "Volver",
  "place.retry": "Reintentar",
  "place.resultPre": "Tu nivel estimado es",
  "place.resultNote": "Es una estimación rápida; podrás ajustarla manualmente si no coincide.",
  "place.repeat": "Repetir",
  "place.use": "Usar este nivel",
  "place.cancel": "Cancelar prueba",
  "place.q": "Pregunta {n} de {total}",
  "place.noQuestions": "Sin preguntas.",
  "place.failed": "No se pudo generar la prueba.",
  // dashboard
  "dash.loading": "Cargando…",
  "dash.noPlan": "Aún no hay plan. Redirigiendo…",
  "dash.journey": "Tu camino de {skill}",
  "dash.meta": "Plan de {total} semanas · {hrs} h/semana · {cost}",
  "dash.estFinish": "Fin estimado {date}",
  "dash.focus": "Foco ahora · Semana {week} ({done}/{total} hechos)",
  "dash.markDone": "Marcar hecho",
  "dash.openWeek": "Abrir semana",
  "dash.allDone": "¡Completaste todas las semanas! 🎉",
  "dash.allDoneSub": "Envía feedback abajo para ampliar o afinar tu ruta.",
  "dash.aboutYou": "Sobre ti",
  "dash.timeline": "Tu ruta de aprendizaje personalizada",
  "dash.progress": "Tu progreso",
  "dash.completed": "Completadas",
  "dash.inProgress": "En curso",
  "dash.notStarted": "Sin empezar",
  "dash.nextUp": "A continuación — Vista previa de la semana {week}",
  "dash.viewFullWeek": "Ver semana completa",
  "dash.tipBold": "¡Sé constante!",
  "dash.tipText": "30 min al día rinden más que 4 horas una vez por semana.",
  // week card / detail
  "common.week": "Semana",
  "wk.adjusted": "Ajustada",
  "wk.markUndone": "Marcar semana como no hecha",
  "wk.markDone": "Marcar toda la semana",
  "wk.more": "más",
  "wk.hide": "Ocultar",
  "wk.expand": "Ver más",
  "wk.viewFull": "Ver semana completa →",
  "wk.objective": "Objetivo:",
  "detail.back": "Volver a la ruta",
  "detail.notFound": "Semana no encontrada.",
  "detail.total": "Total",
  "detail.topicsDone": "{done}/{total} temas hechos",
  "detail.milestone": "Al final de esta semana: {m}",
  "detail.completedUndo": "Completada — marcar como no hecha",
  "detail.markAll": "Marcar todos los temas",
  // feedback
  "fb.title": "Califica esta semana (Semana {week})",
  "fb.sub": "Tu feedback reajusta las próximas semanas.",
  "fb.placeholder": "Sugiere mejoras…",
  "fb.adapting": "Adaptando tu plan…",
  "fb.submit": "Enviar feedback",
  "fb.failed": "La adaptación falló. No se cambió nada.",
  // banner
  "banner.default": "SkillPath AI ha ajustado tus próximas semanas según tu feedback.",
  // progress page
  "prog.title": "Progreso y feedback",
  "prog.weeksDone": "{done} de {total} semanas hechas",
  "prog.inProgress": "En curso: {n}",
  "prog.notStarted": "Sin empezar: {n}",
  "prog.weekly": "Avance semanal",
  "prog.history": "Historial de feedback",
  "prog.noFeedback": "Aún no has enviado feedback.",
  "prog.timeline": "Cronología del idioma",
  // resources
  "res.title": "Biblioteca de recursos",
  "res.sub": "Todos los enlaces de tu plan de {skill}.",
  "res.search": "Buscar recursos…",
  "res.all": "Todos",
  "res.open": "Abrir",
  "res.none": "No hay recursos que coincidan.",
  // settings
  "set.title": "Ajustes",
  "set.prefs": "Preferencias",
  "set.prefsSub": "Editar esto regenera tu plan.",
  "set.goal": "Objetivo",
  "set.level": "Nivel",
  "set.resourcePref": "Preferencia de recursos",
  "set.regenerate": "Regenerar plan",
  "set.danger": "Zona de peligro",
  "set.export": "Exportar plan (JSON)",
  "set.delete": "Eliminar plan",
  "set.confirmRegen":
    "Regenerar reconstruirá tu plan y reiniciará el progreso. Esto llama a la IA (tiene costo). ¿Continuar?",
  "set.confirmDelete": "¿Eliminar tu plan de forma permanente?",
  "set.failed": "Falló.",
  // shared empty states
  "empty.noPlan": "Aún no hay plan.",
  "empty.createPath": "Crea tu ruta de aprendizaje →",
  // interface language switcher
  "ui.language": "Idioma de la app",
};

const en: Dict = {
  "nav.dashboard": "Dashboard",
  "nav.resources": "Resources",
  "nav.progress": "Progress & Feedback",
  "nav.settings": "Settings",
  "sidebar.learner": "Learner",
  "sidebar.freePlan": "Free plan",
  "a11y.openMenu": "Open menu",
  "a11y.closeMenu": "Close menu",
  "landing.getStarted": "Get started",
  "landing.badge": "Built for language learners",
  "landing.heroPre": "Your personalized path to a",
  "landing.heroEm": "new language",
  "landing.sub":
    "SkillPath AI builds adaptive, week-by-week study plans for Spanish, English, French, Italian, German, Ancient Greek and Latin — prioritizing real practice and free resources.",
  "landing.ctaBuild": "Build my learning path",
  "landing.ctaDemo": "See a sample plan",
  "landing.chip1": "Comprehensible input",
  "landing.chip2": "Free & low-cost",
  "landing.chip3": "Adapts to your pace",
  "landing.howItWorks": "How it works",
  "step1.title": "Tell us about you",
  "step1.text": "Your language, level, goal, weekly time and learning style.",
  "step2.title": "Get a week-by-week plan",
  "step2.text": "Vocabulary, grammar, listening and speaking tied to real resources.",
  "step3.title": "Rate & adapt",
  "step3.text": "The AI re-tunes upcoming weeks based on your feedback.",
  "onb.s1.title": "Which language do you want to learn?",
  "onb.s1.sub": "Pick one or type your own.",
  "onb.s1.placeholder": "Or type another language…",
  "onb.s2.title": "Your level & goal",
  "onb.s2.sub": "Be honest — we tailor the pace to you.",
  "onb.goal": "Your goal",
  "onb.goal.placeholder": "e.g. Hold a conversation in 3 months, read the news, pass B1…",
  "onb.takeTest": "Not sure of your level? Take a placement test",
  "onb.tested": "Level estimated by the test: {level}",
  "onb.s3.title": "Time & learning style",
  "onb.s3.sub": "How you learn best.",
  "onb.weeklyTime": "Weekly time: {h}-{h2} hours",
  "onb.style": "Learning style",
  "onb.s4.title": "Resource budget",
  "onb.s4.sub": "We default to free & low-cost.",
  "onb.s5.title": "Ready to build your path",
  "onb.s5.sub": "Review and generate.",
  "review.language": "Language",
  "review.level": "Level",
  "review.goal": "Goal",
  "review.time": "Time",
  "review.style": "Style",
  "review.resources": "Resources",
  "onb.timeShort": "{h}-{h2} hrs/week",
  "onb.demoLink": "Or explore a sample plan instantly (no AI call)",
  "onb.back": "Back",
  "onb.next": "Next",
  "onb.build": "Build my learning path",
  "onb.gen.title": "Building your {skill} plan…",
  "onb.gen.sub": "Sequencing vocabulary, grammar, listening and speaking practice for you.",
  "onb.gen.draft": "Drafted {n} of {total} weeks…",
  "onb.gen.hint": "This can take 1-2 minutes.",
  "onb.error": "Our AI is thinking hard. Please try again.",
  "place.loading.title": "Preparing your {skill} test…",
  "place.loading.sub": "The AI is writing the questions. This can take ~1 minute.",
  "place.back": "Back",
  "place.retry": "Retry",
  "place.resultPre": "Your estimated level is",
  "place.resultNote": "It's a quick estimate; you can adjust it manually if it doesn't fit.",
  "place.repeat": "Retake",
  "place.use": "Use this level",
  "place.cancel": "Cancel test",
  "place.q": "Question {n} of {total}",
  "place.noQuestions": "No questions.",
  "place.failed": "Couldn't generate the test.",
  "dash.loading": "Loading…",
  "dash.noPlan": "No plan yet. Redirecting…",
  "dash.journey": "Your {skill} journey",
  "dash.meta": "{total}-week plan · {hrs} hrs/week · {cost}",
  "dash.estFinish": "Est. finish {date}",
  "dash.focus": "Focus now · Week {week} ({done}/{total} done)",
  "dash.markDone": "Mark done",
  "dash.openWeek": "Open week",
  "dash.allDone": "All planned weeks complete 🎉",
  "dash.allDoneSub": "Submit feedback below to extend or refine your path.",
  "dash.aboutYou": "About you",
  "dash.timeline": "Your personalized learning path",
  "dash.progress": "Your progress",
  "dash.completed": "Completed",
  "dash.inProgress": "In progress",
  "dash.notStarted": "Not started",
  "dash.nextUp": "Next up — Week {week} preview",
  "dash.viewFullWeek": "View full week",
  "dash.tipBold": "Stay consistent!",
  "dash.tipText": "30 min daily beats 4 hours once a week.",
  "common.week": "Week",
  "wk.adjusted": "Adjusted",
  "wk.markUndone": "Mark week not done",
  "wk.markDone": "Mark whole week done",
  "wk.more": "more",
  "wk.hide": "Hide",
  "wk.expand": "Expand",
  "wk.viewFull": "View full week →",
  "wk.objective": "Objective:",
  "detail.back": "Back to learning path",
  "detail.notFound": "Week not found.",
  "detail.total": "Total",
  "detail.topicsDone": "{done}/{total} topics done",
  "detail.milestone": "By the end of this week: {m}",
  "detail.completedUndo": "Completed — mark undone",
  "detail.markAll": "Mark all topics complete",
  "fb.title": "Rate this week (Week {week})",
  "fb.sub": "Your feedback re-tunes upcoming weeks.",
  "fb.placeholder": "Suggest improvements…",
  "fb.adapting": "Adapting your plan…",
  "fb.submit": "Submit feedback",
  "fb.failed": "Adaptation failed. Nothing was changed.",
  "banner.default": "SkillPath AI has adjusted your upcoming weeks based on your feedback.",
  "prog.title": "Progress & Feedback",
  "prog.weeksDone": "{done} of {total} weeks done",
  "prog.inProgress": "In progress: {n}",
  "prog.notStarted": "Not started: {n}",
  "prog.weekly": "Weekly completion",
  "prog.history": "Feedback history",
  "prog.noFeedback": "No feedback submitted yet.",
  "prog.timeline": "Language timeline",
  "res.title": "Resource library",
  "res.sub": "Every link across your {skill} plan.",
  "res.search": "Search resources…",
  "res.all": "All",
  "res.open": "Open",
  "res.none": "No resources match.",
  "set.title": "Settings",
  "set.prefs": "Preferences",
  "set.prefsSub": "Editing these regenerates your plan.",
  "set.goal": "Goal",
  "set.level": "Level",
  "set.resourcePref": "Resource preference",
  "set.regenerate": "Regenerate plan",
  "set.danger": "Danger zone",
  "set.export": "Export plan (JSON)",
  "set.delete": "Delete plan",
  "set.confirmRegen":
    "Regenerating will rebuild your plan and reset progress. This calls the AI (costs apply). Continue?",
  "set.confirmDelete": "Delete your plan permanently?",
  "set.failed": "Failed.",
  "empty.noPlan": "No plan yet.",
  "empty.createPath": "Create your learning path →",
  "ui.language": "App language",
};

const dicts: Record<Locale, Dict> = { es, en };

export function translate(
  locale: Locale,
  key: string,
  vars?: Record<string, string | number>
): string {
  let s = dicts[locale]?.[key] ?? es[key] ?? key;
  if (vars) {
    for (const k of Object.keys(vars)) {
      s = s.replace(new RegExp(`\\{${k}\\}`, "g"), String(vars[k]));
    }
  }
  return s;
}

// ---- Enum label maps per locale ----
export const levelLabelsByLocale: Record<Locale, Record<Level, string>> = {
  es: {
    A1: "A1 · Elemental",
    A2: "A2 · Principiante",
    B1: "B1 · Intermedio",
    B2: "B2 · Intermedio-alto",
    C1: "C1 · Avanzado",
    C2: "C2 · Profesional",
  },
  en: {
    A1: "A1 · Elementary",
    A2: "A2 · Beginner",
    B1: "B1 · Intermediate",
    B2: "B2 · Upper-intermediate",
    C1: "C1 · Advanced",
    C2: "C2 · Proficient",
  },
};

export const styleLabelsByLocale: Record<Locale, Record<LearningStyle, string>> = {
  es: { Conversation: "Conversación", Listening: "Escucha", Reading: "Lectura", "Apps & games": "Apps y juegos" },
  en: { Conversation: "Conversation", Listening: "Listening", Reading: "Reading", "Apps & games": "Apps & games" },
};

export const prefLabelsByLocale: Record<Locale, Record<ResourcePreference, string>> = {
  es: { "Free only": "Solo gratis", "Free + Low cost": "Gratis + bajo costo", Any: "Cualquiera" },
  en: { "Free only": "Free only", "Free + Low cost": "Free + low cost", Any: "Any" },
};

export const topicTypeLabelsByLocale: Record<Locale, Record<TopicType, string>> = {
  es: {
    Vocabulary: "Vocabulario",
    Grammar: "Gramática",
    Listening: "Escucha",
    Speaking: "Habla",
    Reading: "Lectura",
    Writing: "Escritura",
    Pronunciation: "Pronunciación",
    Culture: "Cultura",
    Review: "Repaso",
    Assessment: "Evaluación",
  },
  en: {
    Vocabulary: "Vocabulary",
    Grammar: "Grammar",
    Listening: "Listening",
    Speaking: "Speaking",
    Reading: "Reading",
    Writing: "Writing",
    Pronunciation: "Pronunciation",
    Culture: "Culture",
    Review: "Review",
    Assessment: "Assessment",
  },
};

export const resourceTypeLabelsByLocale: Record<Locale, Record<ResourceType, string>> = {
  es: { Video: "Video", Podcast: "Podcast", Article: "Artículo", App: "App", Interactive: "Interactivo", Flashcards: "Tarjetas" },
  en: { Video: "Video", Podcast: "Podcast", Article: "Article", App: "App", Interactive: "Interactive", Flashcards: "Flashcards" },
};

export const costLabelsByLocale: Record<Locale, Record<Cost, string>> = {
  es: { Free: "Gratis", Low: "Bajo", Premium: "Premium" },
  en: { Free: "Free", Low: "Low", Premium: "Premium" },
};

export const statusLabelsByLocale: Record<Locale, Record<WeekStatus, string>> = {
  es: { completed: "Completada", in_progress: "En curso", not_started: "Sin empezar" },
  en: { completed: "Completed", in_progress: "In progress", not_started: "Not started" },
};

export const feedbackLabelsByLocale: Record<Locale, Record<Difficulty, string>> = {
  es: { "Too Easy": "Muy fácil", "Just Right": "Adecuado", "Too Hard": "Muy difícil" },
  en: { "Too Easy": "Too easy", "Just Right": "Just right", "Too Hard": "Too hard" },
};

export const difficultyLabelsByLocale: Record<Locale, Record<WeekDifficulty, string>> = {
  es: { Beginner: "Principiante", Intermediate: "Intermedio", Advanced: "Avanzado" },
  en: { Beginner: "Beginner", Intermediate: "Intermediate", Advanced: "Advanced" },
};

/** Hook used by client components to read the locale, translate, and get labels. */
export function useI18n() {
  const { state, dispatch } = usePlan();
  const locale = state.locale;
  return {
    locale,
    setLocale: (l: Locale) => dispatch({ type: "SET_LOCALE", payload: l }),
    t: (key: string, vars?: Record<string, string | number>) => translate(locale, key, vars),
    L: {
      level: levelLabelsByLocale[locale],
      style: styleLabelsByLocale[locale],
      pref: prefLabelsByLocale[locale],
      topicType: topicTypeLabelsByLocale[locale],
      resourceType: resourceTypeLabelsByLocale[locale],
      cost: costLabelsByLocale[locale],
      status: statusLabelsByLocale[locale],
      feedback: feedbackLabelsByLocale[locale],
      difficulty: difficultyLabelsByLocale[locale],
    },
  };
}
