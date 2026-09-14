import api from "./api";

export interface Teacher {
  id?: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  qualification: string;
  experience: number;
  assignedClass: string;
  joiningDate: string;
  status: "Active" | "Inactive";
}

export async function getTeachers() {
  const response = await api.get("/teachers/");
  return response.data;
}

export async function getTeacher(id: string) {
  const response = await api.get(`/teachers/${id}`);
  return response.data;
}

export async function createTeacher(teacher: Teacher) {
  const response = await api.post("/teachers/", teacher);
  return response.data;
}

export async function updateTeacher(
  id: string,
  teacher: Teacher
) {
  const response = await api.put(`/teachers/${id}`, teacher);
  return response.data;
}

export async function deleteTeacher(id: string) {
  const response = await api.delete(`/teachers/${id}`);
  return response.data;
}