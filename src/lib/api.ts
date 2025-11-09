/**
 * API Client for backend communication
 */
import { HopData } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

interface ApiError {
  error: string;
  details?: any;
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage on init
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        error: 'Request failed',
      }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Auth APIs
  async login(username: string, password: string) {
    const data = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    this.setToken(data.token);
    return data;
  }

  async register(username: string, email: string, password: string) {
    const data = await this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
    this.setToken(data.token);
    return data;
  }

  logout() {
    this.setToken(null);
  }

  // Server APIs
  async getServers() {
    return this.request<any[]>('/servers');
  }

  async createServer(server: any) {
    return this.request<any>('/servers', {
      method: 'POST',
      body: JSON.stringify(server),
    });
  }

  async updateServer(id: number, server: any) {
    return this.request<any>(`/servers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(server),
    });
  }

  async deleteServer(id: number) {
    return this.request<void>(`/servers/${id}`, {
      method: 'DELETE',
    });
  }

  async testServerConnection(id: number) {
    return this.request<{ success: boolean; message: string }>(`/servers/${id}/test`, {
      method: 'POST',
    });
  }

  // Trace APIs
  async executeTrace(target: string, serverIds: number[], count: number = 10) {
    return this.request<any>('/traces', {
      method: 'POST',
      body: JSON.stringify({ target, server_ids: serverIds, count }),
    });
  }

  async getTraceHistory(limit: number = 50) {
    return this.request<any[]>(`/traces?limit=${limit}`);
  }

  async getTrace(id: number) {
    return this.request<any>(`/traces/${id}`);
  }

  async getTraceStats() {
    return this.request<any>('/traces/stats/summary');
  }

  async exportTrace(id: number, format: 'json' | 'csv' = 'json') {
    const response = await fetch(`${API_BASE_URL}/traces/${id}/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
      },
      body: JSON.stringify({ format }),
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trace-${id}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}

export const apiClient = new ApiClient();
