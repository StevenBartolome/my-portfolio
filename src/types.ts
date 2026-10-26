export type ThemeMode = 'light' | 'dark';

export interface Project {
  id: string;
  title: string;
  category: 'mobile' | 'web' | 'uiux';
  categoryLabel: string;
  description: string;
  image: string;
  tags: string[];
  year: string;
  featured?: boolean;
  link?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  deliverables: string[];
}

export interface SkillItem {
  name: string;
  category: 'design' | 'dev' | 'tools';
}
