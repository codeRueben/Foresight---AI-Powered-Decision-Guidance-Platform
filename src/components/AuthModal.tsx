import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X, Mail, Lock, UserPlus, LogIn, Loader2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const { login, register, isLoading, error } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
      onClose();
    } catch (e: any) {
      // Error is handled by auth context
    }
  };

  const displayError = localError || error;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md glass-card-strong overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-foresight-accent/20 flex items-center justify-center">
              {isLogin ? (
                <LogIn className="w-5 h-5 text-foresight-accent" />
              ) : (
                <UserPlus className="w-5 h-5 text-foresight-accent" />
              )}
            </div>
            <div>
              <h3 className="font-display text-xl text-foresight-text">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h3>
              <p className="text-xs text-foresight-text-muted">
                {isLogin ? 'Sign in to save your decisions' : 'Join Foresight to track your journey'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-foresight-text-muted" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {displayError && (
            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
              {displayError}
            </div>
          )}

          <div>
            <label className="block text-sm text-foresight-text-muted mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foresight-text-muted/50" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-foresight-text placeholder:text-foresight-text-muted/50 focus:outline-none focus:border-foresight-accent/50 focus:ring-2 focus:ring-foresight-accent/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-foresight-text-muted mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foresight-text-muted/50" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-foresight-text placeholder:text-foresight-text-muted/50 focus:outline-none focus:border-foresight-accent/50 focus:ring-2 focus:ring-foresight-accent/20"
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm text-foresight-text-muted mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foresight-text-muted/50" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-foresight-text placeholder:text-foresight-text-muted/50 focus:outline-none focus:border-foresight-accent/50 focus:ring-2 focus:ring-foresight-accent/20"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary flex items-center justify-center gap-2 py-3 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
              </>
            ) : (
              <>
                {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              </>
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setLocalError(null);
              }}
              className="text-sm text-foresight-text-muted hover:text-foresight-text transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 bg-white/5 border-t border-white/10 text-center">
          <p className="text-xs text-foresight-text-muted/50">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
