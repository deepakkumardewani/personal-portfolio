export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  stack: string[];
  url?: string;
  repo?: string;
  image: string;
  accentColor: string;
  year: number;
}

export interface Role {
  title: string;
  period: string;
  location: string;
  highlights: string[];
}

export interface Experience {
  company: string;
  roles: Role[];
}

export interface Award {
  title: string;
  event: string;
  date: string;
  location: string;
}

export interface SkillGroup {
  label: string;
  skills: string[];
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  period: string;
}

export interface PortfolioLinks {
  linkedin: string;
  github: string;
  website?: string;
}

export interface PortfolioConfig {
  name: string;
  title: string;
  tagline: string;
  contactCta: string;
  email: string;
  phone?: string;
  location: string;
  photo?: string;
  links: PortfolioLinks;
  projects: Project[];
  experience: Experience[];
  award: Award;
  skillGroups: SkillGroup[];
  education: Education;
}
