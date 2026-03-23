import type { NavLink, MarqueeItem, Service, Stat, TeamMember } from "../types";
 
export const NAV_LINKS: NavLink[] = [
  { label: "Proyectos", href: "#proyectos" },
  { label: "Servicios", href: "#servicios" },
  { label: "Equipo",    href: "#equipo" },
  { label: "Contacto",      href: "#contacto" },
  { label: "Iniciar Sesión",  href: "/login" },
];
 
export const MARQUEE_ITEMS: MarqueeItem[] = [
  { txt: "Desarrollo Web",          color: "#a855f7" },
  { txt: "Apps Mobile",             color: "#06b6d4" },
  { txt: "Inteligencia Artificial", color: "#ec4899" },
  { txt: "Datos & Analítica",       color: "#f97316" },
  { txt: "UI/UX Design",            color: "#10b981" },
  { txt: "Cloud & DevOps",          color: "#eab308" },
  { txt: "Automatización",          color: "#a855f7" },
  { txt: "Consultoría Tech",        color: "#06b6d4" },
];
 
export const STATS: Stat[] = [
  { num: "40+",  label: "Proyectos",      gradient: "from-purple-400 to-cyan-400" },
  { num: "6",    label: "Especialidades", gradient: "from-cyan-400 to-green-400" },
  { num: "100%", label: "Entrega",        gradient: "from-pink-400 to-orange-400" },
  { num: "24/7", label: "Soporte",        gradient: "from-orange-400 to-yellow-400" },
];
 
export const TEAM: TeamMember[] = [
  {
    initials: "KC",
    name: "Kennett Cárcamo",
    role: "Co-Founder & Full Stack",
    roleColor: "#a855f7",
    avatarFrom: "#3b0764",
    avatarTo: "#7c3aed",
    avatarText: "#ede9fe",
    bio: "Arquitecto de soluciones digitales con experiencia en plataformas SaaS, e-commerce y sistemas a medida. Obsesionado con el código limpio y las experiencias que sorprenden.",
    skills: ["React", "Node.js", "Firebase", "TypeScript"],
  },
  {
    initials: "NL",
    name: "Nicolás Lintz",
    role: "Co-Founder & Backend",
    roleColor: "#06b6d4",
    avatarFrom: "#083344",
    avatarTo: "#0891b2",
    avatarText: "#cffafe",
    bio: "Especialista en arquitecturas robustas, APIs y automatización de procesos. Construye los cimientos que hacen que todo funcione a escala sin importar la presión.",
    skills: ["Python", "Cloud", "DevOps", "SQL"],
  },
  {
    initials: "IB",
    name: "Ignacio Barrientos",
    role: "Desarrollador Web",
    roleColor: "#ec4899",
    avatarFrom: "#500724",
    avatarTo: "#be185d",
    avatarText: "#fce7f3",
    bio: "Frontend con ojo para el diseño y dominio de la experiencia de usuario. Transforma interfaces en experiencias memorables con atención al detalle y animaciones que importan.",
    skills: ["Vue", "CSS", "Figma", "Motion"],
  },
];
 
export const SERVICES: Service[] = [
  {
    title: "Desarrollo Web",
    desc: "Aplicaciones rápidas, escalables y hermosas. Desde landing pages hasta plataformas SaaS completas.",
    bg: "rgba(124,58,237,0.08)",
    iconBg: "rgba(124,58,237,0.15)",
    tags: ["React", "Next.js", "TypeScript"],
    tagColor: "#c084fc",
    tagBg: "rgba(124,58,237,0.12)",
    icon: null,
  },
  {
    title: "Apps Mobile",
    desc: "iOS y Android nativos o cross-platform. Experiencias móviles que los usuarios adoran usar.",
    bg: "rgba(6,182,212,0.08)",
    iconBg: "rgba(6,182,212,0.12)",
    tags: ["React Native", "Flutter"],
    tagColor: "#22d3ee",
    tagBg: "rgba(6,182,212,0.1)",
    icon: null,
  },
  {
    title: "Inteligencia Artificial",
    desc: "Chatbots, modelos personalizados, automatización inteligente y soluciones de visión computacional.",
    bg: "rgba(236,72,153,0.08)",
    iconBg: "rgba(236,72,153,0.12)",
    tags: ["LLMs", "Python", "ML"],
    tagColor: "#f472b6",
    tagBg: "rgba(236,72,153,0.1)",
    icon: null,
  },
  {
    title: "Datos & Analítica",
    desc: "Dashboards, pipelines de datos, visualizaciones y sistemas de reportería que te ayudan a decidir mejor.",
    bg: "rgba(249,115,22,0.08)",
    iconBg: "rgba(249,115,22,0.12)",
    tags: ["SQL", "BigQuery", "Tableau"],
    tagColor: "#fb923c",
    tagBg: "rgba(249,115,22,0.1)",
    icon: null,
  },
  {
    title: "Diseño UI/UX",
    desc: "Interfaces que enamoran. Investigación de usuarios, prototipado, sistemas de diseño y entrega lista para código.",
    bg: "rgba(16,185,129,0.08)",
    iconBg: "rgba(16,185,129,0.12)",
    tags: ["Figma", "UX Research"],
    tagColor: "#34d399",
    tagBg: "rgba(16,185,129,0.1)",
    icon: null,
  },
  {
    title: "Cloud & DevOps",
    desc: "Infraestructura como código, CI/CD, contenedores y despliegues que no fallan a las 3 AM.",
    bg: "rgba(234,179,8,0.08)",
    iconBg: "rgba(234,179,8,0.12)",
    tags: ["AWS", "Docker", "Firebase"],
    tagColor: "#facc15",
    tagBg: "rgba(234,179,8,0.1)",
    icon: null,
  },
];