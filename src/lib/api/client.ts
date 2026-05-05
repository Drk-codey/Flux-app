import type {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  UserProfile,
  UserSearchResult,
  PublicKeyResponse,
  Conversation,
  Message,
  SendMessageRequest,
} from './types';

const BASE_URL = '/api';

class APIClient {
  private accessToken: string | null = null;

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.accessToken && !endpoint.includes('/auth/')) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        detail: 'Request failed',
      }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMe(): Promise<UserProfile> {
    return this.request<UserProfile>('/auth/me');
  }

  async refresh(refreshToken: string): Promise<{
    access_token: string;
    token_type: string;
    expires_in: number;
  }> {
    return this.request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  }

  async logout(refreshToken: string): Promise<void> {
    await this.request('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  }

  // User endpoints
  async searchUsers(query: string): Promise<UserSearchResult[]> {
    return this.request<UserSearchResult[]>(
      `/users/search?q=${encodeURIComponent(query)}`
    );
  }

  async getUserPublicKey(userId: string): Promise<PublicKeyResponse> {
    return this.request<PublicKeyResponse>(`/users/${userId}/public-key`);
  }

  // Message endpoints
  async getConversations(): Promise<Conversation[]> {
    return this.request<Conversation[]>('/conversations');
  }

  async getMessages(
    userId: string,
    limit: number = 50,
    before?: string
  ): Promise<Message[]> {
    let url = `/conversations/${userId}/messages?limit=${limit}`;
    if (before) {
      url += `&before=${encodeURIComponent(before)}`;
    }
    return this.request<Message[]>(url);
  }

  async sendMessage(data: SendMessageRequest): Promise<Message> {
    return this.request<Message>('/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Health check
  async health(): Promise<{ status: string; environment: string }> {
    const response = await fetch(`${BASE_URL}/health`);
    return response.json();
  }
}

export const apiClient = new APIClient();