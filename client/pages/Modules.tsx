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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-medium text-gray-900 mb-4">AI Research Modules</h1>
      <p className="mt-2 text-gray-600 max-w-2xl mb-8">
        Advanced analytical tools for oceanography, fisheries, and molecular biodiversity research. These professional-grade modules integrate seamlessly with your data and computational models.
      </p>
      <div className="mt-6 grid gap-6 grid-cols-1 md:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.title} to={c.to} className="card-gov p-6 hover:shadow-lg transition-shadow">
            <div className="font-medium text-xl text-gray-900 mb-3">{c.title}</div>
            <p className="text-sm text-gray-600">{c.body}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
