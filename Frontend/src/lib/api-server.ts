const API_BASE_URL = "http://127.0.0.1:8080";
import { User } from "./type";
export const apiRequestServer = async <T>(
  endpoint: string,
  token?: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
    cache: options.cache ?? "no-store",
  });

  if (!response.ok) {
    let msg = "Request failed";
    try {
      const err = await response.json();
      msg = err.error?.message || err.message || msg;
    } catch {}
    throw new Error(msg);
  }

  if (response.status === 204) return undefined as T;
  return response.json();
};
