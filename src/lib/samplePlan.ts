// Demo mode — a realistic, fully-formed sample plan so users can explore the
// product instantly without spending an LLM call. Profile + plan are consistent.
import type { Plan, UserProfile } from "./types";

export const sampleProfile: UserProfile = {
  skill: "Welding",
  current_level: "Beginner",
  goal: "Get job-ready in 6 months",
  time_available: "6-7 hours/week",
  learning_style: ["Hands-on", "Videos"],
  resource_preference: "Free + Low cost",
};

const yt = (title: string, url = "") =>
  ({ title, url, type: "Video", cost: "Free", preferred: true }) as const;
const guide = (title: string) =>
  ({ title, url: "", type: "Practice Guide", cost: "Free", preferred: false }) as const;

export const samplePlan: Plan = {
  plan_id: "demo-welding-0001",
  skill: "Welding",
  total_weeks: 8,
  weekly_time_hours: 6.5,
  estimated_total_cost: "$0 (all free resources)",
  adaptation_note: "",
  profile: sampleProfile,
  weeks: [
    {
      week_number: 1,
      title: "Safety & Welding Basics",
      objective: "Set up a safe workspace and understand core welding safety gear.",
      difficulty: "Beginner",
      total_time_minutes: 390,
      milestone: "You can identify hazards and gear up safely before any weld.",
      topics: [
        {
          name: "PPE, fumes & fire safety",
          type: "Safety",
          estimated_minutes: 90,
          resources: [yt("Welding Safety 101 — Welding Tips and Tricks"), guide("OSHA welding fact sheet")],
        },
        {
          name: "Tour of welding processes (MIG/TIG/Stick)",
          type: "Theory",
          estimated_minutes: 120,
          resources: [yt("MIG vs TIG vs Stick explained")],
        },
        {
          name: "Set up a MIG machine and strike your first bead",
          type: "Hands-On Practice",
          estimated_minutes: 180,
          resources: [guide("Manufacturer MIG setup manual")],
        },
      ],
    },
    {
      week_number: 2,
      title: "Running Clean MIG Beads",
      objective: "Produce consistent straight beads on flat plate.",
      difficulty: "Beginner",
      total_time_minutes: 400,
      milestone: "You can lay a straight, uniform bead on flat steel.",
      topics: [
        {
          name: "Voltage, wire speed & travel angle",
          type: "Theory",
          estimated_minutes: 80,
          resources: [yt("Dialing in your MIG settings")],
        },
        {
          name: "Stringer beads on flat plate",
          type: "Hands-On Practice",
          estimated_minutes: 200,
          resources: [guide("Bead practice worksheet")],
        },
        {
          name: "Self-assessment: read your bead",
          type: "Assessment",
          estimated_minutes: 120,
          resources: [yt("How to read a weld bead")],
        },
      ],
    },
    {
      week_number: 3,
      title: "Joints & Positions",
      objective: "Weld lap and T-joints in the flat position.",
      difficulty: "Beginner",
      total_time_minutes: 410,
      milestone: "You can complete clean lap and T-joints in flat position.",
      topics: [
        {
          name: "Joint types & fit-up",
          type: "Demonstration",
          estimated_minutes: 90,
          resources: [yt("Weld joint types demo")],
        },
        {
          name: "Lap & T-joint practice",
          type: "Hands-On Practice",
          estimated_minutes: 220,
          resources: [guide("Joint practice checklist")],
        },
        {
          name: "Review: distortion & how to control it",
          type: "Review",
          estimated_minutes: 100,
          resources: [yt("Controlling weld distortion")],
        },
      ],
    },
    {
      week_number: 4,
      title: "Penetration & Defects",
      objective: "Achieve full penetration and recognize common defects.",
      difficulty: "Intermediate",
      total_time_minutes: 420,
      milestone: "You can diagnose porosity, undercut and lack of fusion.",
      topics: [
        {
          name: "Penetration & heat control",
          type: "Theory",
          estimated_minutes: 90,
          resources: [yt("Getting full penetration")],
        },
        {
          name: "Defect identification lab",
          type: "Hands-On Practice",
          estimated_minutes: 210,
          resources: [guide("Weld defect photo guide")],
        },
        {
          name: "Project: butt joint with full penetration",
          type: "Project",
          estimated_minutes: 120,
          resources: [],
        },
      ],
    },
    {
      week_number: 5,
      title: "Vertical & Horizontal Welds",
      objective: "Weld out of the flat position with control.",
      difficulty: "Intermediate",
      total_time_minutes: 410,
      milestone: "You can run vertical-up beads without excessive sag.",
      topics: [
        {
          name: "Gravity, technique & gun angle out of position",
          type: "Demonstration",
          estimated_minutes: 90,
          resources: [yt("Vertical up welding technique")],
        },
        {
          name: "Vertical & horizontal bead practice",
          type: "Hands-On Practice",
          estimated_minutes: 230,
          resources: [guide("Out-of-position drill sheet")],
        },
        {
          name: "Review your week-5 coupons",
          type: "Review",
          estimated_minutes: 90,
          resources: [],
        },
      ],
    },
    {
      week_number: 6,
      title: "Intro to Stick Welding (SMAW)",
      objective: "Strike and maintain an arc with stick electrodes.",
      difficulty: "Intermediate",
      total_time_minutes: 400,
      milestone: "You can run a stable stick bead with 6013 rod.",
      topics: [
        {
          name: "Stick fundamentals & electrode types",
          type: "Theory",
          estimated_minutes: 90,
          resources: [yt("Stick welding for beginners")],
        },
        {
          name: "Striking the arc & running 6013",
          type: "Hands-On Practice",
          estimated_minutes: 220,
          resources: [guide("Stick electrode quick reference")],
        },
        {
          name: "Safety refresher: stick-specific hazards",
          type: "Safety",
          estimated_minutes: 90,
          resources: [],
        },
      ],
    },
    {
      week_number: 7,
      title: "Reading Symbols & Blueprints",
      objective: "Interpret basic weld symbols on shop drawings.",
      difficulty: "Intermediate",
      total_time_minutes: 380,
      milestone: "You can read a weld symbol and produce what it specifies.",
      topics: [
        {
          name: "Weld symbols decoded",
          type: "Theory",
          estimated_minutes: 120,
          resources: [yt("Weld symbols explained")],
        },
        {
          name: "Build from a drawing",
          type: "Project",
          estimated_minutes: 180,
          resources: [guide("Sample fabrication drawing")],
        },
        {
          name: "Quiz: symbol recognition",
          type: "Assessment",
          estimated_minutes: 80,
          resources: [],
        },
      ],
    },
    {
      week_number: 8,
      title: "Capstone Fabrication Project",
      objective: "Plan, fabricate and inspect a small steel project end-to-end.",
      difficulty: "Advanced",
      total_time_minutes: 430,
      milestone: "You can take a project from drawing to finished, inspected weldment.",
      topics: [
        {
          name: "Plan cuts, fit-up & sequence",
          type: "Theory",
          estimated_minutes: 90,
          resources: [guide("Project planning template")],
        },
        {
          name: "Fabricate the project",
          type: "Project",
          estimated_minutes: 260,
          resources: [],
        },
        {
          name: "Final inspection & self-grade",
          type: "Assessment",
          estimated_minutes: 80,
          resources: [yt("Visual weld inspection basics")],
        },
      ],
    },
  ],
};
