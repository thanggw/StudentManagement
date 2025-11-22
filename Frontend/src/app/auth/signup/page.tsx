"use client";

import { Button, Form, Input, message } from "antd";
import { useRouter } from "next/navigation";
import { signup } from "@/lib/api";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  BookOutlined,
} from "@ant-design/icons";

export default function SignupPage() {
  const router = useRouter();

  const onFinish = async (values: {
    email: string;
    password: string;
    name: string;
  }) => {
    try {
      await signup(values);
      message.success("Signup successful. Please login.");
      router.push("/auth/login");
    } catch (error) {
      message.error("Signup failed");
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 overflow-hidden">
      <div className="relative bg-white/95 backdrop-blur-sm p-12 rounded-3xl shadow-2xl w-full max-w-xl mx-4">
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-full shadow-lg">
            <BookOutlined className="text-5xl text-white" />
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Tạo tài khoản
          </h1>
          <p className="text-gray-500 text-lg">Hệ thống quản lý sinh viên</p>
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
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="Email"
              size="large"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Họ và tên"
              size="large"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              { min: 6, message: "Password must be at least 6 characters!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Mật khẩu"
              size="large"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Xác nhận mật khẩu"
              size="large"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="w-full h-14 bg-gradient-to-r from-blue-500 to-purple-500 border-none hover:from-blue-600 hover:to-purple-600 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 mt-4"
            >
              Tạo tài khoản
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-8 text-base text-gray-600">
          Bạn đã có tài khoản?{" "}
          <a
            href="/auth/login"
            className="text-blue-500 hover:text-blue-700 font-semibold"
          >
            Đăng nhập
          </a>
        </div>
      </div>
    </div>
  );
}
