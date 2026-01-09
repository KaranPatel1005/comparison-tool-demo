import axiosInstance from "../utils/axios";
import type { AxiosRequestConfig } from "axios";

// Generic API Request Options
interface ApiRequestOptions<T = any> {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  url: string;
  data?: T;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  formData?: FormData;
  onUploadProgress?: (progress: number) => void;
  onDownloadProgress?: (progress: number) => void;
  timeout?: number;
  responseType?: "json" | "blob" | "arraybuffer" | "text";
  [key: string]: any; // Allow any other axios config options
}

/**
 * Generic API Request Wrapper
 * Handles all HTTP methods with flexible options
 */
export const apiRequest = async <TResponse = any, TData = any>(
  options: ApiRequestOptions<TData>
): Promise<TResponse> => {
  const {
    method = "GET",
    url,
    data,
    params,
    headers,
    formData,
    onUploadProgress,
    onDownloadProgress,
    timeout,
    responseType,
    ...restConfig
  } = options;

  // Build axios config
  const config: AxiosRequestConfig = {
    method,
    url,
    ...restConfig,
  };

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Nzg3N2Q5YzUwMDk0Yjg4ZDM1NmIxM2QiLCJyb2xlIjoiQWRtaW5pc3RyYXRvciIsImVtYWlsIjoiZGVtb0BieGwuZGlnaXRhbCIsImlhdCI6MTc2NzYyNTg5NCwiZXhwIjoxNzcwMjE3ODk0fQ.CKoXdwRpHu6iL4PclQER03tHtrIHOiu4S5I1lJ5OSHM";

  // Add data (body)
  if (formData) {
    config.data = formData;
    config.headers = {
      ...config.headers,
      "Content-Type": "multipart/form-data",
      Authorization: "Bearer " + token,
      ...headers,
    };
  } else if (data) {
    config.data = data;
    if (headers) {
      config.headers = { ...config.headers, ...headers };
    }
  } else if (headers) {
    config.headers = headers;
  }

  // Add query params
  if (params) {
    config.params = params;
  }

  // Add progress tracking
  if (onUploadProgress) {
    config.onUploadProgress = (progressEvent: any) => {
      if (progressEvent.total) {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onUploadProgress(percent);
      }
    };
  }

  if (onDownloadProgress) {
    config.onDownloadProgress = (progressEvent: any) => {
      if (progressEvent.total) {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onDownloadProgress(percent);
      }
    };
  }

  // Add timeout
  if (timeout) {
    config.timeout = timeout;
  }

  // Add response type
  if (responseType) {
    config.responseType = responseType;
  }

  // Make request
  const response = await axiosInstance.request(config);
  return response.data;
};

// Convenience wrappers (optional - for cleaner syntax)
export const apiGet = <T = any>(
  url: string,
  options?: Omit<ApiRequestOptions, "method" | "url">
) => apiRequest<T>({ method: "GET", url, ...options });

export const apiPost = <T = any>(
  url: string,
  data?: any,
  options?: Omit<ApiRequestOptions, "method" | "url" | "data">
) => apiRequest<T>({ method: "POST", url, data, ...options });

export const apiPut = <T = any>(
  url: string,
  data?: any,
  options?: Omit<ApiRequestOptions, "method" | "url" | "data">
) => apiRequest<T>({ method: "PUT", url, data, ...options });

export const apiDelete = <T = any>(
  url: string,
  options?: Omit<ApiRequestOptions, "method" | "url">
) => apiRequest<T>({ method: "DELETE", url, ...options });

export const apiPatch = <T = any>(
  url: string,
  data?: any,
  options?: Omit<ApiRequestOptions, "method" | "url" | "data">
) => apiRequest<T>({ method: "PATCH", url, data, ...options });

// Example API functions using the generic wrapper
export const checkboxListing = async () => {
  return apiGet(`/api/v1/labels`);
};
