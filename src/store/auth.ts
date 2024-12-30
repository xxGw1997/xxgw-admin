import { create } from "zustand";
import { persist } from "zustand/middleware";
import { signIn, signOut, UserInfo } from "~/api/auth";
import { ACCESS_TOKEN_KEY, USER_INFO_KEY } from "~/lib/constants";

export type Role = "ADMIN" | "EDITOR" | "USER";

interface AuthStore {
  user?: UserInfo;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  reset: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: undefined,
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
            const userInfo = await signIn({ email, password });
            if (userInfo.success) {
              set({ user: userInfo.data });
              localStorage.setItem(ACCESS_TOKEN_KEY, userInfo.data.accessToken);
              resolve(true);
            } else {
              resolve(false);
            }
          } catch (error) {
            set({
              user: undefined,
            });
            reject(false);
          }
        });
      },
      logout: async () => {
        try {
          const res = await signOut();
          if (res.success) {
            set({ user: undefined });
            localStorage.removeItem(ACCESS_TOKEN_KEY);
          }
        } catch (error) {
          console.error(error);
        }
      },
      reset: () => {
        set({ user: undefined });
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(USER_INFO_KEY);
      },
    }),
    { name: USER_INFO_KEY }
  )
);
