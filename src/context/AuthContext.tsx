import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string) => Promise<void>;
  loginDemoAdmin: () => void;
  logout: () => Promise<void>;
  isDemoAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isDemoAdmin, setIsDemoAdmin] = useState<boolean>(() => {
    return localStorage.getItem('bassa_demo_admin') === 'true';
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    if (!auth) throw new Error('Firebase Auth não inicializado');
    setIsDemoAdmin(false);
    localStorage.removeItem('bassa_demo_admin');
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const registerWithEmail = async (email: string, pass: string) => {
    if (!auth) throw new Error('Firebase Auth não inicializado');
    setIsDemoAdmin(false);
    localStorage.removeItem('bassa_demo_admin');
    await createUserWithEmailAndPassword(auth, email, pass);
  };

  const loginDemoAdmin = () => {
    setIsDemoAdmin(true);
    localStorage.setItem('bassa_demo_admin', 'true');
  };

  const logout = async () => {
    setIsDemoAdmin(false);
    localStorage.removeItem('bassa_demo_admin');
    if (auth) {
      try {
        await signOut(auth);
      } catch (e) {
        console.warn('Sign out warning:', e);
      }
    }
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    loginWithEmail,
    registerWithEmail,
    loginDemoAdmin,
    logout,
    isDemoAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
