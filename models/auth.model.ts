// Request model (same as backend DTO)
export interface LocalLoginRequest {
  identifier: string;
  password: string;
  role:string;
}

// frontend/models/auth.ts

export interface LocalSignupRequest {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

// Response model (adjust based on your backend)
export interface LoginResponse {
  access_token: string;
  refresh_token?: string;

  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface SignupResponse {
  access_token: string;
  refresh_token?: string;

  user: {
    id: string;
    fullName: string;
    username: string;
    email: string;
  };
  message?: string; // optional message like "Signup successful"
}

export interface VerifyAccountRequest {
  userId: string;
  otp: string;
}

export interface VerifyAccountResponse {
  access_token: string;
  refresh_token?: string;

  user: {
    id: string;
    fullName: string;
    username: string;
    email: string;
  };
  message?: string; // optional confirmation message
}