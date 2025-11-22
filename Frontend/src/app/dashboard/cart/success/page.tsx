import { Result, Button } from "antd";
import { Link } from "lucide-react";
export default function CheckoutSuccess({
  searchParams,
}: {
  searchParams: { orderId: string; amount: string };
}) {
  return (
    <Result
      status="success"
      title="Thanh toán thành công!"
      subTitle={`Mã đơn hàng: ${searchParams.orderId}`}
      extra={[
        <Button type="primary" key="order">
          <Link href={`/dashboard/orders/${searchParams.orderId}`}>
            Xem chi tiết đơn hàng
          </Link>
        </Button>,
        <Button key="continue">
          <Link href="/dashboard/courses">Tiếp tục mua khóa học</Link>
        </Button>,
      ]}
    />
  );
}
