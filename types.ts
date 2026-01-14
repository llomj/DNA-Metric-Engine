export interface DNAMetrics {
  behavioralTraits: string[];
  epistemology: string;
  moralAxioms: string[];
  rhetoricalStructure: string;
  linguisticPatterns: string[];
  cognitiveBiases: string[];
  valueHierarchy: string[];
  emotionalConstraints: string;
}
export interface ModelProfile { id: string; name: string; metrics: DNAMetrics; summary: string; }
export interface UserProfile { 
  id: string; 
  name: string; 
  persona: string; 
  dnaMetrics?: DNAMetrics; 
  summary?: string;
  createdAt: number;
}
export interface DetectedFallacy { name: string; description: string; exampleFromContext: string; }
export interface Message { role: 'user' | 'model'; content: string; timestamp: number; detectedFallacies?: DetectedFallacy[]; }
export interface CustomizationSettings {
  aggressiveness: number; formality: number; emotionalExpressiveness: number; verbosity: number;
  analyticalDepth: number; skepticism: number; abstractness: number; intellectualDensity: number; ttsEnabled: boolean;
}
export enum AppStatus { INITIALIZING = 'INITIALIZING', IDLE = 'IDLE', ANALYZING = 'ANALYZING', ACTIVE = 'ACTIVE', ERROR = 'ERROR' }
