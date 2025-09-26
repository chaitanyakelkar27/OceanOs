import { RequestHandler } from "express";
import crypto from "crypto";
import { aiService } from "../services/aiService.js";

export const classifyTaxonomy: RequestHandler = async (req, res) => {
  const startTime = Date.now();
  const { traits, image } = req.body || {};

  try {
    // Parse traits if provided as string
    const parsedTraits = traits ? (typeof traits === 'string' ? JSON.parse(traits) : traits) : {};
    const hasImage = !!image;

    console.log('🔬 Processing species identification request:', { parsedTraits, hasImage });

    // Check if AI service is available
    const serviceAvailable = await aiService.isServiceAvailable();
    const modelAvailable = serviceAvailable ? await aiService.isModelAvailable() : false;

    let suggestions = [];
    let modelUsed = "OceanAI-v3.0 (Enhanced Heuristic)";

    if (serviceAvailable && modelAvailable) {
      try {
        // Use real Llama 3.1 8B for species identification
        suggestions = await aiService.identifySpecies(parsedTraits, hasImage);
        modelUsed = "Llama 3.1 8B (Marine Biology Expert)";
        console.log('🦙 Using Llama 3.1 8B for AI-powered identification');
      } catch (aiError) {
        console.error("AI service error, falling back to heuristics:", aiError);
        suggestions = await aiService.identifySpecies(parsedTraits, hasImage);
        modelUsed = "OceanAI-v3.0 (AI Fallback)";
      }
    } else {
      // Use enhanced heuristic matching
      suggestions = await aiService.identifySpecies(parsedTraits, hasImage);
      modelUsed = serviceAvailable ? "OceanAI-v3.0 (Model Unavailable)" : "OceanAI-v3.0 (Ollama Unavailable)";

      if (!serviceAvailable) {
        console.log('⚠️ Ollama service not available, using heuristic matching');
      } else if (!modelAvailable) {
        console.log('⚠️ Llama 3.1 8B model not available, using heuristic matching');
      }
    }

    const processingTime = (Date.now() - startTime) / 1000;

    console.log(`✅ Identified ${suggestions.length} species in ${processingTime.toFixed(2)}s using ${modelUsed}`);

    // Format response
    const enhancedSuggestions = suggestions.map(s => ({
      id: s.id,
      scientific_name: s.scientific_name,
      common_name: s.common_name,
      score: s.score,
      confidence: s.confidence,
      reasoning: s.reasoning || (modelAvailable ? "AI-powered marine biology analysis" : "Enhanced trait-based identification")
    }));

    res.json({
      input: { hasTraits: !!traits, hasImage: hasImage },
      suggestions: enhancedSuggestions,
      meta: {
        model: modelUsed,
        processing_time: processingTime,
        ai_service_available: serviceAvailable,
        llama_model_available: modelAvailable,
        llama_ready: serviceAvailable && modelAvailable,
        timestamp: new Date().toISOString(),
        note: (!serviceAvailable || !modelAvailable) ? "Install Ollama and run 'ollama pull llama3.1:8b' for full AI capabilities" : "AI-powered by Llama 3.1 8B"
      }
    });

  } catch (error) {
    console.error("Classification error:", error);
    res.status(500).json({
      error: "Species classification failed",
      message: error instanceof Error ? error.message : "Unknown error",
      suggestions: [],
      meta: {
        model: "Error",
        processing_time: (Date.now() - startTime) / 1000,
        ai_service_available: false,
        llama_ready: false
      }
    });
  }
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
