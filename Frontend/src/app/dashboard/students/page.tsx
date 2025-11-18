"use client";

import { useState } from "react";
import { Table, Button, Modal, Form, Input, message, Tag } from "antd";
import { EditOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";
import { createStudent, updateStudent, deleteStudent } from "@/lib/api";
import { Student } from "@/lib/type";
import { useAuth } from "@/hooks/useAuth";
import { usePaginatedData } from "@/hooks/usePaginatedData";
import { getStudents } from "@/lib/api";

export default function StudentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [form] = Form.useForm();
  useAuth();

  const {
    data: students,
    total,
    loading,
    currentPage,
    pageSize,
    loadData,
    refetchPage1,
  } = usePaginatedData<Student>({
    fetchFn: getStudents,
    pageSize: 10,
  });

  const showModal = (student?: Student) => {
    setEditingStudent(student || null);
    form.setFieldsValue(student || {});
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingStudent) {
        await updateStudent(editingStudent.id, values);
      } else {
        await createStudent(values);
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
      await deleteStudent(id);
      refetchPage1();
      message.success("Student deleted");
    } catch (error: any) {
      message.error(error.message || "Delete failed");
    }
  };

  const columns = [
    { title: "Student Code", dataIndex: "studentCode", key: "studentCode" },
    { title: "Full Name", dataIndex: "fullName", key: "fullName" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phoneNumber", key: "phoneNumber" },
    { title: "Major", dataIndex: "major", key: "major" },
    { title: "GPA", dataIndex: "gpa", key: "gpa" },
    {
      title: "Admission Year",
      dataIndex: "admissionYear",
      key: "admissionYear",
      render: (year: number) => year || <Tag color="gray">N/A</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag
          color={
            status === "active"
              ? "green"
              : status === "inactive"
              ? "red"
              : "orange"
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Student) => (
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
          <UserOutlined /> Students Management
        </h2>
        <Button type="primary" onClick={() => showModal()}>
          Add Student
        </Button>
      </div>

      <Table
        dataSource={students}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          current: currentPage,
          total,
          pageSize,
          showSizeChanger: false,
          onChange: loadData,
        }}
      />

      <Modal
        title={editingStudent ? "Edit Student" : "Add Student"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="studentCode"
            label="Student Code"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="major" label="Major" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="gpa"
            label="GPA"
            rules={[{ required: true, type: "number", min: 0, max: 4 }]}
          >
            <Input type="number" step="0.1" />
          </Form.Item>
          <Form.Item name="admissionYear" label="Admission Year">
            <Input
              type="number"
              min={1900}
              max={new Date().getFullYear() + 5}
            />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
