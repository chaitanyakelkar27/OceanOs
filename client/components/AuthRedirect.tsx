import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth";

interface AuthRedirectProps {
  children: React.ReactNode;
}

export function AuthRedirect({ children }: AuthRedirectProps) {
  const { user } = useAuth();
  
  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If user is authenticated, render children
  return <>{children}</>;
}

export function PublicOnly({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  // If user is authenticated, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // If not authenticated, render children (public content)
  return <>{children}</>;
}