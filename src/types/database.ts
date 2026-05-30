export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      notes: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          color: string
          category: string | null
          tags: string[]
          is_pinned: boolean
          is_favorite: boolean
          is_archived: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content?: string
          color?: string
          category?: string | null
          tags?: string[]
          is_pinned?: boolean
          is_favorite?: boolean
          is_archived?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          color?: string
          category?: string | null
          tags?: string[]
          is_pinned?: boolean
          is_favorite?: boolean
          is_archived?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      note_activity: {
        Row: {
          id: string
          note_id: string
          action: string
          created_at: string
        }
        Insert: {
          id?: string
          note_id: string
          action: string
          created_at?: string
        }
        Update: {
          id?: string
          note_id?: string
          action?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "note_activity_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Note = Database['public']['Tables']['notes']['Row'];
export type NoteActivity = Database['public']['Tables']['note_activity']['Row'];

// Form types
export interface LoginForm {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupForm {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface NoteForm {
  title: string;
  content: string;
  color: string;
  category?: string;
  tags: string[];
}

// UI State types
export interface NoteFilter {
  search: string;
  category: string | null;
  tags: string[];
  sortBy: 'newest' | 'oldest' | 'alphabetical' | 'recently_updated';
  showArchived: boolean;
  showFavorites: boolean;
  showPinned: boolean;
}

export type NoteViewMode = 'grid' | 'list';

// API Response types
export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

// Auth types
export interface AuthState {
  user: any | null;
  profile: Profile | null;
  loading: boolean;
}
