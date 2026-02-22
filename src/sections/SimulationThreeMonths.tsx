import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSimulation } from '../context/SimulationContext';
import { TrendingDown, Zap, Users, ArrowUpRight, RotateCcw } from 'lucide-react';

// Helper to get metric value with fallback
const getMetricValue = (result: any, key: string, hasDecision: boolean): string => {
  if (!result) return hasDecision ? '...' : '-';
  const value = result[key]?.value;
  if (value === undefined || value === null) return '-';
  if (key === 'social') return `+${value}`;
  if (key === 'financial') return `${value > 0 ? '+' : ''}${value}%`;
  return `+${value}%`;
};

gsap.registerPlugin(ScrollTrigger);

interface FlipCardProps {
  title: string;
  description: string;
  metric: { label: string; value: string };
  icon: React.ReactNode;
  color: string;
}

function FlipCard({ title, description, metric, icon, color }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="relative w-full h-full perspective-1000 cursor-pointer group gpu-accelerate"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative w-full h-full preserve-3d transition-transform duration-500 ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden glass-card p-5 flex flex-col hover:border-opacity-50 transition-all">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
            style={{ background: `${color}25`, boxShadow: `0 0 20px ${color}30` }}
          >
            <div style={{ color }}>{icon}</div>
          </div>
          <h3 className="font-display text-lg text-foresight-text mb-2">{title}</h3>
          <p className="text-sm text-foresight-text-muted/80 flex-grow leading-relaxed">{description}</p>
          <div className="mt-4 pt-3 border-t border-white/10">
            <p className="text-xs text-foresight-text-muted mb-1">{metric.label}</p>
            <p className="text-xl font-display" style={{ color, textShadow: `0 0 20px ${color}50` }}>
              {metric.value}
            </p>
          </div>
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight className="w-4 h-4 text-foresight-text-muted" />
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 backface-hidden rotate-y-180 glass-card p-5 flex flex-col"
          style={{ background: `linear-gradient(135deg, ${color}15, transparent)` }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
            style={{ background: `${color}35` }}
          >
            <div style={{ color }}>{icon}</div>
          </div>
          <h3 className="font-display text-lg text-foresight-text mb-2">Deeper Insight</h3>
          <p className="text-sm text-foresight-text-muted/80 flex-grow leading-relaxed">
            This phase is characterized by adjustment. The initial excitement meets reality, 
            and your {title.toLowerCase()} becomes a daily practice. Small wins compound faster than expected.
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFlipped(false);
            }}
            className="mt-3 flex items-center gap-2 text-xs text-foresight-text-muted hover:text-foresight-text transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Flip back
          </button>
        </div>
      </div>
    </div>
  );
}

export function SimulationThreeMonths() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  const { simulationResult, decision } = useSimulation();
  const hasDecision = decision.trim().length > 0;

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const cardsContainer = cardsContainerRef.current;

    if (!section || !headline || !cardsContainer) return;

    const cards = cardsContainer.querySelectorAll('.sim-card');

    const ctx = gsap.context(() => {
      // Simple fade-in animation
      gsap.fromTo(
        headline,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Cards fade in with stagger
      gsap.fromTo(
        cards,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: cardsContainer,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const result = simulationResult?.threeMonths;

  const cards = [
    {
      title: 'Income dip',
      description: 'Freelance pipelines take time; savings buffer matters.',
      metric: { label: 'Financial impact', value: getMetricValue(result, 'financial', hasDecision) },
      icon: <TrendingDown className="w-5 h-5" />,
      color: '#FF6B6B',
    },
    {
      title: 'New rhythm',
      description: 'You control the day. Energy improves, focus sharpens.',
      metric: { label: 'Wellbeing', value: getMetricValue(result, 'emotional', hasDecision) },
      icon: <Zap className="w-5 h-5" />,
      color: '#4ECDC4',
    },
    {
      title: 'Network growth',
      description: 'Outreach builds new relationships across industries.',
      metric: { label: 'Connections', value: getMetricValue(result, 'social', hasDecision) },
      icon: <Users className="w-5 h-5" />,
      color: '#4F6DFF',
    },
  ];

  return (
    <section
      ref={sectionRef}
      data-section="3months"
      className="relative w-full min-h-[80vh] flex flex-col items-center justify-center overflow-hidden py-16"
    >
      {/* Micro label */}
      <p className="absolute top-[10%] left-1/2 -translate-x-1/2 micro-label">
        SIMULATION
      </p>

      {/* Headline */}
      <h2
        ref={headlineRef}
        className="absolute top-[16%] left-1/2 -translate-x-1/2 font-display text-[clamp(48px,8vw,100px)] font-light text-foresight-text drop-shadow-[0_0_40px_rgba(79,109,255,0.3)]"
      >
        3 Months
      </h2>

      {/* Cards container */}
      <div
        ref={cardsContainerRef}
        className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[95vw] lg:max-w-[1200px] flex flex-col lg:flex-row justify-center gap-4 lg:gap-6 px-4"
      >
        {cards.map((card) => (
          <div
            key={card.title}
            className="sim-card w-full lg:w-[30%] h-[280px] lg:h-[320px] gpu-accelerate"
          >
            <FlipCard {...card} />
          </div>
        ))}
      </div>
    </section>
  );
}
