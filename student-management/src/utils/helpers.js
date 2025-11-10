// Hàm tạo mã sinh viên tự động
export const generateStudentCode = (students) => {
  if (students.length === 0) return "SV001";

  const maxId = Math.max(
    ...students.map((s) => {
      const num = parseInt(s.code.replace("SV", ""));
      return isNaN(num) ? 0 : num;
    })
  );

  return `SV${String(maxId + 1).padStart(3, "0")}`;
};

// Hàm format điểm GPA
export const formatGPA = (gpa) => {
  return Number(gpa).toFixed(2);
};

// Hàm lấy màu theo GPA
export const getGPAColor = (gpa) => {
  if (gpa >= 3.6) return "text-green-600";
  if (gpa >= 3.0) return "text-blue-600";
  if (gpa >= 2.5) return "text-yellow-600";
  return "text-red-600";
};

// Hàm validate email
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Hàm validate số điện thoại Việt Nam
export const validatePhone = (phone) => {
  const re = /^(0|\+84)[0-9]{9}$/;
  return re.test(phone.replace(/\s/g, ""));
};

// Hàm tìm kiếm sinh viên
export const searchStudents = (students, searchTerm) => {
  if (!searchTerm) return students;

  const term = searchTerm.toLowerCase();
  return students.filter(
    (student) =>
      student.fullName.toLowerCase().includes(term) ||
      student.code.toLowerCase().includes(term) ||
      student.email.toLowerCase().includes(term) ||
      student.major.toLowerCase().includes(term)
  );
};

// Hàm lọc sinh viên theo ngành
export const filterByMajor = (students, major) => {
  if (!major || major === "all") return students;
  return students.filter((student) => student.major === major);
};

// Hàm lọc sinh viên theo trạng thái
export const filterByStatus = (students, status) => {
  if (!status || status === "all") return students;
  return students.filter((student) => student.status === status);
};

// Hàm sắp xếp sinh viên
export const sortStudents = (students, sortBy, sortOrder = "asc") => {
  const sorted = [...students].sort((a, b) => {
    let compareA = a[sortBy];
    let compareB = b[sortBy];

    if (typeof compareA === "string") {
      compareA = compareA.toLowerCase();
      compareB = compareB.toLowerCase();
    }

    if (compareA < compareB) return sortOrder === "asc" ? -1 : 1;
    if (compareA > compareB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return sorted;
};
