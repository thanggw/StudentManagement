"use client";

import { Layout, Avatar, Dropdown, message } from "antd";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { getCurrentUser } from "@/lib/api";
import { User } from "@/lib/type";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { logout } from "@/store/authSlice";

const { Header: AntHeader } = Layout;

export default function Header() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    message.success("Logged out");
    router.push("/auth/login");
  };

  const menuItems = [
    {
      key: "info",
      label: (
        <div className="px-3 py-2 border-b">
          <div className="font-medium">{user?.name || "User"}</div>
          <div className="text-xs text-gray-500">{user?.email}</div>
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
      <h1 className="text-xl font-semibold">Student Management</h1>
      <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
        <Avatar
          size="default"
          icon={<UserOutlined />}
          className="cursor-pointer bg-blue-500"
        >
          {user?.name?.charAt(0).toUpperCase()}
        </Avatar>
      </Dropdown>
    </AntHeader>
  );
}
