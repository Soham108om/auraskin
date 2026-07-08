import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../utils/supabase';
import { User } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isDemoMode: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data for Demo Mode
const MOCK_USER_ID = '00000000-0000-0000-0000-000000000000';
const mockDefaultProfile: Profile = {
  id: MOCK_USER_ID,
  first_name: 'Eleanor',
  last_name: 'Sterling',
  phone: '+91 98765 43210',
  address: '42, Golden Crest Apartments, Bandra West',
  city: 'Mumbai',
  zip: '400050',
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const isDemoMode = !isSupabaseConfigured();

  // Load profile from Supabase
  const fetchProfile = async (uid: string) => {
    if (isDemoMode || !supabase) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .single();

      if (error) {
        // Code PGRST116 means no rows returned (profile doesn't exist yet)
        if (error.code === 'PGRST116') {
          console.log('Profile record missing in database. Auto-creating from auth metadata...');
          const { data: sessionData } = await supabase.auth.getUser();
          const meta = sessionData?.user?.user_metadata;
          
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: uid,
              first_name: meta?.first_name || '',
              last_name: meta?.last_name || '',
              phone: '',
              address: '',
              city: '',
              zip: ''
            })
            .select()
            .single();

          if (!insertError && newProfile) {
            setProfile(newProfile);
            return;
          } else if (insertError) {
            console.error('Failed to auto-create profile:', insertError.message);
          }
        } else {
          console.error('Error fetching profile:', error.message);
        }
        return;
      }
      setProfile(data);
    } catch (e) {
      console.error('Exception fetching profile:', e);
    }
  };

  useEffect(() => {
    if (isDemoMode) {
      // Check local storage for mock login state
      const savedMockUser = localStorage.getItem('auraskin_mock_user');
      if (savedMockUser) {
        const parsed = JSON.parse(savedMockUser);
        setUser(parsed.user);
        setProfile(parsed.profile);
      }
      setLoading(false);
      return;
    }

    if (!supabase) return;

    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isDemoMode]);

  // Sign In
  const signIn = async (email: string, password: string) => {
    if (isDemoMode) {
      // Mock log in
      const mockUser = { id: MOCK_USER_ID, email } as User;
      const mockProfile = { ...mockDefaultProfile, id: MOCK_USER_ID };
      setUser(mockUser);
      setProfile(mockProfile);
      localStorage.setItem('auraskin_mock_user', JSON.stringify({ user: mockUser, profile: mockProfile }));
      return { success: true };
    }

    if (!supabase) return { success: false, error: 'Database client not initialized.' };

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) {
        setUser(data.user);
        await fetchProfile(data.user.id);
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'An error occurred during sign in.' };
    } finally {
      setLoading(false);
    }
  };

  // Sign Up
  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    if (isDemoMode) {
      // Mock Sign Up
      const mockUser = { id: MOCK_USER_ID, email } as User;
      const mockProfile = {
        id: MOCK_USER_ID,
        first_name: firstName,
        last_name: lastName,
        phone: '',
        address: '',
        city: '',
        zip: '',
      };
      setUser(mockUser);
      setProfile(mockProfile);
      localStorage.setItem('auraskin_mock_user', JSON.stringify({ user: mockUser, profile: mockProfile }));
      return { success: true };
    }

    if (!supabase) return { success: false, error: 'Database client not initialized.' };

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) throw error;
      
      // Auto sign-in or manual verification check
      if (data.user) {
        setUser(data.user);
        
        // Client-side fallback: explicitly create the profile row
        // in case the database trigger function was not created/enabled
        try {
          await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              first_name: firstName,
              last_name: lastName,
              phone: '',
              address: '',
              city: '',
              zip: ''
            });
        } catch (profileErr) {
          console.error('Client-side profile fallback error:', profileErr);
        }

        await fetchProfile(data.user.id);
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'An error occurred during registration.' };
    } finally {
      setLoading(false);
    }
  };

  // Sign Out
  const signOut = async () => {
    if (isDemoMode) {
      setUser(null);
      setProfile(null);
      localStorage.removeItem('auraskin_mock_user');
      return;
    }

    if (!supabase) return;
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
    } catch (e) {
      console.error('Error signing out:', e);
    }
  };

  // Update Profile
  const updateProfile = async (updates: Partial<Profile>) => {
    const profileId = profile?.id || user?.id;
    if (!profileId) {
      return { success: false, error: 'No authenticated user session found.' };
    }

    if (isDemoMode) {
      const baseProfile = profile || {
        id: profileId,
        first_name: '',
        last_name: '',
        phone: '',
        address: '',
        city: '',
        zip: '',
      };
      const updatedProfile = { ...baseProfile, ...updates };
      setProfile(updatedProfile);
      if (user) {
        localStorage.setItem('auraskin_mock_user', JSON.stringify({ user, profile: updatedProfile }));
      }
      return { success: true };
    }

    if (!supabase) return { success: false, error: 'Database client not initialized.' };

    try {
      setLoading(true);
      // Use upsert so that if the profile record doesn't exist yet, it gets created automatically
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: profileId,
          ...updates,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      
      setProfile(prev => {
        const base = prev || {
          id: profileId,
          first_name: '',
          last_name: '',
          phone: '',
          address: '',
          city: '',
          zip: '',
        };
        return { ...base, ...updates };
      });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update profile details.' };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isDemoMode,
        signIn,
        signUp,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
