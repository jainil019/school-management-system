import api from "./api";

export interface Subject {
  id?: string;
  name: string;
  code: string;
  type: "Theory" | "Practical";
  teacher: string;
  classes: string;
  weeklyClasses: number;
  status: "Active" | "Inactive";
}

export async function getSubjects() {
  const response = await api.get("/subjects/");
  return response.data;
}

export async function getSubject(id: string) {
  const response = await api.get(`/subjects/${id}`);
  return response.data;
}

export async function createSubject(subject: Subject) {
  const response = await api.post("/subjects/", subject);
  return response.data;
}

export async function updateSubject(
  id: string,
  subject: Subject
) {
  const response = await api.put(
    `/subjects/${id}`,
    subject
  );

  return response.data;
}

export async function deleteSubject(id: string) {
  const response = await api.delete(
    `/subjects/${id}`
  );

  return response.data;
}