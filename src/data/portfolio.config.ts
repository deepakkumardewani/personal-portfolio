import { z } from "zod";

export const RoleSchema = z.object({
  title: z.string(),
  period: z.string(),
  location: z.string(),
  highlights: z.array(z.string()),
});

export const ProjectSchema = z.object({
  id: z.string(),
  title: z.string(),
  tagline: z.string(),
  description: z.string(),
  stack: z.array(z.string()),
  url: z.string().url().optional(),
  repo: z.string().url().optional(),
  image: z.string(),
  accentColor: z.string(),
  year: z.number(),
});

export const ExperienceSchema = z.object({
  company: z.string(),
  roles: z.array(RoleSchema),
});

export const SkillGroupSchema = z.object({
  label: z.string(),
  skills: z.array(z.string()),
});

export const AwardSchema = z.object({
  title: z.string(),
  event: z.string(),
  date: z.string(),
  location: z.string(),
});

const EducationSchema = z.object({
  degree: z.string(),
  institution: z.string(),
  location: z.string(),
  period: z.string(),
});

const PortfolioConfigSchema = z.object({
  name: z.string(),
  title: z.string(),
  tagline: z.string(),
  contactCta: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  location: z.string(),
  photo: z.string().optional(),
  links: z.object({
    linkedin: z.string().url(),
    github: z.string().url(),
    website: z.string().url().optional(),
  }),
  projects: z.array(ProjectSchema),
  experience: z.array(ExperienceSchema),
  award: AwardSchema,
  skillGroups: z.array(SkillGroupSchema),
  education: EducationSchema,
});

