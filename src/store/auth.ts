import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authFetch } from "~/lib/authFetch";

export type Role = "ADMIN" | "EDITOR" | "USER";

interface AuthStore {
  user?: {
    email: string;
    accessToken: string;
    refreshToken: string;
    name: string;
    role: Role;
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
          // set({
          //   user: {
          //     email: 'xxgw@163.com',
          //     name: 'xxgw',
          //     accessToken: '123',
          //     refreshToken: '123',
          //     role: 'ADMIN'
          //   },
          // });
          try {
            const res = await fetch(`/api/auth/signin`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email, password }),
            });
            if (res.ok) {
              const user = ((await res.json()) as any).data;
              set({
                user,
              });
              resolve(true);
            } else {
              throw new Error();
            }
          } catch (error) {
            set({
              user: null,
            });
            reject(false);
          }
        });
      },
      logout: async () => {
        try {
          const res = await authFetch(`/api/auth/signout`, {
            method: "POST",
          });
          if (res.ok) {
            set({ user: null });
          }
        } catch (error) {
          console.error(error);
        }
      },
    }),
    { name: "user-info" }
  )
);
