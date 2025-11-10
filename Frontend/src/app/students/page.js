"use client";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import StudentForm from "../../components/StudentForm";
import StudentList from "../../components/StudentList";
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../../lib/api";
import { majors, statuses } from "../../data/students";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [sortBy, setSortBy] = useState({ field: null, direction: "asc" });

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await getStudents();
      const mappedStudents = data.map((s) => ({
        id: s.id,
        code: s.studentCode,
        fullName: s.fullName,
        email: s.email,
        phone: s.phoneNumber,
        major: s.major,
        gpa: parseFloat(s.gpa),
        enrollmentYear: parseInt(s.admissionYear, 10) || 2000,
        status: s.status,
      }));
      setStudents(mappedStudents);
    } catch (error) {
      alert("Lỗi tải dữ liệu: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
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

      let updatedStudent;
      if (editingStudent) {
        updatedStudent = await updateStudent(editingStudent.id, backendData);
        console.log("Update success (204):", updatedStudent);
        setStudents((prev) =>
          prev.map((s) =>
            s.id === editingStudent.id
              ? {
                  ...s,
                  code: backendData.studentCode,
                  fullName: backendData.fullName,
                  email: backendData.email,
                  phone: backendData.phoneNumber,
                  major: backendData.major,
                  gpa: parseFloat(backendData.gpa),
                  enrollmentYear:
                    parseInt(backendData.admissionYear, 10) || 2000,
                  status: backendData.status,
                }
              : s
          )
        );
      } else {
        updatedStudent = await createStudent(backendData);
        const mappedNew = {
          id: updatedStudent.id,
          code: backendData.studentCode,
          fullName: backendData.fullName,
          email: backendData.email,
          phone: backendData.phoneNumber,
          major: backendData.major,
          gpa: parseFloat(backendData.gpa),
          enrollmentYear: parseInt(backendData.admissionYear, 10) || 2000,
          status: backendData.status,
        };
        setStudents((prev) => [...prev, mappedNew]);
      }
      setShowForm(false);
      setEditingStudent(null);
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

  const handleEdit = (student) => {
    setEditingStudent({ ...student });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Xác nhận xóa sinh viên?")) return;
    try {
      await deleteStudent(id);
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      alert("Lỗi xóa: " + error.message);
    }
  };

  const handleSort = (field) => {
    setSortBy((prev) => {
      const direction =
        prev.field === field && prev.direction === "asc" ? "desc" : "asc";
      const sorted = [...students].sort((a, b) => {
        let aVal = a[field];
        let bVal = b[field];
        // Handle number fields
        if (["gpa", "enrollmentYear"].includes(field)) {
          aVal = parseFloat(aVal);
          bVal = parseFloat(bVal);
        }
        if (aVal < bVal) return direction === "asc" ? -1 : 1;
        if (aVal > bVal) return direction === "asc" ? 1 : -1;
        return 0;
      });
      setStudents(sorted);
      return { field, direction };
    });
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  if (loading) return <div className="p-8 text-center">Đang tải...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý sinh viên</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm mới</span>
        </button>
      </div>

      <StudentList
        students={students}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSort={handleSort}
      />

      {showForm && (
        <StudentForm
          student={editingStudent}
          onSave={handleSave}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}
