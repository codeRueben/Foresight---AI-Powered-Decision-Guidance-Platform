export interface EducationalContent {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const DECISION_FRAMEWORKS: EducationalContent[] = [
  {
    id: 'swot',
    title: 'SWOT Analysis',
    description: 'Evaluate Strengths, Weaknesses, Opportunities, and Threats to get a comprehensive view of your decision.',
    icon: 'grid',
  },
  {
    id: 'pros-cons',
    title: 'Pros & Cons',
    description: 'List all advantages and disadvantages, then weigh them by importance to see which side wins.',
    icon: 'scale',
  },
  {
    id: 'regret-minimization',
    title: 'Regret Minimization',
    description: 'Project yourself to age 80 and ask: Will I regret not doing this? This clarifies long-term priorities.',
    icon: 'clock',
  },
  {
    id: 'second-order',
    title: 'Second-Order Thinking',
    description: 'Consider not just the immediate effects, but the consequences of those consequences.',
    icon: 'git-branch',
  },
];

export const FACTOR_EXPLANATIONS: Record<string, { title: string; description: string; tips: string[] }> = {
  riskTolerance: {
    title: 'Risk Tolerance',
    description: 'How comfortable are you with uncertainty and potential setbacks?',
    tips: [
      'High risk tolerance: You handle uncertainty well and bounce back quickly from setbacks',
      'Low risk tolerance: You prefer stability and predictability',
      'Consider your financial cushion and support system when assessing',
    ],
  },
  financialStability: {
    title: 'Financial Stability',
    description: 'Your current financial security and ability to weather storms.',
    tips: [
      'Include emergency funds, stable income, and low debt',
      'Consider runway: how long can you sustain without income?',
      'Factor in healthcare, insurance, and unexpected costs',
    ],
  },
  disciplineLevel: {
    title: 'Discipline Level',
    description: 'Your ability to stick to plans, routines, and long-term goals.',
    tips: [
      'High discipline: You consistently follow through on commitments',
      'Consider your track record with similar challenges',
      'Self-employment and major changes require strong self-discipline',
    ],
  },
  supportSystem: {
    title: 'Support System',
    description: 'The network of people who can help, advise, and encourage you.',
    tips: [
      'Include family, friends, mentors, and professional networks',
      'Emotional support is as important as practical help',
      'Consider who you can call when things get tough',
    ],
  },
};

export const AI_AGENT_EDUCATION = {
  title: 'How AI Advisory Works',
  description: 'Our AI agents use different frameworks and perspectives to analyze your decision.',
  steps: [
    {
      title: 'Multiple Perspectives',
      description: 'Each AI agent specializes in a different aspect: risks, opportunities, finances, and life balance.',
    },
    {
      title: 'Personalized Analysis',
      description: 'Agents consider your specific situation, risk tolerance, and personal factors.',
    },
    {
      title: 'Consensus Building',
      description: 'We synthesize all perspectives to give you a balanced recommendation.',
    },
    {
      title: 'Actionable Guidance',
      description: 'Get specific steps, resources, and milestones to guide your journey.',
    },
  ],
};

export const TIMEFRAME_EXPLANATIONS = {
  threeMonths: {
    title: '3 Months: The Adjustment Period',
    description: 'The initial phase where you face the steepest learning curve and highest uncertainty.',
    whatToExpect: [
      'Income may dip or become irregular',
      'New routines and habits are forming',
      'High stress but also excitement',
      'Many unknowns and surprises',
    ],
    tips: [
      'Focus on learning, not perfection',
      'Build systems and routines early',
      'Track progress to see growth',
      'Lean on your support network',
    ],
  },
  oneYear: {
    title: '1 Year: The Growth Phase',
    description: 'You\'ve found your footing and are building momentum. Patterns emerge.',
    whatToExpect: [
      'More predictable income and workflow',
      'Skills have improved significantly',
      'Confidence is higher',
      'New challenges replace old ones',
    ],
    tips: [
      'Optimize your systems',
      'Invest in skill development',
      'Build long-term relationships',
      'Review and adjust goals',
    ],
  },
  fiveYears: {
    title: '5 Years: The Mastery Phase',
    description: 'You\'ve achieved stability and are operating at a high level.',
    whatToExpect: [
      'Expert-level competence',
      'Strong professional network',
      'Financial stability achieved',
      'Clear sense of direction',
    ],
    tips: [
      'Mentor others starting their journey',
      'Consider scaling or new ventures',
      'Focus on legacy and impact',
      'Maintain work-life balance',
    ],
  },
};

export const SUCCESS_METRICS = {
  financial: {
    title: 'Financial Health',
    indicators: [
      'Stable or growing income',
      'Emergency fund maintained',
      'Debt reduction or elimination',
      'Investment in growth',
    ],
  },
  emotional: {
    title: 'Emotional Wellbeing',
    indicators: [
      'Sense of fulfillment',
      'Stress levels manageable',
      'Confidence in decisions',
      'Work-life balance',
    ],
  },
  social: {
    title: 'Social Connections',
    indicators: [
      'Strong professional network',
      'Supportive relationships',
      'Meaningful collaborations',
      'Community involvement',
    ],
  },
  skills: {
    title: 'Skill Development',
    indicators: [
      'New competencies gained',
      'Expertise recognized by others',
      'Continuous learning habit',
      'Ability to teach others',
    ],
  },
};
