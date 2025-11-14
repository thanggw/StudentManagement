const API_BASE = "http://localhost:8080";

export async function getStudents() {
  try {
    const response = await fetch(`${API_BASE}/students`);
    if (!response.ok) throw new Error("Lỗi tải danh sách sinh viên");
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

export async function searchStudents(params = {}) {
  const { major, status, page = 1, limit = 100 } = params;
  let url = `${API_BASE}/students/search?page=${page}&limit=${limit}`;
  if (major && major !== "all") url += `&major=${encodeURIComponent(major)}`;
  if (status && status !== "all")
    url += `&status=${encodeURIComponent(status)}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Lỗi tìm kiếm sinh viên");
    return await response.json(); // {data: [...], total, page, limit}
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

export async function createStudent(studentData) {
  try {
    const response = await fetch(`${API_BASE}/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(studentData),
    });
    if (!response.ok) throw new Error("Lỗi tạo sinh viên");
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

export async function updateStudent(id, studentData) {
  const response = await fetch(`${API_BASE}/students/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(studentData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || "Update failed"}`);
  }

  return {};
}

export async function deleteStudent(id) {
  try {
    const response = await fetch(`${API_BASE}/students/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Lỗi xóa sinh viên");
    return { success: true };
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
