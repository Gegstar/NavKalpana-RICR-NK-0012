export interface AttendanceRecord {
  id: number;
  courseId: number;
  courseName: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  checkInTime?: string;
  checkOutTime?: string;
}

export interface AttendanceSummary {
  courseId: number;
  courseName: string;
  totalClasses: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  attendancePercentage: number;
}

export interface MonthlyAttendance {
  month: string;
  year: number;
  records: AttendanceRecord[];
  summary: {
    totalClasses: number;
    present: number;
    absent: number;
    late: number;
    percentage: number;
  };
}