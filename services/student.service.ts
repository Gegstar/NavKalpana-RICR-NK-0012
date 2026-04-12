import api from "@/lib/api";

export const studentService = {
  getProfile: async () => {
    const response = await api.get("/student/profile");
    return response.data;
  },
  updateProfile: async (data: any) => {
    const response = await api.patch("/student/profile", data);
    return response.data;
  }
};
