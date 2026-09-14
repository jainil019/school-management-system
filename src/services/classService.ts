import api from "./api";

export interface ClassData {
  id?: string;
  className: string;
  division: string;
  classTeacher: string;
  roomNo: string;
  students: number;
  academicYear: string;
  status: "Active" | "Inactive";
}

export async function getClasses() {
  const response = await api.get("/classes/");
  return response.data;
}

export async function getClass(id: string) {
  const response = await api.get(`/classes/${id}`);
  return response.data;
}

export async function createClass(classData: ClassData) {
  const response = await api.post("/classes/", classData);
  return response.data;
}

export async function updateClass(
  id: string,
  classData: ClassData
) {
  const response = await api.put(
    `/classes/${id}`,
    classData
  );
  return response.data;
}

export async function deleteClass(id: string) {
  const response = await api.delete(`/classes/${id}`);
  return response.data;
}