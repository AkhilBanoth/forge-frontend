
import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';
import type { ApiError } from '../../types/api';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  import.meta.env.NEXT_PUBLIC_API_URL ||
  'https://skill-forge-0zkr.onrender.com';

export const USE_MOCKS =
  String(import.meta.env.VITE_USE_MOCKS ?? 'false') === 'true';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    try {
      const persistedAuth = localStorage.getItem('skillforge_auth');

      if (persistedAuth) {
        const parsed = JSON.parse(persistedAuth);
        const token = parsed?.state?.token;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch {
      // Ignore local storage errors.
    }

    return config;
  },
  (error) => Promise.reject(error)
);

type NotificationListener = (msg: {
  type: 'error' | 'warning';
  text: string;
}) => void;

const listeners: NotificationListener[] = [];

export function subscribeToApiNotifications(
  listener: NotificationListener
) {
  listeners.push(listener);

  return () => {
    const index = listeners.indexOf(listener);
    if (index !== -1) listeners.splice(index, 1);
  };
}

export function notify(msg: {
  type: 'error' | 'warning';
  text: string;
}) {
  listeners.forEach((listener) => listener(msg));
}

type LogoutCallback = () => void;
let onUnauthorizedLogout: LogoutCallback | null = null;

export function registerUnauthorizedHandler(cb: LogoutCallback) {
  onUnauthorizedLogout = cb;
}

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ detail?: string; message?: string }>) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || '';
    const hasAuthorization =
      Boolean(error.config?.headers?.Authorization);

    if (status === 403) {
      notify({
        type: 'warning',
        text: "You don't have permission to access that resource.",
      });
    }

    if (
      status === 401 &&
      hasAuthorization &&
      !requestUrl.includes('/auth/login')
    ) {
      try {
        localStorage.removeItem('skillforge_auth');
        document.cookie = 'skillforge_role=; path=/; max-age=0;';
      } catch {
        // Ignore storage errors.
      }

      if (onUnauthorizedLogout) {
        onUnauthorizedLogout();
      }

      if (
        typeof window !== 'undefined' &&
        !window.location.pathname.startsWith('/login')
      ) {
        window.location.href =
          `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      }
    }

    const normalizedError: ApiError = {
      message:
        error.response?.data?.message ||
        error.response?.data?.detail ||
        error.message ||
        'An unexpected API error occurred.',
      status: status || 500,
      code: error.code,
    };

    return Promise.reject(normalizedError);
  }
);
