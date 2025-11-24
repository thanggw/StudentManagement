"use client";
import { Button, Form, Input, message } from "antd";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import { UserOutlined, LockOutlined, BookOutlined } from "@ant-design/icons";

export default function LoginPage() {
  const router = useRouter();

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      const { token } = await login(values);
      localStorage.setItem("token", token);
      message.success("Login successful");
      router.push("/dashboard/students");
    } catch (error) {
      message.error("Login failed");
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 overflow-hidden">
      <div className="relative bg-white/95 backdrop-blur-sm p-12 rounded-3xl shadow-2xl w-full max-w-xl mx-4">
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-full">
            <BookOutlined className="text-4xl text-white" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-500">Hệ thống quản lý sinh viên</p>
        </div>

        <Form onFinish={onFinish} layout="vertical">
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Email"
              size="large"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Mật khẩu"
              size="large"
              className="rounded-lg"
            />
          </Form.Item>

          <div className="flex justify-between items-center mb-6">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <label className="flex items-center text-sm text-gray-600 cursor-pointer">
                <input type="checkbox" className="mr-2" />
                Ghi nhớ mật khảu
              </label>
            </Form.Item>
            <a href="#" className="text-sm text-blue-500 hover:text-blue-700">
              Quên mật khẩu?
            </a>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 border-none hover:from-blue-600 hover:to-purple-600 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-6 text-sm text-gray-600">
          Bạn không có tài khoản?{" "}
          <a
            href="/auth/signup"
            className="text-blue-500 hover:text-blue-700 font-semibold"
          >
            Đăng ký
          </a>
        </div>
      </div>
    </div>
  );
}
