import { create } from 'zustand';
import type { User } from 'firebase/auth';
import type { UserRole } from '@/lib/user-role';

interface AuthState {
  user: User | null;
  role: UserRole | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setRole: (role: UserRole | null) => void;
  setLoading: (v: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  loading: true,
  setUser: (user) => set({ user, loading: false }),
  setRole: (role) => set({ role }),
  setLoading: (loading) => set({ loading }),
}));
