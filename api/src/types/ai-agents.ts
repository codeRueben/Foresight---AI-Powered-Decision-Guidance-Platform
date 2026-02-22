// Duplicate types for API - keep in sync with src/types/ai-agents.ts

export interface AIAgent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  description: string;
  systemPrompt: string;
  color: string;
  gradient: string;
  icon: string;
}

export interface AgentAnalysis {
  agentId: string;
  agentName: string;
  perspective: string;
  recommendation: string;
  confidence: number;
  keyInsights: string[];
  risks: string[];
  opportunities: string[];
  actionItems: string[];
}

export interface ConversationMessage {
  id: string;
  agentId: string | 'user';
  content: string;
  timestamp: Date;
  type: 'text' | 'insight' | 'warning' | 'suggestion' | 'question';
}

export interface AgentConsultation {
  decision: string;
  factors: {
    riskTolerance: number;
    financialStability: number;
    disciplineLevel: number;
    supportSystem: number;
  };
  analyses: AgentAnalysis[];
  consensus: string;
  divergentPoints: string[];
  overallConfidence: number;
}

export interface ActionPlan {
  shortTerm: ActionItem[];
  mediumTerm: ActionItem[];
  longTerm: ActionItem[];
  resources: Resource[];
  milestones: Milestone[];
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  timeframe: 'immediate' | 'week' | 'month';
  agentSource: string;
  completed: boolean;
}

export interface Resource {
  id: string;
  title: string;
  type: 'article' | 'tool' | 'book' | 'video' | 'course';
  url?: string;
  description: string;
  agentSource: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  successCriteria: string;
  agentSource: string;
}
