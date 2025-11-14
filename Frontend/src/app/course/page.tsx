"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Spin,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import AdminLayout from "@/components/admin/AdminLayout";
import { API_BASE_URL, auth } from "@/lib/apiConfig";

interface Course {
  id: string;
  courseCode: string;
  courseName: string;
  credits: number;
  description: string;
}

export default function CourseManagementPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [form] = Form.useForm();
  const router = useRouter();

  const fetchCourses = async () => {
    const token = auth.getToken();
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Lỗi tải dữ liệu");
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      message.error("Không thể tải danh sách môn học");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSave = async (values: any) => {
    const token = auth.getToken();
    const url = editingCourse
      ? `${API_BASE_URL}/courses/${editingCourse.id}`
      : `${API_BASE_URL}/courses`;
    const method = editingCourse ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (!res.ok)
        throw new Error(editingCourse ? "Cập nhật thất bại" : "Thêm thất bại");
      message.success(
        editingCourse ? "Cập nhật thành công" : "Thêm thành công"
      );
      setIsModalOpen(false);
      form.resetFields();
      setEditingCourse(null);
      fetchCourses();
    } catch (err) {
      message.error("Lỗi: " + (err as Error).message);
    }
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc muốn xóa môn học này?",
      onOk: async () => {
        const token = auth.getToken();
        try {
          const res = await fetch(`${API_BASE_URL}/courses/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error("Xóa thất bại");
          message.success("Xóa thành công");
          fetchCourses();
        } catch (err) {
          message.error("Xóa thất bại");
        }
      },
    });
  };

  const columns = [
    { title: "Mã MH", dataIndex: "courseCode", key: "courseCode" },
    { title: "Tên môn học", dataIndex: "courseName", key: "courseName" },
    {
      title: "Tín chỉ",
      dataIndex: "credits",
      key: "credits",
      align: "center" as const,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (text: string) => <span className="text-gray-600">{text}</span>,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: Course) => (
        <span>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingCourse(record);
              form.setFieldsValue(record);
              setIsModalOpen(true);
            }}
          />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </span>
      ),
    },
  ];

  return (
    <AdminLayout title="Quản lý môn học" activeId="manage-courses">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Danh sách môn học</h2>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingCourse(null);
              form.resetFields();
              setIsModalOpen(true);
            }}
          >
            Thêm môn học
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            dataSource={courses}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        )}
      </div>

      {/* Modal Form */}
      <Modal
        title={editingCourse ? "Sửa môn học" : "Thêm môn học mới"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setEditingCourse(null);
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleSave} layout="vertical">
          <Form.Item
            name="courseCode"
            label="Mã môn học"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="courseName"
            label="Tên môn học"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="credits"
            label="Số tín chỉ"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                {editingCourse ? "Cập nhật" : "Thêm mới"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
}
