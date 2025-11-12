import { NextResponse } from "next/server";

// Dữ liệu user mẫu (trong thực tế bạn sẽ dùng database)
let users = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    password: "123456",
  },
];

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Vui lòng điền đầy đủ thông tin" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Email không hợp lệ" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { message: "Mật khẩu phải có ít nhất 6 ký tự" },
        { status: 400 }
      );
    }

    // Kiểm tra email đã tồn tại
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return NextResponse.json(
        { message: "Email đã được sử dụng" },
        { status: 409 }
      );
    }

    // Tạo user mới
    const newUser = {
      id: users.length + 1,
      name,
      email,
      password, // Trong thực tế phải hash password với bcrypt
    };

    users.push(newUser);

    // Trả về thông tin user (không trả password)
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      {
        message: "Đăng ký thành công",
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra trong quá trình đăng ký" },
      { status: 500 }
    );
  }
}
