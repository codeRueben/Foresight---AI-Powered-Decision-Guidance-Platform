import OpenAI from 'openai';
import type { AIAgent, AgentAnalysis } from '../types/ai-agents';

// Only initialize OpenAI if API key is available
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

interface AnalysisRequest {
  decision: string;
  factors: {
    riskTolerance: number;
    financialStability: number;
    disciplineLevel: number;
    supportSystem: number;
  };
  agent: AIAgent;
}

interface ChatRequest {
  decision: string;
  factors: {
    riskTolerance: number;
    financialStability: number;
    disciplineLevel: number;
    supportSystem: number;
  };
  agent: AIAgent;
  messageHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  userMessage: string;
}

// Cost-effective model for production
const MODEL = 'gpt-4o-mini';

export async function generateAgentAnalysis(request: AnalysisRequest): Promise<AgentAnalysis> {
  const { decision, factors, agent } = request;

  // Check if we should use mock responses (for development/free tier)
  if (!process.env.OPENAI_API_KEY || process.env.USE_MOCK_AI === 'true') {
    return generateMockAnalysis(request);
  }

  try {
    const prompt = buildAnalysisPrompt(decision, factors, agent);
    
    if (!openai) {
      throw new Error('OpenAI not configured');
    }

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: agent.systemPrompt },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from OpenAI');
    }

    return parseAnalysisResponse(content, agent);
  } catch (error) {
    console.error('OpenAI API error:', error);
    // Fallback to mock analysis
    return generateMockAnalysis(request);
  }
}

export async function generateChatResponse(request: ChatRequest): Promise<string> {
  const { decision, factors, agent, messageHistory, userMessage } = request;

  if (!process.env.OPENAI_API_KEY || process.env.USE_MOCK_AI === 'true') {
    return generateMockChatResponse(userMessage, agent);
  }

  try {
    const contextPrompt = buildContextPrompt(decision, factors);
    
    const messages = [
      { role: 'system', content: agent.systemPrompt + '\n\n' + contextPrompt },
      ...messageHistory,
      { role: 'user', content: userMessage },
    ];

    if (!openai) {
      throw new Error('OpenAI not configured');
    }

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: messages as any,
      temperature: 0.8,
      max_tokens: 500,
    });

    return response.choices[0]?.message?.content || 'I apologize, but I could not generate a response at this time.';
  } catch (error) {
    console.error('OpenAI chat error:', error);
    return generateMockChatResponse(userMessage, agent);
  }
}

function buildAnalysisPrompt(
  decision: string,
  factors: { riskTolerance: number; financialStability: number; disciplineLevel: number; supportSystem: number },
  agent: AIAgent
): string {
  return `
Please analyze the following decision and provide your perspective:

DECISION: "${decision}"

USER PROFILE:
- Risk Tolerance: ${factors.riskTolerance}/100
- Financial Stability: ${factors.financialStability}/100
- Discipline Level: ${factors.disciplineLevel}/100
- Support System: ${factors.supportSystem}/100

Please provide your analysis in the following JSON format:
{
  "perspective": "Your overall perspective on this decision (2-3 sentences)",
  "recommendation": "Your primary recommendation (1-2 sentences)",
  "confidence": 75,
  "keyInsights": ["Insight 1", "Insight 2", "Insight 3"],
  "risks": ["Risk 1", "Risk 2", "Risk 3"],
  "opportunities": ["Opportunity 1", "Opportunity 2"],
  "actionItems": ["Action 1", "Action 2", "Action 3"]
}

Confidence should be a number between 0-100 representing how confident you are in your analysis.
Provide 2-4 items for each array field. Be specific and actionable.
`;
}

function buildContextPrompt(
  decision: string,
  factors: { riskTolerance: number; financialStability: number; disciplineLevel: number; supportSystem: number }
): string {
  return `
Context for this conversation:
- User is deciding: "${decision}"
- Risk Tolerance: ${factors.riskTolerance}/100
- Financial Stability: ${factors.financialStability}/100
- Discipline Level: ${factors.disciplineLevel}/100
- Support System: ${factors.supportSystem}/100

Keep responses concise (2-4 sentences) and focused on helping the user make their decision.
`;
}

function parseAnalysisResponse(content: string, agent: AIAgent): AgentAnalysis {
  try {
    // Try to extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        agentId: agent.id,
        agentName: agent.name,
        perspective: parsed.perspective || 'Analysis completed.',
        recommendation: parsed.recommendation || 'Consider all factors carefully.',
        confidence: Math.min(100, Math.max(0, parsed.confidence || 70)),
        keyInsights: parsed.keyInsights || [],
        risks: parsed.risks || [],
        opportunities: parsed.opportunities || [],
        actionItems: parsed.actionItems || [],
      };
    }
  } catch (e) {
    console.error('Failed to parse AI response:', e);
  }

  // Fallback parsing
  return {
    agentId: agent.id,
    agentName: agent.name,
    perspective: 'Analysis based on your profile and decision.',
    recommendation: content.slice(0, 200),
    confidence: 70,
    keyInsights: ['Review your decision carefully', 'Consider all factors'],
    risks: ['Uncertainty in outcomes'],
    opportunities: ['Potential for growth'],
    actionItems: ['Gather more information', 'Consult with advisors'],
  };
}

