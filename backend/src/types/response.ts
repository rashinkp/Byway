export interface ApiResponse<T = any> {
  status: "success" | "error";
  data?: T; 
  message?: string;
  statusCode: number; 
  token?: string; 
}

export interface AuthResponse
  extends ApiResponse<{
    id: string;
    email: string;
    role: string;
  }> {}
