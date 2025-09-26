import { useQuery } from "@tanstack/react-query";
import { api, type StatsResponse } from "@/api/api";
import { Link } from "react-router-dom";
import { CuratorNote } from "@/components/CuratorNote";
import { useAuth } from "@/hooks/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Database, 
  Users, 
  Shield, 
  MapPin, 
  BarChart3, 
  Upload, 
  CheckCircle, 
  Globe,
  Waves
} from "lucide-react";

export default function Index() {
  const { user } = useAuth();
  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => (await api.get<StatsResponse>("/stats")).data,
  });

  return (
    <div className="min-h-screen bg-gov-light">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-white to-gray-50">
        <div className="container-gov text-center">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 mb-8 bg-blue-50 border border-blue-200 px-6 py-3 rounded-lg">
              <Database className="h-5 w-5 text-blue-600" />
              <span className="text-blue-800 font-semibold text-sm tracking-wide uppercase">
                Official Government Marine Data Platform
              </span>
            </div>
            
            <h1 className="heading-gov mb-6">
              OceanOS — Marine Intelligence Platform
            </h1>
            
            <p className="subheading-gov mb-6 max-w-4xl mx-auto">
              India's Official Marine Data Repository and Research Platform
            </p>
            
            <p className="text-lg text-gov mb-12 max-w-5xl mx-auto">
              Comprehensive marine data collection, AI-powered species identification, and real-time environmental monitoring to support evidence-based marine conservation and sustainable fisheries management across Indian waters.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              {user ? (
                <>
                  <Link to="/dashboard">
                    <button className="btn-gov inline-flex items-center gap-3 text-lg px-8 py-4">
                      <BarChart3 className="h-5 w-5" />
                      Access Dashboard
                    </button>
                  </Link>
                  <Link to="/map">
                    <button className="btn-gov-outline inline-flex items-center gap-3 text-lg px-8 py-4">
                      <MapPin className="h-5 w-5" />
                      Marine Map
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/auth">
                    <button className="btn-gov inline-flex items-center gap-3 text-lg px-8 py-4">
                      <Users className="h-5 w-5" />
                      Access Portal
                    </button>
                  </Link>
                  <Link to="/map">
                    <button className="btn-gov-outline inline-flex items-center gap-3 text-lg px-8 py-4">
                      <Globe className="h-5 w-5" />
                      View Public Data
                    </button>
                  </Link>
                </>
              )}
            </div>
            
            {/* Government Statistics */}
            {stats && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <div className="card-gov-elevated p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totals.observations.toLocaleString()}</div>
                  <div className="text-gray-600 text-sm font-medium uppercase tracking-wide">Marine Observations</div>
                </div>
                <div className="card-gov-elevated p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totals.species}</div>
                  <div className="text-gray-600 text-sm font-medium uppercase tracking-wide">Species Catalogued</div>
                </div>
                <div className="card-gov-elevated p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totals.uploads}</div>
                  <div className="text-gray-600 text-sm font-medium uppercase tracking-wide">Monitoring Stations</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container-gov">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">
              Platform Capabilities
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Advanced marine data management and analysis tools designed for researchers, government agencies, and conservation organizations
            </p>
          </div>
          
          <div className="grid-responsive">
            <div className="card-gov p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-lg flex items-center justify-center">
                  <Database className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-serif text-gray-900 mb-4">Comprehensive Database</h3>
              <p className="text-gray-600 leading-relaxed">
                Centralized repository of marine species data, environmental observations, and research findings from Indian territorial waters.
              </p>
            </div>
            
            <div className="card-gov p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-serif text-gray-900 mb-4">Quality Assurance</h3>
              <p className="text-gray-600 leading-relaxed">
                Rigorous peer-review process ensuring all data meets scientific standards and government compliance requirements.
              </p>
            </div>
            
            <div className="card-gov p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Users className="h-8 w-8 text-indigo-600" />
                </div>
              </div>
              <h3 className="text-xl font-serif text-gray-900 mb-4">Research Collaboration</h3>
              <p className="text-gray-600 leading-relaxed">
                Facilitating partnerships between institutions, agencies, and organizations for marine conservation research.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Observations" value={stats?.totals.observations ?? 0} />
        <StatCard label="Species" value={stats?.totals.species ?? 0} />
        <StatCard label="Uploads" value={stats?.totals.uploads ?? 0} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl">Recent activity</h2>
            <span className="text-xs text-foreground/60">{stats ? `Updated ${new Date(stats.lastUpdated).toLocaleString()}` : "Painting the coast… give us a sec."}</span>
          </div>
          <ul className="mt-3 divide-y">
            {["Dolphin pod near Lands End","Yellowfin school at temp front","Community report: tidepool nudibranch"].map((t, i) => (
              <li key={i} className="py-3 flex items-center justify-between">
                <span>{t}</span>
                <span className="text-xs text-foreground/60">now</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <h2 className="font-serif text-xl">Curator’s corner</h2>
          <div className="mt-3">
            <CuratorNote author="C. Marin">
              When filtering tuna observations, try a 7–10 day window after warm-water eddies. Community reports can be noisy; keep them on for serendipity.
            </CuratorNote>
          </div>
          <div className="mt-4 text-sm text-foreground/70">
            Tip: Debounce map pans — our API will happily bucket requests, but your laptop battery will thank you.
          </div>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="font-serif text-xl">Quick access: AI modules</h2>
        <div className="mt-3 grid gap-4 grid-cols-1 md:grid-cols-3">
          <QuickCard title="Taxonomy Assistant" to="/modules/taxonomy" subtitle="Human-in-the-loop species ID with curator approval." />
          <QuickCard title="Otolith Morphometrics" to="/modules/otolith" subtitle="Shape descriptors and cohort comparisons." />
          <QuickCard title="eDNA Browser" to="/modules/edna" subtitle="Search assays, hits, and crosswalk to taxonomy." />
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="text-sm text-foreground/70">{label}</div>
      <div className="mt-1 text-3xl font-serif">{value.toLocaleString()}</div>
    </div>
  );
}

function QuickCard({ title, subtitle, to }: { title: string; subtitle: string; to: string }) {
  return (
    <a href={to} className="rounded-xl border bg-card p-5 block hover:shadow-sm">
      <div className="font-serif text-lg">{title}</div>
      <div className="mt-1 text-sm text-foreground/70">{subtitle}</div>
    </a>
  );
}
