import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/authService';
import type { Profile } from '@/types/database';


interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: string | null }>;
  uploadAvatar: (file: File) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for active session on mount
    checkUser();

    // Listen for auth state changes
    const { data: { subscription } } = authService.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          loadProfile(session.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      const { user } = await authService.getCurrentUser();
      setUser(user);
      if (user) {
        await loadProfile(user.id);
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProfile = async (userId: string) => {
    const { profile, error } = await authService.getProfile(userId);
    if (profile && !error) {
      setProfile(profile);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await authService.signUp(email, password, fullName);
    if (data?.user) {
      setUser(data.user);
    }
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await authService.signIn(email, password);
    if (data?.user) {
      setUser(data.user);
    }
    return { error };
  };

  const signInWithGoogle = async () => {
    const { data, error } = await authService.signInWithGoogle();
    return { error };
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
    setProfile(null);
    saveToStorage('rememberMe', false);
  };

  const resetPassword = async (email: string) => {
    return await authService.resetPassword(email);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: 'No user logged in' };
    
    const { data, error } = await authService.updateProfile(user.id, updates);
    if (data && !error) {
      setProfile(data);
    }
    return { error };
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return { error: 'No user logged in' };
    
    const { avatarUrl, error } = await authService.uploadAvatar(user.id, file);
    if (avatarUrl && profile) {
      setProfile({ ...profile, avatar_url: avatarUrl });
    }
    return { error };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        resetPassword,
        updateProfile,
        uploadAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
