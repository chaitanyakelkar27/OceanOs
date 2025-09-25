import { RequestHandler } from "express";
import crypto from "crypto";

export const classifyTaxonomy: RequestHandler = (req, res) => {
  const { traits, image } = req.body || {};
  
  // Simulate AI processing time
  const processingTime = Math.random() * 1.5 + 0.8; // 0.8-2.3 seconds
  
  // Enhanced species database for Indian Ocean marine life
  const speciesDatabase = [
    { id: "sp_1", scientific_name: "Thunnus albacares", common_name: "Yellowfin Tuna", habitat: "pelagic", typical_length: 150 },
    { id: "sp_2", scientific_name: "Scomber japonicus", common_name: "Japanese Mackerel", habitat: "coastal", typical_length: 35 },
    { id: "sp_3", scientific_name: "Sardinella longiceps", common_name: "Indian Oil Sardine", habitat: "coastal", typical_length: 20 },
    { id: "sp_4", scientific_name: "Pampus argenteus", common_name: "Silver Pomfret", habitat: "coastal", typical_length: 40 },
    { id: "sp_5", scientific_name: "Harpadon nehereus", common_name: "Bombay Duck", habitat: "coastal", typical_length: 30 },
    { id: "sp_6", scientific_name: "Katsuwonus pelamis", common_name: "Skipjack Tuna", habitat: "pelagic", typical_length: 80 },
    { id: "sp_7", scientific_name: "Rastrelliger kanagurta", common_name: "Indian Mackerel", habitat: "coastal", typical_length: 25 },
    { id: "sp_8", scientific_name: "Lutjanus argentimaculatus", common_name: "Mangrove Red Snapper", habitat: "reef", typical_length: 120 },
  ];

  let suggestions = [];
  
  // Simulate AI classification logic based on inputs
  if (traits) {
    const parsedTraits = typeof traits === 'string' ? JSON.parse(traits) : traits;
    
    // Filter by traits and calculate confidence scores
    suggestions = speciesDatabase
      .map(species => {
        let score = 0.4 + Math.random() * 0.3; // Base random score
        
        // Boost score based on matching traits
        if (parsedTraits.habitat && species.habitat === parsedTraits.habitat) {
          score += 0.2;
        }
        
        if (parsedTraits.length) {
          const lengthDiff = Math.abs(species.typical_length - parseInt(parsedTraits.length));
          const lengthScore = Math.max(0, 1 - (lengthDiff / species.typical_length));
          score += lengthScore * 0.15;
        }
        
        // Add some randomness for color/fin matching
        if (parsedTraits.color) score += Math.random() * 0.1;
        if (parsedTraits.fins) score += Math.random() * 0.05;
        
        return {
          ...species,
          score: Math.min(0.95, score) // Cap at 95% to show realistic uncertainty
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 4); // Top 4 results
  } else if (image) {
    // Image-based classification (simulated)
    suggestions = speciesDatabase
      .map(species => ({
        ...species,
        score: 0.3 + Math.random() * 0.65 // Random scores for image classification
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // Top 5 results for images
  } else {
    // Fallback general suggestions
    suggestions = [
      { ...speciesDatabase[0], score: 0.85 },
      { ...speciesDatabase[1], score: 0.72 },
      { ...speciesDatabase[2], score: 0.58 },
    ];
  }

  // Add confidence categories and processing metadata
  const enhancedSuggestions = suggestions.map(s => ({
    id: s.id,
    scientific_name: s.scientific_name,
    common_name: s.common_name,
    score: s.score,
    confidence: s.score >= 0.8 ? 'high' : s.score >= 0.6 ? 'medium' : 'low'
  }));

  // Simulate async processing
  setTimeout(() => {
    res.json({ 
      input: { hasTraits: !!traits, hasImage: !!image },
      suggestions: enhancedSuggestions,
      meta: { 
        model: "OceanAI-v2.1",
        processing_time: processingTime,
        total_species_analyzed: speciesDatabase.length,
        confidence_threshold: 0.6
      }
    });
  }, processingTime * 1000);
};

export const measureOtolith: RequestHandler = (req, res) => {
  const { image } = req.body || {};
  res.json({
    input: { hasImage: !!image },
    morphometrics: { area: 123.4, perimeter: 67.8, efd: [0.12, 0.03, 0.07] },
    meta: { method: "efd" },
  });
};

export const ednaMatch: RequestHandler = (req, res) => {
  const { sequence } = req.body || {};
  res.json({
    query: { length: sequence?.length || 0 },
    matches: [
      { species_id: "sp_1", scientific_name: "Thunnus albacares", identity: 0.97 },
      { species_id: "sp_2", scientific_name: "Sardinella longiceps", identity: 0.91 },
    ],
    meta: { db: "refseq", version: "mock" },
  });
};

const ingestJobs = new Map<string, { status: string }>();
export const createIngestJob: RequestHandler = (_req, res) => {
  const id = crypto.randomUUID();
  ingestJobs.set(id, { status: "queued" });
  res.status(202).json({ id, status: "queued" });
};
export const getIngestJob: RequestHandler = (req, res) => {
  const job = ingestJobs.get(req.params.id) || { status: "queued" };
  res.json({ id: req.params.id, ...job });
};
