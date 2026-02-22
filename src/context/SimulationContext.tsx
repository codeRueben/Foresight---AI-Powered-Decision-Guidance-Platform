import React, { createContext, useContext, useState, useCallback } from 'react';

export interface DecisionFactors {
  riskTolerance: number;
  financialStability: number;
  disciplineLevel: number;
  supportSystem: number;
}

export interface SimulationOutcome {
  financial: { value: number; label: string };
  emotional: { value: number; label: string };
  social: { value: number; label: string };
  skills: { value: number; label: string };
  stress: { value: number; label: string };
}

export interface SimulationResult {
  threeMonths: SimulationOutcome;
  oneYear: SimulationOutcome;
  fiveYears: SimulationOutcome;
  summary: string;
  alternativePath: string;
}

export interface SavedScenario {
  id: string;
  decision: string;
  factors: DecisionFactors;
  result: SimulationResult;
  createdAt: Date;
  confidenceScore: number;
}

interface SimulationContextType {
  decision: string;
  setDecision: (decision: string) => void;
  factors: DecisionFactors;
  updateFactor: (factor: keyof DecisionFactors, value: number) => void;
  simulationResult: SimulationResult | null;
  runSimulation: () => void;
  savedScenarios: SavedScenario[];
  saveScenario: () => void;
  totalSimulations: number;
  insightPattern: string;
  decisionConfidence: number;
}

const defaultFactors: DecisionFactors = {
  riskTolerance: 50,
  financialStability: 50,
  disciplineLevel: 50,
  supportSystem: 50,
};

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const [decision, setDecision] = useState('');
  const [factors, setFactors] = useState<DecisionFactors>(defaultFactors);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([]);
  const [totalSimulations, setTotalSimulations] = useState(0);

  const updateFactor = useCallback((factor: keyof DecisionFactors, value: number) => {
    setFactors(prev => ({ ...prev, [factor]: value }));
  }, []);

  const runSimulation = useCallback(() => {
    const riskFactor = factors.riskTolerance / 100;
    const financialFactor = factors.financialStability / 100;
    const disciplineFactor = factors.disciplineLevel / 100;
    const supportFactor = factors.supportSystem / 100;

    const calculateOutcome = (timeframe: '3months' | '1year' | '5years'): SimulationOutcome => {
      const baseMultiplier = timeframe === '3months' ? 0.3 : timeframe === '1year' ? 0.7 : 1;
      
      return {
        financial: {
          value: Math.round((riskFactor * 0.6 + financialFactor * 0.4) * 100 * baseMultiplier),
          label: timeframe === '3months' ? 'Income dip' : timeframe === '1year' ? 'Portfolio growth' : 'Wealth stability',
        },
        emotional: {
          value: Math.round((disciplineFactor * 0.5 + supportFactor * 0.5) * 100 * baseMultiplier),
          label: timeframe === '3months' ? 'New rhythm' : timeframe === '1year' ? 'Confidence boost' : 'Inner peace',
        },
        social: {
          value: Math.round((supportFactor * 0.7 + riskFactor * 0.3) * 100 * baseMultiplier),
          label: timeframe === '3months' ? 'Network growth' : timeframe === '1year' ? 'Relationship shifts' : 'Deep connections',
        },
        skills: {
          value: Math.round((disciplineFactor * 0.8 + riskFactor * 0.2) * 100 * baseMultiplier),
          label: timeframe === '3months' ? 'Learning curve' : timeframe === '1year' ? 'Skill mastery' : 'Expert status',
        },
        stress: {
          value: Math.round((1 - (financialFactor * 0.5 + supportFactor * 0.5)) * 100 * baseMultiplier),
          label: timeframe === '3months' ? 'High uncertainty' : timeframe === '1year' ? 'Managing stress' : 'Stress mastery',
        },
      };
    };

    const threeMonths = calculateOutcome('3months');
    const oneYear = calculateOutcome('1year');
    const fiveYears = calculateOutcome('5years');

    const riskLevel = factors.riskTolerance > 60 ? 'ambitious' : factors.riskTolerance < 40 ? 'cautious' : 'balanced';
    const financialLevel = factors.financialStability > 60 ? 'secure' : 'challenging';
    
    const summary = `Based on your ${riskLevel} approach with ${financialLevel} financial backing, your decision shows ${threeMonths.emotional.value > 50 ? 'promising' : 'mixed'} short-term emotional outcomes, with significant improvements by year 5.`;
    
    const alternativePath = factors.riskTolerance > 60 
      ? 'A more conservative approach might provide earlier stability but slower growth.'
      : 'Taking bigger risks earlier could accelerate your timeline but increase initial stress.';

    // Create new object to ensure React detects state change
    const newResult: SimulationResult = {
      threeMonths: { ...threeMonths },
      oneYear: { ...oneYear },
      fiveYears: { ...fiveYears },
      summary,
      alternativePath,
    };

    setSimulationResult(newResult);
    setTotalSimulations(prev => prev + 1);
  }, [factors]);

  const saveScenario = useCallback(() => {
    if (!simulationResult || !decision) return;

    const confidenceScore = Math.round(
      (factors.riskTolerance + factors.financialStability + factors.disciplineLevel + factors.supportSystem) / 4
    );

    const newScenario: SavedScenario = {
      id: Date.now().toString(),
      decision,
      factors: { ...factors },
      result: simulationResult,
      createdAt: new Date(),
      confidenceScore,
    };

    setSavedScenarios(prev => [newScenario, ...prev]);
  }, [simulationResult, decision, factors]);

  // Calculate insight pattern based on factor preferences
  const insightPattern = (() => {
    const avg = (factors.riskTolerance + factors.financialStability + factors.disciplineLevel + factors.supportSystem) / 4;
    if (factors.riskTolerance > avg + 10) return 'You favor bold moves and calculated risks.';
    if (factors.financialStability > avg + 10) return 'You prioritize security and stability.';
    if (factors.disciplineLevel > avg + 10) return 'You trust systems and consistent effort.';
    if (factors.supportSystem > avg + 10) return 'You value community and shared journeys.';
    return 'You maintain a balanced approach to decisions.';
  })();

  const decisionConfidence = Math.round(
    (factors.riskTolerance + factors.financialStability + factors.disciplineLevel + factors.supportSystem) / 4
  );

  return (
    <SimulationContext.Provider
      value={{
        decision,
        setDecision,
        factors,
        updateFactor,
        simulationResult,
        runSimulation,
        savedScenarios,
        saveScenario,
        totalSimulations,
        insightPattern,
        decisionConfidence,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (context === undefined) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
}