function generateMockAnalysis(request: AnalysisRequest): AgentAnalysis {
  const { decision, factors, agent } = request;
  
  const riskLevel = factors.riskTolerance > 60 ? 'high' : factors.riskTolerance < 40 ? 'low' : 'moderate';
  const financialLevel = factors.financialStability > 60 ? 'secure' : 'challenging';
  
  const templates: Record<string, AgentAnalysis> = {
    'risk-analyst': {
      agentId: 'risk-analyst',
      agentName: 'Aria',
      perspective: `With ${riskLevel} risk tolerance and ${financialLevel} finances, this decision requires careful consideration of potential downsides.`,
      recommendation: factors.riskTolerance > 60 
        ? 'Your risk tolerance is high, but ensure you have contingency plans.'
        : 'Consider smaller steps to minimize exposure while moving forward.',
      confidence: 75,
      keyInsights: [
        'Market conditions could shift unexpectedly',
        'Your support network will be crucial',
        'Financial buffer recommended',
      ],
      risks: [
        'Initial income instability',
        'Unexpected costs',
        'Market competition',
      ],
      opportunities: [
        'Learning from early challenges',
        'Building resilience',
      ],
      actionItems: [
        'Build 6-month emergency fund',
        'Create contingency plan',
        'Identify exit strategies',
      ],
    },
    'opportunity-coach': {
      agentId: 'opportunity-coach',
      agentName: 'Blaze',
      perspective: `Your discipline (${factors.disciplineLevel}%) and support (${factors.supportSystem}%) position you well for growth.`,
      recommendation: 'This decision opens doors to significant development.',
      confidence: 82,
      keyInsights: [
        'Skills are highly transferable',
        'Network effects will compound',
        'Early mover advantage',
      ],
      risks: [
        'Opportunity cost of delay',
        'Increasing competition',
      ],
      opportunities: [
        'Rapid skill acquisition',
        'Valuable network building',
        'Exponential growth potential',
        'Personal fulfillment gains',
      ],
      actionItems: [
        'Start building portfolio',
        'Connect with 3 professionals',
        'Set up progress tracking',
      ],
    },
    'financial-advisor': {
      agentId: 'financial-advisor',
      agentName: 'Cora',
      perspective: `Financial outlook: ${factors.financialStability > 60 ? 'Stable with growth potential' : 'Challenging initially'}.`,
      recommendation: factors.financialStability > 60
        ? 'You have cushion to weather initial turbulence.'
        : 'Consider phased approach.',
      confidence: 68,
      keyInsights: [
        'Break-even at 8-12 months',
        'Multiple revenue streams needed',
        'Tax implications favorable',
      ],
      risks: [
        'Cash flow gaps in months 3-6',
        'Healthcare cost increases',
      ],
      opportunities: [
        'Tax deductions available',
        'Higher earning ceiling',
        'Investment in skills',
      ],
      actionItems: [
        'Set up business account',
        'Consult tax professional',
        'Create monthly budget',
      ],
    },
    'life-mentor': {
      agentId: 'life-mentor',
      agentName: 'Dawn',
      perspective: `Life impact: Aligns ${factors.disciplineLevel > 60 ? 'well' : 'moderately'} with your values.`,
      recommendation: 'Prioritize relationships during transition.',
      confidence: 85,
      keyInsights: [
        'Greater autonomy improves satisfaction',
        'Flexible schedule benefits relationships',
        'Alignment with personal values',
      ],
      risks: [
        'Work-life boundaries may blur',
        'Social isolation risk',
        'Stress on relationships',
      ],
      opportunities: [
        'More time for family',
        'Reduced commute stress',
        'Greater sense of purpose',
        'Improved mental health',
      ],
      actionItems: [
        'Schedule regular check-ins',
        'Establish work boundaries',
        'Prioritize self-care',
      ],
    },
  };

  return templates[agent.id] || templates['risk-analyst'];
}

function generateMockChatResponse(userMessage: string, agent: AIAgent): string {
  const responses: Record<string, string[]> = {
    'risk-analyst': [
      "That's a valid concern. Have you considered building a 6-month emergency fund before proceeding?",
      "From a risk perspective, I'd recommend starting with a smaller test run to validate your approach.",
      "The key is having contingency plans. What would you do if things don't go as expected?",
      "Your risk tolerance suggests you can handle uncertainty, but don't skip the planning phase.",
    ],
    'opportunity-coach': [
      "That's exactly the right mindset! This could be a huge growth opportunity for you.",
      "Have you thought about who in your network could help accelerate this journey?",
      "The skills you'll gain will be valuable regardless of the outcome. That's a win-win.",
      "I see massive potential here. What's holding you back from starting today?",
    ],
    'financial-advisor': [
      "Let's run the numbers. What's your current monthly burn rate and runway?",
      "From a financial standpoint, diversifying your income streams would reduce risk.",
      "Have you calculated the tax implications? There might be deductions you're missing.",
      "I'd recommend setting up a separate business account to track expenses properly.",
    ],
    'life-mentor': [
      "How does this decision align with your core values and long-term vision?",
      "Remember to prioritize your wellbeing during this transition. Self-care isn't selfish.",
      "Have you discussed this with the important people in your life? Their support matters.",
      "Trust your intuition. You know what's right for you better than anyone else.",
    ],
  };

  const agentResponses = responses[agent.id] || responses['risk-analyst'];
  return agentResponses[Math.floor(Math.random() * agentResponses.length)];
}
