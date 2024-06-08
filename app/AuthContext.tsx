import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUserDetails, logout } from './authService';
import { loginWithMail, loginWithCardano } from "@/app/(auth)/login/loginActions"

// Extend User interface if needed
interface User {
  id: string;
  email?: string;
  name?: string;
  walletAddress?: string;
  walletNetwork?: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  loginWithCardano: (walletAddress: string, walletNetwork: number, key: string, signature: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const userDetails = await getUserDetails();
        setUser(userDetails);
      } catch (error) {
        console.error("Failed to load user:", error);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  const handleLoginWithEmail = async (email: string, password: string) => {
    setLoading(true);
    const result = await loginWithMail(email, password);
    if (result.success) {
      const userDetails = await getUserDetails(); // Assuming this gets the new user details
      setUser(userDetails);
    } else {
      alert(result.error); // Or handle the error as you see fit
    }
    setLoading(false);
  };

  const handleLoginWithCardano = async ( walletAddress: string, walletNetwork: number, key: string, signature: string) => {
    setLoading(true);
    const result = await loginWithCardano(walletAddress, walletNetwork, key, signature);
    if (result.success) {
      const userDetails = await getUserDetails(); // Assuming this gets the new user details
      setUser(userDetails);
    } else {
      alert(result.error); // Or handle the error as you see fit
    }
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithEmail: handleLoginWithEmail, loginWithCardano: handleLoginWithCardano, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
