import { ReactNode } from "react";
import { useAuth } from "@/hooks/auth";
import { AuthForm } from "./AuthForm";
import { UserRole } from "@shared/api";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
  requireAnyRole?: UserRole[];
}

export function ProtectedRoute({ children, requiredRole, requireAnyRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  // Check role-based access
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <Alert className="max-w-md border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">
            Access denied. This page requires {requiredRole} role privileges.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (requireAnyRole && !requireAnyRole.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <Alert className="max-w-md border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">
            Access denied. This page requires one of the following roles: {requireAnyRole.join(", ")}.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}

// Convenience components for specific roles
export function GovernmentOnly({ children }: { children: ReactNode }) {
  return <ProtectedRoute requiredRole="government">{children}</ProtectedRoute>;
}

export function ResearcherOnly({ children }: { children: ReactNode }) {
  return <ProtectedRoute requiredRole="researcher">{children}</ProtectedRoute>;
}

export function AuthenticatedOnly({ children }: { children: ReactNode }) {
  return <ProtectedRoute requireAnyRole={["government", "researcher"]}>{children}</ProtectedRoute>;
}