import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSimulation } from '../context/SimulationContext';
import { Briefcase, Award, Heart, TrendingUp, Users, Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface MetricCardProps {
  value: string;
  label: string;
  icon: React.ReactNode;
}

function MetricCard({ value, label, icon }: MetricCardProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
      <div className="w-8 h-8 rounded-lg bg-foresight-accent/20 flex items-center justify-center text-foresight-accent">
        {icon}
      </div>
      <div>
        <p className="text-lg font-display text-foresight-text">{value}</p>
        <p className="text-[10px] text-foresight-text-muted uppercase tracking-wider">{label}</p>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  metrics?: { value: string; label: string; icon: React.ReactNode }[];
  icon: React.ReactNode;
}

function FeatureCard({ title, description, metrics, icon }: FeatureCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="glass-card p-5 lg:p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-foresight-accent/20 flex items-center justify-center flex-shrink-0 text-foresight-accent shadow-[0_0_20px_rgba(79,109,255,0.2)]">
          {icon}
        </div>
        <div className="flex-grow">
          <h3 className="font-display text-xl text-foresight-text mb-2">{title}</h3>
          <p className="text-sm text-foresight-text-muted/80 leading-relaxed">{description}</p>
          
          {metrics && (
            <div className="grid grid-cols-3 gap-2 mt-4">
              {metrics.map((m) => (
                <MetricCard key={m.label} {...m} />
              ))}
            </div>
          )}

          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-white/10 animate-in fade-in slide-in-from-top-2">
              <p className="text-sm text-foresight-text-muted/80 leading-relaxed">
                By this point, the initial uncertainty has transformed into a rhythm. 
                You&apos;ve developed systems that work for you, and the compound effects 
                of consistent effort begin to show.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface SmallCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

function SmallCard({ title, description, icon, color }: SmallCardProps) {
  return (
    <div 
      className="glass-card p-4 hover:scale-[1.03] transition-all cursor-pointer gpu-accelerate"
      style={{ '--glow-color': color } as React.CSSProperties}
    >
      <div className="flex items-center gap-3 mb-2">
        <div 
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: `${color}25`, boxShadow: `0 0 15px ${color}30` }}
        >
          <div style={{ color }}>{icon}</div>
        </div>
        <h4 className="font-display text-base text-foresight-text">{title}</h4>
      </div>
      <p className="text-sm text-foresight-text-muted/80">{description}</p>
    </div>
  );
}

export function SimulationOneYear() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCardsRef = useRef<HTMLDivElement>(null);

  const { simulationResult, decision } = useSimulation();
  const result = simulationResult?.oneYear;
  const hasDecision = decision.trim().length > 0;

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const leftCard = leftCardRef.current;
    const rightCards = rightCardsRef.current;

    if (!section || !headline || !leftCard || !rightCards) return;

    const rightCardElements = rightCards.querySelectorAll('.right-card');

    const ctx = gsap.context(() => {
      // Simple fade-in animations
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

      gsap.fromTo(
        leftCard,
        { x: -50, opacity: 0 },
        {
          x: 0,
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

      gsap.fromTo(
        rightCardElements,
        { x: 50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 65%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="1year"
      className="relative w-full min-h-[80vh] flex flex-col items-center justify-center overflow-hidden py-16"
    >
      {/* Headline */}
      <h2
        ref={headlineRef}
        className="absolute top-[12%] left-1/2 -translate-x-1/2 font-display text-[clamp(48px,8vw,100px)] font-light text-foresight-text drop-shadow-[0_0_40px_rgba(79,109,255,0.3)]"
      >
        1 Year
      </h2>

      {/* Content grid */}
      <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[95vw] lg:max-w-[1200px] px-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6">
          {/* Left feature card - takes 3 columns */}
          <div ref={leftCardRef} className="lg:col-span-3 gpu-accelerate">
            <FeatureCard
              title="Portfolio momentum"
              description="Consistent work, repeat clients, and a clearer niche. The uncertainty hasn't vanished—but it's quieter."
              metrics={[
                { value: result ? `${result.skills.value}` : (hasDecision ? 'Run simulation' : '-'), label: 'Skill level', icon: <Briefcase className="w-4 h-4" /> },
                { value: result ? `$${(result.financial.value * 0.1).toFixed(1)}k` : (hasDecision ? 'Run simulation' : '-'), label: 'Growth', icon: <TrendingUp className="w-4 h-4" /> },
                { value: result ? `${result.social.value}%` : (hasDecision ? 'Run simulation' : '-'), label: 'Network', icon: <Users className="w-4 h-4" /> },
              ]}
              icon={<Star className="w-6 h-6" />}
            />
          </div>

          {/* Right stack - takes 2 columns */}
          <div ref={rightCardsRef} className="lg:col-span-2 space-y-4">
            <div className="right-card gpu-accelerate">
              <SmallCard
                title="Skill jump"
                description="You've learned sales, scope, and systems."
                icon={<Award className="w-4 h-4" />}
                color="#4ECDC4"
              />
            </div>
            <div className="right-card gpu-accelerate">
              <SmallCard
                title="Social shift"
                description="Weekends become flexible; relationships evolve."
                icon={<Heart className="w-4 h-4" />}
                color="#FF6B6B"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
