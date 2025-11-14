"use client";

import { Button, Form, Input, message } from "antd";
import { useRouter } from "next/navigation";
import { signup } from "@/lib/api";

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
    <div className="bg-white p-8 rounded shadow-md w-96">
      <h1 className="text-2xl mb-4">Signup</h1>
      <Form onFinish={onFinish}>
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input placeholder="Name" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Signup
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
