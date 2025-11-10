"use client";

import { useState, useMemo } from "react";
import {
  Users,
  GraduationCap,
  TrendingUp,
  BookOpen,
  Plus,
  Filter,
} from "lucide-react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import StudentList from "../components/StudentList";
import StudentForm from "../components/StudentForm";
import { initialStudents, majors } from "../data/students";
import {
  generateStudentCode,
  searchStudents,
  filterByMajor,
  filterByStatus,
  sortStudents,
} from "../utils/helpers";
import StudentsPage from "./students/page";

export default function Home() {
  const [students, setStudents] = useState(initialStudents);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: "code", order: "asc" });

  // Tính toán statistics
  const stats = useMemo(() => {
    const totalStudents = students.length;
    const activeStudents = students.filter((s) => s.status === "active").length;
    const averageGPA =
      students.reduce((sum, s) => sum + s.gpa, 0) / totalStudents || 0;
    const uniqueMajors = new Set(students.map((s) => s.major)).size;

    return {
      total: totalStudents,
      active: activeStudents,
      averageGPA: averageGPA.toFixed(2),
      majors: uniqueMajors,
    };
  }, [students]);

  // Filter và search students
  const filteredStudents = useMemo(() => {
    let result = students;

    // Search
    result = searchStudents(result, searchTerm);

    // Filter by major
    result = filterByMajor(result, selectedMajor);

    // Filter by status
    result = filterByStatus(result, selectedStatus);

    // Sort
    result = sortStudents(result, sortConfig.key, sortConfig.order);

    return result;
  }, [students, searchTerm, selectedMajor, selectedStatus, sortConfig]);

  // Handle sort
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      order: prev.key === key && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header onSearch={setSearchTerm} />

        {/* Content */}
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
          <StudentsPage />
        </main>
      </div>

      {/* Student Form Modal */}
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
