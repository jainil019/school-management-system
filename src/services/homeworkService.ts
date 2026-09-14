import api from "./api";

export interface Homework {
  id?: string;
  title: string;
  description: string;
  className: string;
  subject: string;
  dueDate: string;
}

export async function getHomework() {
  const response = await api.get("/homework/");
  return response.data;
}

export async function getHomeworkById(id: string) {
  const response = await api.get(`/homework/${id}`);
  return response.data;
}

export async function createHomework(
  homework: Homework
) {
  const response = await api.post(
    "/homework/",
    homework
  );

  return response.data;
}

export async function updateHomework(
  id: string,
  homework: Homework
) {
  const response = await api.put(
    `/homework/${id}`,
    homework
  );

  return response.data;
}

export async function deleteHomework(id: string) {
  const response = await api.delete(
    `/homework/${id}`
  );

  return response.data;
}