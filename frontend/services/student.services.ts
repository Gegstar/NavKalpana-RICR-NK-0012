import { api } from "@/lib/api";

export const studentService = {
  /**
   * Get student profile
   * GET /student/profile
   */
  getProfile: async () => {
    try {
      const response = await api.get("/dashboard/student");
      return response.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      // In development, return mock data
      if (process.env.NODE_ENV === 'development') {
        return {
          student: {
            name: "",
            email: "john@student.com",
            avatar: "",
            academicScore: "",
            performanceTrend: "",
            streak: "",
            skills: [],
            totalRequiredSkills: 10,
            enrolledCourses: [],
          },
        };
      }
      throw error;
    }
  },

  /**
   * Get all assignments
   * GET /assignments
   */
  getAllAssignments: async () => {
    try {
      const response = await api.get("dashboard/student");
      return response.data;
    } catch (error) {
      console.error("Error fetching assignments:", error);
      return [];
    }
  },

  /**
   * Get a single assignment by ID (with submission details)
   * GET /assignments/my-assignment/:assignmentId
   */
  getAssignmentById: async (assignmentId: string) => {
    try {
      const response = await api.get(`dashboard/student/${assignmentId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching assignment:", error);
      return null;
    }
  },

  /**
   * Submit an assignment
   * POST /assignments/:assignmentId/submit
   */
  submitAssignment: async (id: string, formData: any) => {
    try {
      const response = await api.post(`dashboard/student/${id}/submit`, formData);
      return response.data;
    } catch (error) {
      console.error("Error submitting assignment:", error);
      throw error;
    }
  },

  /**
   * Get course details
   * GET /course-detail/:courseId
   */
  getCourseDetails: async (courseId: string) => {
    try {
      const response = await api.get(`/dashboard/student/${courseId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching course details:", error);
      return null;
    }
  },

  /**
   * Update lesson progress
   * POST /course/:courseId/progress
   */
  updateProgress: async (courseId: string, lessonId: string) => {
    try {
      const response = await api.post(`/course/${courseId}/progress`, { lessonId });
      return response.data;
    } catch (error) {
      console.error("Error updating progress:", error);
      throw error;
    }
  },
};