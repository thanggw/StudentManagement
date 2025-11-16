"use client";

import { Layout, Avatar, Dropdown, message } from "antd";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { getCurrentUser } from "@/lib/api";
import { User } from "@/lib/type";

const { Header: AntHeader } = Layout;

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch (err) {
        console.warn("Failed to load user info:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    message.success("Logged out successfully");
    router.push("/auth/login");
  };

  // Dropdown menu
  const menuItems = [
    {
      key: "info",
      label: (
        <div className="px-3 py-2 border-b">
          <div className="font-medium">{user?.name ?? "User"}</div>
          <div className="text-xs text-gray-500">{user?.email ?? ""}</div>
        </div>
      ),
      disabled: true,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  return (
    <AntHeader className="bg-white flex justify-between items-center px-6 shadow-sm">
      <h1 className="text-xl font-semibold m-0">Student Management</h1>

      <Dropdown
        menu={{ items: menuItems }}
        trigger={["click"]}
        placement="bottomRight"
        overlayClassName="min-w-48"
      >
        <Avatar
          size="default"
          icon={loading ? <UserOutlined /> : undefined}
          className="cursor-pointer bg-blue-500"
          style={{ backgroundColor: loading ? undefined : "#1890ff" }}
        >
          {/* Nếu không có icon, hiển thị chữ cái đầu của tên */}
          {!loading && user?.name?.charAt(0).toUpperCase()}
        </Avatar>
      </Dropdown>
    </AntHeader>
  );
}
