import { apiConfig } from '@/config/api';
import type { ApiError, ApiResponse, FetcherOptions } from '@/types/api.types';

class FetcherError extends Error {
  status: number;
  statusText: string;
  url: string;
  errors?: Record<string, string[]>;

  constructor(error: ApiError) {
    super(error.message);
    this.name = 'FetcherError';
    this.status = error.status;
    this.statusText = error.statusText;
    this.url = error.url;
    this.errors = error.errors;
  }
}

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetcher<T = unknown>(
  endpoint: string,
  options: FetcherOptions = {},
): Promise<T> {
  const {
    timeout = apiConfig.timeout,
    retry = apiConfig.retryAttempts,
    retryDelay = apiConfig.retryDelay,
    headers = {},
    ...restOptions
  } = options;

  const url = endpoint.startsWith('http') ? endpoint : `${apiConfig.baseUrl}${endpoint}`;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  };

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retry; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...restOptions,
        headers: defaultHeaders,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        throw new FetcherError({
          message: errorData.message || response.statusText || 'An error occurred',
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          errors: errorData.errors,
        });
      }

      const contentType = response.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        const data: ApiResponse<T> = await response.json();
        return data.data as T;
      }

      return (await response.text()) as T;
    } catch (error) {
      lastError = error as Error;

      if (error instanceof FetcherError) {
        if (error.status >= 400 && error.status < 500) {
          throw error;
        }
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new FetcherError({
          message: 'Request timeout',
          status: 408,
          statusText: 'Request Timeout',
          url,
        });
      }

      if (attempt < retry) {
        await sleep(retryDelay * (attempt + 1));
        continue;
      }

      throw lastError;
    }
  }

  throw lastError || new Error('Unknown error occurred');
}

export const httpClient = {
  get: <T>(endpoint: string, options?: FetcherOptions) =>
    fetcher<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, options?: FetcherOptions) =>
    fetcher<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    }),

  put: <T>(endpoint: string, body?: unknown, options?: FetcherOptions) =>
    fetcher<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  patch: <T>(endpoint: string, body?: unknown, options?: FetcherOptions) =>
    fetcher<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  delete: <T>(endpoint: string, options?: FetcherOptions) =>
    fetcher<T>(endpoint, { ...options, method: 'DELETE' }),
};

export async function fetcherWithSchema<T>(
  endpoint: string,
  schema: { parse: (data: unknown) => T },
  options?: FetcherOptions,
): Promise<T> {
  const data = await fetcher(endpoint, options);
  return schema.parse(data);
}

export { FetcherError };
