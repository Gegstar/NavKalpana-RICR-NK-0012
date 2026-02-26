// services/attendance.services.ts
import { api } from "@/lib/api";

export const attendanceService = {
  getAttendanceSummary: async () => {
    const response = await api.get("/attendance/summary");
    return response.data;
  },
  getMonthlyAttendance: async (month: number, year: number) => {
    const response = await api.get(`/attendance/monthly?month=${month}&year=${year}`);
    return response.data;
  },
};
