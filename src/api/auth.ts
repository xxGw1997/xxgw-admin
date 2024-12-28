import axios from "axios";
import { instance, requestHandler } from "~/lib/request-handler";

export type Role = "ADMIN" | "EDITOR" | "USER";

export type UserInfo = {
  email: string;
  accessToken: string;
  refreshToken: string;
  name: string;
  role: Role;
};

export type SignInParams = {
  email: string;
  password: string;
};

export const signIn = requestHandler<SignInParams, UserInfo>((payload) =>
  axios.post("/api/auth/signin", payload)
);

export const signOut = requestHandler(() => instance.post("/api/auth/signout"));
