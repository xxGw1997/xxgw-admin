import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  user?: any;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      login: (username, password) => {
        return new Promise(async (resolve, reject) => {
          try {
            const user = await mockLogin(username, password);
            set({
              user,
            });
            resolve(true);
          } catch (error) {
            set({
              user: null,
            });
            reject(false);
          }
        });
      },
      logout: async () => {
        set({ user: null });
      },
    }),
    { name: "user-info" }
  )
);

function mockLogin(username: string, password: string) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        token: `${username}-${password}`,
        username: username,
      });
    }, 1000);
  });
}
