import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export function Logo({ className = '', size = 'md', animated = true }: LogoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const eyeRef = useRef<SVGCircleElement>(null);

  const sizes = {
    sm: { container: 'w-8 h-8', icon: 'w-4 h-4' },
    md: { container: 'w-10 h-10', icon: 'w-5 h-5' },
    lg: { container: 'w-16 h-16', icon: 'w-8 h-8' },
  };

  useEffect(() => {
    if (!animated || !eyeRef.current) return;

    // Subtle eye movement animation
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 3 });
    tl.to(eyeRef.current, {
      scaleY: 0.1,
      duration: 0.1,
      ease: 'power2.in',
    }).to(eyeRef.current, {
      scaleY: 1,
      duration: 0.1,
      ease: 'power2.out',
    });

    return () => {
      tl.kill();
    };
  }, [animated]);

  return (
    <div ref={containerRef} className={`relative ${sizes[size].container} ${className}`}>
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-foresight-accent/40 to-foresight-accent/10 blur-lg animate-pulse-soft" />
      
      {/* Main container */}
      <div className="relative w-full h-full rounded-full bg-gradient-to-br from-foresight-bg via-foresight-bg-secondary to-foresight-bg border border-foresight-accent/30 flex items-center justify-center overflow-hidden">
        {/* Animated rings */}
        <div className="absolute inset-0 rounded-full border border-foresight-accent/20 animate-spin" style={{ animationDuration: '8s' }} />
        <div className="absolute inset-1 rounded-full border border-foresight-accent/10 animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }} />
        
        {/* Eye icon */}
        <div className={`relative ${sizes[size].icon}`}>
          {/* Eye shape */}
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            {/* Outer eye */}
            <path
              d="M12 5C7 5 3 9 3 12C3 15 7 19 12 19C17 19 21 15 21 12C21 9 17 5 12 5Z"
              stroke="url(#eyeGradient)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Iris */}
            <circle
              cx="12"
              cy="12"
              r="4"
              fill="url(#irisGradient)"
              className="animate-pulse-soft"
            />
            {/* Pupil */}
            <circle
              ref={eyeRef}
              cx="12"
              cy="12"
              r="2"
              fill="#07080B"
            />
            {/* Highlight */}
            <circle
              cx="13.5"
              cy="10.5"
              r="1"
              fill="white"
              opacity="0.6"
            />
            {/* Gradients */}
            <defs>
              <linearGradient id="eyeGradient" x1="3" y1="12" x2="21" y2="12">
                <stop offset="0%" stopColor="#4F6DFF" />
                <stop offset="100%" stopColor="#7B9FFF" />
              </linearGradient>
              <radialGradient id="irisGradient" cx="12" cy="12" r="4">
                <stop offset="0%" stopColor="#4F6DFF" />
                <stop offset="100%" stopColor="#1a2a6c" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}

export function LogoWithText({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Logo size="md" />
      <span className="font-display text-xl font-medium text-foresight-text tracking-wide">
        Foresight
      </span>
    </div>
  );
}
