import axios from "axios";
import { ACCESS_TOKEN_KEY } from "./constants";

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

httpRequest.interceptors.response.use((res) => res.data.data);
