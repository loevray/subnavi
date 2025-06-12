// lib/api-client.ts
interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string> = {};

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
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

        // 응답 본문에서 에러 메시지 추출 시도
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

        return {
          error: errorMessage,
          status: response.status,
        };
      }

      // 성공적인 응답 처리
      let data: T;
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // JSON이 아닌 경우 텍스트로 처리
        data = (await response.text()) as unknown as T;
      }

      return {
        data,
        status: response.status,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 500,
      };
    }
  }

  async get<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
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
  ): Promise<ApiResponse<T>> {
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
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  // 인증 헤더 설정
  setAuthToken(token: string) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // 기본 헤더 설정
  setDefaultHeader(key: string, value: string) {
    this.defaultHeaders[key] = value;
  }

  // 기본 헤더 제거
  removeDefaultHeader(key: string) {
    delete this.defaultHeaders[key];
  }
}

// 환경별 설정
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // 클라이언트 사이드
    return '/api';
  }
  // 서버 사이드 (Next.js 등)
  return process.env.API_BASE_URL || 'http://localhost:3000/api';
};

// 싱글톤 인스턴스
export const apiClient = new ApiClient(getApiBaseUrl());

// 타입 정의 개선
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string; // ISO 8601 형식 권장
  location: string;
  created_at: string; // ISO 8601 형식 권장
}

export type CreateEventRequest = Omit<Event, 'id' | 'created_at'>;
export type UpdateEventRequest = Partial<Omit<Event, 'id' | 'created_at'>>;

export interface EventsListResponse {
  events: Event[];
  total: number;
  page?: number;
  limit?: number;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 이벤트 관련 API 함수들 개선
export const eventsApi = {
  // 모든 이벤트 가져오기 (쿼리 파라미터 지원)
  getAll: (params?: QueryParams) => {
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

  // 특정 이벤트 가져오기
  getById: (id: string) => apiClient.get<Event>(`/events/${id}`),

  // 이벤트 생성
  create: (event: CreateEventRequest) =>
    apiClient.post<Event>('/events', event),

  // 이벤트 수정 (PATCH 사용)
  update: (id: string, event: UpdateEventRequest) =>
    apiClient.patch<Event>(`/events/${id}`, event),

  // 이벤트 전체 교체 (PUT 사용)
  replace: (id: string, event: CreateEventRequest) =>
    apiClient.put<Event>(`/events/${id}`, event),

  // 이벤트 삭제
  delete: (id: string) => apiClient.delete<void>(`/events/${id}`),
};
