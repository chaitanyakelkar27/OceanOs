import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { login, me, refresh, logout } from "./routes/auth";
import { searchSpecies, getSpecies, createSpecies, updateSpecies } from "./routes/species";
import { geospatial, getObservation, createObservation } from "./routes/observations";
import { listSensors, sensorData } from "./routes/sensors";
import { upload, datasetStatus, approveDataset } from "./routes/datasets";
import { getStats } from "./routes/stats";
import { classifyTaxonomy, measureOtolith, ednaMatch, createIngestJob, getIngestJob } from "./routes/ai";

export function createServer() {
  const app = express();

  // Enhanced CORS configuration for tunneled access from Netlify
  const corsOptions = {
    origin: [
      'http://localhost:3000',
      'http://localhost:8080',
      'http://localhost:8081',
      'http://localhost:8082',
      'https://oces.netlify.app', // Your Netlify domain
      /^https:\/\/.*\.netlify\.app$/, // Any Netlify subdomain
      /^https:\/\/.*\.loca\.lt$/, // LocalTunnel domains
      /^https:\/\/.*\.ngrok\.io$/, // ngrok domains (if used)
      /^https:\/\/.*\.ngrok-free\.app$/ // ngrok free domains
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Client',
      'X-Provenance',
      'Accept',
      'Origin',
      'X-Requested-With'
    ],
    credentials: true,
    optionsSuccessStatus: 200 // For legacy browser support
  };

  // Middleware
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Auth
  app.post("/api/auth/login", login);
  app.post("/api/auth/refresh", refresh);
  app.get("/api/auth/me", me);
  app.post("/api/auth/logout", logout);

  // Species
  app.get("/api/species", searchSpecies);
  app.get("/api/species/:id", getSpecies);
  app.post("/api/species", createSpecies);
  app.put("/api/species/:id", updateSpecies);

  // Observations
  app.get("/api/observations/geospatial", geospatial);
  app.get("/api/observations/:id", getObservation);
  app.post("/api/observations", createObservation);

  // Sensors
  app.get("/api/sensors", listSensors);
  app.get("/api/sensors/:id/data", sensorData);

  // Datasets / uploads
  app.post("/api/upload", upload);
  app.get("/api/datasets/:id/status", datasetStatus);
  app.post("/api/datasets/:id/approve", approveDataset);

  // Stats
  app.get("/api/stats", getStats);

  // AI modules
  app.post("/api/taxonomy/classify", classifyTaxonomy);
  app.post("/api/otolith/shape/measure", measureOtolith);
  app.post("/api/edna/match", ednaMatch);

  // Ingestion
  app.post("/api/ingest/jobs", createIngestJob);
  app.get("/api/ingest/jobs/:id", getIngestJob);

  return app;
}
