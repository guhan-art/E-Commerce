import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';
import { User as UserIcon, Mail, Lock, Sparkles, ShieldCheck } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, signup, user, logout } = useAuthStore();
  const { addToast } = useToastStore();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (isSignUp) {
      if (!name) return;
      signup(email, name);
      addToast({
        title: 'Account Created',
        description: `Welcome to AURA Studio, ${name}!`,
        type: 'success',
      });
    } else {
      login(email, name);
      addToast({
        title: 'Signed In',
        description: `Welcome back to AURA Studio.`,
        type: 'success',
      });
    }
    setEmail('');
    setPassword('');
    setName('');
  };

  const handleDemoSignIn = () => {
    login('demo@aura.design', 'Guhan Raj');
    addToast({
      title: 'Demo Session Active',
      description: 'Logged in as Guhan Raj (Aura Gold Tier)',
      type: 'info',
    });
  };

  const handleLogout = () => {
    logout();
    addToast({
      title: 'Signed Out',
      description: 'You have been safely signed out.',
      type: 'info',
    });
    setIsAuthModalOpen(false);
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={() => setIsAuthModalOpen(false)}
      title={user ? 'Your AURA Account' : isSignUp ? 'Create AURA Account' : 'Welcome Back'}
      maxWidth="md"
    >
      {user ? (
        <div className="space-y-6 text-center py-2">
          <div className="relative inline-block mx-auto">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-full mx-auto ring-4 ring-emerald-500/30 object-cover shadow-lg"
            />
            <span className="absolute bottom-0 right-0 p-1 bg-emerald-500 text-white rounded-full text-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
          </div>

          <div>
            <h4 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{user.name}</h4>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{user.email}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <Sparkles className="w-3.5 h-3.5" />
              {user.membershipTier || 'Standard'} Member
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 text-left text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-zinc-500 dark:text-zinc-400">Complimentary Shipping</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Unlocked ($150+)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500 dark:text-zinc-400">Studio Concierge</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">Active 24/7</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium transition-colors"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Sign in to track orders, save wishlists across devices, and unlock bespoke studio privileges.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Guhan Raj"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="guhan@example.com"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 font-semibold text-sm transition-colors shadow-md"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-zinc-900 px-2 text-zinc-400">or instant demo</span>
            </div>
          </div>

          <button
            onClick={handleDemoSignIn}
            className="w-full py-2.5 px-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Sign in as Demo User (Guhan Raj)
          </button>

          <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 pt-2">
            {isSignUp ? 'Already have an account?' : "Don't have an account yet?"}{' '}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      )}
    </Modal>
  );
};
