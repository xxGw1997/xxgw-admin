import axios, { AxiosError, AxiosResponse } from "axios";

type SuccessResponse<V> = {
  data: V;
  message: string;
  success: true;
};

type ErrorResponse<E = AxiosError> = {
  message: string;
  success: false;
  error: E;
};

type BaseRequest<T, V> = (
  params?: T
) => Promise<AxiosResponse<SuccessResponse<V>>>;

type BaseResponse<V, E> = Promise<SuccessResponse<V> | ErrorResponse<E>>;

export const instance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use((config) => {
  let accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

export const requestHandler =
  <T, V, E = AxiosError>(request: BaseRequest<T, V>) =>
  async (params?: T): BaseResponse<V, E> => {
    try {
      const response = await request(params);
      return response.data;
    } catch (error) {
      return {
        error: error as E,
        message: "error",
        success: false,
      };
    }
  };
