import axios, { AxiosError } from 'axios';
import type { Anime } from '@/types/anime';

interface ApiErrorResponse {
  message: string;
  code?: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // You might want to redirect to login page or refresh the token here
    }
    
    throw new ApiError(
      error.response?.data?.message || 'An unexpected error occurred',
      error.response?.status,
      error.response?.data?.code
    );
  }
);

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  username: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  birthDate?: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    username: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    role: string;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  hasNextPage: boolean;
}

export interface AnimeQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  genre?: string;
  type?: string;
  status?: string;
  where?: {
    [key: string]: any;
  };
  orderBy?: {
    [key: string]: 'asc' | 'desc';
  };
}

export const auth = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to login');
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/register', data);
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to register');
    }
  },

  async logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  async forgotPassword(email: string): Promise<{ message: string; token?: string }> {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to process forgot password request');
    }
  },

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    try {
      const response = await api.post('/auth/reset-password', { token, newPassword });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to reset password');
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },
};

export const animes = {
  async getAll(params: AnimeQueryParams): Promise<PaginatedResponse<Anime>> {
    const response = await api.get('/anime', { params });
    return response.data;
  },

  async getOne(id: string): Promise<Anime> {
    const response = await api.get(`/anime/${id}`);
    return response.data;
  },

  async addToFavorites(id: string): Promise<void> {
    await api.post(`/anime/${id}/favorites`);
  },

  async removeFromFavorites(id: string): Promise<void> {
    await api.delete(`/anime/${id}/favorites`);
  },

  async updateProgress(id: string, episode: number, progress: number): Promise<void> {
    await api.post(`/anime/${id}/progress`, {
      episode,
      progress,
    });
  },

  async getFavorites(): Promise<PaginatedResponse<Anime>> {
    const response = await api.get('/anime/user/favorites');
    return response.data;
  },
};

export const videos = {
  async getByAnimeId(animeId: string) {
    const response = await api.get(`/videos/anime/${animeId}`);
    return response.data;
  },

  async getByEpisode(animeId: string, episode: number) {
    const response = await api.get(`/videos/anime/${animeId}/episode/${episode}`);
    return response.data;
  },

  async refreshSources(animeId: string, episode: number) {
    const response = await api.post(
      `/videos/anime/${animeId}/episode/${episode}/refresh`,
    );
    return response.data;
  },
};

export interface UpdateProfileData {
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  country?: string;
  birthDate?: string;
  avatar?: string;
  language?: string;
  theme?: string;
}

export const users = {
  async getProfile() {
    const response = await api.get('/users/profile');
    return response.data;
  },

  async updateProfile(data: UpdateProfileData) {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  async getHistory() {
    const response = await api.get('/users/history');
    return response.data;
  },

  async getStats() {
    const response = await api.get('/users/stats');
    return response.data;
  },
};