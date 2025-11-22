"use client";

import { Layout, Avatar, Dropdown, message, Badge, Popover } from "antd";
import { useRouter } from "next/navigation";
import {
  UserOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { logout } from "@/store/authSlice";
import Link from "next/link";
import { Roles } from "@/lib/constants";

import { useIsAdmin, useIsStudent, useCurrentUser } from "@/hooks/useRole";
import { useCart } from "@/hooks/useCart";
import CartPopoverContent from "@/components/cart/CartPopoverContent";

const { Header: AntHeader } = Layout;

export default function Header() {
  const dispatch = useDispatch();
  const router = useRouter();

  const user = useCurrentUser();
  const isStudent = useIsStudent();
  const isAdmin = useIsAdmin();
  const { items: cartItems, loading: cartLoading, totalItems } = useCart();

  const handleLogout = () => {
    dispatch(logout());
    message.success("Đã đăng xuất");
    router.push("/auth/login");
  };

  const menuItems = [
    {
      key: "info",
      label: (
        <div className="px-3 py-2 border-b min-w-48">
          <div className="font-medium">{user?.name || "User"}</div>
          <div className="text-xs text-gray-500">{user?.email}</div>
          <div className="text-xs text-blue-600 mt-1">
            {isAdmin ? "Quản trị viên" : "Sinh viên"}
          </div>
        </div>
      ),
      disabled: true,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      onClick: handleLogout,
    },
  ];

  return (
    <AntHeader className="bg-white flex justify-between items-center px-6 shadow-sm h-16">
      <Link href="/dashboard">
        <h1 className="text-xl font-bold text-blue-600 cursor-pointer hover:opacity-80 transition">
          Student Management
        </h1>
      </Link>

      <div className="flex items-center space-x-6">
        {/* Giỏ hàng - chỉ hiện cho sinh viên */}
        {isStudent && (
          <Popover
            content={
              <CartPopoverContent
                items={cartItems}
                loading={cartLoading}
                totalItems={totalItems}
              />
            }
            trigger="click"
            placement="bottomRight"
            arrow={false}
          >
            <Badge
              style={{ marginTop: "10px", right: "10px" }}
              count={totalItems}
              size="small"
              offset={[-5, 5]}
            >
              <button
                className="hover:bg-gray-100 rounded-full p-3 transition flex items-center justify-center"
                disabled={cartLoading}
              >
                <ShoppingCartOutlined className="text-2xl" />
              </button>
            </Badge>
          </Popover>
        )}

        {/* Avatar Dropdown */}
        <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
          <Avatar
            size={40}
            icon={<UserOutlined />}
            className="cursor-pointer bg-blue-500 hover:bg-blue-600 transition shadow-md"
          >
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
        </Dropdown>
      </div>
    </AntHeader>
  );
}
