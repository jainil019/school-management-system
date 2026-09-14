import { getStudent } from "./studentService";
import { getAttendance } from "./attendanceService";
import { getStudentResults } from "./resultService";
import { getHomework } from "./homeworkService";
import { getTimetable } from "./timetableService";
import { getFees } from "./feeService";
import { getNotices } from "./noticeService";

export async function getStudentProfile(studentId: string) {
  return await getStudent(studentId);
}

export async function getStudentAttendance(studentId: string) {
  const attendance = await getAttendance();

  return attendance.filter(
    (item: { studentId: string }) =>
      String(item.studentId) === String(studentId)
  );
}

export async function getStudentResultData(studentId: string) {
  return await getStudentResults(studentId);
}

export async function getStudentHomework(className: string) {
  const homework = await getHomework();

  return homework.filter(
    (item: { className: string }) =>
      item.className === className
  );
}

export async function getStudentTimetable(className: string) {
  const timetable = await getTimetable();

  return timetable.filter(
    (item: { className: string }) =>
      item.className === className
  );
}

export async function getStudentFees(studentId: string) {
  const fees = await getFees();

  return fees.filter(
    (item: { studentId: string }) =>
      String(item.studentId) === String(studentId)
  );
}

export async function getStudentNotices() {
  const notices = await getNotices();

  return notices.filter(
    (item: { audience: string }) =>
      item.audience === "All" ||
      item.audience === "Students"
  );
}