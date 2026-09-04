import { apiClient } from './client';

export interface Insight {
  type: string;
  title: string;
  description: string;
  breakdown: any;
  reasoning: string;
  severity: string;
}

export interface Action {
  type: string;
  title: string;
  description: string;
  potentialSavings: number;
  steps: string[];
  requiresConfirmation: boolean;
  target?: string;
}

export const fetchInsights = async (): Promise<Insight[]> => {
  const response = await apiClient.post('/chat/insights');
  return response.data.insights;
};

export const fetchActions = async (): Promise<Action[]> => {
  const response = await apiClient.post('/chat/actions');
  return response.data.actions;
};

export const explainInsight = async (insight: any): Promise<string> => {
  const response = await apiClient.post('/chat/explain', { insight });
  return response.data.explanation;
};

export const executeAction = async (actionId: string): Promise<void> => {
  await apiClient.post('/chat/execute-action', { actionId });
};

export const classifyTransaction = async (description: string, amount: number): Promise<string> => {
  const response = await apiClient.post('/chat/classify', { description, amount });
  return response.data.category;
};

export const sendChatQuery = async (query: string, history: any[] = []): Promise<string> => {
  const response = await apiClient.post('/chat/query', { query, history });
  return response.data.response;
};
