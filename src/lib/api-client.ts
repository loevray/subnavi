import { CreateEventRequest, CreateEventResponse } from '@/dto/event/create-event.dto';
import { EventDetailResponse } from '@/dto/event/event-detail.dto';
import { EventListResponse } from '@/dto/event/event-list.dto';
import { EventCategory, EventDateFilter, RegionListResponse, RegionName } from '@/dto/event/shared-event.dto';
import { UpdateEventRequest, UpdateEventResponse } from '@/dto/event/update-event.dto';
import { ErrorResponseBody, isSerializedAppError, SerializedAppError } from '@/lib/errors/error-contract';

export class ApiError extends Error {
  public readonly code: SerializedAppError['code'];
  public readonly details?: unknown;

  constructor(
    message: string,
    public status: number,
    public endpoint: string,
    code: SerializedAppError['code'] = 'INTERNAL',
    details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
  }
}

class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string> = {};

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  private extractSerializedError(errorBody: unknown): SerializedAppError | null {
    if (!errorBody || typeof errorBody !== 'object') {
      return null;
    }

    const body = errorBody as Partial<ErrorResponseBody> & {
      error?: unknown;
      message?: unknown;
    };

    if (isSerializedAppError(body.error)) {
      return body.error;
    }

    if (typeof body.message === 'string') {
      return {
        code: 'INTERNAL',
        message: body.message,
        statusCode: 500,
      };
    }

    return null;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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
        let serializedError: SerializedAppError | null = null;

        try {
          const errorBody = await response.json();
          serializedError = this.extractSerializedError(errorBody);

          if (serializedError) {
            errorMessage = serializedError.message;
          } else if (
            errorBody &&
            typeof errorBody === 'object' &&
            'error' in errorBody &&
            typeof errorBody.error === 'string'
          ) {
            errorMessage = errorBody.error;
          }
        } catch {
          // Keep the default error message when the response body is not JSON.
        }

        throw new ApiError(
          errorMessage,
          response.status,
          endpoint,
          serializedError?.code ?? 'INTERNAL',
          serializedError?.details
        );
      }

      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        return (await response.json()) as T;
      }

      return (await response.text()) as unknown as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(error instanceof Error ? error.message : 'Unknown error', 500, endpoint);
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
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

const getApiBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_BASE_URL;
};

export const apiClient = new ApiClient(getApiBaseUrl());

export interface QueryParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  category?: EventCategory['name'];
  region?: RegionName;
  date?: EventDateFilter;
}

export const EventsApi = {
  getAll: async (params?: QueryParams): Promise<EventListResponse> => {
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
    return apiClient.get<EventListResponse>(endpoint);
  },

  getById: async (id: string): Promise<EventDetailResponse> => {
    return apiClient.get<EventDetailResponse>(`/events/${id}`);
  },

  create: async (event: CreateEventRequest): Promise<CreateEventResponse> => {
    return apiClient.post<CreateEventResponse>('/events', event);
  },

  update: async (id: string, event: UpdateEventRequest): Promise<UpdateEventResponse> => {
    return apiClient.patch<UpdateEventResponse>(`/events/${id}`, event);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/events/${id}`);
  },

  Categories: {
    getAll: () => apiClient.get<EventCategory[]>('/categories'),
  },
  Regions: {
    getAll: () => apiClient.get<RegionListResponse>('/regions'),
  },
};
