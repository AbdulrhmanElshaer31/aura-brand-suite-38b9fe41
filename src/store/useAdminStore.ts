import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminState {
  adminPassword: string;
  isAdminLoggedIn: boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  changePassword: (oldPassword: string, newPassword: string) => boolean;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      adminPassword: 'admin123',
      isAdminLoggedIn: false,
      loginAdmin: (password) => {
        if (password === get().adminPassword) {
          set({ isAdminLoggedIn: true });
          return true;
        }
        return false;
      },
      logoutAdmin: () => set({ isAdminLoggedIn: false }),
      changePassword: (oldPassword, newPassword) => {
        if (oldPassword === get().adminPassword) {
          set({ adminPassword: newPassword });
          return true;
        }
        return false;
      },
    }),
    { name: 'perfume-admin' }
  )
);
