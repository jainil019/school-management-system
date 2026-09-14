import api from "./api";

export interface Assignment {
  id?: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  weeklyPeriods: number;
  academicYear: string;
  status: "Active" | "Inactive";
}

export async function getAssignments() {
  const response = await api.get("/assignments/");
  return response.data;
}

export async function getAssignment(id: string) {
  const response = await api.get(`/assignments/${id}`);
  return response.data;
}

export async function createAssignment(
  assignment: Assignment
) {
  const response = await api.post(
    "/assignments/",
    assignment
  );

  return response.data;
}

export async function updateAssignment(
  id: string,
  assignment: Assignment
) {
  const response = await api.put(
    `/assignments/${id}`,
    assignment
  );

  return response.data;
}

export async function deleteAssignment(id: string) {
  const response = await api.delete(
    `/assignments/${id}`
  );

  return response.data;
}