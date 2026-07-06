import { create } from 'zustand';
import type { User } from 'firebase/auth';
import type { UserRole } from '@/lib/user-role';

interface AuthState {
  user: User | null;
  role: UserRole | null;
  orgId: string | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setRole: (role: UserRole | null) => void;
  setOrgId: (orgId: string | null) => void;
  setLoading: (v: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  orgId: null,
  loading: true,
  setUser: (user) => set({ user, loading: false }),
  setRole: (role) => set({ role }),
  setOrgId: (orgId) => set({ orgId }),
  setLoading: (loading) => set({ loading }),
}));
