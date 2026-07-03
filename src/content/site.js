/**
 * Edit this file to update site-wide copy, links, and section headings.
 */

export const site = {
  name: "Anas Arif",
  role: "Full-Stack Developer · AI · Data",
  headline:
    "I design and ship modern web products — from polished interfaces to scalable backends and intelligent features.",
  status: {
    available: true,
    label: "Open to opportunities",
  },
  location: "Kuwait",
  email: "anasarif82@gmail.com",
  cvUrl: "#",
  assets: {
    heroImage: "hero/Anas_arif.png",
    cv: "about/AnasArifCV.pdf",
  },
  social: {
    github: "https://github.com/KaedKazuha",
    linkedin: "https://www.linkedin.com/in/anasarif99/",
    twitter: null,
  },
  contactIcons: {
    email: "contact/emailIcon.png",
    linkedin: "contact/link.png",
    github: "contact/github.png",
  },
  nav: [
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" },
  ],
  sections: {
    about: {
      label: "About",
      title: "Building SaaS that works across web, mobile, and the field",
      description:
        "Full-stack developer shipping production software across the Tasleeh ecosystem.",
      bio: "Software developer with a background in computer systems engineering, currently building Tasleeh Core in Kuwait — a multi-platform SaaS for service operations.",
      tagline:
        "I connect web dashboards, mobile apps, and live field workflows into one platform teams can actually run on.",
      storySteps: [
        {
          icon: "web",
          label: "Web",
          text: "React dashboards for ops, finance & logistics",
        },
        {
          icon: "mobile",
          label: "Mobile",
          text: "Customer & technician apps in the field",
        },
        {
          icon: "live",
          label: "Live",
          text: "Real-time sync, secure auth & AI where it helps",
        },
      ],
    },
    skills: {
      label: "Skills",
      title: "Tools & technologies I work with",
      description:
        "The stack I use day to day across web dashboards, mobile apps, APIs, and production deployments.",
    },
    experience: {
      label: "Experience",
      title: "Where I've worked & what I've done",
      description:
        "Software development roles across SaaS, full-stack web, and mobile — from MVP delivery to production modules.",
    },
    projects: {
      label: "Projects",
      title: "Selected work",
      description:
        "SaaS platforms, mobile apps, and shipped products — use Watch demo on mobile or hover previews on desktop.",
    },
    contact: {
      label: "Contact",
      title: "Let's work together",
      titleHighlight: "together",
      description:
        "Open to freelance, full-time, and collaboration. Drop a line — I usually reply within a day.",
    },
  },
  stats: [
    { value: "3+", label: "Years building", icon: "calendar" },
    { value: "3+", label: "Mobile apps published", icon: "mobile" },
    { value: "5+", label: "Technologies", icon: "tech" },
  ],
  aboutCards: [
    {
      visual: "web",
      title: "Web & platform",
      description: "React ops dashboards for teams, finance, and logistics.",
      tags: ["React", "Material UI", "RBAC", "RTL"],
    },
    {
      visual: "mobile",
      title: "Mobile & field",
      description: "Customer and technician apps with tracking on the ground.",
      tags: ["Expo", "React Native", "Geofencing", "Push"],
    },
    {
      visual: "realtime",
      title: "Live & intelligent",
      description: "Real-time sync, secure auth, and AI where it helps.",
      tags: ["Centrifugo", "Firebase", "JWT", "AI"],
    },
  ],
};
