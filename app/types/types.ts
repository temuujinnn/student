// src/types/types.ts

export interface Student {
  sid: number;
  firstname: string;
  lastname: string;
  phone: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface Lesson {
  gradeid: number;
  grade: "A" | "B" | "C" | "D" | "F"; // Enum for grades
  coursename: string;
}

export interface Attendance {
  attendanceid: number;
  attendancedate: string; // ISO date string
  status: "Absent" | "Late" | "Present"; // Enum for status
  coursename: string;
  weekday: string;
  roomnumber: string;
}

export interface GradeUpdateRequest {
  grade_id: number;
  grade: "A" | "B" | "C" | "D" | "F"; // Enum for grades
}

export interface GradeUpdateResponse {
  grade_id: number;
  grade: "A" | "B" | "C" | "D" | "F"; // Enum for grades
}

export interface AttendanceUpdateResponse {
  attendance_id: number;
  status: "Absent" | "Late" | "Present";
}