export const portfolio = PortfolioConfigSchema.parse({
  name: "Deepak Kumar Dewani",
  title: "AI Lead & Senior Frontend Engineer",
  tagline:
    "8+ years | Building performant & scalable applications | Driving AI-assisted development | Performance Expert",
  contactCta: "GET IN TOUCH",
  email: "deepakkumardewani@gmail.com",
  phone: "+91-8308887772",
  location: "Mumbai, India",
  photo: "/photo.jpg",
  links: {
    linkedin: "https://linkedin.com/in/deepakkumardewani",
    github: "https://github.com/deepakkumardewani",
    website: "https://deepakd.me",
  },
  projects: [
    {
      id: "requestr",
      title: "Requestr",
      tagline: "A Postman alternative that lives entirely in your browser.",
      description:
        "Fully browser-native API testing tool with zero backend. All data persisted in IndexedDB, requests proxied via server-side route to eliminate CORS entirely. Multi-tab workspace with collections, drag-and-drop, environment variable interpolation, cURL import/export, and Postman v2.1-compatible collection format.",
      stack: [
        "Next.js 15",
        "React 19",
        "Tailwind",
        "Zustand",
        "IndexedDB",
        "CodeMirror 6",
        "shadcn/ui",
      ],
      url: "https://requestr-api.vercel.app",
      image: "/projects/requestr.png",
      accentColor: "#6366f1",
      year: 2024,
    },
    {
      id: "elementum",
      title: "Elementum",
      tagline: "The periodic table, rebuilt for people who care about craft.",
      description:
        "High-performance interactive periodic table with real-time search, dynamic heatmaps, 3D atom visualisations, and side-by-side element comparison. Lighthouse score of 100 and LCP under 200ms.",
      stack: ["Vue 3", "TypeScript", "Vite", "Three.js", "Pinia", "ApexCharts"],
      url: "https://elementum-periodic-table.vercel.app",
      image: "/projects/elementum.png",
      accentColor: "#10b981",
      year: 2023,
    },
    {
      id: "visual-ai",
      title: "Visual AI",
      tagline: "Production AI SaaS. Auth, payments, queues — the full stack.",
      description:
        "Production AI SaaS with Clerk auth and Razorpay payments. Node.js backend with Redis job queues and Docker CI/CD. Achieved 99.9% uptime.",
      stack: ["Vue 3", "TypeScript", "Node.js", "Redis", "Razorpay", "Docker"],
      url: "https://visual-ai.app",
      image: "/projects/visualai.png",
      accentColor: "#f59e0b",
      year: 2023,
    },
    {
      id: "rocketlander",
      title: "RocketLander",
      tagline: "Physics. Particles. Firebase. 60 FPS.",
      description:
        "Physics-based browser game with Firebase real-time leaderboard. Consistently maintaining 60 FPS with optimised particle systems.",
      stack: ["Vue 3", "TypeScript", "Three.js", "Pinia", "Firebase"],
      url: "https://rocketlander.in",
      image: "/projects/rocketlander.png",
      accentColor: "#ef4444",
      year: 2022,
    },
    {
      id: "createfolio",
      title: "CreateFolio",
      tagline: "Portfolio generator. Pick a template. Ship in minutes.",
      description:
        "Portfolio generator with multi-step forms, template selection, Appwrite auth, and one-click CI/CD deployment to Netlify.",
      stack: ["Next.js", "TypeScript", "Vite", "Appwrite"],
      url: "https://createfolio.app",
      image: "/projects/createfolio.png",
      accentColor: "#8b5cf6",
      year: 2022,
    },
  ],
  experience: [
    {
      company: "AccionLabs",
      roles: [
        {
          title: "Senior Frontend Engineer",
          period: "Nov 2023 — Present",
          location: "Mumbai",
          highlights: [
            "Architected production-grade React + TypeScript component libraries for enterprise applications, establishing component-driven standards adopted across the engineering org",
            "Led AI-first engineering workflow using Claude Code and GitHub Copilot with reusable prompt templates for tests, reviews, and commits — cutting sprint delivery time by ~30%",
            "Achieved 90% test coverage across production apps using Jest and React Testing Library, reducing regression incidents and building a culture of automated validation",
            "Optimised bundle performance via tree-shaking, dynamic imports, and Vite pipelines — delivering sub-2s load times on data-heavy dashboards including maps, tables, and reporting modules",
            "Established PR standards and led architecture discussions across a distributed team, elevating code consistency and reducing review cycle time",
          ],
        },
        {
          title: "Frontend Engineer",
          period: "Dec 2020 — Oct 2023",
          location: "Mumbai",
          highlights: [
            "Led end-to-end development of Nexial UI using Vue.js and TypeScript — transforming a terminal-based platform into a production GUI and migrating Excel workflows to structured JSON, significantly reducing operator task time",
            "Built scalable, reusable Vue component systems following advanced design patterns, establishing modular architecture that improved maintainability across the platform",
            "Collaborated with UX/UI designers to deliver pixel-perfect, accessible interfaces across multiple frontend modules",
          ],
        },
        {
          title: "Fullstack Developer",
          period: "Sep 2019 — Nov 2020",
          location: "Mumbai",
          highlights: [
            "Delivered bill payments and real-time notifications using React — directly contributing to a $9M revenue increase and serving 14M+ active users at scale",
            "Designed and implemented GraphQL APIs to optimise data retrieval and eliminate over-fetching, significantly improving performance and frontend responsiveness",
            "Established automated testing practices using Jest and Mocha, enabling early bug detection and improving release confidence",
          ],
        },
        {
          title: "Junior Fullstack Developer",
          period: "Aug 2017 — Aug 2019",
          location: "Mumbai",
          highlights: [
            "Engineered an AI-powered web assistant using Dialogflow with NLP workflows integrated via Node.js/Express REST APIs — deployed to 7,000+ internal users, boosting productivity by 20%",
            "Led mobile-first responsive UI development, driving a 42% increase in user engagement",
            "Drove adoption of Angular 2+ as the core framework, reducing development time by 58% and significantly improving team efficiency",
          ],
        },
      ],
    },
  ],
  award: {
    title: "Innovation & Engineering Excellence",
    event: "Accionlabs Innovation Summit",
    date: "February 2026",
    location: "Goa, India",
  },
  skillGroups: [
    {
      label: "Frontend",
      skills: [
        "React",
        "Next.js",
        "Vue.js",
        "Angular",
        "TypeScript",
        "JavaScript",
        "Tailwind",
        "CSS",
        "SASS",
        "MUI",
        "ShadCN",
        "Ant Design",
        "Vuetify",
      ],
    },
    {
      label: "State & Data",
      skills: ["Redux", "Pinia", "Jotai", "Tanstack Query", "GraphQL", "REST APIs"],
    },
    {
      label: "Testing",
      skills: ["Jest", "React Testing Library", "Vitest", "Cypress", "Playwright", "Mocha"],
    },
    {
      label: "Backend & Infra",
      skills: ["Node.js", "Express", "MongoDB", "Redis", "Docker", "CI/CD", "GitHub Actions"],
    },
    {
      label: "AI & Productivity",
      skills: ["Claude Code", "GitHub Copilot", "Cursor", "Prompt Engineering"],
    },
    {
      label: "Platforms",
      skills: ["Vercel", "Firebase", "Netlify", "DigitalOcean", "Cloudinary"],
    },
  ],
  education: {
    degree: "Bachelor of Technology in Computer Engineering",
    institution: "MPSTME, NMIMS",
    location: "Mumbai, India",
    period: "Jun 2013 — Jul 2017",
  },
});

export type PortfolioConfig = z.infer<typeof PortfolioConfigSchema>;

export { PortfolioConfigSchema };
