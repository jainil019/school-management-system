import api from "./api";

export interface Attendance {
  id?: string;
  date: string;
  classId: string;
  subjectId: string;
  studentId: string;
  status: "Present" | "Absent" | "Late" | "Leave";
}

export async function getAttendance() {
  const response = await api.get("/attendance/");
  return response.data;
}

export async function getAttendanceById(id: string) {
  const response = await api.get(`/attendance/${id}`);
  return response.data;
}

export async function createAttendance(
  attendance: Attendance
) {
  const response = await api.post(
    "/attendance/",
    attendance
  );

  return response.data;
}

export async function updateAttendance(
  id: string,
  attendance: Attendance
) {
  const response = await api.put(
    `/attendance/${id}`,
    attendance
  );

  return response.data;
}

export async function deleteAttendance(id: string) {
  const response = await api.delete(
    `/attendance/${id}`
  );

  return response.data;
}