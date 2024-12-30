import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";
import { ACCESS_TOKEN_KEY } from "./constants";
import { useAuthStore } from "~/store/auth";

export interface Result<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export const httpRequest = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

httpRequest.interceptors.request.use((config) => {
  let accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }

  return config;
});

httpRequest.interceptors.response.use(
  (res: AxiosResponse<Result>) => {
    if (res.data.success) {
      return res.data.data;
    } else {
      throw new Error(res.data.message);
    }
  },
  (err: AxiosError<Result>) => {
    toast.error(err.response?.data.message, {
      position: "top-center",
    });
    if (err.status === 401) {
      useAuthStore.getState().reset();
    }
    return Promise.reject(err);
  }
);
