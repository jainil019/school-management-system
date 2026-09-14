export interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  className: string;
  division: string;
  rollNo: number;
  gender: string;
  status: string;
}

export function getParentStudent(): Student | null {
  const students: Student[] = JSON.parse(
    localStorage.getItem("school_students") || "[]"
  );

  const id = localStorage.getItem("school_parent_student_id");

  return (
    students.find((s) => String(s.id) === String(id)) ||
    students[0] ||
    null
  );
}

export function getData<T>(key: string): T[] {
  return JSON.parse(localStorage.getItem(key) || "[]");
}