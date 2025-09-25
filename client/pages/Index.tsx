import { useQuery } from "@tanstack/react-query";
import { api, type StatsResponse } from "@/api/api";
import { Link } from "react-router-dom";
import { CuratorNote } from "@/components/CuratorNote";

export default function Index() {
  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => (await api.get<StatsResponse>("/stats")).data,
  });

  return (
    <div className="space-y-10">
      <header className="rounded-xl bg-card p-8 shadow-sm ring-1 ring-border">
        <h1 className="text-3xl md:text-4xl font-serif tracking-tight">OceanOS — a living atlas of sea life and sensors</h1>
        <p className="mt-3 max-w-2xl text-foreground/80">
          Tide to trench, we weave community reports, field expeditions, and sensor streams — reviewed by curators with provenance preserved.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/map" className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground shadow hover:bg-primary/90">Open Map Explorer</Link>
          <Link to="/upload" className="inline-flex items-center rounded-md border px-4 py-2 hover:bg-secondary">Upload dataset</Link>
        </div>
      </header>

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
