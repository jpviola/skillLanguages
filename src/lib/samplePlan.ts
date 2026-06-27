// Demo mode — a realistic, fully-formed sample plan so users can explore the
// product instantly without spending an LLM call. Profile + plan are consistent.
import type { Plan, UserProfile } from "./types";

export const sampleProfile: UserProfile = {
  skill: "Spanish",
  current_level: "Beginner",
  goal: "Hold a basic conversation in 3 months",
  time_available: "6-7 hours/week",
  learning_style: ["Conversation", "Listening"],
  resource_preference: "Free + Low cost",
};

const video = (title: string, url = "") =>
  ({ title, url, type: "Video", cost: "Free", preferred: true }) as const;
const app = (title: string) =>
  ({ title, url: "", type: "App", cost: "Free", preferred: false }) as const;
const cards = (title: string) =>
  ({ title, url: "", type: "Flashcards", cost: "Free", preferred: false }) as const;

export const samplePlan: Plan = {
  plan_id: "demo-spanish-0001",
  skill: "Spanish",
  total_weeks: 8,
  weekly_time_hours: 6.5,
  estimated_total_cost: "$0 (all free resources)",
  adaptation_note: "",
  profile: sampleProfile,
  weeks: [
    {
      week_number: 1,
      title: "Sounds, Greetings & How to Study",
      objective: "Pronounce Spanish vowels clearly and greet people confidently.",
      difficulty: "Beginner",
      total_time_minutes: 390,
      milestone: "You can introduce yourself and exchange greetings out loud.",
      topics: [
        {
          name: "The 5 Spanish vowels & the alphabet",
          type: "Pronunciation",
          estimated_minutes: 90,
          resources: [video("Spanish pronunciation for beginners"), app("Forvo — hear native pronunciation")],
        },
        {
          name: "Greetings & introductions (hola, ¿cómo estás?, me llamo…)",
          type: "Speaking",
          estimated_minutes: 120,
          resources: [video("Language Transfer — Complete Spanish (track 1)")],
        },
        {
          name: "Your first 50 high-frequency words",
          type: "Vocabulary",
          estimated_minutes: 90,
          resources: [cards("Anki — Spanish top 1000 deck")],
        },
        {
          name: "Listen: slow Spanish for absolute beginners",
          type: "Listening",
          estimated_minutes: 90,
          resources: [video("Dreaming Spanish — Superbeginner")],
        },
      ],
    },
    {
      week_number: 2,
      title: "Ser, Estar & Talking About Yourself",
      objective: "Describe who you are and how you feel using ser and estar.",
      difficulty: "Beginner",
      total_time_minutes: 400,
      milestone: "You can say where you're from and how you're feeling.",
      topics: [
        {
          name: "Ser vs estar in context",
          type: "Grammar",
          estimated_minutes: 90,
          resources: [video("Ser vs estar explained simply")],
        },
        {
          name: "Speaking drill: describe yourself",
          type: "Speaking",
          estimated_minutes: 130,
          resources: [app("Pimsleur or a tutor on iTalki (low cost)")],
        },
        {
          name: "Numbers 0–100 & telling your age",
          type: "Vocabulary",
          estimated_minutes: 90,
          resources: [cards("Anki — numbers deck")],
        },
        {
          name: "Listen & repeat: short self-introductions",
          type: "Listening",
          estimated_minutes: 90,
          resources: [video("Coffee Break Spanish — Season 1")],
        },
      ],
    },
    {
      week_number: 3,
      title: "Present Tense & Daily Routines",
      objective: "Talk about what you do every day with regular -ar/-er/-ir verbs.",
      difficulty: "Beginner",
      total_time_minutes: 405,
      milestone: "You can describe your daily routine in the present tense.",
      topics: [
        {
          name: "Regular present-tense conjugation",
          type: "Grammar",
          estimated_minutes: 100,
          resources: [video("Present tense regular verbs")],
        },
        {
          name: "Write: a short paragraph about your day",
          type: "Writing",
          estimated_minutes: 110,
          resources: [app("LanguageTool — free grammar checker")],
        },
        {
          name: "Daily-life vocabulary (home, work, food)",
          type: "Vocabulary",
          estimated_minutes: 95,
          resources: [cards("Anki — daily life deck")],
        },
        {
          name: "Review week 1–2 + recycle vocabulary",
          type: "Review",
          estimated_minutes: 100,
          resources: [],
        },
      ],
    },
    {
      week_number: 4,
      title: "Asking Questions & Getting Around",
      objective: "Ask and answer practical questions in shops and on the street.",
      difficulty: "Beginner",
      total_time_minutes: 410,
      milestone: "You can ask for directions, prices, and order food.",
      topics: [
        {
          name: "Question words (qué, dónde, cuánto, cómo)",
          type: "Grammar",
          estimated_minutes: 90,
          resources: [video("Spanish question words")],
        },
        {
          name: "Roleplay: ordering at a café",
          type: "Speaking",
          estimated_minutes: 140,
          resources: [app("iTalki conversation (low cost)")],
        },
        {
          name: "Read: a simple menu and signs",
          type: "Reading",
          estimated_minutes: 90,
          resources: [],
        },
        {
          name: "Listen: short market dialogues",
          type: "Listening",
          estimated_minutes: 90,
          resources: [video("Dreaming Spanish — Beginner")],
        },
      ],
    },
    {
      week_number: 5,
      title: "The Past: Talking About Yesterday",
      objective: "Tell simple stories about what happened using the preterite.",
      difficulty: "Intermediate",
      total_time_minutes: 415,
      milestone: "You can recount what you did over the weekend.",
      topics: [
        {
          name: "Preterite of common regular & irregular verbs",
          type: "Grammar",
          estimated_minutes: 110,
          resources: [video("Preterite tense made easy")],
        },
        {
          name: "Speaking: tell a 1-minute story about your weekend",
          type: "Speaking",
          estimated_minutes: 130,
          resources: [],
        },
        {
          name: "Connectors & time expressions (ayer, luego, después)",
          type: "Vocabulary",
          estimated_minutes: 85,
          resources: [cards("Anki — connectors deck")],
        },
        {
          name: "Listen: a short personal anecdote",
          type: "Listening",
          estimated_minutes: 90,
          resources: [video("Coffee Break Spanish")],
        },
      ],
    },
    {
      week_number: 6,
      title: "Culture & Real Conversations",
      objective: "Understand cultural context and hold a longer exchange.",
      difficulty: "Intermediate",
      total_time_minutes: 405,
      milestone: "You can keep a 5-minute conversation going on familiar topics.",
      topics: [
        {
          name: "Spanish-speaking cultures & politeness (tú vs usted)",
          type: "Culture",
          estimated_minutes: 80,
          resources: [video("Tú vs usted explained")],
        },
        {
          name: "Conversation practice with a partner or tutor",
          type: "Speaking",
          estimated_minutes: 150,
          resources: [app("iTalki / Tandem language exchange")],
        },
        {
          name: "Read: a short blog post or comic",
          type: "Reading",
          estimated_minutes: 90,
          resources: [],
        },
        {
          name: "Review weeks 3–5",
          type: "Review",
          estimated_minutes: 85,
          resources: [],
        },
      ],
    },
    {
      week_number: 7,
      title: "Future Plans & Opinions",
      objective: "Express plans and opinions naturally.",
      difficulty: "Intermediate",
      total_time_minutes: 410,
      milestone: "You can talk about your plans and say what you think.",
      topics: [
        {
          name: "Near future (ir a + infinitive) & giving opinions",
          type: "Grammar",
          estimated_minutes: 100,
          resources: [video("Ir a + infinitive")],
        },
        {
          name: "Write: a message planning a weekend with a friend",
          type: "Writing",
          estimated_minutes: 110,
          resources: [app("LanguageTool")],
        },
        {
          name: "Opinion & feeling vocabulary",
          type: "Vocabulary",
          estimated_minutes: 90,
          resources: [cards("Anki — opinions deck")],
        },
        {
          name: "Listen: a short podcast for learners",
          type: "Listening",
          estimated_minutes: 90,
          resources: [video("Españolistos podcast")],
        },
      ],
    },
    {
      week_number: 8,
      title: "Capstone: Hold a Real Conversation",
      objective: "Combine everything in an unscripted conversation and self-assess.",
      difficulty: "Intermediate",
      total_time_minutes: 420,
      milestone: "You can introduce yourself, ask questions, and chat for 10 minutes.",
      topics: [
        {
          name: "Prep: review key phrases & questions",
          type: "Review",
          estimated_minutes: 90,
          resources: [],
        },
        {
          name: "Live 10-minute conversation with a tutor or partner",
          type: "Speaking",
          estimated_minutes: 180,
          resources: [app("iTalki lesson (low cost)")],
        },
        {
          name: "Self-assessment & next-steps checklist",
          type: "Assessment",
          estimated_minutes: 80,
          resources: [],
        },
        {
          name: "Watch a short native video with subtitles",
          type: "Listening",
          estimated_minutes: 70,
          resources: [video("Easy Spanish — street interviews")],
        },
      ],
    },
  ],
};
