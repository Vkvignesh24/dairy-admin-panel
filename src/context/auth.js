import { create } from 'zustand';
import { AdminAPI } from '../api/admin';
import { auth, signInWithEmailAndPassword } from '../services/firebase';

export const useAuth = create((set) => ({
  token: localStorage.getItem('admin_token') || null,
  user: null,
  loading: false,
  error: null,

  bootstrap: async () => {
    if (!localStorage.getItem('admin_token')) return;
    try {
      const { user } = await AdminAPI.me();
      set({ user });
    } catch {
      localStorage.removeItem('admin_token');
      set({ token: null, user: null });
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await cred.user.getIdToken();
      const { token, user } = await AdminAPI.login(idToken);
      localStorage.setItem('admin_token', token);
      set({ token, user, loading: false });
      return true;
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || 'Login failed';
      set({ loading: false, error: msg });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('admin_token');
    set({ token: null, user: null });
  },
}));
