import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9095";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// =============================
// Request Interceptor
// =============================
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Nzg3N2Q5YzUwMDk0Yjg4ZDM1NmIxM2QiLCJyb2xlIjoiQWRtaW5pc3RyYXRvciIsImVtYWlsIjoiZGVtb0BieGwuZGlnaXRhbCIsImlhdCI6MTc2NzYyNTg5NCwiZXhwIjoxNzcwMjE3ODk0fQ.CKoXdwRpHu6iL4PclQER03tHtrIHOiu4S5I1lJ5OSHM"
    const currentLanguage =  "de";

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    config.headers["Accept-Language"] = currentLanguage;

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// =============================
// Refresh Token Logic
// =============================
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// =============================
// Response Interceptor
// =============================
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check for 401 and retry not already attempted
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers["Authorization"] = "Bearer " + token;
              resolve(axiosInstance(originalRequest));
            },
            reject: (err: any) => {
              reject(err);
            },
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        const response = await axios.post(`${API_BASE_URL}/api/v1/users/refreshToken`, {
          refreshToken,
        });

        const newToken = response.data.data.token;
        localStorage.setItem("authToken", newToken);

        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        processQueue(null, newToken);

        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest); // Retry original request
      } catch (err: any) {
        processQueue(err, null);

        // Logout if refresh also fails
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
