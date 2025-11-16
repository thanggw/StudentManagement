"use client";

import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message, Tag } from "antd";
import { EditOutlined, DeleteOutlined, BookOutlined } from "@ant-design/icons";
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getCurrentUser,
} from "@/lib/api";
import { Course } from "@/lib/type";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const { TextArea } = Input;

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [form] = Form.useForm();
  const { isAdmin } = useAuth(true);
  const router = useRouter();
  const pageSize = 10;

  // Kiểm tra admin + load dữ liệu
  const loadData = async (page = 1) => {
    setLoading(true);
    try {
      const skip = (page - 1) * pageSize;
      const { data, total } = await getCourses(undefined, skip, pageSize);
      setCourses(data);
      setTotal(total);
    } catch (error: any) {
      message.error(error.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(1);
  }, [router]);

  const showModal = (course?: Course) => {
    setEditingCourse(course || null);
    form.setFieldsValue(course || {});
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingCourse) {
        await updateCourse(editingCourse.id, values);
      } else {
        await createCourse(values);
      }
      setIsModalOpen(false);
      loadData(1); // reload trang 1
      message.success("Operation successful");
    } catch (error: any) {
      message.error(error.message || "Operation failed");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCourse(id);
      loadData(1);
      message.success("Course deleted");
    } catch (error: any) {
      message.error(error.message || "Delete failed");
    }
  };

  const columns = [
    { title: "Course Code", dataIndex: "courseCode", key: "courseCode" },
    { title: "Course Name", dataIndex: "courseName", key: "courseName" },
    { title: "Credits", dataIndex: "credits", key: "credits" },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text: string) => text || <Tag color="gray">None</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Course) => (
        <>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          >
            Edit
          </Button>
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            style={{ marginLeft: 8 }}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <BookOutlined /> Courses Management
        </h2>
        <Button type="primary" onClick={() => showModal()}>
          Add Course
        </Button>
      </div>

      <Table
        dataSource={courses}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          total,
          pageSize,
          showSizeChanger: false,
          onChange: (page) => loadData(page),
        }}
      />

      <Modal
        title={editingCourse ? "Edit Course" : "Add Course"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="courseCode"
            label="Course Code"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="courseName"
            label="Course Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="credits"
            label="Credits"
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
