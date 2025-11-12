export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";

// API Endpoints
export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/users/login`,
  SIGNUP: `${API_BASE_URL}/users/signup`,
  USERS: `${API_BASE_URL}/users`,
  STUDENTS: `${API_BASE_URL}/students`,
};

// Helper function để gọi API với authentication
export async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Nếu token hết hạn (401), redirect về login
  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  return response;
}

export const auth = {
  getToken: () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  },

  getUser: () => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  },

  isAuthenticated: () => {
    return !!auth.getToken();
  },

  // Logout
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  },

  decodeToken: (token) => {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return null;
      const payload = JSON.parse(atob(parts[1]));
      return payload;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  },
};
