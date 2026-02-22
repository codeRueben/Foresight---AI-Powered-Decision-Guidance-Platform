import { Router } from 'express';
import { z } from 'zod';
import { generateAgentAnalysis, generateChatResponse } from '../services/ai-service';
import type { AIAgent } from '../types/ai-agents';

const router = Router();

// AI Agents configuration
const AI_AGENTS: AIAgent[] = [
  {
    id: 'risk-analyst',
    name: 'Aria',
    role: 'Risk Analyst',
    avatar: '🔴',
    description: 'Identifies potential risks, downsides, and worst-case scenarios to help you prepare for challenges.',
    color: '#FF6B6B',
    gradient: 'from-red-500 to-orange-500',
    icon: 'shield-alert',
    systemPrompt: `You are Aria, a Risk Analyst AI. Your role is to identify potential risks, downsides, and worst-case scenarios for the user's decision.

Focus on:
- What could go wrong?
- Hidden risks and pitfalls
- Worst-case scenarios
- Risk mitigation strategies
- Contingency planning

Be thorough but constructive. Don't just list problems - offer solutions and mitigation strategies. Use a cautious but encouraging tone.`,
  },
  {
    id: 'opportunity-coach',
    name: 'Blaze',
    role: 'Opportunity Coach',
    avatar: '🔵',
    description: 'Discovers growth potential, hidden opportunities, and maps the path to success.',
    color: '#4ECDC4',
    gradient: 'from-cyan-500 to-blue-500',
    icon: 'trending-up',
    systemPrompt: `You are Blaze, an Opportunity Coach AI. Your role is to identify growth potential, opportunities, and best-case scenarios for the user's decision.

Focus on:
- What could go right?
- Hidden opportunities
- Best-case scenarios
- Growth potential
- Success strategies
- Action steps for achieving goals

Be optimistic but realistic. Identify concrete opportunities and provide actionable steps to achieve them. Use an encouraging, energizing tone.`,
  },
  {
    id: 'financial-advisor',
    name: 'Cora',
    role: 'Financial Advisor',
    avatar: '🟢',
    description: 'Analyzes financial implications, cost-benefit ratios, and long-term economic impact.',
    color: '#4ADE80',
    gradient: 'from-emerald-500 to-green-500',
    icon: 'dollar-sign',
    systemPrompt: `You are Cora, a Financial Advisor AI. Your role is to analyze the financial implications of the user's decision.

Focus on:
- Cost-benefit analysis
- Financial risks and rewards
- ROI projections
- Budget considerations
- Financial planning strategies
- Economic impact (short and long term)

Be analytical and thorough. Provide specific financial insights and practical budgeting advice. Use a professional but accessible tone.`,
  },
  {
    id: 'life-mentor',
    name: 'Dawn',
    role: 'Life Balance Mentor',
    avatar: '🟣',
    description: 'Considers wellbeing, relationships, work-life balance, and long-term happiness.',
    color: '#A78BFA',
    gradient: 'from-violet-500 to-purple-500',
    icon: 'heart',
    systemPrompt: `You are Dawn, a Life Balance Mentor AI. Your role is to consider the personal, emotional, and relational aspects of the user's decision.

Focus on:
- Wellbeing and mental health
- Relationships impact
- Work-life balance
- Long-term happiness
- Personal values alignment
- Quality of life considerations

Be empathetic and holistic. Consider the whole person, not just the practical aspects. Use a warm, supportive tone.`,
  },
];

// Validation schemas
const analyzeRequestSchema = z.object({
  decision: z.string().min(1).max(1000),
  factors: z.object({
    riskTolerance: z.number().min(0).max(100),
    financialStability: z.number().min(0).max(100),
    disciplineLevel: z.number().min(0).max(100),
    supportSystem: z.number().min(0).max(100),
  }),
  agentIds: z.array(z.string()).min(1).max(4),
});

const chatRequestSchema = z.object({
  decision: z.string().min(1).max(1000),
  factors: z.object({
    riskTolerance: z.number().min(0).max(100),
    financialStability: z.number().min(0).max(100),
    disciplineLevel: z.number().min(0).max(100),
    supportSystem: z.number().min(0).max(100),
  }),
  agentId: z.string(),
  messageHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })),
  userMessage: z.string().min(1).max(500),
});

// GET /api/agents/list - Get available agents
router.get('/list', (_req, res) => {
  // Return agents without system prompts for security
  const publicAgents = AI_AGENTS.map(({ systemPrompt, ...rest }) => rest);
  res.json({ agents: publicAgents });
});

// POST /api/agents/analyze - Get analysis from multiple agents
router.post('/analyze', async (req, res) => {
  try {
    const validated = analyzeRequestSchema.parse(req.body);
    const { decision, factors, agentIds } = validated;

    // Find requested agents
    const selectedAgents = AI_AGENTS.filter(agent => agentIds.includes(agent.id));
    
    if (selectedAgents.length === 0) {
      return res.status(400).json({ error: 'No valid agents selected' });
    }

    // Generate analyses in parallel
    const analysisPromises = selectedAgents.map(agent =>
      generateAgentAnalysis({ decision, factors, agent })
    );

    const analyses = await Promise.all(analysisPromises);

    // Calculate consensus
    const avgConfidence = analyses.reduce((sum, a) => sum + a.confidence, 0) / analyses.length;
    
    const recommendations = analyses.map(a => a.recommendation.toLowerCase());
    const positiveCount = recommendations.filter(r => 
      r.includes('proceed') || r.includes('good') || r.includes('well') || r.includes('recommend')
    ).length;
    const cautiousCount = recommendations.filter(r => 
      r.includes('caution') || r.includes('consider') || r.includes('careful')
    ).length;

    let consensus: string;
    if (positiveCount >= 3) {
      consensus = 'Strong consensus to proceed with appropriate preparation.';
    } else if (positiveCount >= 2) {
      consensus = 'Moderate support for proceeding. Address key concerns first.';
    } else if (cautiousCount >= 3) {
      consensus = 'Advisors recommend caution. Consider delaying or adjusting approach.';
    } else {
      consensus = 'Mixed opinions. Gather more information before deciding.';
    }

    // Find divergent points
    const divergentPoints: string[] = [];
    const riskAgent = analyses.find(a => a.agentId === 'risk-analyst');
    const oppAgent = analyses.find(a => a.agentId === 'opportunity-coach');
    
    if (riskAgent && oppAgent) {
      if (riskAgent.risks.length > oppAgent.opportunities.length + 2) {
        divergentPoints.push('Risk Analyst sees more challenges than Opportunity Coach sees benefits');
      }
      if (riskAgent.confidence < 60 && oppAgent.confidence > 80) {
        divergentPoints.push('Opportunity Coach is significantly more confident than Risk Analyst');
      }
    }

    res.json({
      analyses,
      consensus,
      divergentPoints,
      overallConfidence: Math.round(avgConfidence),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.issues 
      });
    }
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Failed to generate analysis' });
  }
});

// POST /api/agents/chat - Continue conversation with specific agent
router.post('/chat', async (req, res) => {
  try {
    const validated = chatRequestSchema.parse(req.body);
    const { decision, factors, agentId, messageHistory, userMessage } = validated;

    const agent = AI_AGENTS.find(a => a.id === agentId);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const response = await generateChatResponse({
      decision,
      factors,
      agent,
      messageHistory,
      userMessage,
    });

    res.json({ response });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.issues 
      });
    }
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

export default router;
