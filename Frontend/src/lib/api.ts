"use client";

import { User, UserWithDates, Course, Student } from "@/lib/type";
import { store } from "@/store";
import { setUser } from "@/store/authSlice";

const API_BASE_URL = "http://127.0.0.1:8080";

export const getAuthHeaders = (): Record<string, string> => {
  const authToken = localStorage.getItem("token");

  const headers: Record<string, string> = {};

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  return headers;
};
//url
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
  authToken?: string
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token =
    authToken ??
    (typeof window !== "undefined" ? localStorage.getItem("token") : null);
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    let msg = "Request failed";
    try {
      const err = await response.json();
      msg = err.message || msg;
    } catch {}
    throw new Error(msg);
  }
  if (response.status === 204) return undefined as T;
  return response.json();
};

//client
const createResourceClient = <T extends { id: string }>(basePath: string) => ({
  getAll: (filter?: string, skip = 0, limit = 10) =>
    apiRequest<{ data: T[]; total: number }>(
      `${basePath}?${new URLSearchParams({
        ...(filter && { filter }),
        skip: skip.toString(),
        limit: limit.toString(),
      }).toString()}`
    ),

  getById: (id: string) => apiRequest<T>(`${basePath}/${id}`),

  create: (data: Omit<T, "id">) =>
    apiRequest<T>(basePath, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<T>) =>
    apiRequest(`${basePath}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (id: string) => apiRequest(`${basePath}/${id}`, { method: "DELETE" }),
});

// tạo client
const students = createResourceClient<Student>("/students");
const courses = createResourceClient<Course>("/courses");
const users = createResourceClient<UserWithDates>("/users");

export const {
  getAll: getStudents,
  create: createStudent,
  update: updateStudent,
  delete: deleteStudent,
} = students;

export const {
  getAll: getCourses,
  create: createCourse,
  update: updateCourse,
  delete: deleteCourse,
} = courses;

export const { getAll: getAllUsers, delete: deleteUser } = users;

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
  document.cookie = `token=${token}; path=/; max-age=604800`;
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

export const updateUserRole = async (id: string, roles: string[]) => {
  return apiRequest<UserWithDates>(`/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ roles }),
  });
};

export const enrollCourse = async (data: {
  studentId: string;
  courseId: string;
  semester: string;
}) => {
  const res = await fetch(`${API_BASE_URL}/enrollments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw {
      message: error.error?.message || "Đăng ký thất bại",
      status: res.status,
    };
  }
  return res.json();
};
