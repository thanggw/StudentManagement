"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Descriptions,
  List,
  Avatar,
  message,
  Spin,
  Tag,
} from "antd";
import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { useRouter, useParams } from "next/navigation";
import { getCourseById, getStudentsByCourse, enrollCourse } from "@/lib/api";
import { Course, Student } from "@/lib/type";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useDispatch } from "react-redux";
export default function CourseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAdmin } = useAuth(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (id && user) {
      fetchCourseDetail();
    }
  }, [id, user]);

  const fetchCourseDetail = async () => {
    try {
      setLoading(true);
      const [courseData, studentsData] = await Promise.all([
        getCourseById(id as string),
        isAdmin ? getStudentsByCourse(id as string) : Promise.resolve([]),
      ]);
      setCourse(courseData);
      setStudents(studentsData);
    } catch (error: any) {
      message.error(error.message || "Không tải được thông tin khóa học");
      router.push("/dashboard/courses");
    } finally {
      setLoading(false);
    }
  };

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

    dispatch({
      type: "cart/addRequest",
      payload: { course },
    });

    message.success("Đã thêm vào giỏ hàng!");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" />
      </div>
    );
  }

  if (!course) {
    return <div>Không tìm thấy khóa học</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Card
        title={
          <div className="text-2xl font-bold">
            {course.courseCode} - {course.courseName}
          </div>
        }
        extra={
          <Link href="/dashboard/courses">
            <Button>Quay lại danh sách</Button>
          </Link>
        }
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Mã môn học">
            <Tag color="blue">{course.courseCode}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Tên môn học">
            {course.courseName}
          </Descriptions.Item>
          <Descriptions.Item label="Số tín chỉ">
            <Tag color="green">{course.credits}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Mô tả">
            {course.description || <Tag color="gray">Chưa có mô tả</Tag>}
          </Descriptions.Item>
        </Descriptions>

        <div className="mt-8 flex gap-4">
          {!isAdmin && (
            <Button
              type="primary"
              size="large"
              icon={<ShoppingCartOutlined />}
              onClick={handleAddToCart}
              loading={enrolling}
              className="font-medium"
            >
              Thêm vào giỏ hàng / Đăng ký học
            </Button>
          )}

          {isAdmin && (
            <Button type="default" size="large">
              Quản lý khóa học
            </Button>
          )}
        </div>

        {/* Danh sách sinh viên (chỉ admin thấy) */}
        {isAdmin && (
          <div className="mt-10">
            <h3 className="text-lg font-semibold mb-4">
              Sinh viên đã đăng ký ({students.length})
            </h3>
            {students.length === 0 ? (
              <p className="text-gray-500">Chưa có sinh viên nào đăng ký.</p>
            ) : (
              <List
                dataSource={students}
                renderItem={(student) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={
                        <span>
                          {student.fullName} ({student.studentCode})
                        </span>
                      }
                      description={student.email}
                    />
                  </List.Item>
                )}
              />
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
