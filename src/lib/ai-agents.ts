import type { AIAgent, AgentAnalysis, ActionPlan } from '@/types/ai-agents';

export const AI_AGENTS: AIAgent[] = [
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

// Mock analysis generator for development (free tier)
export function generateMockAnalysis(
  agentId: string,
  _decision: string,
  factors: { riskTolerance: number; financialStability: number; disciplineLevel: number; supportSystem: number }
): AgentAnalysis {
  const agent = AI_AGENTS.find(a => a.id === agentId)!;
  
  // Use agent to avoid unused variable error
  void agent;
  
  const riskLevel = factors.riskTolerance > 60 ? 'high' : factors.riskTolerance < 40 ? 'low' : 'moderate';
  const financialLevel = factors.financialStability > 60 ? 'secure' : 'challenging';
  
  const analyses: Record<string, AgentAnalysis> = {
    'risk-analyst': {
      agentId: 'risk-analyst',
      agentName: 'Aria',
      perspective: `With your ${riskLevel} risk tolerance and ${financialLevel} financial position, this decision carries ${factors.riskTolerance > 50 ? 'significant' : 'moderate'} uncertainty.`,
      recommendation: factors.riskTolerance > 60 
        ? 'Your risk tolerance is high, but ensure you have contingency plans for worst-case scenarios.'
        : 'Consider taking smaller steps to minimize exposure while still moving forward.',
      confidence: 75,
      keyInsights: [
        'Market conditions could shift unexpectedly',
        'Your support network will be crucial during transitions',
        'Financial buffer recommended before proceeding',
      ],
      risks: [
        'Initial income instability during transition period',
        'Unexpected costs not accounted for in planning',
        'Market saturation or competition increase',
      ],
      opportunities: [
        'Learning from early failures can lead to stronger position',
        'Building resilience through managed risk exposure',
      ],
      actionItems: [
        'Build 6-month emergency fund before starting',
        'Create detailed contingency plan',
        'Identify exit strategies if things go wrong',
      ],
    },
    'opportunity-coach': {
      agentId: 'opportunity-coach',
      agentName: 'Blaze',
      perspective: `Your ${factors.disciplineLevel > 60 ? 'strong' : 'developing'} discipline and ${factors.supportSystem > 60 ? 'robust' : 'growing'} support system position you well for growth.`,
      recommendation: 'This decision opens doors to significant personal and professional development.',
      confidence: 82,
      keyInsights: [
        'Your skill set is highly transferable to this new path',
        'Network effects will compound over time',
        'Early mover advantage in emerging trends',
      ],
      risks: [
        'Opportunity cost of not acting sooner',
        'Competition may increase if you delay',
      ],
      opportunities: [
        'Rapid skill acquisition in high-demand areas',
        'Building valuable professional network',
        'Potential for exponential growth in 2-3 years',
        'Personal fulfillment and autonomy gains',
      ],
      actionItems: [
        'Start building your portfolio immediately',
        'Connect with 3 industry professionals this month',
        'Set up systems for consistent progress tracking',
      ],
    },
    'financial-advisor': {
      agentId: 'financial-advisor',
      agentName: 'Cora',
      perspective: `Financial outlook: ${factors.financialStability > 60 ? 'Stable foundation with growth potential' : 'Challenging initially, improving over time'}.`,
      recommendation: factors.financialStability > 60
        ? 'You have the financial cushion to weather initial turbulence.'
        : 'Consider phased approach to minimize financial strain.',
      confidence: 68,
      keyInsights: [
        'Break-even point estimated at 8-12 months',
        'Multiple revenue streams recommended',
        'Tax implications favor this timing',
      ],
      risks: [
        'Cash flow gaps in months 3-6',
        'Higher tax bracket considerations',
        'Healthcare/insurance cost increases',
      ],
      opportunities: [
        'Tax deductions for business expenses',
        'Higher earning ceiling long-term',
        'Investment in appreciating skills/assets',
      ],
      actionItems: [
        'Set up separate business banking account',
        'Consult with tax professional',
        'Create monthly budget with 20% buffer',
      ],
    },
    'life-mentor': {
      agentId: 'life-mentor',
      agentName: 'Dawn',
      perspective: `Life impact: This aligns ${factors.disciplineLevel > 60 ? 'well' : 'moderately'} with your values and supports long-term wellbeing.`,
      recommendation: 'Prioritize relationships and self-care during this transition for sustainable success.',
      confidence: 85,
      keyInsights: [
        'Greater autonomy will improve life satisfaction',
        'Flexible schedule benefits relationships',
        'Alignment with personal values increases fulfillment',
      ],
      risks: [
        'Work-life boundaries may blur initially',
        'Social isolation if not managed proactively',
        'Stress impact on relationships during transition',
      ],
      opportunities: [
        'More time for family and personal interests',
        'Reduced commute stress and time savings',
        'Greater sense of purpose and meaning',
        'Improved mental health from autonomy',
      ],
      actionItems: [
        'Schedule regular check-ins with loved ones',
        'Establish clear work boundaries from day one',
        'Prioritize self-care routines during transition',
      ],
    },
  };

  return analyses[agentId];
}

// Generate comprehensive action plan
export function generateActionPlan(
  _analyses: AgentAnalysis[],
  _decision: string
): ActionPlan {
  return {
    shortTerm: [
      {
        id: '1',
        title: 'Research and validate your decision',
        description: 'Gather more information about your chosen path',
        priority: 'high',
        timeframe: 'immediate',
        agentSource: 'Risk Analyst',
        completed: false,
      },
      {
        id: '2',
        title: 'Build emergency fund',
        description: 'Save 3-6 months of expenses before making the leap',
        priority: 'high',
        timeframe: 'month',
        agentSource: 'Financial Advisor',
        completed: false,
      },
      {
        id: '3',
        title: 'Connect with mentors',
        description: 'Reach out to people who have made similar transitions',
        priority: 'medium',
        timeframe: 'week',
        agentSource: 'Opportunity Coach',
        completed: false,
      },
    ],
    mediumTerm: [
      {
        id: '4',
        title: 'Develop core skills',
        description: 'Focus on the 3 most important skills for success',
        priority: 'high',
        timeframe: 'month',
        agentSource: 'Opportunity Coach',
        completed: false,
      },
      {
        id: '5',
        title: 'Create portfolio/samples',
        description: 'Build evidence of your capabilities',
        priority: 'medium',
        timeframe: 'month',
        agentSource: 'Opportunity Coach',
        completed: false,
      },
    ],
    longTerm: [
      {
        id: '6',
        title: 'Establish sustainable systems',
        description: 'Build routines and processes for long-term success',
        priority: 'medium',
        timeframe: 'month',
        agentSource: 'Life Mentor',
        completed: false,
      },
    ],
    resources: [
      {
        id: 'r1',
        title: 'The Lean Startup',
        type: 'book',
        description: 'Essential reading for anyone starting a new venture',
        agentSource: 'Opportunity Coach',
      },
      {
        id: 'r2',
        title: 'Personal Finance Dashboard',
        type: 'tool',
        description: 'Track your finances during the transition',
        agentSource: 'Financial Advisor',
      },
      {
        id: 'r3',
        title: 'Work-Life Balance Guide',
        type: 'article',
        description: 'Strategies for maintaining balance during transitions',
        agentSource: 'Life Mentor',
      },
    ],
    milestones: [
      {
        id: 'm1',
        title: 'Decision Made',
        description: 'Commit to your path',
        targetDate: 'Week 1',
        successCriteria: 'Clear decision documented with reasoning',
        agentSource: 'All Agents',
      },
      {
        id: 'm2',
        title: 'Financial Safety Net',
        description: 'Emergency fund in place',
        targetDate: 'Month 1-3',
        successCriteria: '6 months expenses saved',
        agentSource: 'Financial Advisor',
      },
      {
        id: 'm3',
        title: 'First Client/Project',
        description: 'Initial validation of your path',
        targetDate: 'Month 3-6',
        successCriteria: 'First paid work completed',
        agentSource: 'Opportunity Coach',
      },
    ],
  };
}

export function calculateConsensus(analyses: AgentAnalysis[]): { consensus: string; divergentPoints: string[]; overallConfidence: number } {
  const avgConfidence = analyses.reduce((sum, a) => sum + a.confidence, 0) / analyses.length;
  
  // Simple consensus logic
  const recommendations = analyses.map(a => a.recommendation.toLowerCase());
  const positiveCount = recommendations.filter(r => r.includes('proceed') || r.includes('good') || r.includes('well')).length;
  const cautiousCount = recommendations.filter(r => r.includes('caution') || r.includes('consider') || r.includes('careful')).length;
  
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
  const riskOpinions = analyses.filter(a => a.agentId === 'risk-analyst')[0]?.risks.length || 0;
  const oppOpinions = analyses.filter(a => a.agentId === 'opportunity-coach')[0]?.opportunities.length || 0;
  
  if (riskOpinions > oppOpinions + 2) {
    divergentPoints.push('Risk Analyst sees more challenges than Opportunity Coach sees benefits');
  }
  
  return {
    consensus,
    divergentPoints,
    overallConfidence: Math.round(avgConfidence),
  };
}
