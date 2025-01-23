import { create } from 'zustand'

interface Metrics {
  tokenCount: number;
  promptTokens: number;
  completionTokens: number;
  cost: number;
}

export interface ExperimentResult {
  response: string;
  responseTime: number;
  metrics: Metrics;
  error?: string;
}

interface ExperimentStore {
  results: Record<string, ExperimentResult>;
  setResults: (results: Record<string, ExperimentResult> | ((prev: Record<string, ExperimentResult>) => Record<string, ExperimentResult>)) => void;
}

export const useExperimentStore = create<ExperimentStore>((set) => ({
  results: {},
  setResults: (results) => set((state) => ({
    results: typeof results === 'function' ? results(state.results) : results,
  })),
}));