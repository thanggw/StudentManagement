"use client";
import {
  Layout,
  Avatar,
  Dropdown,
  message,
  Badge,
  Popover,
  List,
  Button,
  Empty,
} from "antd";
import { useRouter } from "next/navigation";
import {
  UserOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { logout } from "@/store/authSlice";
import Link from "next/link";
import { Roles } from "@/lib/constants";
const { Header: AntHeader } = Layout;

export default function Header() {
  const dispatch = useDispatch();
  const router = useRouter();

  const user = useSelector((state: RootState) => state.auth.user);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartLoading = useSelector((state: RootState) => state.cart.loading);

  const isStudent = user?.roles?.includes(Roles.USER);
  const isAdmin = user?.roles?.includes(Roles.ADMIN);

  const totalItems = cartItems.length;

  const handleLogout = () => {
    dispatch(logout());
    message.success("Đã đăng xuất");
    router.push("/auth/login");
  };

  const cartPopoverContent = (
    <div className="w-80">
      <h4 className="font-semibold mb-3">Giỏ hàng ({totalItems} môn)</h4>
      {cartLoading ? (
        <div className="text-center py-4">Đang tải...</div>
      ) : totalItems === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Giỏ hàng trống"
        />
      ) : (
        <>
          <List
            size="small"
            dataSource={cartItems.slice(0, 4)}
            renderItem={(item: any) => (
              <List.Item className="border-b last:border-b-0 py-2">
                <div className="flex-1">
                  <div className="font-medium text-sm">
                    {item.course.courseCode}
                  </div>
                  <div className="text-xs text-gray-600">
                    {item.course.courseName}
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {item.course.credits} tín
                </div>
              </List.Item>
            )}
          />
          {totalItems > 4 && (
            <div className="text-center text-xs text-gray-500 mt-2">
              ... và {totalItems - 4} môn khác
            </div>
          )}
          <div className="mt-4 flex gap-2">
            <Button
              type="primary"
              size="small"
              block
              onClick={() => router.push("/dashboard/cart")}
            >
              Xem chi tiết giỏ hàng
            </Button>
            {totalItems > 0 && (
              <Button
                size="small"
                onClick={() => router.push("/dashboard/cart/checkout")}
              >
                Đăng ký ngay
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );

  const menuItems = [
    {
      key: "info",
      label: (
        <div className="px-3 py-2 border-b">
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
        <h1 className="text-xl font-bold text-blue-600 cursor-pointer">
          Student Management
        </h1>
      </Link>

      <div className="flex items-center space-x-6">
        {/* Giỏ hàng - chỉ hiện cho sinh viên */}
        {isStudent && (
          <Popover
            content={cartPopoverContent}
            trigger="click"
            placement="bottomRight"
          >
            <Badge count={totalItems} size="small" offset={[-5, 5]}>
              <Button
                type="text"
                size="large"
                icon={<ShoppingCartOutlined className="text-2xl" />}
                className="hover:bg-gray-100 rounded-full p-3 transition"
                loading={cartLoading}
              />
            </Badge>
          </Popover>
        )}

        {/* Avatar */}
        <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
          <Avatar
            size={40}
            icon={<UserOutlined />}
            className="cursor-pointer bg-blue-500 hover:bg-blue-600 transition"
          >
            {user?.name?.charAt(0).toUpperCase() || user?.name?.charAt(0)}
          </Avatar>
        </Dropdown>
      </div>
    </AntHeader>
  );
}
