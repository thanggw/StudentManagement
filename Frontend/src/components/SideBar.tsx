"use client";

import { Layout, Menu } from "antd";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/api";
import {
  UserOutlined,
  BookOutlined,
  ProfileOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

export default function Sidebar() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setIsAdmin(user.roles?.includes("admin") || false);
      } catch (error) {
        console.error("Failed to fetch user");
      }
    };
    fetchUser();
  }, []);

  const menuItems = [
    {
      key: "students",
      icon: <UserOutlined />,
      label: <Link href="/dashboard/students">Students</Link>,
    },
    {
      key: "profile",
      icon: <ProfileOutlined />,
      label: <Link href="/dashboard/profile">Profile</Link>,
    },
    ...(isAdmin
      ? [
          {
            key: "courses",
            icon: <BookOutlined />,
            label: <Link href="/dashboard/courses">Courses</Link>,
          },
          {
            key: "users",
            icon: <TeamOutlined />,
            label: <Link href="/dashboard/users">Users</Link>,
          },
        ]
      : []),
  ];

  return (
    <Sider width={200} className="bg-white">
      <Menu
        mode="inline"
        defaultSelectedKeys={["students"]}
        style={{ height: "100%", borderRight: 0 }}
        items={menuItems}
      />
    </Sider>
  );
}
