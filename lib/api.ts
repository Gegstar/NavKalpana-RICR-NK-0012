import axios from "axios";
import { store } from "@/store/store";
import { authService } from "@/services/auth.service";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ================= REQUEST INTERCEPTOR =================
api.interceptors.request.use((config) => {
  const state = store.getState();

  const businessUnitId = state.global?.settings?.id;

  if (businessUnitId) {
    config.headers["x-business-unit-id"] = businessUnitId;
  }

  return config;
});

// ================= RESPONSE INTERCEPTOR =================
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;

    //  Handle Unauthorized (401)
    if (status === 401) {
      console.warn("Unauthorized! Logging out...");

      // prevent infinite loop (important 🔥)
      if (!window.location.pathname.includes("/login")) {
        await authService.logout();
      }
    }

    return Promise.reject(error);
  }
);

export default api;
