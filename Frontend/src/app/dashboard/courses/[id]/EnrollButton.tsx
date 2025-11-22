"use client";

import { Button, message } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Course } from "@/lib/type";
import { useDispatch } from "react-redux";

interface EnrollButtonProps {
  course: Course;
}

export default function EnrollButton({ course }: EnrollButtonProps) {
  const router = useRouter();
  const { user, isAdmin } = useAuth(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleAddToCart = async () => {
    if (!user) {
      message.warning("Vui lòng đăng nhập để đăng ký khóa học");
      router.push("/auth/login");
      return;
    }
    if (isAdmin) {
      message.info("Admin không thể đăng ký học");
      return;
    }

    setLoading(true);
    dispatch({
      type: "cart/addRequest",
      payload: { course },
    });
    message.success("Đã thêm vào giỏ hàng!");
    setLoading(false);
  };

  if (isAdmin) {
    return (
      <Button type="default" size="large">
        Quản lý khóa học
      </Button>
    );
  }

  return (
    <Button
      type="primary"
      size="large"
      icon={<ShoppingCartOutlined />}
      onClick={handleAddToCart}
      loading={loading}
      className="font-medium"
    >
      Thêm vào giỏ hàng / Đăng ký học
    </Button>
  );
}
