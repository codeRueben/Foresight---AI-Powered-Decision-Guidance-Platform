import { useState } from 'react';
import { AI_AGENTS } from '@/lib/ai-agents';
import { ShieldAlert, TrendingUp, DollarSign, Heart, Check, Sparkles } from 'lucide-react';

interface AgentSelectorProps {
  selectedAgents: string[];
  onSelectAgent: (agentId: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  disabled: boolean;
}

const iconMap: Record<string, React.ReactNode> = {
  'shield-alert': <ShieldAlert className="w-6 h-6" />,
  'trending-up': <TrendingUp className="w-6 h-6" />,
  'dollar-sign': <DollarSign className="w-6 h-6" />,
  'heart': <Heart className="w-6 h-6" />,
};

export function AgentSelector({ 
  selectedAgents, 
  onSelectAgent, 
  onAnalyze, 
  isAnalyzing,
  disabled 
}: AgentSelectorProps) {
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);

  return (
    <div className="w-full">
      <div className="mb-6">
        <h3 className="font-display text-xl text-foresight-text mb-2">
          Select Your AI Advisory Board
        </h3>
        <p className="text-sm text-foresight-text-muted">
          Choose which AI agents to consult for your decision. Each provides a unique perspective.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {AI_AGENTS.map((agent) => {
          const isSelected = selectedAgents.includes(agent.id);
          const isHovered = hoveredAgent === agent.id;

          return (
            <div
              key={agent.id}
              onClick={() => onSelectAgent(agent.id)}
              onMouseEnter={() => setHoveredAgent(agent.id)}
              onMouseLeave={() => setHoveredAgent(null)}
              className={`
                relative p-4 rounded-2xl cursor-pointer transition-all duration-300
                ${isSelected 
                  ? 'bg-gradient-to-r ' + agent.gradient + ' bg-opacity-20 border-2' 
                  : 'glass-card hover:scale-[1.02]'
                }
              `}
              style={{
                borderColor: isSelected ? agent.color : 'transparent',
                boxShadow: isSelected ? `0 0 30px ${agent.color}30` : undefined,
              }}
            >
              {/* Selection indicator */}
              <div className={`
                absolute top-3 right-3 w-6 h-6 rounded-full border-2 flex items-center justify-center
                transition-all duration-200
                ${isSelected 
                  ? 'border-white bg-white/20' 
                  : 'border-white/30'
                }
              `}>
                {isSelected && <Check className="w-4 h-4 text-white" />}
              </div>

              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                  style={{ 
                    background: `linear-gradient(135deg, ${agent.color}, ${agent.color}80)`,
                    boxShadow: `0 4px 20px ${agent.color}40`,
                  }}
                >
                  {iconMap[agent.icon]}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-display text-lg text-foresight-text mb-0.5">
                    {agent.name}
                  </h4>
                  <p className="text-xs font-medium mb-1" style={{ color: agent.color }}>
                    {agent.role}
                  </p>
                  <p className={`
                    text-xs text-foresight-text-muted leading-relaxed
                    transition-all duration-200
                    ${isHovered || isSelected ? 'opacity-100' : 'opacity-70'}
                  `}>
                    {agent.description}
                  </p>
                </div>
              </div>

              {/* Hover glow effect */}
              {isHovered && !isSelected && (
                <div 
                  className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${agent.color}10, transparent)`,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Selected count and analyze button */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-foresight-text-muted">
          <span className="font-medium text-foresight-text">{selectedAgents.length}</span>
          {' '}of {AI_AGENTS.length} agents selected
        </div>

        <button
          onClick={onAnalyze}
          disabled={disabled || selectedAgents.length === 0 || isAnalyzing}
          className="btn-primary flex items-center gap-2 px-6 py-3 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-foresight-accent/30 border-t-foresight-accent rounded-full animate-spin" />
              <span>Consulting Agents...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Get AI Analysis</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
