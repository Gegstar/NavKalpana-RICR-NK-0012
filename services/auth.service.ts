import api from "@/lib/api";
import {
  LocalLoginRequest,
  LoginResponse,
} from "@/models/auth.model";

class AuthService {
  private baseUrl = "/auth";

  // ================= LOGIN =================
  async login(data: LocalLoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(
      `${this.baseUrl}/login`,
      data
    );

    return response.data;
  }

  // ================= SIGNUP =================
  async signup(data: {
    email: string;
    username: string;
    password: string;
    fullName: string;
  }): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(
      `${this.baseUrl}/signup`,
      data
    );

    return response.data;
  }

  // ================= GOOGLE LOGIN =================
  loginWithGoogle() {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  }

  // ================= FACEBOOK LOGIN =================
  loginWithFacebook() {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/facebook`;
  }

  // ================= MICROSOFT LOGIN =================
  loginWithMicrosoft() {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/microsoft`;
  }

  // ================= SAVE TOKEN =================
  setToken(token: string) {
    localStorage.setItem("token", token);
  }

  // ================= GET TOKEN =================
  getToken(): string | null {
    return localStorage.getItem("token");
  }

  // ================= REMOVE TOKEN =================
  logout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  // ================= GET PROFILE =================
  async getProfile() {
    const response = await api.get("/auth/profile");
    return response.data;
  }
}

export const authService = new AuthService();