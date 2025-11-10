// Data mẫu cho sinh viên
export const initialStudents = [
  {
    id: 1,
    code: "SV001",
    fullName: "Nguyễn Văn An",
    email: "an.nguyen@example.com",
    phone: "0912345678",
    major: "Công nghệ thông tin",
    gpa: 3.5,
    status: "active",
    enrollmentYear: 2022,
  },
  {
    id: 2,
    code: "SV002",
    fullName: "Trần Thị Bình",
    email: "binh.tran@example.com",
    phone: "0987654321",
    major: "Kế toán",
    gpa: 3.8,
    status: "active",
    enrollmentYear: 2021,
  },
  {
    id: 3,
    code: "SV003",
    fullName: "Lê Hoàng Cường",
    email: "cuong.le@example.com",
    phone: "0934567890",
    major: "Quản trị kinh doanh",
    gpa: 3.2,
    status: "active",
    enrollmentYear: 2023,
  },
  {
    id: 4,
    code: "SV004",
    fullName: "Phạm Thị Dung",
    email: "dung.pham@example.com",
    phone: "0945678901",
    major: "Công nghệ thông tin",
    gpa: 3.9,
    status: "active",
    enrollmentYear: 2022,
  },
  {
    id: 5,
    code: "SV005",
    fullName: "Hoàng Văn Em",
    email: "em.hoang@example.com",
    phone: "0956789012",
    major: "Marketing",
    gpa: 3.0,
    status: "inactive",
    enrollmentYear: 2020,
  },
];

// Danh sách ngành học
export const majors = [
  "Công nghệ thông tin",
  "Kế toán",
  "Quản trị kinh doanh",
  "Marketing",
  "Kinh tế",
  "Luật",
  "Y khoa",
  "Kiến trúc",
];

// Trạng thái sinh viên
export const statuses = [
  { value: "active", label: "Đang học", color: "text-green-600 bg-green-100" },
  { value: "inactive", label: "Tạm nghỉ", color: "text-red-600 bg-red-100" },
  {
    value: "graduated",
    label: "Đã tốt nghiệp",
    color: "text-blue-600 bg-blue-100",
  },
];
