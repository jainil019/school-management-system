import api from "./api";

export interface Mark {
  id?: string;
  examId: string;
  studentId: string;
  marks: number;
  totalMarks: number;
  grade: string;
  result: string;
}

export async function getMarks() {
  const response = await api.get("/marks/");
  return response.data;
}

export async function getMark(id: string) {
  const response = await api.get(`/marks/${id}`);
  return response.data;
}

export async function createMark(mark: Mark) {
  const response = await api.post("/marks/", mark);
  return response.data;
}

export async function updateMark(
  id: string,
  mark: Mark
) {
  const response = await api.put(
    `/marks/${id}`,
    mark
  );

  return response.data;
}

export async function deleteMark(id: string) {
  const response = await api.delete(
    `/marks/${id}`
  );

  return response.data;
}