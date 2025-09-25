import { Link } from "react-router-dom";

export default function Modules() {
  const cards = [
    {
      title: "Taxonomy Assistant",
      body:
        "Human-in-the-loop classification, species search, and curator notes. Upload traits or images to get ranked suggestions.",
      to: "/modules/taxonomy",
    },
    {
      title: "Otolith Morphometrics",
      body:
        "Interactive otolith shape measurements and morphometrics. Compare populations and export CSVs.",
      to: "/modules/otolith",
    },
    {
      title: "eDNA Browser",
      body:
        "Query molecular assays and environmental DNA hits. Crosswalk to taxonomy and observations.",
      to: "/modules/edna",
    },
  ];
  return (
    <div>
      <h1 className="font-serif text-2xl">AI Modules</h1>
      <p className="mt-2 text-foreground/80 max-w-2xl">
        Unified analytics across oceanography, fisheries, and molecular biodiversity. These modules are scaffolded and ready to wire to your models and data.
      </p>
      <div className="mt-6 grid gap-4 grid-cols-1 md:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.title} to={c.to} className="rounded-xl border bg-card p-5 hover:shadow-sm">
            <div className="font-serif text-xl">{c.title}</div>
            <p className="mt-2 text-sm text-foreground/70">{c.body}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
