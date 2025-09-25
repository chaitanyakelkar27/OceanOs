import { RequestHandler } from "express";
import crypto from "crypto";

const datasets: any[] = [];

export const upload: RequestHandler = (_req, res) => {
  const jobId = crypto.randomUUID();
  // In a real impl, create presigned S3 URL and queue a job
  const url = `https://example-s3.local/upload/${jobId}`;
  res.json({ uploadUrl: url, jobId, meta: { provider: "s3-compatible" } });
};

export const datasetStatus: RequestHandler = (req, res) => {
  const { id } = req.params;
  const ds = datasets.find((d) => d.id === id) || { id, processing_status: "queued" };
  res.json({ dataset: ds, meta: { reviewed: false } });
};

export const approveDataset: RequestHandler = (req, res) => {
  const { id } = req.params;
  res.json({ dataset: { id, processing_status: "approved", reviewer_notes: req.body?.note || "" } });
};
