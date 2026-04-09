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

  // ================= FORGOT PASSWORD (send OTP) =================
  async forgotPassword(data: { email: string }): Promise<{ message: string; otpSent: boolean }> {
    const response = await api.post(`${this.baseUrl}/forgot-password`, data);
    return response.data;
  }

  // ================= VERIFY OTP FOR PASSWORD RESET =================
  async verifyResetOtp(data: { email: string; otp: string }): Promise<{ verified: boolean }> {
    const response = await api.post(`${this.baseUrl}/verify-reset-otp`, data);
    return response.data;
  }

  // ================= RESET PASSWORD =================
  async resetPassword(data: { email: string; otp: string; newPassword: string }): Promise<{ message: string }> {
    const response = await api.post(`${this.baseUrl}/reset-password`, data);
    return response.data;
  }

  // ================= LOGOUT =================
  async logout() {
    try {
      console.log("Logging out user...");
      await api.post(`${this.baseUrl}/logout`);
    } catch (error) {
      console.warn("Logout API failed (continuing cleanup):", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.clear();
      window.location.href = "/";
    }
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

  // ================= GET PROFILE =================
  async getProfile() {
    const response = await api.get("/auth/profile");
    return response.data;
  }
}

export const authService = new AuthService();