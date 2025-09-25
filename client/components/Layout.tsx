import { Link, NavLink } from "react-router-dom";
import { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen flex flex-col bg-[url('data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'160\' height=\'160\' viewBox=\'0 0 160 160\'><path fill=\'%2355b4d4\' fill-opacity=\'0.12\' d=\'M0 80c30-18 60 18 90 0s30-18 30-18v98H0Z\'/></svg>')]">
      <Header />
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
    <header className="border-b bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex items-center justify-between py-4">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="h-8 w-8 rounded-md bg-primary/90 inline-flex items-center justify-center text-primary-foreground font-bold">O</span>
          <span className="font-serif text-xl tracking-tight">OceanOS</span>
        </Link>
        <nav className="flex items-center gap-1">
          <NavLink to="/" className={linkClass} end>Dashboard</NavLink>
          <NavLink to="/map" className={linkClass}>Map Explorer</NavLink>
          <NavLink to="/modules" className={linkClass}>Modules</NavLink>
          <NavLink to="/upload" className={linkClass}>Data Upload</NavLink>
          <NavLink to="/about" className={linkClass}>About</NavLink>
        </nav>
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
