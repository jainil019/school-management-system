import api from "./api";

export interface Timetable {
  id?: string;
  className: string;
  subject: string;
  teacher: string;
  day: string;
  startTime: string;
  endTime: string;
}

export async function getTimetable() {
  const response = await api.get("/timetable/");
  return response.data;
}

export async function getTimetableItem(id: string) {
  const response = await api.get(`/timetable/${id}`);
  return response.data;
}

export async function createTimetable(
  item: Timetable
) {
  const response = await api.post(
    "/timetable/",
    item
  );

  return response.data;
}

export async function updateTimetable(
  id: string,
  item: Timetable
) {
  const response = await api.put(
    `/timetable/${id}`,
    item
  );

  return response.data;
}

export async function deleteTimetable(id: string) {
  const response = await api.delete(
    `/timetable/${id}`
  );

  return response.data;
}