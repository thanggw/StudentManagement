import { checkoutAction } from "@/store/checkoutAction";
import { Button, Card, Result, Typography } from "antd";
import { useCurrentUser } from "@/hooks/useRole";
import Link from "next/link";
import { cookies } from "next/headers";
import { apiRequestServer } from "@/lib/api-server";
import { User } from "@/lib/type";
import { Roles } from "@/lib/constants";
import Title from "antd/es/typography/Title";

export default async function CheckoutPage() {
  const cookieReceived = await cookies();
  const token = cookieReceived.get("token")?.value;
  const user = await apiRequestServer<User>("/users/me", token);
  const isAdmin = user?.roles?.includes(Roles.ADMIN) || false;

  // Nếu không có user → redirect về login
  if (!user) {
    return <Result status="403" title="Vui lòng đăng nhập" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <Card>
          <Title level={3} className="text-center">
            Xác nhận thanh toán
          </Title>

          <div className="my-8 text-center">
            <p className="text-lg">
              Tài khoản: <strong>{user.email}</strong>
            </p>
            <p className="text-lg">
              Số dư hiện tại:{" "}
              <strong>{user.balance?.toLocaleString()} ₫</strong>
            </p>
          </div>

          <form action={checkoutAction}>
            <input type="hidden" name="studentId" value={user.id} />

            <Button
              type="primary"
              danger
              size="large"
              block
              htmlType="submit"
              className="h-14 text-lg font-bold"
            >
              XÁC NHẬN THANH TOÁN NGAY
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Link href="/dashboard/cart">
              <Button type="link">← Quay lại giỏ hàng</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
