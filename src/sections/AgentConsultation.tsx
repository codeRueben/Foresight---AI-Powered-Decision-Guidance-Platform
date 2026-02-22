import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSimulation } from '@/context/SimulationContext';
import { AgentSelector } from '@/components/AgentSelector';
import { AnalysisDashboard } from '@/components/AnalysisDashboard';
import { AI_AGENTS, generateMockAnalysis, calculateConsensus, generateActionPlan } from '@/lib/ai-agents';
import type { AgentAnalysis, AgentConsultation as AgentConsultationType, ActionPlan } from '@/types/ai-agents';
import { Users, ArrowRight, FileText, Calendar, CheckSquare } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function AgentConsultation() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const { decision, factors, simulationResult } = useSimulation();
  
  const [selectedAgents, setSelectedAgents] = useState<string[]>(
    AI_AGENTS.map(a => a.id)
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyses, setAnalyses] = useState<AgentAnalysis[]>([]);
  const [consultation, setConsultation] = useState<AgentConsultationType | null>(null);
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const [showResults, setShowResults] = useState(false);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        content,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 50%',
            scrub: 1,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleSelectAgent = (agentId: string) => {
    setSelectedAgents(prev => 
      prev.includes(agentId)
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    );
  };

  const handleAnalyze = async () => {
    if (!decision.trim() || selectedAgents.length === 0) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock analyses for selected agents
    const newAnalyses = selectedAgents.map(agentId => 
      generateMockAnalysis(agentId, decision, factors)
    );
    
    const { consensus, divergentPoints, overallConfidence } = calculateConsensus(newAnalyses);
    
    setAnalyses(newAnalyses);
    setConsultation({
      decision,
      factors,
      analyses: newAnalyses,
      consensus,
      divergentPoints,
      overallConfidence,
    });
    
    // Generate action plan
    const plan = generateActionPlan(newAnalyses, decision);
    setActionPlan(plan);
    
    setIsAnalyzing(false);
    setShowResults(true);
  };

  const hasDecision = decision.trim().length > 0;

  return (
    <section
      ref={sectionRef}
      data-section="agent-consultation"
      className="relative w-full py-16 lg:py-24"
    >
      <div ref={contentRef} className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users className="w-5 h-5 text-foresight-accent" />
            <span className="micro-label">AI ADVISORY BOARD</span>
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-light text-foresight-text mb-4">
            Meet Your AI Advisors
          </h2>
          <p className="text-lg text-foresight-text-muted max-w-2xl mx-auto">
            Get personalized guidance from multiple AI perspectives. Each advisor brings unique expertise 
            to help you make a well-rounded decision.
          </p>
        </div>

        {!showResults ? (
          // Agent Selection View
          <div className="max-w-3xl mx-auto">
            <div className="glass-card-strong p-6 lg:p-8">
              {!hasDecision ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-foresight-accent/20 flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-foresight-accent" />
                  </div>
                  <h3 className="font-display text-xl text-foresight-text mb-2">
                    Enter Your Decision First
                  </h3>
                  <p className="text-foresight-text-muted mb-4">
                    Go back and describe what you're deciding to get AI guidance.
                  </p>
                  <button
                    onClick={() => {
                      const decisionSection = document.querySelector('[data-section="decision"]');
                      if (decisionSection) {
                        gsap.to(window, {
                          duration: 1,
                          scrollTo: { y: decisionSection, offsetY: 0 },
                          ease: 'power2.inOut',
                        });
                      }
                    }}
                    className="btn-primary flex items-center gap-2 mx-auto"
                  >
                    <span>Enter Decision</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <AgentSelector
                  selectedAgents={selectedAgents}
                  onSelectAgent={handleSelectAgent}
                  onAnalyze={handleAnalyze}
                  isAnalyzing={isAnalyzing}
                  disabled={!hasDecision}
                />
              )}
            </div>
          </div>
        ) : (
          // Results View
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Analysis */}
            <div className="lg:col-span-2">
              <div className="glass-card-strong p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display text-xl text-foresight-text">AI Analysis Results</h3>
                  <button
                    onClick={() => setShowResults(false)}
                    className="text-sm text-foresight-text-muted hover:text-foresight-text transition-colors"
                  >
                    Start Over
                  </button>
                </div>
                
                {consultation && (
                  <AnalysisDashboard
                    analyses={analyses}
                    consensus={consultation.consensus}
                    divergentPoints={consultation.divergentPoints}
                    overallConfidence={consultation.overallConfidence}
                    decision={decision}
                    factors={factors}
                  />
                )}
              </div>
            </div>

            {/* Action Plan Sidebar */}
            <div className="space-y-4">
              {actionPlan && (
                <>
                  {/* Quick Stats */}
                  <div className="glass-card p-4">
                    <h4 className="font-medium text-foresight-text mb-3 flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-foresight-accent" />
                      Action Items
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-foresight-text-muted">Immediate</span>
                        <span className="text-foresight-text font-medium">
                          {actionPlan.shortTerm.filter(i => i.timeframe === 'immediate').length}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-foresight-text-muted">This Week</span>
                        <span className="text-foresight-text font-medium">
                          {actionPlan.shortTerm.filter(i => i.timeframe === 'week').length}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-foresight-text-muted">This Month</span>
                        <span className="text-foresight-text font-medium">
                          {actionPlan.shortTerm.filter(i => i.timeframe === 'month').length + 
                           actionPlan.mediumTerm.length}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Top Priority Actions */}
                  <div className="glass-card p-4">
                    <h4 className="font-medium text-foresight-text mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-foresight-accent" />
                      Top Priorities
                    </h4>
                    <div className="space-y-3">
                      {actionPlan.shortTerm
                        .filter(item => item.priority === 'high')
                        .slice(0, 3)
                        .map((item, idx) => (
                          <div key={item.id} className="flex items-start gap-2">
                            <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <div>
                              <p className="text-sm text-foresight-text">{item.title}</p>
                              <p className="text-xs text-foresight-text-muted">{item.agentSource}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Next Steps Button */}
                  <button
                    onClick={() => {
                      const simSection = document.querySelector('[data-section="3months"]');
                      if (simSection) {
                        gsap.to(window, {
                          duration: 1,
                          scrollTo: { y: simSection, offsetY: 0 },
                          ease: 'power2.inOut',
                        });
                      }
                    }}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    <span>View Timeline</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
