import axios from "axios";
import { ACCESS_TOKEN_KEY } from "./constants";
import { toast } from "sonner";

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
  (res) => {
    return res.data.data;
  },
  (err) => {
    toast(err.response.data.message);
    throw err;
  }
);
