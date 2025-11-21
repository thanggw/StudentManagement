"use client";

import {
  Table,
  Button,
  message,
  Popconfirm,
  Empty,
  Card,
  Typography,
  Space,
  Tag,
} from "antd";
import {
  DeleteOutlined,
  ShoppingCartOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { removeFromCart } from "@/store/cartSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Roles } from "@/lib/constants";
const { Title, Text } = Typography;

export default function CartPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { items: cartItems, loading } = useSelector(
    (state: RootState) => state.cart
  );
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (user?.roles?.includes(Roles.USER) && cartItems.length === 0) {
      dispatch({ type: "cart/loadRequest" });
    }
  }, [user, cartItems.length, dispatch]);

  const handleRemove = (cartItemId: string) => {
    dispatch({ type: "cart/removeRequest", payload: cartItemId });
    message.success("Đã xóa khỏi giỏ hàng");
  };

  const totalCredits = cartItems.reduce(
    (sum, item) => sum + (item.course?.credits || 0),
    0
  );

  const columns = [
    {
      title: "Mã môn",
      dataIndex: ["course", "courseCode"],
      key: "courseCode",
      width: 120,
    },
    {
      title: "Tên môn học",
      dataIndex: ["course", "courseName"],
      key: "courseName",
      ellipsis: true,
    },
    {
      title: "Số tín chỉ",
      dataIndex: ["course", "credits"],
      key: "credits",
      width: 100,
      align: "center" as const,
      render: (credits: number) => <Tag color="blue">{credits} tín</Tag>,
    },
    {
      title: "Thời gian thêm",
      key: "addedAt",
      width: 160,
      render: (_: any, record: any) => (
        <Text type="secondary" className="text-xs">
          {new Date(record.addedAt || Date.now()).toLocaleString("vi-VN")}
        </Text>
      ),
    },
    {
      title: "",
      key: "action",
      width: 100,
      render: (_: any, record: any) => (
        <Popconfirm
          title="Xóa khỏi giỏ hàng?"
          onConfirm={() => handleRemove(record.id || record._id)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Button danger size="small" icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  if (!user || !user.roles?.includes(Roles.USER)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>Vui lòng đăng nhập với tài khoản sinh viên để xem giỏ hàng</Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Title level={2} className="flex items-center gap-3">
            <ShoppingCartOutlined className="text-blue-600" />
            Giỏ hàng của bạn
          </Title>
          <Text type="secondary">
            Bạn đang chọn <strong>{cartItems.length}</strong> môn học • Tổng{" "}
            <strong>{totalCredits}</strong> tín chỉ
          </Text>
        </div>

        {/* Nội dung chính */}
        {cartItems.length === 0 ? (
          <Card className="text-center py-16">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span>
                  <Text strong>Giỏ hàng trống</Text>
                  <br />
                  <Text type="secondary">
                    Hãy chọn môn học bạn muốn đăng ký
                  </Text>
                </span>
              }
            >
              <Button
                type="primary"
                size="large"
                onClick={() => router.push("/dashboard/courses")}
                icon={<ArrowRightOutlined />}
              >
                Xem danh sách khóa học
              </Button>
            </Empty>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Danh sách môn học */}
            <div className="lg:col-span-2">
              <Card>
                <Table
                  columns={columns}
                  dataSource={cartItems}
                  rowKey={(record) =>
                    record.id || record._id || record.courseId
                  }
                  loading={loading}
                  pagination={false}
                  locale={{ emptyText: "Không có môn học nào trong giỏ" }}
                />
              </Card>
            </div>

            {/* Tổng kết & Checkout */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6 shadow-lg">
                <Title level={4} className="mb-6">
                  Tóm tắt đăng ký
                </Title>

                <div className="space-y-4">
                  <div className="flex justify-between text-base">
                    <span>Số môn học:</span>
                    <strong>{cartItems.length} môn</strong>
                  </div>
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Tổng tín chỉ:</span>
                    <Tag color="green">{totalCredits} tín chỉ</Tag>
                  </div>

                  <div className="border-t pt-4 mt-6">
                    <Button
                      type="primary"
                      size="large"
                      block
                      className="h-12 text-lg font-medium"
                      onClick={() => {
                        message.success("Chức năng đăng ký đang phát triển!");
                        // router.push("/dashboard/cart/checkout");
                      }}
                    >
                      Đăng ký tất cả môn học
                      <ArrowRightOutlined />
                    </Button>
                  </div>

                  <Button
                    type="default"
                    size="large"
                    block
                    onClick={() => router.push("/dashboard/courses")}
                  >
                    Tiếp tục chọn môn
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
