import { RequestHandler } from "express";

// Enhanced marine observations for demo - focused on Indian Ocean and Arabian Sea
const observations = [
  // Arabian Sea observations
  {
    id: "obs_1",
    species_id: "sp_1",
    observed_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    geom: { type: "Point", coordinates: [72.8777, 19.0760] }, // Mumbai coast
    recorded_by: "Dr. Marine Biologist",
    validated_by: "Curator A. Patel",
    dataset_id: "mumbai_fisheries_2024",
    photos: [],
    species_name: "Yellowfin Tuna",
    depth: 50,
    temperature: 28.5,
  },
  {
    id: "obs_2", 
    species_id: "sp_2",
    observed_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    geom: { type: "Point", coordinates: [75.7139, 11.2588] }, // Kochi coast
    recorded_by: "Fisherman Kumar",
    validated_by: "Dr. R. Nair",
    dataset_id: "kerala_coastal_survey",
    photos: [],
    species_name: "Indian Mackerel",
    depth: 25,
    temperature: 29.2,
  },
  // Bay of Bengal observations
  {
    id: "obs_3",
    species_id: "sp_3", 
    observed_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    geom: { type: "Point", coordinates: [80.2707, 13.0827] }, // Chennai coast
    recorded_by: "Research Vessel Sagar",
    validated_by: "Prof. S. Krishnan",
    dataset_id: "tn_marine_biodiversity",
    photos: [],
    species_name: "Oil Sardine",
    depth: 15,
    temperature: 27.8,
  },
  {
    id: "obs_4",
    species_id: "sp_1",
    observed_at: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    geom: { type: "Point", coordinates: [88.3639, 22.5726] }, // Kolkata coast  
    recorded_by: "Community Report",
    validated_by: null,
    dataset_id: "community_sightings",
    photos: [],
    species_name: "Yellowfin Tuna",
    depth: 45,
    temperature: 26.5,
  },
  // Western coast observations
  {
    id: "obs_5",
    species_id: "sp_4",
    observed_at: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
    geom: { type: "Point", coordinates: [74.1240, 15.2993] }, // Goa coast
    recorded_by: "Coastal Patrol",
    validated_by: "Marine Officer",
    dataset_id: "goa_fisheries_monitoring",
    photos: [],
    species_name: "Pomfret",
    depth: 30,
    temperature: 28.9,
  },
  {
    id: "obs_6",
    species_id: "sp_5",
    observed_at: new Date(Date.now() - 518400000).toISOString(), // 6 days ago
    geom: { type: "Point", coordinates: [69.6293, 23.0225] }, // Gujarat coast
    recorded_by: "Fisheries Cooperative",
    validated_by: "Regional Inspector", 
    dataset_id: "gujarat_catch_data",
    photos: [],
    species_name: "Bombay Duck",
    depth: 20,
    temperature: 25.4,
  },
  // Deep sea observations
  {
    id: "obs_7",
    species_id: "sp_6",
    observed_at: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
    geom: { type: "Point", coordinates: [73.5, 17.8] }, // Deep Arabian Sea
    recorded_by: "Research Vessel Sindhu Sadhana",
    validated_by: "Chief Marine Scientist",
    dataset_id: "deep_sea_exploration",
    photos: [],
    species_name: "Skipjack Tuna", 
    depth: 120,
    temperature: 24.1,
  },
  {
    id: "obs_8",
    species_id: "sp_2",
    observed_at: new Date(Date.now() - 691200000).toISOString(), // 8 days ago
    geom: { type: "Point", coordinates: [85.0985, 19.8135] }, // Bhubaneswar coast
    recorded_by: "Odisha Marine Survey",
    validated_by: "State Fisheries Director",
    dataset_id: "odisha_coastal_assessment", 
    photos: [],
    species_name: "Indian Mackerel",
    depth: 35,
    temperature: 27.2,
  }
];

export const geospatial: RequestHandler = (req, res) => {
  const bbox = (req.query.bbox as string | undefined)?.split(",").map(Number);
  const speciesId = req.query.speciesId as string | undefined;
  const start = req.query.start ? new Date(String(req.query.start)) : null;
  const end = req.query.end ? new Date(String(req.query.end)) : null;

  let filtered = observations;
  if (speciesId) filtered = filtered.filter((o) => o.species_id === speciesId);
  if (start) filtered = filtered.filter((o) => new Date(o.observed_at) >= start);
  if (end) filtered = filtered.filter((o) => new Date(o.observed_at) <= end);
  if (bbox && bbox.length === 4) {
    const [minX, minY, maxX, maxY] = bbox;
    filtered = filtered.filter((o) => {
      const [x, y] = o.geom.coordinates as [number, number];
      return x >= minX && x <= maxX && y >= minY && y <= maxY;
    });
  }

  const fc = {
    type: "FeatureCollection",
    features: filtered.map((o) => ({
      type: "Feature",
      id: o.id,
      properties: {
        species_id: o.species_id,
        species_name: o.species_name,
        observed_at: o.observed_at,
        dataset_id: o.dataset_id,
        recorded_by: o.recorded_by,
        validated_by: o.validated_by,
        depth: o.depth,
        temperature: o.temperature,
      },
      geometry: o.geom,
    })),
  };

  res.json({ data: fc, meta: { count: filtered.length } });
};

export const getObservation: RequestHandler = (req, res) => {
  const { id } = req.params;
  const found = observations.find((o) => o.id === id);
  if (!found) return res.status(404).json({ error: "Not found" });
  res.json({ observation: found });
};

export const createObservation: RequestHandler = (req, res) => {
  const body = req.body;
  const id = `obs_${observations.length + 1}`;
  const item = { id, ...body };
  observations.push(item);
  res.status(201).json({ observation: item });
};
