import { apiRequest, apiGet, apiPost, apiPut, apiDelete } from "./api";

// ============================================
// GENERIC apiRequest USAGE EXAMPLES
// ============================================

// 1. Simple GET request
export const getLabels = async () => {
  return apiRequest({
    url: `/api/v1/labels`,
  });
};

// 2. GET with query params
export const getUsers = async (page: number, limit: number) => {
  return apiRequest({
    url: `/api/v1/users`,
    params: { page, limit },
  });
};

// 3. GET with custom headers
export const getUsersWithAuth = async () => {
  return apiRequest({
    url: `/api/v1/users`,
    headers: {
      'X-Custom-Header': 'custom-value',
    },
  });
};

// 4. POST with JSON data
export const createUser = async (userData: { name: string; email: string }) => {
  return apiRequest({
    method: 'POST',
    url: `/api/v1/users`,
    data: userData,
  });
};

// 5. POST with FormData
export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('userId', 'user-123');

  return apiRequest({
    method: 'POST',
    url: `/api/v1/upload`,
    formData, // Automatically sets Content-Type: multipart/form-data
  });
};

// 6. POST with upload progress
export const uploadFileWithProgress = async (
  file: File,
  onProgress: (progress: number) => void
) => {
  const formData = new FormData();
  formData.append('file', file);

  return apiRequest({
    method: 'POST',
    url: `/api/v1/upload`,
    formData,
    onUploadProgress: onProgress, // Progress callback
  });
};

// 7. POST multiple files
export const uploadMultipleFiles = async (files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

  return apiRequest({
    method: 'POST',
    url: `/api/v1/upload/multiple`,
    formData,
  });
};

// 8. PUT request (update)
export const updateUser = async (userId: string, userData: any) => {
  return apiRequest({
    method: 'PUT',
    url: `/api/v1/users/${userId}`,
    data: userData,
  });
};

// 9. DELETE request
export const deleteUser = async (userId: string) => {
  return apiRequest({
    method: 'DELETE',
    url: `/api/v1/users/${userId}`,
  });
};

// 10. PATCH request (partial update)
export const patchUser = async (userId: string, updates: any) => {
  return apiRequest({
    method: 'PATCH',
    url: `/api/v1/users/${userId}`,
    data: updates,
  });
};

// 11. Download file (blob response)
export const downloadFile = async (fileId: string) => {
  return apiRequest({
    url: `/api/v1/files/${fileId}/download`,
    responseType: 'blob',
  });
};

// 12. Download with progress
export const downloadFileWithProgress = async (
  fileId: string,
  onProgress: (progress: number) => void
) => {
  return apiRequest({
    url: `/api/v1/files/${fileId}/download`,
    responseType: 'blob',
    onDownloadProgress: onProgress,
  });
};

// 13. Request with timeout
export const getDataWithTimeout = async () => {
  return apiRequest({
    url: `/api/v1/data`,
    timeout: 5000, // 5 seconds
  });
};

// 14. Complex request with all options
export const complexRequest = async (file: File, metadata: any) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('metadata', JSON.stringify(metadata));

  return apiRequest({
    method: 'POST',
    url: `/api/v1/complex`,
    formData,
    params: { category: 'documents' },
    headers: { 'X-Request-ID': Date.now().toString() },
    timeout: 30000,
    onUploadProgress: (progress) => console.log(`Upload: ${progress}%`),
  });
};

// 15. TypeScript typed request
interface User {
  id: string;
  name: string;
  email: string;
}

export const getTypedUser = async (userId: string): Promise<User> => {
  return apiRequest<User>({
    url: `/api/v1/users/${userId}`,
  });
};

// 16. POST with typed request and response
interface CreateUserRequest {
  name: string;
  email: string;
  role: string;
}

interface CreateUserResponse {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export const createTypedUser = async (
  userData: CreateUserRequest
): Promise<CreateUserResponse> => {
  return apiRequest<CreateUserResponse, CreateUserRequest>({
    method: 'POST',
    url: `/api/v1/users`,
    data: userData,
  });
};

// ============================================
// USING CONVENIENCE WRAPPERS
// ============================================

// These are shorter versions using apiGet, apiPost, etc.

// GET with params
export const getUsersShort = async (page: number, limit: number) => {
  return apiGet(`/api/v1/users`, { params: { page, limit } });
};

// POST with data
export const createUserShort = async (userData: any) => {
  return apiPost(`/api/v1/users`, userData);
};

// POST with FormData
export const uploadFileShort = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return apiPost(`/api/v1/upload`, null, { formData });
};

// PUT
export const updateUserShort = async (userId: string, data: any) => {
  return apiPut(`/api/v1/users/${userId}`, data);
};

// DELETE
export const deleteUserShort = async (userId: string) => {
  return apiDelete(`/api/v1/users/${userId}`);
};

// ============================================
// REAL-WORLD EXAMPLES
// ============================================

// Authentication
export const login = async (email: string, password: string) => {
  return apiRequest({
    method: 'POST',
    url: `/api/v1/auth/login`,
    data: { email, password },
  });
};

export const logout = async () => {
  return apiRequest({
    method: 'POST',
    url: `/api/v1/auth/logout`,
  });
};

// File operations with progress
export const uploadDocument = async (
  file: File,
  category: string,
  onProgress: (progress: number) => void
) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('category', category);

  return apiRequest({
    method: 'POST',
    url: `/api/v1/documents/upload`,
    formData,
    onUploadProgress: onProgress,
  });
};

// Search with filters
export const searchItems = async (query: string, filters: any) => {
  return apiRequest({
    url: `/api/v1/items/search`,
    params: {
      q: query,
      ...filters,
    },
  });
};

// Batch operations
export const batchUpdate = async (updates: any[]) => {
  return apiRequest({
    method: 'POST',
    url: `/api/v1/batch/update`,
    data: { updates },
  });
};

// Export data
export const exportData = async (format: 'csv' | 'excel') => {
  return apiRequest({
    url: `/api/v1/export`,
    params: { format },
    responseType: 'blob',
  });
};

// Paginated request
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export const getPaginatedUsers = async (
  page: number,
  limit: number
): Promise<PaginatedResponse<User>> => {
  return apiRequest<PaginatedResponse<User>>({
    url: `/api/v1/users`,
    params: { page, limit },
  });
};

// Upload with metadata
export const uploadWithMetadata = async (
  file: File,
  metadata: {
    title: string;
    description: string;
    tags: string[];
  }
) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', metadata.title);
  formData.append('description', metadata.description);
  formData.append('tags', JSON.stringify(metadata.tags));

  return apiRequest({
    method: 'POST',
    url: `/api/v1/media/upload`,
    formData,
  });
};

// Retry with custom config
export const getDataWithRetry = async () => {
  return apiRequest({
    url: `/api/v1/data`,
    timeout: 10000,
    // You can add any axios config here
    validateStatus: (status) => status < 500,
  });
};

// ============================================
// COMPARISON: Generic vs Convenience
// ============================================

// Using generic apiRequest
export const example1 = async () => {
  return apiRequest({
    method: 'GET',
    url: `/api/v1/items`,
    params: { page: 1 },
  });
};

// Using convenience wrapper (shorter)
export const example2 = async () => {
  return apiGet(`/api/v1/items`, { params: { page: 1 } });
};

// Both are equivalent - use whichever you prefer!
