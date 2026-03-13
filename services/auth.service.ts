import api from "@/lib/api";

/* ============================
   Request Interfaces
============================ */

export interface SendOtpRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface StudentSignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

/* ============================
   Response Interfaces
============================ */

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

/* ============================
   Auth Service
============================ */

class AuthService {

  /* Send OTP */
  async sendOtp(data: SendOtpRequest): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>("/auth/send-otp", data);
    return response.data;
  }

  /* Resend OTP */
  async resendOtp(data: SendOtpRequest): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>("/auth/resend-otp", data);
    return response.data;
  }

  /* Verify OTP */
  async verifyOtp(data: VerifyOtpRequest): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>("/auth/verify-otp", data);
    return response.data;
  }

  /* Signup (Student Registration) */
  async signup(data: StudentSignupRequest): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>("/auth/student-signup", data);
    return response.data;
  }

  /* Optional Alias (अगर कहीं studentSignup use हो रहा हो) */
  async studentSignup(data: StudentSignupRequest): Promise<ApiResponse> {
    return this.signup(data);
  }

  /* Login */
  async login(data: LoginRequest): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>("/auth/login", data);
    return response.data;
  }
}

/* ============================
   Export Instance
============================ */

const authService = new AuthService();
export default authService;