import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import CourseDetailClient from "./CourseDetailClient";
import { apiRequestServer } from "@/lib/api-server";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieReceived = await cookies();
  const token = cookieReceived.get("token")?.value;

  try {
    const course = await apiRequestServer<any>(`/courses/${id}`, token);
    return {
      title: `${course.courseCode} - ${course.courseName}`,
    };
  } catch {
    return { title: "Khóa học không tồn tại" };
  }
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieReceived = await cookies();
  const token = cookieReceived.get("token")?.value;

  let course;
  let students: any[] = [];

  try {
    [course, students] = await Promise.all([
      apiRequestServer<any>(`/courses/${id}`, token),
      apiRequestServer<any>(`/courses/${id}/students`, token).catch(() => []),
    ]);
  } catch (error) {
    notFound();
  }

  return <CourseDetailClient course={course} students={students} />;
}
