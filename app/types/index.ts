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

// JSON:API format for Conversation
export interface Conversation {
  id: string;
  type: string;
  attributes: {
    id: number;
    title: string;
    status: 'active' | 'archived';
    last_interaction_at: string;
    created_at: string;
    updated_at: string;
  };
  relationships: {
    user: {
      data: {
        id: string;
        type: string;
      }
    };
    firm: {
      data: {
        id: string;
        type: string;
      }
    };
    messages: {
      data: Array<{
        id: string;
        type: string;
      }> | [];
    };
  };
}

// JSON:API response format for single conversation with included data
export interface ConversationResponse {
  data: Conversation;
  included?: Array<{
    id: string;
    type: string;
    attributes: {
      id: number;
      role: string;
      content: string;
      created_at: string;
      updated_at: string;
    };
    relationships?: {
      conversation: {
        data: {
          id: string;
          type: string;
        }
      }
    };
  }>;
}

export interface Message {
  id: number | string;
  role: string;
  content: string;
  timestamp?: Date;
  created_at?: string;
  updated_at?: string;
  conversation_id?: number;
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
