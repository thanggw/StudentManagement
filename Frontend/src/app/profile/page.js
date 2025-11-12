"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, API_BASE_URL } from "@/lib/apiConfig";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "" });
  const [successMsg, setSuccessMsg] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = auth.getToken();
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetch(`${API_BASE_URL}/users/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Không thể lấy thông tin user");
        }

        const userData = await response.json();
        setUser(userData);
        setFormData({ name: userData.name });
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      setError("");
      setSuccessMsg("");
      const token = auth.getToken();
      const res = await fetch(`${API_BASE_URL}/users/me`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Không thể cập nhật thông tin");
      }

      const updatedUser = await res.json();
      setUser(updatedUser);
      setSuccessMsg("Cập nhật thành công!");
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">Đang tải...</div>
    );
  if (error)
    return <div className="text-red-500 text-center">Lỗi: {error}</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-indigo-600 rounded-full mx-auto flex items-center justify-center mb-4">
            <span className="text-white font-bold text-2xl">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="text-3xl font-bold text-gray-800 mb-2 text-center border-b border-gray-300 focus:outline-none focus:border-blue-500"
            />
          ) : (
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {user?.name || "User"}
            </h1>
          )}
          <p className="text-gray-600">{user?.email || "email@example.com"}</p>
          <p className="text-sm text-gray-500 mt-2">
            Vai trò: {user?.roles?.join(", ") || "User"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID
              </label>
              <p className="text-gray-900">{user?.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tạo lúc
              </label>
              <p className="text-gray-900">
                {new Date(user?.createdAt).toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cập nhật lúc
              </label>
              <p className="text-gray-900">
                {new Date(user?.updatedAt).toLocaleDateString("vi-VN")}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <p className="text-gray-900">
                {user?.deleted ? "Đã xóa" : "Hoạt động"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
          {successMsg && <p className="text-green-600 text-sm">{successMsg}</p>}
          {isEditing ? (
            <div className="flex gap-3">
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Lưu thay đổi
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Hủy
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Chỉnh sửa hồ sơ
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
