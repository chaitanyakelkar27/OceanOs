import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/api";
import { User, UserRole, LoginRequest, RegisterRequest } from "../../shared/api";

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  isGovernment: boolean;
  isResearcher: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((response: any) => setUser(response.data.user))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    console.log("useAuth login called with:", email);
    try {
      const response = await api.post("/auth/login", { email, password } as LoginRequest);
      console.log("Login response received:", response.data);
      const { data } = response;
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      setUser(data.user);
    } catch (error) {
      console.error("API login error:", error);
      throw error;
    }
  };

  const register = async (registerData: RegisterRequest) => {
    const response = await api.post("/auth/register", registerData);
    const { data } = response;
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    setUser(data.user);
  };

  const logout = async () => {
    const rt = localStorage.getItem("refreshToken");
    await api.post("/auth/logout", { refreshToken: rt });
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const isGovernment = user?.role === "government";
  const isResearcher = user?.role === "researcher";

  const value = useMemo(() => ({ 
    user, 
    loading, 
    login, 
    register,
    logout, 
    hasRole,
    isGovernment,
    isResearcher
  }), [user, loading, isGovernment, isResearcher]);
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
