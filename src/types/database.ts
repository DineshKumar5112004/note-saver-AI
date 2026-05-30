// Database type definitions for Supabase

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  color: string;
  category: string | null;
  tags: string[];
  is_pinned: boolean;
  is_favorite: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface NoteActivity {
  id: string;
  note_id: string;
  action: string;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Profile;
        Update: Partial<Profile>;
      };
      notes: {
        Row: Note;
        Insert: Note;
        Update: Partial<Note>;
      };
      note_activity: {
        Row: NoteActivity;
        Insert: NoteActivity;
        Update: Partial<NoteActivity>;
      };
    };
  };
}

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
