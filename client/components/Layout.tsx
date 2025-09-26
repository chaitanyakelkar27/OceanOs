import { Link, NavLink, useLocation } from "react-router-dom";
import { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";
import { RoleBasedNav } from "@/components/RoleBasedNav";
import { useAuth } from "@/hooks/auth";

export default function Layout({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-[url('data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'160\' height=\'160\' viewBox=\'0 0 160 160\'><path fill=\'%2355b4d4\' fill-opacity=\'0.12\' d=\'M0 80c30-18 60 18 90 0s30-18 30-18v98H0Z\'/></svg>')]">
      {user ? (
        <RoleBasedNav currentPath={location.pathname} />
      ) : (
        <Header />
      )}
      <main className="flex-1">
        <div className="container py-8">{children}</div>
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "px-3 py-2 rounded-md text-sm font-medium",
      isActive ? "bg-primary text-primary-foreground" : "text-foreground/80 hover:bg-secondary hover:text-foreground"
    );
  
  return (
    <header className="nav-gov sticky top-0 z-50">
      <div className="container-gov flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-lg">O</span>
          </div>
          <span className="font-serif text-xl text-gray-900 font-semibold">
            OceanOS
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          <NavLink to="/map" className={linkClass}>
            Marine Map
          </NavLink>
          <NavLink to="/modules" className={linkClass}>
            Research Tools
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            About Platform
          </NavLink>
        </nav>
        
        <div className="flex items-center gap-3">
          <Link 
            to="/login" 
            className="btn-gov text-sm px-4 py-2 rounded font-medium"
          >
            Access Portal
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <button className="md:hidden p-2 rounded-lg hover:bg-blue-50 transition-colors">
          <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t text-sm text-foreground/70">
      <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-2">
        <p>
          © {new Date().getFullYear()} OceanOS — an open ocean observatory • MoES / CMLRE (Kochi).
        </p>
        <p>
          Crafted with care • Provenance preserved • Curated by humans
        </p>
      </div>
    </footer>
  );
}
