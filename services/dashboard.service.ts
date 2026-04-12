import api from "@/lib/api";

export const dashboardService = {
  getStudentDashboard: async () => {
    const response = await api.get("/dashboard/student");
    return response.data;
  }
};
