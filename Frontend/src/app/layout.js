import "./globals.css";

export const metadata = {
  title: "Student Management System",
  description: "Hệ thống quản lý sinh viên",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
