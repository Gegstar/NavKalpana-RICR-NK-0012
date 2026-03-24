// src/services/auth.service.ts
import api from "@/lib/api";
import {
  LocalLoginRequest,
  LocalSignupRequest,
  LoginResponse,
  VerifyAccountRequest,
  VerifyAccountResponse,
} from "@/models/auth.model";

class AuthService {
  private baseUrl = "/auth";

  // ================= LOGIN =================
  async login(data: LocalLoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(`${this.baseUrl}/login`, data);
    return response.data;
  }

  // ================= SIGNUP =================
  async signup(data: LocalSignupRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(`${this.baseUrl}/signup`, data);
    return response.data;
  }

  // ================= RESEND OTP =================
async resendOtp(identifier: string): Promise<{ message: string; otpSent: boolean }> {
  const response = await api.post(`${this.baseUrl}/resend-otp`, {
    identifier,
  });
  return response.data;
}

  // ================= VERIFY ACCOUNT (OTP) =================
  async verifyAccount(data: VerifyAccountRequest): Promise<VerifyAccountResponse> {
    const response = await api.post<VerifyAccountResponse>(`${this.baseUrl}/verify-otp`, data);
    return response.data;
  }

  // ================= SOCIAL LOGIN =================
  loginWithGoogle() {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  }

  loginWithFacebook() {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/facebook`;
  }

  loginWithMicrosoft() {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/microsoft`;
  }

  // ================= TOKEN MANAGEMENT =================
  setToken(token: string) {
    localStorage.setItem("token", token);
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }

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