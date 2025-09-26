import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { login, me, refresh, logout, register, requireAuth, requireGovernment, requireResearcher } from "./routes/auth";
import { getSubmissions, getPendingSubmissions, createSubmission, reviewSubmission, getSubmissionById, updateSubmission } from "./routes/submissions";
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
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:8080',
        'http://localhost:8081',
        'http://localhost:8082',
        'https://oces.netlify.app', // Your Netlify domain
      ];

      // Check against patterns for dynamic domains
      const allowedPatterns = [
        /^https:\/\/.*\.netlify\.app$/,
        /^https:\/\/.*\.loca\.lt$/,
        /^https:\/\/.*\.ngrok\.io$/,
        /^https:\/\/.*\.ngrok-free\.app$/
      ];

      const isAllowed = allowedOrigins.includes(origin) ||
        allowedPatterns.some(pattern => pattern.test(origin));

      console.log(`🌐 CORS Check - Origin: ${origin}, Allowed: ${isAllowed}`);

      if (isAllowed) {
        callback(null, true);
      } else {
        console.warn(`❌ CORS blocked origin: ${origin}`);
        callback(null, true); // Allow all for now during testing
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Client',
      'X-Provenance',
      'Accept',
      'Origin',
      'X-Requested-With',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers'
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    preflightContinue: false
  };

  // Additional CORS middleware for LocalTunnel compatibility
  app.use((req, res, next) => {
    // Set CORS headers manually as backup
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Client, X-Provenance');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '86400');

    console.log(`🔍 Request: ${req.method} ${req.url} from ${req.headers.origin || 'unknown'}`);

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      console.log('✈️ Handling preflight request');
      return res.status(200).end();
    }

    next();
  });

  // Apply CORS middleware
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
  app.post("/api/auth/register", register);
  app.post("/api/auth/refresh", refresh);
  app.get("/api/auth/me", me);
  app.post("/api/auth/logout", logout);

  // Data Submissions & Approval System
  app.get("/api/submissions", requireAuth, getSubmissions);
  app.get("/api/submissions/pending", ...requireGovernment, getPendingSubmissions);
  app.post("/api/submissions", ...requireResearcher, createSubmission);
  app.get("/api/submissions/:submissionId", requireAuth, getSubmissionById);
  app.put("/api/submissions/:submissionId", ...requireResearcher, updateSubmission);
  app.post("/api/submissions/:submissionId/review", ...requireGovernment, reviewSubmission);

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
