import { Roles } from "./constants";
export interface User {
  id: string;
  name: string;
  email: string;
  roles: Roles[];
  balance: number;
}
export interface UserWithDates extends User {
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
}

export interface Student {
  id: string;
  studentCode: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  major: string;
  gpa: number;
  admissionYear?: number;
  status: string;
}

export interface Course {
  id: string;
  courseCode: string;
  courseName: string;
  credits: number;
  description?: string;
}
