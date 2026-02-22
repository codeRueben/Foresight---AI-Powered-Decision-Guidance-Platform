import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Orb3D } from '../components/Orb3D';
import { ArrowRight, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function OrbHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const orbContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const orbContainer = orbContainerRef.current;
    const content = contentRef.current;
    const headline = headlineRef.current;
    const subheadline = subheadlineRef.current;
    const cta = ctaRef.current;

    if (!section || !orbContainer || !content || !headline || !subheadline || !cta) return;

    const ctx = gsap.context(() => {
      // Initial load animation
      const loadTl = gsap.timeline({ delay: 0.2 });

      // Orb entrance with glow
      loadTl.fromTo(
        orbContainer,
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.2)' }
      );

      // Headline words stagger with glow effect
      const words = headline.querySelectorAll('.word');
      loadTl.fromTo(
        words,
        { y: 40, opacity: 0, filter: 'blur(10px)' },
        { 
          y: 0, 
          opacity: 1, 
          filter: 'blur(0px)',
          duration: 0.6, 
          stagger: 0.08, 
          ease: 'power3.out' 
        },
        '-=0.5'
      );

      // Subheadline
      loadTl.fromTo(
        subheadline,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
        '-=0.3'
      );

      // CTA with bounce
      loadTl.fromTo(
        cta,
        { y: 20, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)' },
        '-=0.2'
      );

    }, section);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    mousePosition.current = { x, y };
  };

  const scrollToDecision = () => {
    const decisionSection = document.querySelector('[data-section="decision"]');
    if (decisionSection) {
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: decisionSection, offsetY: 0 },
        ease: 'power2.inOut',
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      data-section="hero"
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* 3D Orb */}
      <div
        ref={orbContainerRef}
        className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 w-[min(50vw,600px)] aspect-square z-0 gpu-accelerate"
      >
        <Orb3D mousePosition={mousePosition} className="w-full h-full" />
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center text-center px-6 pt-[35vh]"
      >
        {/* Headline */}
        <h1
          ref={headlineRef}
          className="font-display text-[clamp(48px,7vw,96px)] font-light text-foresight-text leading-[1.05] mb-6"
        >
          <span className="word inline-block">See</span>{' '}
          <span className="word inline-block">your</span>{' '}
          <span className="word inline-block">future</span>
          <br />
          <span className="word inline-block">before</span>{' '}
          <span className="word inline-block">you</span>
          <br />
          <span className="word inline-block text-gradient-blue drop-shadow-[0_0_30px_rgba(79,109,255,0.5)]">choose.</span>
        </h1>

        {/* Subheadline */}
        <p
          ref={subheadlineRef}
          className="text-lg text-foresight-text-muted max-w-md mb-10"
        >
          A calm space to simulate life decisions—before you commit.
        </p>

        {/* CTA Button */}
        <button
          ref={ctaRef}
          onClick={scrollToDecision}
          className="btn-primary group flex items-center gap-3 text-foresight-text text-base"
        >
          <Sparkles className="w-5 h-5 text-foresight-accent" />
          <span>Simulate my decision</span>
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </button>

        {/* Micro helper */}
        <p className="mt-6 text-sm text-foresight-text-muted/60">
          Takes 60 seconds. No signup required.
        </p>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-2 text-foresight-text-muted/40">
        <div className="w-px h-12 bg-gradient-to-b from-transparent via-foresight-accent/50 to-transparent" />
      </div>
    </section>
  );
}
