import api from "./api";

export interface Notice {
  id?: string;
  title: string;
  description: string;
  audience: string;
  date: string;
}

export async function getNotices() {
  const response = await api.get("/notices/");
  return response.data;
}

export async function getNotice(id: string) {
  const response = await api.get(`/notices/${id}`);
  return response.data;
}

export async function createNotice(
  notice: Notice
) {
  const response = await api.post(
    "/notices/",
    notice
  );

  return response.data;
}

export async function updateNotice(
  id: string,
  notice: Notice
) {
  const response = await api.put(
    `/notices/${id}`,
    notice
  );

  return response.data;
}

export async function deleteNotice(id: string) {
  const response = await api.delete(
    `/notices/${id}`
  );

  return response.data;
}