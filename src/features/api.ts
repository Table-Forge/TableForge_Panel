import { AUTH_STORAGE_KEY } from "@/src/store/slices/auth-slice";
import { ENV } from "@/src/config/env";
import axios from "axios";

const api = axios.create({
  baseURL: ENV.API_URL,
  timeout: 60000,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const authDataSerialized = localStorage.getItem(AUTH_STORAGE_KEY);

  if (authDataSerialized) {
    try {
      const authData = JSON.parse(authDataSerialized) as {
        token?: { value?: string };
      };

      const tokenValue = authData.token?.value;

      if (tokenValue) {
        config.headers.Authorization = `Bearer ${tokenValue}`;
      }
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/login")
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export { api };
