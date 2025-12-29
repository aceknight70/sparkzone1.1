import axios, { AxiosResponse, AxiosError } from 'axios';
import toast from 'react-hot-toast';

// Types
export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  avatarUrl?: string;
  bannerUrl?: string;
  bio?: string;
  pronouns?: string;
  gender?: string;
  age?: number;
  nationality?: string;
  isPremium: boolean;
  sparks: number;
  battlePower: number;
  maxAgeRating: 'Everyone' | 'Teen' | 'Mature';
  blockedTags: string[];
  createdAt: string;
  lastActive: string;
}

export interface Character {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  personality?: string;
  backstory?: string;
  appearance?: string;
  ageRating: 'Everyone' | 'Teen' | 'Mature';
  tags: string[];
  warnings: string[];
  likes: number;
  uses: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    username: string;
    name: string;
    avatarUrl?: string;
  };
}

export interface Post {
  id: string;
  content: string;
  imageUrl?: string;
  type: 'TEXT' | 'IMAGE' | 'CHARACTER_SHOWCASE' | 'WORLD_SHOWCASE' | 'STORY_EXCERPT' | 'MEME';
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    username: string;
    name: string;
    avatarUrl?: string;
    isPremium: boolean;
  };
  character?: {
    id: string;
    name: string;
    imageUrl?: string;
  };
  community?: {
    id: string;
    name: string;
    imageUrl?: string;
  };
}

export interface Comment {
  id: string;
  content: string;
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    username: string;
    name: string;
    avatarUrl?: string;
  };
  replies?: Comment[];
}

export interface Notification {
  id: string;
  type: 'LIKE' | 'COMMENT' | 'FOLLOW' | 'MENTION' | 'PARTY_INVITE' | 'COMMUNITY_INVITE' | 'SPARK_BATTLE_CHALLENGE' | 'SYSTEM';
  title: string;
  content: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
}

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('spark_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('spark_token');
      localStorage.removeItem('spark_user');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    } else if (error.response?.status === 403) {
      toast.error('Access forbidden');
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else if (error.code === 'NETWORK_ERROR') {
      toast.error('Network error. Please check your connection.');
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  register: (data: {
    email: string;
    username: string;
    password: string;
    name: string;
  }) => api.post('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  logout: () => api.post('/auth/logout'),

  refresh: () => api.post('/auth/refresh'),
};

// User API
export const userAPI = {
  getProfile: () => api.get<User>('/users/profile'),

  updateProfile: (data: Partial<User>) =>
    api.put<{ user: User }>('/users/profile', data),

  getUser: (identifier: string) =>
    api.get<User & { isFollowing: boolean }>(`/users/${identifier}`),

  followUser: (userId: string) =>
    api.post<{ isFollowing: boolean }>(`/users/${userId}/follow`),

  getFollowers: (userId: string, page: number = 1) =>
    api.get(`/users/${userId}/followers?page=${page}`),

  getFollowing: (userId: string, page: number = 1) =>
    api.get(`/users/${userId}/following?page=${page}`),

  searchUsers: (query: string, page: number = 1) =>
    api.get(`/users/search/${encodeURIComponent(query)}?page=${page}`),
};

// Character API
export const characterAPI = {
  createCharacter: (data: Partial<Character>) =>
    api.post<{ character: Character }>('/characters', data),

  getMyCharacters: (page: number = 1) =>
    api.get<{ characters: Character[] }>(`/characters/my-characters?page=${page}`),

  getCharacter: (characterId: string) =>
    api.get<Character>(`/characters/${characterId}`),

  updateCharacter: (characterId: string, data: Partial<Character>) =>
    api.put<{ character: Character }>(`/characters/${characterId}`, data),

  deleteCharacter: (characterId: string) =>
    api.delete(`/characters/${characterId}`),

  browseCharacters: (params: {
    page?: number;
    sortBy?: string;
    ageRating?: string;
    tags?: string;
  }) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });
    return api.get<{ characters: Character[] }>(`/characters?${searchParams}`);
  },

  searchCharacters: (query: string, page: number = 1) =>
    api.get<{ characters: Character[] }>(
      `/characters/search/${encodeURIComponent(query)}?page=${page}`
    ),

  likeCharacter: (characterId: string) =>
    api.post(`/characters/${characterId}/like`),
};

// Post API
export const postAPI = {
  createPost: (data: {
    content: string;
    type?: string;
    characterId?: string;
    communityId?: string;
  }) => api.post<{ post: Post }>('/posts', data),

  getFeed: (page: number = 1) =>
    api.get<{ posts: Post[] }>(`/posts/feed?page=${page}`),

  getPosts: (params: {
    page?: number;
    type?: string;
    communityId?: string;
  }) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });
    return api.get<{ posts: Post[] }>(`/posts?${searchParams}`);
  },

  getPost: (postId: string) =>
    api.get<Post & { comments: Comment[] }>(`/posts/${postId}`),

  likePost: (postId: string) =>
    api.post<{ isLiked: boolean }>(`/posts/${postId}/like`),

  addComment: (postId: string, data: { content: string; parentId?: string }) =>
    api.post<{ comment: Comment }>(`/posts/${postId}/comments`, data),

  deletePost: (postId: string) => api.delete(`/posts/${postId}`),
};

// AI API
export const aiAPI = {
  generateCharacter: (data: {
    prompt: string;
    style?: string;
    ageRating?: string;
  }) => api.post('/ai/generate/character', data),

  generateWorld: (data: {
    prompt: string;
    genre?: string;
    scope?: string;
    ageRating?: string;
  }) => api.post('/ai/generate/world', data),

  generateStory: (data: {
    prompt: string;
    genre?: string;
    length?: string;
    ageRating?: string;
    characters?: string[];
  }) => api.post('/ai/generate/story', data),

  generateMeme: (data: {
    topic: string;
    style?: string;
    context?: string;
  }) => api.post('/ai/generate/meme', data),

  continueStory: (data: {
    currentContent: string;
    direction?: string;
    characters?: string[];
    world?: string;
  }) => api.post('/ai/continue/story', data),
};

// Upload API
export const uploadAPI = {
  uploadSingle: (file: File, type: string = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    return api.post('/upload/single', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  uploadMultiple: (files: File[], type: string = 'general') => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    formData.append('type', type);
    return api.post('/upload/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  deleteFile: (publicId: string, resourceType: string = 'image') =>
    api.delete(`/upload/${encodeURIComponent(publicId)}`, {
      data: { resourceType },
    }),

  getUploadSignature: (folder: string = 'spark-zone', resourceType: string = 'image') =>
    api.post('/upload/signature', { folder, resourceType }),
};

// Notification API
export const notificationAPI = {
  getNotifications: (page: number = 1, unreadOnly: boolean = false) =>
    api.get<{ notifications: Notification[]; unreadCount: number }>(
      `/notifications?page=${page}&unreadOnly=${unreadOnly}`
    ),

  markAsRead: (notificationId: string) =>
    api.put(`/notifications/${notificationId}/read`),

  markAllAsRead: () => api.put('/notifications/read-all'),

  deleteNotification: (notificationId: string) =>
    api.delete(`/notifications/${notificationId}`),
};

export default api;