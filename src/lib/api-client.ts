export class ApiError extends Error {
  constructor(message: string, public status: number, public endpoint: string) {
    super(message);
    this.name = 'ApiError';
  }
}

import {
  CreateEventRequest,
  Event,
  EventCategoriesResponse,
  EventsListResponse,
  UpdateEventRequest,
} from '@/schema/events';

class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string> = {};

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...this.defaultHeaders,
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(url, config);

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

        try {
          const errorBody = await response.json();
          if (errorBody.message) {
            errorMessage = errorBody.message;
          } else if (errorBody.error) {
            errorMessage = errorBody.error;
          }
        } catch {
          // JSON 파싱 실패 시 기본 메시지 사용
        }

        // 에러를 throw하여 Error Boundary에서 처리되도록
        throw new ApiError(errorMessage, response.status, endpoint);
      }

      let data: T;
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = (await response.text()) as unknown as T;
      }

      return data; // 성공 시 data만 반환
    } catch (error) {
      if (error instanceof ApiError) {
        throw error; // ApiError는 그대로 재throw
      }

      // 네트워크 에러 등은 ApiError로 래핑
      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error',
        500,
        endpoint
      );
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  setAuthToken(token: string) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  setDefaultHeader(key: string, value: string) {
    this.defaultHeaders[key] = value;
  }

  removeDefaultHeader(key: string) {
    delete this.defaultHeaders[key];
  }
}

// 서버 사이드 전용 설정
const getApiBaseUrl = () => {
  return process.env.API_BASE_URL || 'http://localhost:3000/api';
};

export const apiClient = new ApiClient(getApiBaseUrl());

export interface QueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const EventsApi = {
  getAll: async (params?: QueryParams): Promise<EventsListResponse> => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/events?${queryString}` : '/events';
    return apiClient.get<EventsListResponse>(endpoint);
  },

  // 특정 이벤트 가져오기 - 타입이 보장됨
  getById: async (id: string): Promise<Event> => {
    return apiClient.get<Event>(`/events/${id}`);
  },

  // 이벤트 생성 - 타입이 보장됨
  create: async (event: CreateEventRequest): Promise<Event> => {
    return apiClient.post<Event>('/events', event);
  },

  // 이벤트 수정 - 타입이 보장됨
  update: async (id: string, event: UpdateEventRequest): Promise<Event> => {
    return apiClient.patch<Event>(`/events/${id}`, event);
  },

  // 이벤트 전체 교체 - 타입이 보장됨
  replace: async (id: string, event: CreateEventRequest): Promise<Event> => {
    return apiClient.put<Event>(`/events/${id}`, event);
  },

  // 이벤트 삭제 - 타입이 보장됨
  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/events/${id}`);
  },
  Categories: {
    getAll: () => apiClient.get<EventCategoriesResponse>('/events/categories'),
  },
};
