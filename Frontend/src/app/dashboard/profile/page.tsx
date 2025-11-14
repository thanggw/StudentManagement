"use client";

import { useState, useEffect } from "react";
import { Card, Avatar, Form, Input, Button, message, Spin } from "antd";
import { UserOutlined, EditOutlined } from "@ant-design/icons";
import { getCurrentUser, updateCurrentUser } from "@/lib/api";
import { User } from "@/lib/type";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data);
        form.setFieldsValue(data);
      } catch (error) {
        message.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      await updateCurrentUser(values);
      const updated = await getCurrentUser();
      setUser(updated);
      setEditing(false);
      message.success("Profile updated successfully");
    } catch (error: any) {
      message.error(error.message || "Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return <div className="text-center text-red-500">User not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card
        title={
          <div className="flex items-center gap-3">
            <Avatar size={48} icon={<UserOutlined />} />
            <div>
              <h2 className="text-xl font-semibold m-0">{user.name}</h2>
              <p className="text-gray-500 m-0">{user.email}</p>
            </div>
          </div>
        }
        extra={
          !editing && (
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => setEditing(true)}
            >
              Edit
            </Button>
          )
        }
      >
        {editing ? (
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Full Name"
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Invalid email format" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={handleSave}>
                Save
              </Button>
              <Button
                onClick={() => {
                  form.resetFields();
                  setEditing(false);
                }}
                style={{ marginLeft: 8 }}
              >
                Cancel
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <div className="space-y-4">
            <div>
              <strong>Role:</strong>{" "}
              <span className="capitalize">
                {user.roles?.join(", ") || "user"}
              </span>
            </div>
            <div>
              <strong>User ID:</strong> <code>{user.id}</code>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
