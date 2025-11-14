"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, API_BASE_URL } from "@/lib/apiConfig";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

import {
  Avatar,
  Card,
  Typography,
  Space,
  Button,
  Input,
  message,
  Spin,
  Tag,
  Divider,
  Row,
  Col,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { ClockCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "" });
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = auth.getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Không thể lấy thông tin user");

      const userData = await response.json();
      setUser(userData);
      setFormData({ name: userData.name });
    } catch (err: any) {
      setError(err.message);
      message.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!formData.name.trim()) {
      message.warning("Tên không được để trống");
      return;
    }

    setSaving(true);
    try {
      const token = auth.getToken();
      const res = await fetch(`${API_BASE_URL}/users/me`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: formData.name }),
      });

      if (!res.ok) throw new Error("Cập nhật thất bại");

      const updatedUser = await res.json();
      setUser(updatedUser);
      setIsEditing(false);
      message.success("Cập nhật thành công!");
    } catch (err: any) {
      message.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  {
    isLoading && (
      <Spin
        fullscreen
        size="large"
        tip="Đang tải thông tin người dùng..."
        indicator={<div className="text-2xl">Loading</div>}
      />
    );
  }

  if (error && !user) {
    return (
      <div className="text-center py-20">
        <Text type="danger">Lỗi: {error}</Text>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto p-6">
        <Card className="shadow-lg rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-32 -m-6 mb-6"></div>

          <div className="text-center -mt-16">
            <Avatar
              size={120}
              className="border-4 border-white shadow-2xl bg-indigo-600 font-bold text-5xl"
              icon={<UserOutlined />}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>

            <div className="mt-4">
              {isEditing ? (
                <Input
                  size="large"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
                  className="max-w-xs text-3xl font-bold text-center"
                  autoFocus
                />
              ) : (
                <Title level={2} className="mt-2 !text-gray-800">
                  {user?.name || "User"}
                </Title>
              )}

              <Text type="secondary" className="text-lg">
                {user?.email}
              </Text>

              <div className="mt-3">
                <Tag
                  color={user?.deleted ? "red" : "green"}
                  icon={
                    user?.deleted ? <StopOutlined /> : <CheckCircleOutlined />
                  }
                >
                  {user?.deleted ? "Đã khóa" : "Hoạt động"}
                </Tag>
                <Tag color="blue">{user?.roles?.join(", ") || "User"}</Tag>
              </div>
            </div>
          </div>

          <Divider />

          <Row gutter={[32, 24]}>
            <Col xs={24} md={12}>
              <Space direction="vertical" size="middle" className="w-full">
                <div>
                  <Text strong className="text-gray-600">
                    <UserOutlined className="mr-2" />
                    ID người dùng
                  </Text>
                  <div className="mt-1 font-mono text-sm bg-gray-100 px-3 py-2 rounded">
                    {user?.id}
                  </div>
                </div>

                <div>
                  <Text strong className="text-gray-600">
                    <CalendarOutlined className="mr-2" />
                    Ngày tạo
                  </Text>
                  <Text className="block mt-1">
                    {new Date(user?.createdAt).toLocaleDateString("vi-VN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                </div>
              </Space>
            </Col>

            <Col xs={24} md={12}>
              <Space direction="vertical" size="middle" className="w-full">
                <div>
                  <Text strong className="text-gray-600">
                    <ClockCircleOutlined className="mr-2" />
                    Cập nhật lần cuối
                  </Text>
                  <Text className="block mt-1">
                    {new Date(user?.updatedAt).toLocaleString("vi-VN")}
                  </Text>
                </div>

                <div>
                  <Text strong className="text-gray-600">
                    Trạng thái tài khoản
                  </Text>
                  <Text
                    className={`block mt-1 font-medium ${
                      user?.deleted ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {user?.deleted ? "Đã bị khóa" : "Hoạt động bình thường"}
                  </Text>
                </div>
              </Space>
            </Col>
          </Row>

          <Divider />

          <div className="flex justify-center gap-4">
            {isEditing ? (
              <>
                <Button
                  type="primary"
                  size="large"
                  icon={<SaveOutlined />}
                  onClick={handleUpdate}
                  loading={saving}
                  className="bg-blue-600"
                >
                  Lưu thay đổi
                </Button>
                <Button
                  size="large"
                  icon={<CloseOutlined />}
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({ name: user?.name });
                  }}
                >
                  Hủy
                </Button>
              </>
            ) : (
              <Button
                type="primary"
                size="large"
                icon={<EditOutlined />}
                onClick={() => setIsEditing(true)}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Chỉnh sửa hồ sơ
              </Button>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
