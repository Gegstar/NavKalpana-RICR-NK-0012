import axios from "axios";
import { store } from "@/redux/store"; // ✅ import store

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

//  INTERCEPTOR
api.interceptors.request.use((config) => {
  const state = store.getState();

  const businessUnitId =
    state.global?.settings?.id;

  //  only add if available
  if (businessUnitId) {
    config.headers["x-business-unit-id"] = businessUnitId;
  }

  return config;
});

export default api;