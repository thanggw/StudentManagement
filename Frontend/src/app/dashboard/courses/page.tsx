"use client";

import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getCurrentUser,
} from "@/lib/api";
import { useRouter } from "next/navigation";

interface Course {
  id: string;
  courseCode: string;
  courseName: string;
  credits: number;
  description?: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [form] = Form.useForm();
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await getCurrentUser();
        if (!user.roles?.includes("admin")) {
          message.warning("Access denied. Redirecting...");
          router.push("/dashboard/students");
          return;
        }

        const response = await getCourses();
        setCourses(response || []);
      } catch (error) {
        message.error("Failed to load courses");
        router.push("/dashboard/students");
      }
    };

    loadData();
  }, [router]);

  const showModal = (course?: Course) => {
    setEditingCourse(course || null);
    form.setFieldsValue(course || {});
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingCourse) {
        await updateCourse(editingCourse.id, values);
      } else {
        await createCourse(values);
      }
      setIsModalVisible(false);
      const response = await getCourses();
      setCourses(response.data || []);
      message.success("Operation successful");
    } catch (error) {
      message.error("Operation failed");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCourse(id);
      const response = await getCourses();
      setCourses(response.data || []);
      message.success("Course deleted");
    } catch (error) {
      message.error("Delete failed");
    }
  };

  const columns = [
    { title: "Course Code", dataIndex: "courseCode", key: "courseCode" },
    { title: "Course Name", dataIndex: "courseName", key: "courseName" },
    { title: "Credits", dataIndex: "credits", key: "credits" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Course) => (
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
        Add Course
      </Button>
      <Table dataSource={courses} columns={columns} rowKey="id" />
      <Modal
        title={editingCourse ? "Edit Course" : "Add Course"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
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
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
