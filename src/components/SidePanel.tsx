import { useState } from 'react';
import { 
  Home, 
  Edit3, 
  Users, 
  FileText, 
  CheckSquare, 
  Calendar, 
  GitBranch, 
  Heart,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

interface Section {
  id: string;
  label: string;
  icon: string;
}

interface SidePanelProps {
  sections: Section[];
  currentSection: number;
  onSelect: (index: number) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  home: <Home className="w-5 h-5" />,
  edit: <Edit3 className="w-5 h-5" />,
  users: <Users className="w-5 h-5" />,
  file: <FileText className="w-5 h-5" />,
  check: <CheckSquare className="w-5 h-5" />,
  calendar: <Calendar className="w-5 h-5" />,
  git: <GitBranch className="w-5 h-5" />,
  heart: <Heart className="w-5 h-5" />,
};

export function SidePanel({ sections, currentSection, onSelect }: SidePanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 left-4 z-50 lg:hidden w-10 h-10 rounded-full glass-card flex items-center justify-center"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Side Panel */}
      <aside
        className={`
          fixed left-0 top-0 h-full z-40
          transform transition-transform duration-300 ease-out
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="w-64 h-full glass-card-strong border-r border-white/10 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <h2 className="font-display text-lg text-foresight-text">Journey</h2>
            <p className="text-xs text-foresight-text-muted mt-1">
              Step {currentSection + 1} of {sections.length}
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="space-y-1 px-3">
              {sections.map((section, index) => {
                const isActive = index === currentSection;
                const isPast = index < currentSection;
                
                return (
                  <button
                    key={section.id}
                    onClick={() => {
                      onSelect(index);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-xl
                      transition-all duration-200 group
                      ${isActive 
                        ? 'bg-foresight-accent/20 text-foresight-accent border border-foresight-accent/30' 
                        : 'text-foresight-text-muted hover:bg-white/5 hover:text-foresight-text'
                      }
                    `}
                  >
                    <div className={`
                      flex-shrink-0 transition-colors
                      ${isActive ? 'text-foresight-accent' : 'text-foresight-text-muted/50 group-hover:text-foresight-text-muted'}
                    `}>
                      {iconMap[section.icon]}
                    </div>
                    <span className="text-sm font-medium flex-1 text-left">
                      {section.label}
                    </span>
                    {isActive && (
                      <ChevronRight className="w-4 h-4 text-foresight-accent" />
                    )}
                    {isPast && !isActive && (
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Progress Indicator */}
          <div className="p-6 border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-foresight-text-muted">Progress</span>
              <span className="text-xs text-foresight-accent font-medium">
                {Math.round((currentSection / (sections.length - 1)) * 100)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-foresight-accent to-foresight-accent/60 transition-all duration-500"
                style={{ width: `${(currentSection / (sections.length - 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
