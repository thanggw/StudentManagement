import "./globals.css";

export const metadata = {
  title: "Student Management System",
  description: "Hệ thống quản lý sinh viên",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
