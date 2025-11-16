"use client";

import { Layout, Menu } from "antd";
import Link from "next/link";
import {
  UserOutlined,
  BookOutlined,
  ProfileOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/hooks/useAuth";
import { Roles } from "@/lib/constants";

const { Sider } = Layout;

export default function Sidebar() {
  const { isAdmin } = useAuth();

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
