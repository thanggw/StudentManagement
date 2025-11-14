"use client";

import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "@/lib/api";

interface Student {
  id: string;
  studentCode: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  major: string;
  gpa: number;
  admissionYear: number;
  status: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [form] = Form.useForm();

  // Tách logic fetch vào trong useEffect
  useEffect(() => {
    const loadStudents = async () => {
      try {
        const response = await getStudents();
        setStudents(response || []);
      } catch (error) {
        message.error("Failed to fetch students");
        setStudents([]);
      }
    };

    loadStudents();
  }, []);

  const showModal = (student?: Student) => {
    setEditingStudent(student || null);
    form.setFieldsValue(student || {});
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingStudent) {
        await updateStudent(editingStudent.id, values);
      } else {
        await createStudent(values);
      }
      setIsModalVisible(false);
      // Refresh data
      const response = await getStudents();
      setStudents(response.data || []);
      message.success("Operation successful");
    } catch (error) {
      message.error("Operation failed");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteStudent(id);
      const response = await getStudents();
      setStudents(response.data || []);
      message.success("Student deleted");
    } catch (error) {
      message.error("Delete failed");
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
    },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Student) => (
        <>
          <Button onClick={() => showModal(record)}>Edit</Button>
          <Button
            danger
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
      <Button
        type="primary"
        onClick={() => showModal()}
        style={{ marginBottom: 16 }}
      >
        Add Student
      </Button>
      <Table
        dataSource={students}
        columns={columns}
        rowKey="id"
        locale={{ emptyText: "No students found" }}
      />
      <Modal
        title={editingStudent ? "Edit Student" : "Add Student"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
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
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
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
          <Form.Item name="gpa" label="GPA" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="admissionYear" label="Admission Year">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
