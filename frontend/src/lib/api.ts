const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;
  
  // Try to get token from auth store first, then fallback to localStorage
  let token = null;
  if (typeof window !== 'undefined') {
    // Try zustand persist storage
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const authData = JSON.parse(authStorage);
        token = authData.state?.accessToken;
      } catch (e) {
        // Fallback to direct localStorage
        token = localStorage.getItem('accessToken');
      }
    } else {
      token = localStorage.getItem('accessToken');
    }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid - clear auth and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-storage');
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
      throw new Error('Authentication required. Please login again.');
    }
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'An error occurred');
  }

  return response.json();
}

export const api = {
  auth: {
    register: (data: any) => fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    login: (data: any) => fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    refresh: (refreshToken: string) => fetchAPI('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),
    me: () => fetchAPI('/auth/me'),
    forgotPassword: (email: string) => fetchAPI('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
    resetPassword: (token: string, newPassword: string) => fetchAPI('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    }),
  },
  users: {
    getProfile: () => fetchAPI('/users/profile'),
    updateProfile: (data: any) => fetchAPI('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    updateAccessibility: (preferences: any) => fetchAPI('/users/accessibility', {
      method: 'PUT',
      body: JSON.stringify({ preferences }),
    }),
  },
  translations: {
    create: (data: any) => fetchAPI('/translations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    getAll: () => fetchAPI('/translations'),
    getHistory: (limit?: number) => fetchAPI(`/translations/history${limit ? `?limit=${limit}` : ''}`),
    getSaved: () => fetchAPI('/translations/saved'),
    getStats: () => fetchAPI('/translations/stats'),
    save: (id: string, notes?: string) => fetchAPI(`/translations/${id}/save`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    }),
    unsave: (id: string) => fetchAPI(`/translations/${id}/save`, {
      method: 'DELETE',
    }),
    delete: (id: string) => fetchAPI(`/translations/${id}`, {
      method: 'DELETE',
    }),
  },
  ai: {
    predict: (gestureData: any) => fetchAPI('/ai/predict', {
      method: 'POST',
      body: JSON.stringify({ gestureData }),
    }),
    getLogs: (limit?: number) => fetchAPI(`/ai/logs${limit ? `?limit=${limit}` : ''}`),
    getStats: () => fetchAPI('/ai/stats'),
    createTraining: (data: any) => fetchAPI('/ai/training', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    getTrainingHistory: () => fetchAPI('/ai/training'),
    getTraining: (id: string) => fetchAPI(`/ai/training/${id}`),
    updateTrainingStatus: (id: string, status: string, accuracy?: number, loss?: number, errorMessage?: string) =>
      fetchAPI(`/ai/training/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, accuracy, loss, errorMessage }),
      }),
  },
  admin: {
    getReports: () => fetchAPI('/admin/reports'),
    createReport: (data: any) => fetchAPI('/admin/reports', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    updateReportStatus: (id: string, status: string, adminResponse?: string) => 
      fetchAPI(`/admin/reports/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, adminResponse }),
      }),
    getStats: () => fetchAPI('/admin/stats'),
    getAllUsers: (page?: number, limit?: number, search?: string) => 
      fetchAPI(`/admin/users?page=${page || 1}&limit=${limit || 10}${search ? `&search=${search}` : ''}`),
    getUserById: (id: string) => fetchAPI(`/admin/users/${id}`),
    updateUserRole: (id: string, role: string) => fetchAPI(`/admin/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    }),
    deleteUser: (id: string) => fetchAPI(`/admin/users/${id}`, {
      method: 'DELETE',
    }),
    logSystemMetric: (data: any) => fetchAPI('/admin/system/metrics', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    getSystemMetrics: (limit?: number, type?: string) => 
      fetchAPI(`/admin/system/metrics?limit=${limit || 100}${type ? `&type=${type}` : ''}`),
    getDashboardStats: () => fetchAPI('/admin/system/dashboard'),
  },
  notifications: {
    getAll: () => fetchAPI('/notifications'),
    getUnread: () => fetchAPI('/notifications/unread'),
    getUnreadCount: () => fetchAPI('/notifications/count'),
    create: (data: any) => fetchAPI('/notifications', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    markAsRead: (id: string) => fetchAPI(`/notifications/${id}/read`, {
      method: 'PUT',
    }),
    markAllAsRead: () => fetchAPI('/notifications/read-all', {
      method: 'PUT',
    }),
    delete: (id: string) => fetchAPI(`/notifications/${id}`, {
      method: 'DELETE',
    }),
    clearAll: () => fetchAPI('/notifications/clear-all', {
      method: 'DELETE',
    }),
  },
};
