import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSimulation } from '../context/SimulationContext';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

gsap.registerPlugin(ScrollTrigger);

export function DecisionInput() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const slidersRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { decision, setDecision, factors, updateFactor, runSimulation } = useSimulation();
  const [isAnimating, setIsAnimating] = useState(false);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    const orb = orbRef.current;
    const title = titleRef.current;
    const textarea = textareaRef.current;
    const sliders = slidersRef.current;
    const button = buttonRef.current;

    if (!section || !card || !orb || !title || !textarea || !sliders || !button) return;

    const ctx = gsap.context(() => {
      // Simple fade-in animations
      gsap.fromTo(
        card,
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        orb,
        { x: 60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        title,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 65%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        textarea,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          delay: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 65%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      const sliderItems = sliders.querySelectorAll('.slider-item');
      gsap.fromTo(
        sliderItems,
        { x: -20, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.05,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        button,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 55%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleBeginSimulation = () => {
    if (!decision.trim()) return;
    
    setIsAnimating(true);
    
    // Run the simulation first
    runSimulation();

    // Scroll to simulation results after a short delay
    setTimeout(() => {
      setIsAnimating(false);
      const simSection = document.querySelector('[data-section="3months"]');
      if (simSection) {
        gsap.to(window, {
          duration: 1.2,
          scrollTo: { y: simSection, offsetY: 0 },
          ease: 'power2.inOut',
        });
      }
    }, 600);
  };

  const sliderConfigs = [
    { key: 'riskTolerance', label: 'Risk tolerance', left: 'Conservative', right: 'Ambitious', icon: Zap },
    { key: 'financialStability', label: 'Financial stability', left: 'Tight', right: 'Secure', icon: null },
    { key: 'disciplineLevel', label: 'Discipline level', left: 'Flexible', right: 'Structured', icon: null },
    { key: 'supportSystem', label: 'Support system', left: 'Solo', right: 'Strong network', icon: null },
  ] as const;

  return (
    <section
      ref={sectionRef}
      data-section="decision"
      className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden py-16"
    >
      {/* Micro label */}
      <p className="absolute top-[12%] left-1/2 -translate-x-1/2 micro-label">
        YOUR DECISION
      </p>

      {/* Left card - positioned higher */}
      <div
        ref={cardRef}
        className="absolute left-[5vw] lg:left-[8vw] top-[15%] w-[90vw] max-w-[500px] perspective-1000 gpu-accelerate"
      >
        <div className="glass-card-strong p-4">
          <h2
            ref={titleRef}
            className="font-display text-2xl lg:text-3xl font-light text-foresight-text mb-4"
          >
            What are you deciding?
          </h2>

          <div className="relative mb-3">
            <textarea
              ref={textareaRef}
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
              placeholder="e.g., Should I quit my job and start freelancing?"
              className="w-full h-16 p-3 rounded-xl bg-white/5 border border-white/10 text-foresight-text placeholder:text-foresight-text-muted/50 resize-none focus:outline-none focus:border-foresight-accent/50 focus:ring-2 focus:ring-foresight-accent/20 transition-all text-sm"
            />
            <div className="absolute bottom-2 right-2 text-xs text-foresight-text-muted/50">
              {decision.length}/200
            </div>
          </div>

          <div ref={slidersRef} className="space-y-2 mb-4">
            {sliderConfigs.map(({ key, label, left, right }) => (
              <div key={key} className="slider-item">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-xs text-foresight-text-muted">{label}</span>
                  <span className="text-xs font-medium text-foresight-accent bg-foresight-accent/10 px-2 py-0.5 rounded-full">
                    {factors[key]}%
                  </span>
                </div>
                <Slider
                  value={[factors[key]]}
                  onValueChange={([value]) => updateFactor(key, value)}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between mt-0.5">
                  <span className="text-[10px] text-foresight-text-muted/50">{left}</span>
                  <span className="text-[10px] text-foresight-text-muted/50">{right}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            ref={buttonRef}
            onClick={handleBeginSimulation}
            disabled={!decision.trim() || isAnimating}
            className="btn-primary w-full flex items-center justify-center gap-2 text-foresight-text disabled:opacity-30 disabled:cursor-not-allowed py-3 text-sm"
          >
            {isAnimating ? (
              <>
                <div className="w-4 h-4 border-2 border-foresight-accent/30 border-t-foresight-accent rounded-full animate-spin" />
                <span>Simulating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{decision.trim() ? 'Begin simulation' : 'Type your decision above'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right visual */}
      <div
        ref={orbRef}
        className="hidden lg:block absolute right-[8vw] top-1/2 -translate-y-1/2 w-[30vw] max-w-[400px] aspect-square gpu-accelerate"
      >
        <div className="relative w-full h-full">
          {/* Outer glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-foresight-accent/30 to-transparent blur-3xl animate-pulse-soft" />
          
          {/* Orb rings */}
          <div className="absolute inset-[5%] rounded-full border border-foresight-accent/20 animate-spin" style={{ animationDuration: '20s' }} />
          <div className="absolute inset-[15%] rounded-full border border-foresight-accent/15 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
          <div className="absolute inset-[25%] rounded-full border border-foresight-accent/10 animate-spin" style={{ animationDuration: '25s' }} />
          
          {/* Core orb */}
          <div className="absolute inset-[20%] rounded-full bg-gradient-to-br from-foresight-accent/30 via-foresight-accent/10 to-transparent backdrop-blur-sm" />
          
          {/* Inner core */}
          <div className="absolute inset-[35%] rounded-full bg-gradient-to-br from-foresight-accent/50 to-foresight-accent/20 animate-pulse-soft" />
          
          {/* Floating particles */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '30s' }}>
            <div className="absolute top-[10%] left-1/2 w-3 h-3 rounded-full bg-foresight-accent/60 shadow-[0_0_10px_rgba(79,109,255,0.8)] -translate-x-1/2" />
          </div>
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }}>
            <div className="absolute bottom-[15%] right-[15%] w-2 h-2 rounded-full bg-foresight-accent/40 shadow-[0_0_8px_rgba(79,109,255,0.6)]" />
          </div>
        </div>
      </div>
    </section>
  );
}
