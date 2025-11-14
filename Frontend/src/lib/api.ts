import { User, UserWithDates } from "./type";
const API_BASE_URL = "http://127.0.0.1:8080";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const login = async (credentials: {
  email: string;
  password: string;
}) => {
  const response = await fetch(`${API_BASE_URL}/users/login`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(credentials),
  });
  if (!response.ok) throw new Error("Login failed");
  return response.json();
};

export const signup = async (userData: {
  email: string;
  password: string;
  name: string;
}) => {
  const response = await fetch(`${API_BASE_URL}/users/signup`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(userData),
  });
  if (!response.ok) throw new Error("Signup failed");
  return response.json();
};

export const getCurrentUser = async () => {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Failed to get user");
  return response.json();
};

export const getStudents = async () => {
  const response = await fetch(`${API_BASE_URL}/students`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Failed to get students");
  return response.json();
};

export const createStudent = async (data: any) => {
  const response = await fetch(`${API_BASE_URL}/students`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create student");
  return response.json();
};

export const updateStudent = async (id: string, data: any) => {
  const response = await fetch(`${API_BASE_URL}/students/${id}`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update student");
};

export const deleteStudent = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/students/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Failed to delete student");
};

export const getCourses = async () => {
  const response = await fetch(`${API_BASE_URL}/courses`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Failed to get courses");
  return response.json();
};

export const createCourse = async (data: any) => {
  const response = await fetch(`${API_BASE_URL}/courses`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create course");
  return response.json();
};

export const updateCourse = async (id: string, data: any) => {
  const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update course");
};

export const deleteCourse = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Failed to delete course");
};
export const updateCurrentUser = async (data: Partial<User>) => {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update profile");
  }
  return response.json();
};
export const getAllUsers = async (): Promise<UserWithDates[]> => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch users");
  }
  return response.json();
};

export const deleteUser = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to delete user");
  }
};

export const updateUserRole = async (
  id: string,
  roles: string[]
): Promise<UserWithDates> => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({ roles }),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to update role");
  }
  return response.json();
};
