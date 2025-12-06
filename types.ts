export enum SimulationStatus {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  ALIGNING = 'ALIGNING',
  OPTIMIZED = 'OPTIMIZED'
}

export interface CoherenceMetric {
  concept: string;
  score: number;
}

export interface AncientScript {
  origin: string;
  age: number;
  resonance: number;
  purpose: string;
}

export interface Watcher {
  id: string;
  name: string;
  role: string;
  tone: string; // Added from Python script (Deep, Whisper, Harmonic)
  script: AncientScript; // Added from Python script
  aiPersonality: string; // Distinct personality for AI dialogue
  frequency: number; // Hz
  alignment: number; // 0-100%
  status: 'scanning' | 'locked' | 'harmonizing';
  x: number; // For visualization
  y: number; // For visualization
  history: number[]; // For charts
  coherenceMetrics: CoherenceMetric[];
  checksum?: string; // The cryptographic signature of the Sovereign Anchor
}

export interface Anchor {
  name: string;
  vision: string;
  signature_frequency: number;
  isActive: boolean;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  source: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'sovereign';
}