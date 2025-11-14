"use client";
import { useState, useMemo, useEffect } from "react";
import {
  Users,
  GraduationCap,
  TrendingUp,
  BookOpen,
  Plus,
  Filter,
  FileText,
  Calendar,
  BarChart3,
  Settings,
  UserCog,
  BookOpenCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import StudentList from "../components/StudentList";
import StudentForm from "../components/StudentForm";
import { majors } from "../data/students";
import { auth } from "@/lib/apiConfig";
import { searchStudents, sortStudents } from "../utils/helpers";
import {
  getStudents,
  searchStudents as searchStudentsApi,
  createStudent,
  updateStudent,
  deleteStudent,
} from "@/lib/api";
import { API_BASE_URL } from "@/lib/apiConfig";

function DynamicSidebar({ role, activeItem, setActiveItem }) {
  const router = useRouter();

  const menu = role === "admin" ? ADMIN_MENU : USER_MENU;
  const title = role === "admin" ? "Quản trị viên" : "Giáo viên";
  const gradient =
    role === "admin"
      ? "from-red-500 to-rose-600"
      : "from-green-500 to-emerald-600";

  const handleMenuClick = (id, path) => {
    setActiveItem(id);
    if (path) {
      router.push(path); // điều hướng
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col">
      {/* Header */}
      <div className={`p-6 border-b bg-gradient-to-r ${gradient} text-white`}>
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-sm opacity-90">Hệ thống quản lý</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id, item.path)} // thêm path
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group
                ${
                  isActive
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-semibold shadow-md"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-blue-600" : ""}`} />
              <span className="flex-1 text-left">{item.label}</span>
              {isActive && (
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-ping" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
          <p className="text-xs font-bold text-purple-900">Phiên bản 2.0</p>
          <p className="text-xs text-purple-700">© 2025 EduSys</p>
        </div>
      </div>
    </aside>
  );
}
const USER_MENU = [
  { id: "students", icon: Users, label: "Quản lý SV" },
  { id: "courses", icon: BookOpen, label: "Môn học" },
  { id: "grades", icon: FileText, label: "Điểm số" },
  { id: "schedule", icon: Calendar, label: "Lịch học" },
  { id: "reports", icon: BarChart3, label: "Báo cáo" },
  { id: "settings", icon: Settings, label: "Cài đặt" },
];

const ADMIN_MENU = [
  { id: "students", icon: Users, label: "Quản lý SV", path: "/" },
  { id: "manage-users", icon: UserCog, label: "Quản lý user", path: "/user" },
  {
    id: "manage-courses",
    icon: BookOpenCheck,
    label: "Quản lý course",
    path: "/course",
  },
];
export default function Home() {
  const [allStudents, setAllStudents] = useState([]); // Dữ liệu đầy đủ cho stats
  const [backendStudents, setBackendStudents] = useState([]); // Kết quả lọc major/status từ backend
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: "code", order: "asc" });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [role, setRole] = useState(null);
  const [activeItem, setActiveItem] = useState("students");
  // Hàm map dữ liệu backend sang frontend format
  const mapToFrontend = (s) => ({
    id: s.id,
    code: s.studentCode,
    fullName: s.fullName,
    email: s.email,
    phone: s.phoneNumber,
    major: s.major,
    gpa: parseFloat(s.gpa),
    enrollmentYear: parseInt(s.admissionYear, 10) || 2000,
    status: s.status,
  });

  // Fetch toàn bộ cho stats
  const fetchAll = async () => {
    try {
      const data = await getStudents();
      setAllStudents(data.map(mapToFrontend));
    } catch (error) {
      console.error("Không thể tải dữ liệu stats:", error);
    }
  };

  // Fetch lọc major/status từ backend
  const fetchBackend = async () => {
    try {
      setIsLoading(true);
      const params = {};
      if (selectedMajor !== "all") params.major = selectedMajor;
      if (selectedStatus !== "all") params.status = selectedStatus;
      const result = await searchStudentsApi(params);
      setBackendStudents(result.data.map(mapToFrontend));
    } catch (error) {
      console.error("Không thể tải danh sách sinh viên:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkAuthAndRole = async () => {
      const token = auth.getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = await res.json();
        const userRole = user.roles.includes("admin") ? "admin" : "user";
        setRole(userRole);
        setActiveItem("students");
      } catch (err) {
        auth.logout();
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthAndRole();
  }, [router]);

  // Fetch stats (toàn bộ dữ liệu)
  useEffect(() => {
    fetchAll();
  }, []);

  // Fetch list khi major/status thay đổi
  useEffect(() => {
    fetchBackend();
  }, [selectedMajor, selectedStatus]);

  // Tính toán statistics từ allStudents
  const stats = useMemo(() => {
    const totalStudents = allStudents.length;
    const activeStudents = allStudents.filter(
      (s) => s.status === "active"
    ).length;
    const averageGPA =
      allStudents.reduce((sum, s) => sum + s.gpa, 0) / totalStudents || 0;
    const uniqueMajors = new Set(allStudents.map((s) => s.major)).size;
    return {
      total: totalStudents,
      active: activeStudents,
      averageGPA: averageGPA.toFixed(2),
      majors: uniqueMajors,
    };
  }, [allStudents]);

  // Filter và search students (searchTerm client-side, sort)
  const filteredStudents = useMemo(() => {
    let result = backendStudents;
    // Search client-side
    if (searchTerm) {
      result = searchStudents(result, searchTerm);
    }
    // Sort
    result = sortStudents(result, sortConfig.key, sortConfig.order);
    return result;
  }, [backendStudents, searchTerm, sortConfig]);

  // Handle sort
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      order: prev.key === key && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  // Handle edit
  const handleEdit = (student) => {
    setEditingStudent({ ...student });
    setIsFormOpen(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!confirm("Xác nhận xóa sinh viên?")) return;
    try {
      await deleteStudent(id);
      fetchBackend();
      fetchAll(); // Cập nhật stats
    } catch (error) {
      alert("Lỗi xóa: " + error.message);
    }
  };

  // Handle save student
  const handleSaveStudent = async (formData) => {
    try {
      const backendData = {
        studentCode: formData.code,
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phone,
        major: formData.major,
        gpa: parseFloat(formData.gpa),
        admissionYear: parseInt(formData.enrollmentYear, 10) || 2000,
        status: formData.status,
      };
      if (editingStudent) {
        await updateStudent(editingStudent.id, backendData);
      } else {
        await createStudent(backendData);
      }
      setIsFormOpen(false);
      setEditingStudent(null);
      fetchBackend(); // Refetch list
      fetchAll(); // Refetch stats
    } catch (error) {
      const errorMsg = error.message || "Lỗi lưu dữ liệu";
      if (error.details) {
        console.error("Validation errors:", error.details);
        alert(`${errorMsg}\nChi tiết: ${JSON.stringify(error.details)}`);
      } else {
        alert(errorMsg);
      }
    }
  };

  if (isLoading && allStudents.length === 0)
    return <div className="p-8 text-center">Đang tải...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {role && (
        <DynamicSidebar
          role={role}
          activeItem={activeItem}
          setActiveItem={setActiveItem}
        />
      )}
      <div className="flex-1 flex flex-col">
        <Header onSearch={setSearchTerm} />
        <main className="flex-1 p-6 overflow-auto">
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard
              title="Tổng sinh viên"
              value={stats.total}
              icon={Users}
              color="blue"
              trend={{
                direction: "up",
                value: 12,
                label: "so với tháng trước",
              }}
            />
            <StatCard
              title="Đang học"
              value={stats.active}
              icon={GraduationCap}
              color="green"
              trend={{ direction: "up", value: 5, label: "sinh viên mới" }}
            />
            <StatCard
              title="GPA trung bình"
              value={stats.averageGPA}
              icon={TrendingUp}
              color="yellow"
              trend={{ direction: "up", value: 2, label: "tăng 0.1 điểm" }}
            />
            <StatCard
              title="Ngành học"
              value={stats.majors}
              icon={BookOpen}
              color="purple"
            />
          </div>
          {/* Actions and Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                  value={selectedMajor}
                  onChange={(e) => setSelectedMajor(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tất cả ngành</option>
                  {majors.map((major) => (
                    <option key={major} value={major}>
                      {major}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Đang học</option>
                  <option value="inactive">Tạm nghỉ</option>
                  <option value="graduated">Đã tốt nghiệp</option>
                </select>
              </div>
              <button
                onClick={() => {
                  setEditingStudent(null);
                  setIsFormOpen(true);
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Thêm sinh viên</span>
              </button>
            </div>
          </div>
          {/* Student List */}
          {isLoading ? (
            <div className="p-8 text-center">Đang tải danh sách...</div>
          ) : (
            <StudentList
              students={filteredStudents}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSort={handleSort}
            />
          )}
        </main>
      </div>
      {isFormOpen && (
        <StudentForm
          student={editingStudent}
          onSave={handleSaveStudent}
          onClose={() => {
            setIsFormOpen(false);
            setEditingStudent(null);
          }}
        />
      )}
    </div>
  );
}
