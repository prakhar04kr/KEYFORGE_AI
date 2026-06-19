import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

export interface AuthUser {
  userId: number;
  username: string;
  email: string;
  role: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function decodeToken(token: string): AuthUser | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return { userId: payload.userId, username: payload.username, email: payload.email, role: payload.role };
  } catch {
    return null;
  }
}

const TOKEN_KEY = "keyforge_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, token: null, isLoading: true });

  useEffect(() => {
    const saved = localStorage.getItem(TOKEN_KEY);
    if (saved) {
      const user = decodeToken(saved);
      if (user) {
        setState({ user, token: saved, isLoading: false });
        return;
      }
    }
    setState((s) => ({ ...s, isLoading: false }));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    localStorage.setItem(TOKEN_KEY, data.token);
    const user = decodeToken(data.token);
    setState({ user, token: data.token, isLoading: false });
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Registration failed");
    localStorage.setItem(TOKEN_KEY, data.token);
    const user = decodeToken(data.token);
    setState({ user, token: data.token, isLoading: false });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setState({ user: null, token: null, isLoading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}
