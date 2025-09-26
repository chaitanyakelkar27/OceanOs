import { RequestHandler } from "express";
import { DataSubmission, ApprovalRequest, SubmissionStatus } from "@shared/api";

// In-memory storage for demo (use a database in production)
let submissions: DataSubmission[] = [
  {
    id: "1",
    title: "Coral Reef Species Observation",
    description: "New species identification in Great Barrier Reef section A-7",
    dataType: "species",
    submittedBy: "2", // researcher@university.edu
    submittedAt: "2024-03-15T10:30:00.000Z",
    status: "pending",
    data: {
      species: "Acropora cervicornis",
      location: { lat: -16.2839, lng: 145.7781 },
      depth: 15,
      temperature: 26.5,
      observations: "Healthy colony with active polyp extension"
    },
    attachments: ["/uploads/coral-sample-1.jpg", "/uploads/coral-sample-2.jpg"]
  },
  {
    id: "2",
    title: "Water Quality Sensor Data",
    description: "Monthly pH and salinity measurements from monitoring station B-12",
    dataType: "sensor",
    submittedBy: "3", // researcher2@lab.org
    submittedAt: "2024-03-10T14:15:00.000Z",
    status: "approved",
    reviewedBy: "1",
    reviewedAt: "2024-03-11T09:00:00.000Z",
    reviewNotes: "Data validated and meets quality standards",
    data: {
      stationId: "B-12",
      measurements: [
        { date: "2024-03-01", pH: 8.1, salinity: 35.2, temperature: 24.8 },
        { date: "2024-03-02", pH: 8.0, salinity: 35.1, temperature: 25.1 }
      ]
    }
  }
];

// Get all submissions (government sees all, researchers see only their own)
export const getSubmissions: RequestHandler = (req, res) => {
  const user = (req as any).user;
  
  let userSubmissions = submissions;
  
  if (user.role === "researcher") {
    // Researchers only see their own submissions plus approved ones
    userSubmissions = submissions.filter(s => 
      s.submittedBy === user.id || s.status === "approved"
    );
  }
  
  res.json({ 
    submissions: userSubmissions,
    meta: { 
      total: userSubmissions.length,
      fetchedAt: new Date().toISOString() 
    }
  });
};

// Get pending submissions for government review
export const getPendingSubmissions: RequestHandler = (req, res) => {
  const pendingSubmissions = submissions.filter(s => s.status === "pending");
  
  res.json({ 
    submissions: pendingSubmissions,
    meta: { 
      total: pendingSubmissions.length,
      fetchedAt: new Date().toISOString() 
    }
  });
};

// Create new submission
export const createSubmission: RequestHandler = (req, res) => {
  const user = (req as any).user;
  const { title, description, dataType, data, attachments } = req.body;
  
  const newSubmission: DataSubmission = {
    id: Date.now().toString(),
    title,
    description,
    dataType,
    submittedBy: user.id,
    submittedAt: new Date().toISOString(),
    status: "pending",
    data,
    attachments
  };
  
  submissions.push(newSubmission);
  
  res.status(201).json({ 
    submission: newSubmission,
    message: "Submission created successfully. Awaiting government approval."
  });
};

// Approve or reject submission (government only)
export const reviewSubmission: RequestHandler = (req, res) => {
  const user = (req as any).user;
  const { submissionId } = req.params;
  const { action, notes } = req.body as ApprovalRequest;
  
  const submission = submissions.find(s => s.id === submissionId);
  
  if (!submission) {
    return res.status(404).json({ error: "Submission not found" });
  }
  
  if (submission.status !== "pending") {
    return res.status(400).json({ error: "Submission has already been reviewed" });
  }
  
  // Update submission
  submission.status = action === "approve" ? "approved" : "rejected";
  submission.reviewedBy = user.id;
  submission.reviewedAt = new Date().toISOString();
  submission.reviewNotes = notes;
  
  res.json({ 
    submission,
    message: `Submission ${action === "approve" ? "approved" : "rejected"} successfully`
  });
};

// Get submission by ID
export const getSubmissionById: RequestHandler = (req, res) => {
  const user = (req as any).user;
  const { submissionId } = req.params;
  
  const submission = submissions.find(s => s.id === submissionId);
  
  if (!submission) {
    return res.status(404).json({ error: "Submission not found" });
  }
  
  // Check access permissions
  if (user.role === "researcher" && submission.submittedBy !== user.id && submission.status !== "approved") {
    return res.status(403).json({ error: "Access denied" });
  }
  
  res.json({ submission });
};

// Update submission (only by original submitter and only if pending)
export const updateSubmission: RequestHandler = (req, res) => {
  const user = (req as any).user;
  const { submissionId } = req.params;
  const updates = req.body;
  
  const submission = submissions.find(s => s.id === submissionId);
  
  if (!submission) {
    return res.status(404).json({ error: "Submission not found" });
  }
  
  if (submission.submittedBy !== user.id) {
    return res.status(403).json({ error: "Can only update your own submissions" });
  }
  
  if (submission.status !== "pending") {
    return res.status(400).json({ error: "Cannot update reviewed submissions" });
  }
  
  // Update allowed fields
  Object.assign(submission, {
    ...updates,
    id: submission.id, // Prevent ID changes
    submittedBy: submission.submittedBy, // Prevent submitter changes
    submittedAt: submission.submittedAt, // Prevent timestamp changes
    status: submission.status, // Prevent status changes
  });
  
  res.json({ 
    submission,
    message: "Submission updated successfully"
  });
};