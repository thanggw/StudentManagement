import { Card, Descriptions, List, Avatar, Tag, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import EnrollButton from "./EnrollButton";
import { Course, Student } from "@/lib/type";
import { Roles } from "@/lib/constants";
import { apiRequestServer } from "@/lib/api-server";
import { User } from "@/lib/type";
import { cookies } from "next/headers";
interface CourseDetailProps {
  course: Course;
  students: Student[];
}

export default async function CourseDetail({
  course,
  students,
}: CourseDetailProps) {
  const cookieReceived = await cookies();
  const token = cookieReceived.get("token")?.value;
  const user = await apiRequestServer<User>("/users/me", token);
  const isAdmin = user?.roles?.includes(Roles.ADMIN) || false;

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

        <div className="mt-8">
          {/* Chỉ phần này cần client */}
          <EnrollButton course={course} />
        </div>

        {/* Danh sách sinh viên - chỉ admin thấy */}
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
