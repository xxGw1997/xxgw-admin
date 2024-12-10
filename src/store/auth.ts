import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  user?: {
    email: string;
    token: string;
    username: string;
  } | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      login: (email, password) => {
        return new Promise(async (resolve, reject) => {
          try {
            const user = await mockLogin(email, password);
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

function mockLogin(
  email: string,
  password: string
): Promise<AuthStore["user"]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        email,
        token: `${email}-${password}`,
        username: "xxgw",
      });
    }, 1000);
  });
}
