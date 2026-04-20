import { AUTH_STORAGE_KEY } from "@/src/store/slices/auth-slice";
import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_DEVELOPMENT_URL;

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
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

export { api };
