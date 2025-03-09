export interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  updated_at: string;
}

export interface Portfolio {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  template: string;
  published: boolean;
  github_username: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  portfolio_id: string;
  title: string;
  description: string | null;
  github_url: string | null;
  live_url: string | null;
  technologies: string[];
  sort_order: number;
  created_at: string;
}

export interface Skill {
  id: string;
  portfolio_id: string;
  name: string;
  category: string;
  proficiency: number;
  sort_order: number;
}

export type TemplateType = 'minimal' | 'professional' | 'creative';

export interface GithubData {
  repositories: any[];
  contributions: number;
  languages: { [key: string]: number };
}