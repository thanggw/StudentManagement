"use client";

import { User, UserWithDates, Course, Student } from "@/lib/type";
import { store } from "@/store";
import { setUser } from "@/store/authSlice";

const API_BASE_URL = "http://127.0.0.1:8080";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    let errorMessage = "Request failed";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // Không parse được JSON
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
};

export const login = async (credentials: {
  email: string;
  password: string;
}) => {
  const { token } = await apiRequest<{ token: string }>("/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  localStorage.setItem("token", token);
  const user = await getCurrentUser();
  store.dispatch(setUser(user));
  return { token, user };
};

export const signup = async (userData: {
  email: string;
  password: string;
  name: string;
}) => {
  return apiRequest("/users/signup", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const getCurrentUser = async (): Promise<User> => {
  return apiRequest<User>("/users/me");
};

export const updateCurrentUser = async (data: Partial<User>) => {
  return apiRequest<User>("/users/me", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

export const getStudents = async (
  filter?: string,
  skip = 0,
  limit = 10
): Promise<{ data: Student[]; total: number }> => {
  const params = new URLSearchParams();
  if (filter) params.set("filter", filter);
  params.set("skip", skip.toString());
  params.set("limit", limit.toString());

  return apiRequest(`/students?${params.toString()}`);
};

export const createStudent = async (data: Omit<Student, "id">) => {
  return apiRequest<Student>("/students", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateStudent = async (id: string, data: Partial<Student>) => {
  await apiRequest(`/students/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

export const deleteStudent = async (id: string) => {
  await apiRequest(`/students/${id}`, { method: "DELETE" });
};

export const getCourses = async (
  filter?: string,
  skip = 0,
  limit = 10
): Promise<{ data: Course[]; total: number }> => {
  const params = new URLSearchParams();
  if (filter) params.set("filter", filter);
  params.set("skip", skip.toString());
  params.set("limit", limit.toString());

  return apiRequest(`/courses?${params.toString()}`);
};

export const createCourse = async (data: Omit<Course, "id">) => {
  return apiRequest<Course>("/courses", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateCourse = async (id: string, data: Partial<Course>) => {
  await apiRequest(`/courses/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

export const deleteCourse = async (id: string) => {
  await apiRequest(`/courses/${id}`, { method: "DELETE" });
};

// USERS (ADMIN)
export const getAllUsers = async (
  filter?: string,
  skip = 0,
  limit = 10
): Promise<{ data: UserWithDates[]; total: number }> => {
  const params = new URLSearchParams();
  if (filter) params.set("filter", filter);
  params.set("skip", skip.toString());
  params.set("limit", limit.toString());

  return apiRequest(`/users?${params.toString()}`);
};

export const deleteUser = async (id: string): Promise<void> => {
  await apiRequest(`/users/${id}`, { method: "DELETE" });
};

export const updateUserRole = async (
  id: string,
  roles: string[]
): Promise<UserWithDates> => {
  return apiRequest<UserWithDates>(`/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ roles }),
  });
};
