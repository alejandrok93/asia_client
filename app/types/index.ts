// app/types/index.ts
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  agent_id: string;
  role: 'agent' | 'admin' | 'manager';
  firm_id: number;
  full_name: string;
  created_at: string;
}

export interface Firm {
  id: number;
  name: string;
  address: string;
  phone: string;
  industry: string;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: number;
  title: string;
  status: 'active' | 'archived';
  ai_context: string;
  last_interaction_at: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  firm_id: number;
}

export interface ApiResponse<T> {
  data: T;
}

export interface ApiError {
  error: string;
  errors?: Record<string, string[]>;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  password_confirmation: string;
  first_name: string;
  last_name: string;
  agent_id: string;
  role: 'agent' | 'admin' | 'manager';
  firm_id: number;
}
