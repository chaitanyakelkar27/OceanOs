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
