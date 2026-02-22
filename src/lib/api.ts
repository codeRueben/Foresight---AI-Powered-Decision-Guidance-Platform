const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Storage key for auth token
const TOKEN_KEY = 'foresight_token';

// Get stored token
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// Set token
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Remove token
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// API request helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// Auth API
export const auth = {
  register: (email: string, password: string) =>
    apiRequest<{ user: { id: string; email: string }; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  login: (email: string, password: string) =>
    apiRequest<{ user: { id: string; email: string }; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  me: () =>
    apiRequest<{ user: { id: string; email: string } }>('/auth/me'),
};

// Simulations API
export interface SimulationData {
  id?: string;
  decision: string;
  factors: {
    riskTolerance: number;
    financialStability: number;
    disciplineLevel: number;
    supportSystem: number;
  };
  results: {
    threeMonths: any;
    oneYear: any;
    fiveYears: any;
    summary: string;
    alternativePath: string;
  };
  created_at?: string;
}

export const simulations = {
  create: (data: SimulationData) =>
    apiRequest<SimulationData>('/simulations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  list: () =>
    apiRequest<SimulationData[]>('/simulations'),

  get: (id: string) =>
    apiRequest<SimulationData>(`/simulations/${id}`),

  delete: (id: string) =>
    apiRequest<void>(`/simulations/${id}`, {
      method: 'DELETE',
    }),
};

// AI Analysis API
export interface AnalysisResult {
  analysis: string;
  pros: string[];
  cons: string[];
  recommendation: string;
  confidenceScore: number;
}

export const decisions = {
  analyze: (decision: string, factors: SimulationData['factors']) =>
    apiRequest<AnalysisResult>('/decisions/analyze', {
      method: 'POST',
      body: JSON.stringify({ decision, factors }),
    }),
};

// AI Agents API
export interface ChatRequest {
  decision: string;
  factors: SimulationData['factors'];
  agentId: string;
  messageHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  userMessage: string;
}

export interface ChatResponse {
  response: string;
}

export const agents = {
  list: () =>
    apiRequest<{ agents: Array<{ id: string; name: string; role: string; description: string; color: string; icon: string }> }>('/agents/list'),
  
  analyze: (decision: string, factors: SimulationData['factors'], agentIds: string[]) =>
    apiRequest<{
      analyses: any[];
      consensus: string;
      divergentPoints: string[];
      overallConfidence: number;
    }>('/agents/analyze', {
      method: 'POST',
      body: JSON.stringify({ decision, factors, agentIds }),
    }),
  
  chat: (data: ChatRequest) =>
    apiRequest<ChatResponse>('/agents/chat', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Export apiClient for convenience
export const apiClient = {
  chatWithAgent: agents.chat,
};

export default {
  auth,
  simulations,
  decisions,
  agents,
  getToken,
  setToken,
  removeToken,
};
