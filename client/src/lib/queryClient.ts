import { QueryClient } from '@tanstack/react-query';
import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth tokens
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Query client with default fetcher
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const [url] = queryKey as [string, ...unknown[]];
        const { data } = await api.get(url);
        return data;
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Helper function for mutations
export const apiRequest = {
  get: (url: string) => api.get(url).then(res => res.data),
  post: (url: string, data?: any) => api.post(url, data).then(res => res.data),
  put: (url: string, data?: any) => api.put(url, data).then(res => res.data),
  delete: (url: string) => api.delete(url).then(res => res.data),
};

export default api;