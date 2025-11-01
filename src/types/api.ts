export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface ApiError {
  error: string;
  details?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
