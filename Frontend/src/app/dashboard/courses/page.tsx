"use client";

import { useState } from "react";
import { Table, Button, Modal, Form, Input, message, Tag } from "antd";
import { EditOutlined, DeleteOutlined, BookOutlined } from "@ant-design/icons";
import { createCourse, updateCourse, deleteCourse } from "@/lib/api";
import { Course } from "@/lib/type";
import { useAuth } from "@/hooks/useAuth";
import { usePaginatedData } from "@/hooks/usePaginatedData";
import { getCourses } from "@/lib/api";
import { useRouter } from "next/navigation";
const { TextArea } = Input;

export default function CoursesPage() {
  useAuth(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [form] = Form.useForm();
  const router = useRouter();
  const {
    data: courses,
    total,
    loading,
    loadData,
    refetchPage1,
  } = usePaginatedData<Course>({
    fetchFn: getCourses,
    pageSize: 10,
  });

  const showModal = (course?: Course) => {
    setEditingCourse(course || null);
    form.setFieldsValue(course || {});
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const processedValues = {
        ...values,
        credits: Number(values.credits),
      };
      if (editingCourse) {
        await updateCourse(editingCourse.id, processedValues);
      } else {
        await createCourse(processedValues);
      }
      setIsModalOpen(false);
      refetchPage1();
      message.success("Operation successful");
    } catch (error: any) {
      message.error(error.message || "Operation failed");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCourse(id);
      refetchPage1();
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
        rowClassName="cursor-pointer hover:bg-gray-50"
        onRow={(record) => ({
          onClick: () => router.push(`/dashboard/courses/${record.id}`),
        })}
        pagination={{
          total,
          pageSize: 10,
          showSizeChanger: false,
          onChange: loadData,
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
