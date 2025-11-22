import { List, Button, Empty, Spin } from "antd";
import { useRouter } from "next/navigation";
import { ShoppingCartOutlined } from "@ant-design/icons";

interface CartPopoverContentProps {
  items: any[];
  loading: boolean;
  totalItems: number;
}

export default function CartPopoverContent({
  items,
  loading,
  totalItems,
}: CartPopoverContentProps) {
  const router = useRouter();

  if (loading) {
    return (
      <div className="w-80 p-4 text-center">
        <Spin />
      </div>
    );
  }

  if (totalItems === 0) {
    return (
      <div className="w-80">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Giỏ hàng trống"
        />
      </div>
    );
  }

  return (
    <div className="w-80">
      <h4 className="font-semibold mb-3 px-4">Giỏ hàng ({totalItems} môn)</h4>

      <List
        size="small"
        dataSource={items.slice(0, 4)}
        renderItem={(item) => (
          <List.Item className="border-b last:border-b-0 py-3 px-4 hover:bg-gray-50">
            <div className="flex-1">
              <div className="font-medium text-sm">
                {item.course.courseCode}
              </div>
              <div className="text-xs text-gray-600 line-clamp-1">
                {item.course.courseName}
              </div>
            </div>
            <div className="text-xs text-gray-500 ml-4">
              {item.course.credits} tín
            </div>
          </List.Item>
        )}
      />

      {totalItems > 4 && (
        <div className="text-center text-xs text-gray-500 py-2">
          ... và {totalItems - 4} môn khác
        </div>
      )}

      <div className="p-4 border-t mt-3 flex gap-2">
        <Button
          type="primary"
          size="middle"
          block
          onClick={() => router.push("/dashboard/cart")}
        >
          Xem chi tiết giỏ hàng
        </Button>
        {totalItems > 0 && (
          <Button
            type="default"
            size="middle"
            onClick={() => router.push("/dashboard/cart/checkout")}
          >
            Đăng ký ngay
          </Button>
        )}
      </div>
    </div>
  );
}
