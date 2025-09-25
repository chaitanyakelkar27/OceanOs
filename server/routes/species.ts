import { RequestHandler } from "express";

const speciesDb = [
  {
    id: "sp_1",
    scientific_name: "Delphinus delphis",
    common_name: "Common Dolphin",
    taxonomy: { kingdom: "Animalia", phylum: "Chordata", class: "Mammalia" },
    curator_notes: "Often sighted near continental shelves.",
    last_reviewed_by: "2",
  },
  {
    id: "sp_2",
    scientific_name: "Thunnus albacares",
    common_name: "Yellowfin Tuna",
    taxonomy: { kingdom: "Animalia", phylum: "Chordata", class: "Actinopterygii" },
    curator_notes: "Pelagic species; schools near temperature fronts.",
    last_reviewed_by: "2",
  },
];

export const searchSpecies: RequestHandler = (req, res) => {
  const name = String(req.query.name || "").toLowerCase();
  const results = speciesDb.filter(
    (s) =>
      s.scientific_name.toLowerCase().includes(name) ||
      s.common_name.toLowerCase().includes(name),
  );
  res.json({ results, meta: { total: results.length, q: name } });
};

export const getSpecies: RequestHandler = (req, res) => {
  const { id } = req.params;
  const found = speciesDb.find((s) => s.id === id);
  if (!found) return res.status(404).json({ error: "Not found" });
  res.json({ species: found, meta: { provenance: { curated: true } } });
};

export const createSpecies: RequestHandler = (req, res) => {
  const body = req.body;
  const id = `sp_${speciesDb.length + 1}`;
  const item = { id, ...body };
  speciesDb.push(item);
  res.status(201).json({ species: item });
};

export const updateSpecies: RequestHandler = (req, res) => {
  const { id } = req.params;
  const idx = speciesDb.findIndex((s) => s.id === id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  speciesDb[idx] = { ...speciesDb[idx], ...req.body };
  res.json({ species: speciesDb[idx] });
};
