import { useAuth } from "@/hooks/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Settings, LogOut, FileCheck, Upload, BarChart3 } from "lucide-react";

interface RoleBasedNavProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export function RoleBasedNav({ currentPath, onNavigate }: RoleBasedNavProps) {
  const { user, logout, isGovernment, isResearcher } = useAuth();

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleNavigation = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.href = path;
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "government":
        return "bg-blue-100 text-blue-800";
      case "researcher":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <header className="nav-gov sticky top-0 z-50">
      <div className="container-gov">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg">O</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-serif text-gray-900 font-semibold">
                OceanOS
              </h1>
              <span className="text-xs text-gray-500 font-medium">Marine Intelligence Platform</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-2">
            <Button
              variant={currentPath === "/dashboard" ? "default" : "ghost"}
              onClick={() => handleNavigation("/dashboard")}
              className="nav-link-gov"
            >
              Dashboard
            </Button>

            {isResearcher && (
              <>
                <Button
                  variant={currentPath === "/upload" ? "default" : "ghost"}
                  onClick={() => handleNavigation("/upload")}
                  className="nav-link-gov flex items-center gap-2"
                >
                  Upload Data
                </Button>
                <Button
                  variant={currentPath === "/submissions" ? "default" : "ghost"}
                  onClick={() => handleNavigation("/submissions")}
                  className="nav-link-ocean"
                >
                  Status
                </Button>
                <Button
                  variant={currentPath === "/my-submissions" ? "default" : "ghost"}
                  onClick={() => handleNavigation("/my-submissions")}
                  className="nav-link-ocean"
                >
                  📂 My Data
                </Button>
              </>
            )}

            {isGovernment && (
              <>
                <Button
                  variant={currentPath === "/approvals" ? "default" : "ghost"}
                  onClick={() => handleNavigation("/approvals")}
                  className="nav-link-ocean flex items-center gap-2"
                >
                  Review Data
                </Button>
                <Button
                  variant={currentPath === "/stats" ? "default" : "ghost"}
                  onClick={() => handleNavigation("/stats")}
                  className="nav-link-ocean flex items-center gap-2"
                >
                  Analytics
                </Button>
              </>
            )}

            <Button
              variant={currentPath === "/modules" ? "default" : "ghost"}
              onClick={() => handleNavigation("/modules")}
              className="nav-link-ocean"
            >
              🤖 AI Modules
            </Button>

            <Button
              variant={currentPath === "/map" ? "default" : "ghost"}
              onClick={() => handleNavigation("/map")}
              className="nav-link-ocean"
            >
              Map Explorer
            </Button>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {getUserInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <Badge className={`text-xs ${getRoleColor(user.role)}`}>
                        {user.role}
                      </Badge>
                    </div>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                    {user.organization && (
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.organization}
                      </p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleNavigation("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigation("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}