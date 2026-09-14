import api from "./api";

export interface Exam {
  id?: string;
  name: string;
  classId: string;
  subjectId: string;
  examDate: string;
  totalMarks: number;
  passingMarks: number;
  academicYear: string;
  status: "Scheduled" | "Completed";
}

export async function getExams() {
  const response = await api.get("/exams/");
  return response.data;
}

export async function getExam(id: string) {
  const response = await api.get(`/exams/${id}`);
  return response.data;
}

export async function createExam(exam: Exam) {
  const response = await api.post("/exams/", exam);
  return response.data;
}

export async function updateExam(
  id: string,
  exam: Exam
) {
  const response = await api.put(
    `/exams/${id}`,
    exam
  );

  return response.data;
}

export async function deleteExam(id: string) {
  const response = await api.delete(
    `/exams/${id}`
  );

  return response.data;
}