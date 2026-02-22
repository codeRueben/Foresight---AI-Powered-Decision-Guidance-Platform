import { useState, useEffect } from 'react';
import { Save, Info, User, LogOut } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { useAuth } from '@/context/AuthContext';
import { LogoWithText } from './Logo';
import { AuthModal } from './AuthModal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { savedScenarios, totalSimulations, insightPattern, decisionConfidence } = useSimulation();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-foresight-bg/90 backdrop-blur-2xl border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-6 lg:px-12 py-4">
        {/* Logo */}
        <LogoWithText />

        {/* Right side actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Auth Button */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-foresight-text-muted hidden sm:inline">
                {user?.email}
              </span>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm text-foresight-text-muted hover:text-foresight-text hover:bg-white/5 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm text-foresight-text-muted hover:text-foresight-text hover:bg-white/5 transition-all"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 rounded-full text-sm text-foresight-text-muted hover:text-foresight-text hover:bg-white/5 transition-all">
                <Info className="w-4 h-4" />
                <span className="hidden sm:inline">About</span>
              </button>
            </DialogTrigger>
            <DialogContent className="glass-card-strong border-white/10 max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display text-xl text-foresight-text">
                  About Foresight
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-foresight-text-muted text-sm">
                <p>
                  Foresight is a life decision simulator that helps you visualize potential 
                  outcomes before making important choices.
                </p>
                <p>
                  By analyzing your risk tolerance, financial stability, discipline, and 
                  support system, we project how your decision might unfold over time.
                </p>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs uppercase tracking-wider mb-3 text-foresight-accent">Your Stats</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-xl bg-white/5">
                      <p className="text-2xl font-display text-foresight-accent">
                        {totalSimulations}
                      </p>
                      <p className="text-xs">Simulations</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5">
                      <p className="text-2xl font-display text-foresight-accent">
                        {savedScenarios.length}
                      </p>
                      <p className="text-xs">Saved</p>
                    </div>
                  </div>
                  {insightPattern && (
                    <div className="mt-4 p-3 rounded-xl bg-foresight-accent/10 border border-foresight-accent/20">
                      <p className="text-xs text-foresight-accent mb-1">Pattern</p>
                      <p className="text-foresight-text text-sm">{insightPattern}</p>
                    </div>
                  )}
                  {decisionConfidence > 0 && (
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-foresight-text-muted">Confidence</span>
                        <span className="text-sm text-foresight-accent font-medium">{decisionConfidence}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-foresight-accent to-foresight-accent/70 transition-all duration-500"
                          style={{ width: `${decisionConfidence}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 rounded-full text-sm text-foresight-text-muted hover:text-foresight-text hover:bg-white/5 transition-all">
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">Save</span>
                {savedScenarios.length > 0 && (
                  <span className="px-2 py-0.5 text-xs bg-foresight-accent/20 text-foresight-accent rounded-full">
                    {savedScenarios.length}
                  </span>
                )}
              </button>
            </DialogTrigger>
            <DialogContent className="glass-card-strong border-white/10 max-w-lg max-h-[80vh] overflow-auto">
              <DialogHeader>
                <DialogTitle className="font-display text-xl text-foresight-text">
                  Saved Scenarios
                </DialogTitle>
              </DialogHeader>
              {savedScenarios.length === 0 ? (
                <p className="text-foresight-text-muted text-sm py-8 text-center">
                  No saved scenarios yet. Run a simulation and save your results.
                </p>
              ) : (
                <div className="space-y-4">
                  {savedScenarios.map((scenario) => (
                    <div
                      key={scenario.id}
                      className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-foresight-accent/30 transition-colors"
                    >
                      <p className="text-foresight-text font-medium mb-2 line-clamp-2">
                        {scenario.decision}
                      </p>
                      <p className="text-xs text-foresight-text-muted mb-3">
                        {scenario.createdAt.toLocaleDateString()}
                      </p>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="p-2 rounded-lg bg-white/5">
                          <p className="text-foresight-text-muted text-[10px]">3 Months</p>
                          <p className="text-foresight-accent font-medium">
                            {scenario.result.threeMonths.emotional.label}
                          </p>
                        </div>
                        <div className="p-2 rounded-lg bg-white/5">
                          <p className="text-foresight-text-muted text-[10px]">1 Year</p>
                          <p className="text-foresight-accent font-medium">
                            {scenario.result.oneYear.emotional.label}
                          </p>
                        </div>
                        <div className="p-2 rounded-lg bg-white/5">
                          <p className="text-foresight-text-muted text-[10px]">5 Years</p>
                          <p className="text-foresight-accent font-medium">
                            {scenario.result.fiveYears.emotional.label}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </nav>
  );
}
