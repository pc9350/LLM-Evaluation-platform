import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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

export interface SavedExperiment {
  id: string;
  name: string;
  prompt: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  results: Record<string, ExperimentResult>;
  timestamp: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  target: number;
  unlockedAt?: string;
}

interface ExperimentStore {
  results: Record<string, ExperimentResult>;
  savedExperiments: SavedExperiment[];
  achievements: Achievement[];
  userXp: number;
  userLevel: number;
  experimentCount: number;
  setResults: (results: Record<string, ExperimentResult> | ((prev: Record<string, ExperimentResult>) => Record<string, ExperimentResult>)) => void;
  saveExperiment: (experiment: SavedExperiment) => void;
  deleteSavedExperiment: (id: string) => void;
  addXp: (amount: number) => void;
  incrementExperimentCount: () => void;
  updateAchievement: (id: string, progress: number) => Achievement | null;
  getAchievement: (id: string) => Achievement | undefined;
  migrateExperiments: () => void;
}

// Model name mapping for migration
const MODEL_MAPPING: Record<string, string> = {
  "mixtral": "gemma2-9b",
  "llama-70b": "llama-3.3-70b",
};

// Define initial achievements
const initialAchievements: Achievement[] = [
  {
    id: 'first-experiment',
    name: 'First Experiment',
    description: 'Run your first experiment',
    icon: 'Medal',
    unlocked: false,
    progress: 0,
    target: 1,
  },
  {
    id: 'model-master',
    name: 'Model Master',
    description: 'Test 50 different prompts',
    icon: 'Star',
    unlocked: false,
    progress: 0,
    target: 50,
  },
  {
    id: 'ai-whisperer',
    name: 'AI Whisperer',
    description: 'Find the perfect prompt',
    icon: 'Award',
    unlocked: false,
    progress: 0,
    target: 10,
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Complete an experiment in under 2 seconds',
    icon: 'Zap',
    unlocked: false,
    progress: 0,
    target: 1,
  },
  {
    id: 'token-master',
    name: 'Token Master',
    description: 'Process over 10,000 tokens',
    icon: 'Hash',
    unlocked: false,
    progress: 0,
    target: 10000,
  }
];

export const useExperimentStore = create<ExperimentStore>()(
  persist(
    (set, get) => ({
      results: {},
      savedExperiments: [],
      achievements: initialAchievements,
      userXp: 0,
      userLevel: 1,
      experimentCount: 0,
      
      setResults: (results) => set((state) => ({
        results: typeof results === 'function' ? results(state.results) : results,
      })),
      
      saveExperiment: (experiment) => set((state) => ({
        savedExperiments: [...state.savedExperiments, experiment],
      })),
      
      deleteSavedExperiment: (id) => set((state) => ({
        savedExperiments: state.savedExperiments.filter(exp => exp.id !== id),
      })),
      
      migrateExperiments: () => set((state) => {
        // Migrate saved experiments with old model names
        const migratedExperiments = state.savedExperiments.map(experiment => {
          const migratedResults: Record<string, ExperimentResult> = {};
          
          Object.entries(experiment.results).forEach(([modelName, result]) => {
            // If this is an old model name, migrate it to the new one
            const newModelName = MODEL_MAPPING[modelName] || modelName;
            migratedResults[newModelName] = result;
          });
          
          return {
            ...experiment,
            results: migratedResults
          };
        });
        
        return {
          savedExperiments: migratedExperiments
        };
      }),
      
      addXp: (amount) => set((state) => {
        const newXp = state.userXp + amount;
        const newLevel = Math.floor(newXp / 100) + 1;
        
        return {
          userXp: newXp,
          userLevel: newLevel,
        };
      }),
      
      incrementExperimentCount: () => set((state) => ({
        experimentCount: state.experimentCount + 1,
      })),
      
      updateAchievement: (id, progress) => {
        const state = get();
        const achievement = state.achievements.find(a => a.id === id);
        
        if (!achievement) return null;
        
        // If already unlocked, don't update
        if (achievement.unlocked) return achievement;
        
        const newProgress = achievement.progress + progress;
        const unlocked = newProgress >= achievement.target;
        
        set((state) => ({
          achievements: state.achievements.map(a => 
            a.id === id 
              ? { 
                  ...a, 
                  progress: newProgress, 
                  unlocked, 
                  unlockedAt: unlocked ? new Date().toISOString() : undefined 
                } 
              : a
          )
        }));
        
        return {
          ...achievement,
          progress: newProgress,
          unlocked,
          unlockedAt: unlocked ? new Date().toISOString() : undefined
        };
      },
      
      getAchievement: (id) => {
        return get().achievements.find(a => a.id === id);
      },
    }),
    {
      name: 'experiment-storage',
      onRehydrateStorage: () => (state) => {
        // Run migration when store is rehydrated
        if (state) {
          state.migrateExperiments();
        }
      }
    }
  )
);