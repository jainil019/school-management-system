import { getStudent } from "./studentService";
import { getAttendance } from "./attendanceService";
import { getStudentResults } from "./resultService";
import { getFees } from "./feeService";
import { getHomework } from "./homeworkService";
import { getTimetable } from "./timetableService";
import { getNotices } from "./noticeService";

export async function getParentStudent(studentId: string) {
  return await getStudent(studentId);
}

export async function getParentAttendance(studentId: string) {
  const data = await getAttendance();

  return (data || []).filter(
    (item: { studentId: string }) =>
      String(item.studentId) === String(studentId)
  );
}

export async function getParentResults(studentId: string) {
  return await getStudentResults(studentId);
}

export async function getParentFees(studentId: string) {
  const data = await getFees();

  return (data || []).filter(
    (item: { studentId: string }) =>
      String(item.studentId) === String(studentId)
  );
}

export async function getParentHomework(className: string) {
  const data = await getHomework();

  return (data || []).filter(
    (item: { className: string }) =>
      item.className === className
  );
}

export async function getParentTimetable(className: string) {
  const data = await getTimetable();

  return (data || []).filter(
    (item: { className: string }) =>
      item.className === className
  );
}

export async function getParentNotices() {
  const data = await getNotices();

  return (data || []).filter(
    (item: { audience: string }) =>
      item.audience === "All" ||
      item.audience === "Parents"
  );
}