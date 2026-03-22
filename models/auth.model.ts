// Request model (same as backend DTO)
export interface LocalLoginRequest {
  identifier: string;
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