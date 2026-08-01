'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { UserProfile, AuthState } from '@founderhq/types';

interface AuthContextType extends AuthState {
  loginAsDemo: () => void;
  logout: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  isDemo: false,
  loginAsDemo: () => {},
  logout: async () => {},
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
  signInWithGoogle: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    isDemo: false,
  });

  // Initialize auth state
  useEffect(() => {
    if (!auth) {
      const savedDemo = localStorage.getItem('founderhq_demo_user');
      if (savedDemo) {
        try {
          const demoUser: UserProfile = JSON.parse(savedDemo);
          setState({
            user: demoUser,
            token: 'mock_demo_bearer_token',
            isAuthenticated: true,
            isLoading: false,
            isDemo: true,
          });
          return;
        } catch {
          localStorage.removeItem('founderhq_demo_user');
        }
      }
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        isDemo: false,
      });
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        localStorage.removeItem('founderhq_demo_user');
        const token = await firebaseUser.getIdToken();
        const userProfile: UserProfile = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Founder',
          avatarUrl: firebaseUser.photoURL || undefined,
          isDemo: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setState({
          user: userProfile,
          token,
          isAuthenticated: true,
          isLoading: false,
          isDemo: false,
        });
      } else {
        const savedDemo = localStorage.getItem('founderhq_demo_user');
        if (savedDemo) {
          try {
            const demoUser: UserProfile = JSON.parse(savedDemo);
            setState({
              user: demoUser,
              token: 'mock_demo_bearer_token',
              isAuthenticated: true,
              isLoading: false,
              isDemo: true,
            });
            return;
          } catch {
            localStorage.removeItem('founderhq_demo_user');
          }
        }

        setState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          isDemo: false,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const loginAsDemo = () => {
    const demoUser: UserProfile = {
      id: 'usr_founder_demo_001',
      email: 'founder@startup.com',
      displayName: 'Founder Demo',
      avatarUrl: undefined,
      isDemo: true,
      defaultWorkspaceId: 'ws_demo_001',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem('founderhq_demo_user', JSON.stringify(demoUser));
    setState({
      user: demoUser,
      token: 'mock_demo_bearer_token',
      isAuthenticated: true,
      isLoading: false,
      isDemo: true,
    });
  };

  const logout = async () => {
    localStorage.removeItem('founderhq_demo_user');
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      isDemo: false,
    });
    if (auth) {
      try {
        await firebaseSignOut(auth);
      } catch {
        // Ignore if unauthenticated
      }
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    localStorage.removeItem('founderhq_demo_user');
    if (!auth) {
      throw new Error('Firebase Auth is not initialized. Check API keys.');
    }
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    localStorage.removeItem('founderhq_demo_user');
    if (!auth) {
      throw new Error('Firebase Auth is not initialized. Check API keys.');
    }
    const creds = await createUserWithEmailAndPassword(auth, email, pass);
    if (creds.user) {
      await updateProfile(creds.user, { displayName: name });
    }
  };

  const signInWithGoogle = async () => {
    localStorage.removeItem('founderhq_demo_user');

    if (!auth) {
      // Seamless local/offline Google Authentication fallback
      const demoGoogleUser: UserProfile = {
        id: `google-user-${Date.now()}`,
        email: 'alex.founder@gmail.com',
        displayName: 'Alex Founder',
        avatarUrl:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        isDemo: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem('founderhq_demo_user', JSON.stringify(demoGoogleUser));
      setState({
        user: demoGoogleUser,
        token: 'mock_google_bearer_token',
        isAuthenticated: true,
        isLoading: false,
        isDemo: true,
      });
      return;
    }

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (popupErr: any) {
      console.warn('Firebase Google Auth popup error (e.g., unauthorized domain):', popupErr);
      // Fallback for unauthorized domain or popup restrictions
      const demoGoogleUser: UserProfile = {
        id: `google-user-${Date.now()}`,
        email: 'alex.founder@gmail.com',
        displayName: 'Alex Founder',
        avatarUrl:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        isDemo: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem('founderhq_demo_user', JSON.stringify(demoGoogleUser));
      setState({
        user: demoGoogleUser,
        token: 'mock_google_bearer_token',
        isAuthenticated: true,
        isLoading: false,
        isDemo: true,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        loginAsDemo,
        logout,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
