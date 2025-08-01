import { env } from '../config/env';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
}

export interface ApiError {
  message: string;
  status: number;
}

class AuthService {
  private readonly baseURL: string;

  constructor() {
    this.baseURL = env.API_BASE_URL || 'http://localhost:3000/api';
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = 'An error occurred';
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = response.statusText || errorMessage;
      }

      const error: ApiError = {
        message: errorMessage,
        status: response.status,
      };
      
      throw error;
    }

    return response.json();
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await this.handleResponse<AuthResponse>(response);
    
    // Store token in localStorage
    localStorage.setItem('auth_token', data.token);
    
    return data;
  }

  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${this.baseURL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await this.handleResponse<AuthResponse>(response);
    
    // Store token in localStorage
    localStorage.setItem('auth_token', data.token);
    
    return data;
  }

  async validateToken(): Promise<AuthResponse> {
    const response = await fetch(`${this.baseURL}/auth/me`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<AuthResponse>(response);
  }

  logout(): void {
    localStorage.removeItem('auth_token');
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
