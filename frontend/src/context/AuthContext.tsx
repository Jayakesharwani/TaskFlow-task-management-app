"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import type { User } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (token: string, user?: User) => void;
  logout: () => void;
}

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined,
  );

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] =
    useState<User | null>(null);

  const [token, setToken] =
    useState<string | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  // =====================================================
  // LOAD STORED AUTH DATA
  // =====================================================

  useEffect(() => {
    try {
      const storedToken =
        localStorage.getItem("token");

      const storedUser =
        localStorage.getItem("user");

      console.log(
        "AUTH CONTEXT - STORED TOKEN:",
        !!storedToken,
      );

      if (storedToken) {
        setToken(storedToken);
      }

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          localStorage.removeItem("user");
        }
      }
    } catch (error) {
      console.error(
        "Unable to read authentication data:",
        error,
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // =====================================================
  // SET AUTH
  // =====================================================

  const setAuth = (
    newToken: string,
    newUser?: User,
  ) => {
    console.log(
      "AUTH CONTEXT - SAVING TOKEN:",
      !!newToken,
    );

    // Save token
    localStorage.setItem(
      "token",
      newToken,
    );

    // Immediately verify it was saved
    const savedToken =
      localStorage.getItem("token");

    console.log(
      "AUTH CONTEXT - TOKEN SAVED:",
      !!savedToken,
    );

    setToken(newToken);

    // Save user
    if (newUser) {
      localStorage.setItem(
        "user",
        JSON.stringify(newUser),
      );

      setUser(newUser);
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        setAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// =====================================================
// USE AUTH
// =====================================================

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider",
    );
  }

  return context;
}