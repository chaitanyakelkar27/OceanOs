/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Authentication & User Management Types
 */
export type UserRole = "government" | "researcher";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organization?: string;
  createdAt: string;
  isActive: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  meta: {
    issuedAt: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  organization?: string;
}

/**
 * Data Submission & Approval Types
 */
export type SubmissionStatus = "pending" | "approved" | "rejected";

export interface DataSubmission {
  id: string;
  title: string;
  description: string;
  dataType: "observation" | "sensor" | "species" | "other";
  submittedBy: string; // User ID
  submittedAt: string;
  status: SubmissionStatus;
  reviewedBy?: string; // User ID of government reviewer
  reviewedAt?: string;
  reviewNotes?: string;
  data: Record<string, any>; // The actual data being submitted
  attachments?: string[]; // File URLs/paths
}

export interface ApprovalRequest {
  submissionId: string;
  action: "approve" | "reject";
  notes?: string;
}

/**
 * AI Species Identification Types
 */
export interface SpeciesSuggestion {
  id: string;
  scientific_name: string;
  common_name: string;
  score: number;
  confidence: 'high' | 'medium' | 'low';
  reasoning?: string;
}

export interface ClassificationInput {
  hasTraits: boolean;
  hasImage: boolean;
}

export interface ClassificationMeta {
  model: string;
  processing_time: number;
  ai_service_available: boolean;
  timestamp: string;
}

export interface TaxonomyClassificationResponse {
  input: ClassificationInput;
  suggestions: SpeciesSuggestion[];
  meta: ClassificationMeta;
}

/**
 * Physical traits for species identification
 */
export interface PhysicalTraits {
  length?: number;
  habitat?: 'coastal' | 'pelagic' | 'reef' | 'deep-sea';
  color?: string;
  fins?: string;
}
