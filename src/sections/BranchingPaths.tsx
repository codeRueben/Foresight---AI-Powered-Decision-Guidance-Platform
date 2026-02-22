import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSimulation } from '../context/SimulationContext';
import { GitBranch, Shield, Rocket, Check, X, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface PathCardProps {
  title: string;
  subtitle: string;
  description: string;
  pros: string[];
  cons: string[];
  icon: React.ReactNode;
  color: string;
  isSelected: boolean;
  onSelect: () => void;
}

function PathCard({ title, subtitle, description, pros, cons, icon, color, isSelected, onSelect }: PathCardProps) {
  return (
    <div
      onClick={onSelect}
      className={`relative glass-card p-6 lg:p-8 cursor-pointer transition-all duration-500 gpu-accelerate ${
        isSelected ? 'scale-[1.02] shadow-[0_0_40px_rgba(79,109,255,0.2)]' : 'hover:scale-[1.01]'
      }`}
      style={{ 
        borderColor: isSelected ? `${color}60` : undefined,
        boxShadow: isSelected ? `0 0 40px ${color}30, inset 0 0 20px ${color}10` : undefined
      }}
    >
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ background: `${color}25`, boxShadow: `0 0 20px ${color}30` }}
            >
              <div style={{ color }}>{icon}</div>
            </div>
            <div>
              <h3 className="font-display text-xl text-foresight-text">{title}</h3>
              <p className="text-xs text-foresight-text-muted">{subtitle}</p>
            </div>
          </div>
          
          {/* Selection indicator */}
          <div
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
              isSelected
                ? 'border-foresight-accent bg-foresight-accent/20'
                : 'border-white/20'
            }`}
          >
            {isSelected && <div className="w-3 h-3 rounded-full bg-foresight-accent" />}
          </div>
        </div>

        <p className="text-sm text-foresight-text-muted/80 leading-relaxed">{description}</p>

        {/* Pros and Cons */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1">
              <Check className="w-3 h-3" /> Pros
            </p>
            <ul className="space-y-1.5">
              {pros.map((pro, i) => (
                <li key={i} className="text-sm text-foresight-text/80 flex items-start gap-2">
                  <span className="text-emerald-400/60 mt-0.5">•</span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-rose-400 mb-2 flex items-center gap-1">
              <X className="w-3 h-3" /> Cons
            </p>
            <ul className="space-y-1.5">
              {cons.map((con, i) => (
                <li key={i} className="text-sm text-foresight-text/80 flex items-start gap-2">
                  <span className="text-rose-400/60 mt-0.5">•</span>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BranchingPaths() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const { factors, simulationResult } = useSimulation();
  const [selectedPath, setSelectedPath] = useState<'stay' | 'leap' | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const cards = cardsRef.current;

    if (!section || !heading || !cards) return;

    const cardElements = cards.querySelectorAll('.path-card');

    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(
        heading,
        { y: 30, opacity: 0 },
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

      // Cards animation
      cardElements.forEach((card) => {
        gsap.fromTo(
          card,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              end: 'top 60%',
              scrub: 1,
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const paths = [
    {
      id: 'stay' as const,
      title: 'Stay and optimize',
      subtitle: 'The gradual path',
      description: 'Grow inside the system. Slower autonomy, steadier compounding. Build your side projects while maintaining the safety net.',
      pros: ['Stable income', 'Lower stress', 'Time to experiment'],
      cons: ['Slower growth', 'Limited autonomy', 'Potential regret'],
      icon: <Shield className="w-7 h-7" />,
      color: '#4ECDC4',
    },
    {
      id: 'leap' as const,
      title: 'Leap earlier',
      subtitle: 'The bold path',
      description: 'Higher volatility. Faster feedback. More stress, more agency. Full commitment to your vision without a safety net.',
      pros: ['Rapid growth', 'Full autonomy', 'No regrets'],
      cons: ['Financial risk', 'Higher stress', 'Uncertainty'],
      icon: <Rocket className="w-7 h-7" />,
      color: '#FF6B6B',
    },
  ];

  return (
    <section
      ref={sectionRef}
      data-section="branching"
      className="relative w-full min-h-screen py-20 lg:py-28"
    >
      <div className="max-w-4xl mx-auto px-6">
        {/* Heading */}
        <div ref={headingRef} className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <GitBranch className="w-5 h-5 text-foresight-accent" />
            <span className="micro-label">ALTERNATIVE OUTCOMES</span>
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-light text-foresight-text mb-4">
            Branching paths
          </h2>
          <p className="text-lg text-foresight-text-muted max-w-xl mx-auto">
            Small changes in risk or timing create very different futures.
          </p>
        </div>

        {/* Path cards */}
        <div ref={cardsRef} className="space-y-6">
          {paths.map((path) => (
            <div key={path.id} className="path-card gpu-accelerate">
              <PathCard
                {...path}
                isSelected={selectedPath === path.id}
                onSelect={() => setSelectedPath(path.id)}
              />
            </div>
          ))}
        </div>

        {/* Insight based on selection */}
        {selectedPath && (
          <div className="mt-8 p-6 rounded-2xl bg-foresight-accent/10 border border-foresight-accent/30 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-foresight-accent" />
              <span className="text-sm font-medium text-foresight-accent">Insight</span>
            </div>
            <p className="text-foresight-text">
              {selectedPath === 'stay'
                ? `With your ${factors.riskTolerance < 50 ? 'conservative' : 'moderate'} risk profile, 
                   staying might provide the stability you need while you prepare for a future transition.`
                : `Your ${factors.riskTolerance > 60 ? 'high' : 'moderate'} risk tolerance suggests 
                   you might thrive with the autonomy and rapid feedback of leaping earlier.`}
            </p>
          </div>
        )}

        {/* Alternative path from simulation */}
        {simulationResult?.alternativePath && (
          <div className="mt-8 text-center">
            <p className="text-sm text-foresight-text-muted">
              {simulationResult.alternativePath}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
