import { NextResponse } from "next/server";

// Dữ liệu user mẫu (trong thực tế bạn sẽ dùng database)
const users = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    password: "123456", // Trong thực tế phải hash password
  },
];

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email và mật khẩu là bắt buộc" },
        { status: 400 }
      );
    }

    // Tìm user
    const user = users.find((u) => u.email === email);

    if (!user) {
      return NextResponse.json(
        { message: "Email hoặc mật khẩu không đúng" },
        { status: 401 }
      );
    }

    // Kiểm tra password (trong thực tế dùng bcrypt.compare)
    if (user.password !== password) {
      return NextResponse.json(
        { message: "Email hoặc mật khẩu không đúng" },
        { status: 401 }
      );
    }

    // Tạo token đơn giản (trong thực tế dùng JWT)
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString("base64");

    // Trả về thông tin user (không trả password)
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message: "Đăng nhập thành công",
        token,
        user: userWithoutPassword,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra trong quá trình đăng nhập" },
      { status: 500 }
    );
  }
}
