/**
 * ============================================================================
 *  SINGLE SOURCE OF TRUTH
 * ============================================================================
 *  Every piece of copy, every link and the background video URL live here.
 *  Components only READ from this file — adding a project, a skill or a
 *  service later means editing one array and nothing else.
 *
 *  Anything wrapped in `PLACEHOLDER` comments below is a stand-in that should
 *  be swapped for real content before this site is shipped publicly.
 * ============================================================================
 */

export interface SkillGroup {
  /** Group label shown as the chip-group heading. */
  group: string;
  /** Tools / technologies belonging to the group. */
  items: string[];
}

export interface Service {
  title: string;
  description: string;
  cta: { label: string; href: string };
}

export interface Project {
  /** Tech stack / status line shown above the title. */
  kicker: string;
  title: string;
  description: string;
  link: { label: string; href: string };
}

export interface ContactLink {
  label: string;
  href: string;
  /** `download` attribute value, or null for a normal link. */
  download: string | null;
}

export interface PortfolioConfig {
  /** Short logo text used in the fixed header. */
  logo: string;
  /** Full display name used for the hero title. */
  name: string;
  /** One-line positioning statement under the hero name. */
  tagline: string;
  /** Three cream pill tags under the hero tagline. */
  tags: string[];
  about: { heading: string; body: string };
  skillsIntro: string;
  skills: SkillGroup[];
  servicesIntro: string;
  services: Service[];
  projectsIntro: string;
  /** Three placeholder cards ship by default — see PLACEHOLDER note. */
  projects: Project[];
  contact: {
    heading: string;
    note: string;
    email: string;
    links: ContactLink[];
  };
  /** Background video that scrubs with the pointer. */
  videoUrl: string;
}

export const portfolio: PortfolioConfig = {
  logo: "C Nishanth",
  name: "C NISHANTH",
  tagline: "AI/ML student building smart websites and automations.",
  tags: ["AI / ML", "Web Development", "Automation"],

  about: {
    heading: "Building things that think.",
    // PLACEHOLDER: swap for a longer, more personal bio when ready.
    body: "I'm a BTech student at NIAT focused on AI/ML. I build websites and automate the workflows behind them, turning repetitive manual work into systems that run on their own. I'm currently open to freelance projects and looking for an internship where I can ship real things with a sharp team.",
  },

  skillsIntro: "The tools I reach for most.",
  skills: [
    {
      group: "AI / ML",
      items: [
        "Python",
        "PyTorch",
        "TensorFlow",
        "scikit-learn",
        "Pandas",
        "NumPy",
        "OpenCV",
        "Hugging Face",
        "Prompt engineering",
        "LLM APIs",
      ],
    },
    {
      group: "Web Development",
      items: [
        "HTML",
        "CSS",
        "JavaScript",
        "TypeScript",
        "React",
        "Tailwind CSS",
        "Vite",
        "Node.js",
        "REST APIs",
        "Git & GitHub",
      ],
    },
    {
      group: "Automation",
      items: [
        "Python scripting",
        "n8n",
        "Make",
        "Zapier",
        "Selenium",
        "Playwright",
        "Google Apps Script",
        "Webhooks",
        "Cron jobs",
        "API integrations",
      ],
    },
  ],

  servicesIntro: "Three ways I can help, right now.",
  services: [
    {
      title: "Websites",
      description:
        "Fast, polished sites for businesses and creators — built to look sharp, load quickly and be easy to update.",
      cta: { label: "Hire me", href: "#contact" },
    },
    {
      title: "Automation",
      description:
        "Workflows that save hours of manual work — connecting your tools so data moves and tasks run on their own.",
      cta: { label: "Hire me", href: "#contact" },
    },
    {
      title: "AI/ML solutions",
      description:
        "Practical AI features and tools — from chat assistants to simple prediction and vision models that solve a real problem.",
      cta: { label: "Hire me", href: "#contact" },
    },
  ],

  projectsIntro: "Things I'm building right now.",
  // PLACEHOLDER: these three cards describe work that does not exist in public
  // yet. Replace each entry with a real project before going live.
  projects: [
    {
      kicker: "Python · PyTorch · FastAPI",
      title: "Coming soon",
      description:
        "A model that reads documents and answers questions about them. Placeholder card — full case study on the way.",
      link: { label: "Coming soon", href: "#contact" },
    },
    {
      kicker: "React · TypeScript · n8n",
      title: "In progress",
      description:
        "An automation dashboard that keeps a small team's tools in sync without anyone copy-pasting. Placeholder card.",
      link: { label: "Coming soon", href: "#contact" },
    },
    {
      kicker: "TypeScript · Tailwind · Vite",
      title: "Coming soon",
      description:
        "A lightweight storefront template built for speed and easy handover. Placeholder card — details coming soon.",
      link: { label: "Coming soon", href: "#contact" },
    },
  ],

  contact: {
    heading: "Let's build something.",
    note: "Open to freelance projects and internships.",
    // PLACEHOLDER: replace with the real contact address.
    email: "hello@nishanth.dev",
    // PLACEHOLDER: replace these URLs with real profiles / a real resume file.
    links: [
      { label: "GitHub", href: "https://github.com/", download: null },
      { label: "LinkedIn", href: "https://www.linkedin.com/", download: null },
      {
        label: "Resume",
        href: "/resume-placeholder.pdf",
        download: "C-Nishanth-Resume.pdf",
      },
    ],
  },

  /**
   * PLACEHOLDER video: a remote sample clip so the cinematic scrub effect has
   * something to work with. Swap for a real 3D-character loop before launch.
   */
  videoUrl:
    "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_041744_63efcd78-bf7d-4039-99e2-2461e8a61903.mp4",
};

/** Navigation shown in the header, in order. `id` matches a stage section. */
export const navLinks = [
  { label: "About", id: "about" },
  { label: "Skills", id: "skills" },
  { label: "Services", id: "services" },
  { label: "Projects", id: "projects" },
  { label: "Contact", id: "contact" },
] as const;
