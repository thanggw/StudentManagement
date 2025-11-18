// File: app/dashboard/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, Avatar, Form, Input, Button, message, Spin } from "antd";
import { UserOutlined, EditOutlined } from "@ant-design/icons";
import { updateCurrentUser } from "@/lib/api";
import { User } from "@/lib/type";
import { useAuth } from "@/hooks/useAuth";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/authSlice";

export default function ProfilePage() {
  const { user: reduxUser } = useAuth(); // Chỉ lấy user từ Redux
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  // Đồng bộ form khi reduxUser thay đổi
  useEffect(() => {
    if (reduxUser) {
      form.setFieldsValue(reduxUser);
    }
  }, [reduxUser, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const updated = await updateCurrentUser(values);

      // CẬP NHẬT REDUX
      dispatch(setUser(updated));

      setEditing(false);
      message.success("Profile updated successfully");
    } catch (error: any) {
      message.error(error.message || "Failed to update profile");
    }
  };

  if (!reduxUser) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card
        title={
          <div className="flex items-center gap-3">
            <Avatar size={48} icon={<UserOutlined />} />
            <div>
              <h2 className="text-xl font-semibold m-0">{reduxUser.name}</h2>
              <p className="text-gray-500 m-0">{reduxUser.email}</p>
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
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, type: "email" }]}
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
                {reduxUser.roles?.join(", ") || "user"}
              </span>
            </div>
            <div>
              <strong>User ID:</strong> <code>{reduxUser.id}</code>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
