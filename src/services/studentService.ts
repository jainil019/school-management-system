import api from "./api";

export interface Student {
  id?: string;
  name: string;
  email: string;
  phone: string;
  className: string;
  division: string;
  rollNo: number;
  gender: string;
  status: "Active" | "Inactive";
}

export async function getStudents() {
  const response = await api.get("/students/");
  return response.data;
}

export async function getStudent(id: string) {
  const response = await api.get(`/students/${id}`);
  return response.data;
}

export async function createStudent(student: Student) {
  const response = await api.post("/students/", student);
  return response.data;
}

export async function updateStudent(
  id: string,
  student: Student
) {
  const response = await api.put(`/students/${id}`, student);
  return response.data;
}

export async function deleteStudent(id: string) {
  const response = await api.delete(`/students/${id}`);
  return response.data;
}