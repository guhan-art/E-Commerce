import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthModalOpen: boolean;
  login: (email: string, name?: string) => void;
  signup: (email: string, name: string) => void;
  logout: () => void;
  setIsAuthModalOpen: (open: boolean) => void;
}

const DEFAULT_USERS: Record<string, User> = {
  'demo@aura.design': {
    id: 'usr-demo-1',
    name: 'Guhan Raj',
    email: 'demo@aura.design',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
    membershipTier: 'Aura Gold',
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: DEFAULT_USERS['demo@aura.design'], // logged in by default for a frictionless hiring review experience!
      isAuthModalOpen: false,

      login: (email: string, name?: string) => {
        const existing = DEFAULT_USERS[email.toLowerCase()];
        if (existing) {
          set({ user: existing, isAuthModalOpen: false });
        } else {
          set({
            user: {
              id: `usr-${Date.now()}`,
              name: name || email.split('@')[0],
              email,
              avatar: `https://api.dicebear.com/7.x/micah/svg?seed=${email}`,
              membershipTier: 'Standard',
            },
            isAuthModalOpen: false,
          });
        }
      },

      signup: (email: string, name: string) => {
        set({
          user: {
            id: `usr-${Date.now()}`,
            name,
            email,
            avatar: `https://api.dicebear.com/7.x/micah/svg?seed=${name}`,
            membershipTier: 'Pro',
          },
          isAuthModalOpen: false,
        });
      },

      logout: () => {
        set({ user: null });
      },

      setIsAuthModalOpen: (open: boolean) => {
        set({ isAuthModalOpen: open });
      },
    }),
    {
      name: 'aura-auth-storage',
    }
  )
);
