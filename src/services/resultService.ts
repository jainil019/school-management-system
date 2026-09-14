import api from "./api";

export interface ResultExam {
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

export interface Result {
  id?: string;
  examId: string;
  studentId: string;
  marks: number;
  totalMarks: number;
  grade: string;
  result: string;
  exam?: ResultExam | null;
}

export async function getResults() {
  const response = await api.get("/results/");
  return response.data;
}

export async function getStudentResults(
  studentId: string
) {
  const response = await api.get(
    `/results/student/${studentId}`
  );

  return response.data;
}