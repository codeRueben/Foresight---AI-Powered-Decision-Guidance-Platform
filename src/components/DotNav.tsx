import { useEffect, useState } from 'react';

interface DotNavProps {
  total: number;
  current: number;
  onSelect: (index: number) => void;
}

export function DotNav({ total, current, onSelect }: DotNavProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > window.innerHeight * 0.3);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sectionLabels = [
    'Hero',
    'Input',
    '3 Months',
    '1 Year',
    '5 Years',
    'Paths',
    'Reflect',
  ];

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-foresight-bg/80 backdrop-blur-xl border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        {Array.from({ length: total }).map((_, index) => (
          <button
            key={index}
            onClick={() => onSelect(index)}
            className={`group relative w-2 h-2 rounded-full transition-all duration-300 ${
              current === index
                ? 'bg-foresight-accent w-6 shadow-[0_0_10px_rgba(79,109,255,0.8)]'
                : 'bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to ${sectionLabels[index]}`}
          >
            {/* Tooltip */}
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-[10px] text-foresight-text bg-foresight-bg/90 border border-white/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {sectionLabels[index]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
