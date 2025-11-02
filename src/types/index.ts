import { LucideIcon } from 'lucide-react';

export type Theme = 'light' | 'dark';

export interface Profile {
  id: string;
  updated_at: string;
  full_name: string | null;
  avatar_url: string | null;
}

export interface InputField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'email' | 'number';
  placeholder?: string;
  defaultValue?: string;
  options?: string[];
}

export interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  webhookUrl: string;
  inputFields: InputField[];
}

export interface NavItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

export interface WorkflowRun {
  id: number;
  created_at: string;
  user_id: string;
  workflow_title: string;
}
