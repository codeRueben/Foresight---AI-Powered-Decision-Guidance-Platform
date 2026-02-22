import { useState } from 'react';
import type { AgentAnalysis } from '@/types/ai-agents';
import { AI_AGENTS } from '@/lib/ai-agents';
import { AIChat } from './AIChat';
import { AlertTriangle, Lightbulb, Target, CheckCircle, TrendingUp, AlertCircle, MessageCircle } from 'lucide-react';

interface AnalysisDashboardProps {
  analyses: AgentAnalysis[];
  consensus: string;
  divergentPoints: string[];
  overallConfidence: number;
  decision: string;
  factors: {
    riskTolerance: number;
    financialStability: number;
    disciplineLevel: number;
    supportSystem: number;
  };
}

export function AnalysisDashboard({ 
  analyses, 
  consensus, 
  divergentPoints, 
  overallConfidence,
  decision,
  factors,
}: AnalysisDashboardProps) {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [chatAgentId, setChatAgentId] = useState<string | null>(null);

  const getAgentColor = (agentId: string) => {
    const agent = AI_AGENTS.find(a => a.id === agentId);
    return agent?.color || '#4F6DFF';
  };

  const getAgentName = (agentId: string) => {
    const agent = AI_AGENTS.find(a => a.id === agentId);
    return agent?.name || 'Agent';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-emerald-400';
    if (confidence >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getConfidenceBg = (confidence: number) => {
    if (confidence >= 80) return 'bg-emerald-500';
    if (confidence >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full">
      {/* Header with consensus */}
      <div className="glass-card-strong p-5 mb-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-foresight-accent to-foresight-accent/60 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-lg text-foresight-text mb-1">Consensus</h3>
            <p className="text-sm text-foresight-text-muted leading-relaxed">{consensus}</p>
            
            {/* Overall confidence */}
            <div className="mt-3 flex items-center gap-3">
              <span className="text-xs text-foresight-text-muted">Overall Confidence:</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getConfidenceBg(overallConfidence)} transition-all duration-500`}
                    style={{ width: `${overallConfidence}%` }}
                  />
                </div>
                <span className={`text-sm font-medium ${getConfidenceColor(overallConfidence)}`}>
                  {overallConfidence}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divergent points warning */}
      {divergentPoints.length > 0 && (
        <div className="glass-card p-4 mb-4 border-l-4 border-yellow-500">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-foresight-text mb-1">Points of Divergence</h4>
              <ul className="space-y-1">
                {divergentPoints.map((point, idx) => (
                  <li key={idx} className="text-sm text-foresight-text-muted">{point}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-foresight-accent text-white'
              : 'bg-white/5 text-foresight-text-muted hover:bg-white/10'
          }`}
        >
          Overview
        </button>
        {analyses.map((analysis) => (
          <button
            key={analysis.agentId}
            onClick={() => setActiveTab(analysis.agentId)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === analysis.agentId
                ? 'text-white'
                : 'bg-white/5 text-foresight-text-muted hover:bg-white/10'
            }`}
            style={{
              backgroundColor: activeTab === analysis.agentId ? getAgentColor(analysis.agentId) : undefined,
            }}
          >
            {getAgentName(analysis.agentId)}
            <span className={`text-xs ${activeTab === analysis.agentId ? 'text-white/80' : getConfidenceColor(analysis.confidence)}`}>
              {analysis.confidence}%
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'overview' ? (
          // Overview - show summary of all agents
          analyses.map((analysis) => (
            <div key={analysis.agentId} className="glass-card p-4">
              <div className="flex items-start gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${getAgentColor(analysis.agentId)}30` }}
                >
                  <span className="text-lg font-bold" style={{ color: getAgentColor(analysis.agentId) }}>
                    {getAgentName(analysis.agentId)[0]}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-foresight-text">{getAgentName(analysis.agentId)}</h4>
                    <span className={`text-xs font-medium ${getConfidenceColor(analysis.confidence)}`}>
                      {analysis.confidence}% confidence
                    </span>
                  </div>
                  <p className="text-sm text-foresight-text-muted line-clamp-2">{analysis.recommendation}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          // Individual agent detailed view
          analyses
            .filter(a => a.agentId === activeTab)
            .map((analysis) => (
              <div key={analysis.agentId} className="space-y-4">
                {/* Perspective */}
                <div className="glass-card p-4">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-foresight-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-foresight-text mb-1">Perspective</h4>
                      <p className="text-sm text-foresight-text-muted leading-relaxed">{analysis.perspective}</p>
                    </div>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="glass-card p-4">
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-foresight-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-foresight-text mb-1">Recommendation</h4>
                      <p className="text-sm text-foresight-text-muted leading-relaxed">{analysis.recommendation}</p>
                    </div>
                  </div>
                </div>

                {/* Key Insights */}
                {analysis.keyInsights.length > 0 && (
                  <div className="glass-card p-4">
                    <h4 className="font-medium text-foresight-text mb-3 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-400" />
                      Key Insights
                    </h4>
                    <ul className="space-y-2">
                      {analysis.keyInsights.map((insight, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-foresight-text-muted">
                          <span className="text-foresight-accent mt-1">•</span>
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Risks */}
                {analysis.risks.length > 0 && (
                  <div className="glass-card p-4 border-l-4 border-red-500">
                    <h4 className="font-medium text-foresight-text mb-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      Risks to Consider
                    </h4>
                    <ul className="space-y-2">
                      {analysis.risks.map((risk, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-foresight-text-muted">
                          <span className="text-red-400 mt-1">•</span>
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Opportunities */}
                {analysis.opportunities.length > 0 && (
                  <div className="glass-card p-4 border-l-4 border-emerald-500">
                    <h4 className="font-medium text-foresight-text mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      Opportunities
                    </h4>
                    <ul className="space-y-2">
                      {analysis.opportunities.map((opp, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-foresight-text-muted">
                          <span className="text-emerald-400 mt-1">•</span>
                          {opp}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Items */}
                {analysis.actionItems.length > 0 && (
                  <div className="glass-card p-4 border-l-4 border-foresight-accent">
                    <h4 className="font-medium text-foresight-text mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-foresight-accent" />
                      Recommended Actions
                    </h4>
                    <ul className="space-y-2">
                      {analysis.actionItems.map((action, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-foresight-text-muted">
                          <span className="text-foresight-accent mt-1">{idx + 1}.</span>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Chat Button */}
                <button
                  onClick={() => setChatAgentId(analysis.agentId)}
                  className="w-full btn-secondary flex items-center justify-center gap-2 py-3"
                  style={{ borderColor: `${getAgentColor(analysis.agentId)}40` }}
                >
                  <MessageCircle className="w-4 h-4" style={{ color: getAgentColor(analysis.agentId) }} />
                  <span>Chat with {getAgentName(analysis.agentId)}</span>
                </button>
              </div>
            ))
        )}
      </div>

      {/* Chat Modal */}
      {chatAgentId && (
        <AIChat
          agentId={chatAgentId}
          decision={decision}
          factors={factors}
          onClose={() => setChatAgentId(null)}
        />
      )}
    </div>
  );
}
