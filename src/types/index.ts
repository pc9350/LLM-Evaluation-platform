export interface ModelResult {
  modelName: string;
  response: string;
  responseTime: number;
  metrics: {
    tokenCount: number;
    promptTokens: number;
    completionTokens: number;
    cost: number;
    quality?: number;
    readability?: number;
    coherence?: number;
    vocabulary?: number;
  };
} 