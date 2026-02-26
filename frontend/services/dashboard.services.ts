// services/dashboard.services.ts
import { api } from "@/lib/api";

// ========== Types (mirroring the JSON structure) ==========

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

export interface WeeklyActivityItem {
  day: string;
  value: number;
}

export interface EventCalendarItem {
  id: string;
  title: string;
  type: string;
  date: string;
  course: string;
}

export interface PerformanceHeatmapDataPoint {
  date: string;
  hours: number;
}

export interface PerformanceHeatmap {
  totalYearHours: number;
  data: PerformanceHeatmapDataPoint[];
}

export interface Attendance {
  present: number;
  total: number;
  percentage: number;
}

export interface Assignments {
  completed: number;
  total: number;
}

export interface StudentDashboardResponse {
  greeting: string;
  studentName: string;
  academicScore: number;
  attendance: Attendance;
  assignments: Assignments;
  learningStreak: number;
  resumeLesson: null | any;
  weeklyActivity: WeeklyActivityItem[];
  totalSkills: any[];
  eventCalendar: EventCalendarItem[];
  jobPosts: any[];
  alumni: any[];
  topPerformers: any[];
  performanceHeatmap: PerformanceHeatmap;
}

// Optional: more specific types for future use
export interface JobPost {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: string;
  postedAt: string;
}

export interface Alumni {
  id: number;
  name: string;
  role: string;
  batch: string;
  avatar?: string;
}

export interface TopPerformer {
  name: string;
  score: number;
  rank: number;
}

// ========== Service ==========
export const dashboardService = {
  /**
   * Get the student dashboard data.
   * GET /dashboard/student
   */
  getStudentDashboard: async (): Promise<StudentDashboardResponse> => {
    try {
      const response = await api.get("/dashboard/student");
      return response.data;
    } catch (error) {
      console.error("Error fetching student dashboard:", error);
      throw error;
    }
  },

  /**
   * Get user statistics.
   */
  getUserStats: async (): Promise<StudentDashboardResponse> => {
    try {
      const response = await api.get("/dashboard/student");
      return response.data;
    } catch (error) {
      console.error("Error fetching user stats:", error);
      throw error;
    }
  },

  /**
   * Get leaderboard data.
   */
  getLeaderboard: async (): Promise<TopPerformer[]> => {
    try {
      const response = await api.get("/dashboard/student");
      return response.data.topPerformers || [];
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      throw error;
    }
  },

  /**
   * Get upcoming events.
   */
  getUpcomingEvents: async (): Promise<EventCalendarItem[]> => {
    try {
      const response = await api.get("/dashboard/student");
      return response.data.eventCalendar || [];
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
      throw error;
    }
  },

  /**
   * Get student profile (from dashboard data).
   */
  getProfile: async (): Promise<{ name: string; email: string; avatar?: string }> => {
    try {
      const response = await api.get("/dashboard/student");
      const data = response.data;
      return {
        name: data.studentName,
        email: "",
        avatar: undefined,
      };
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  },

  /**
   * Get all assignments (list view).
   * GET /assignments
   */
  getAllAssignments: async (): Promise<any[]> => {
    try {
      const response = await api.get("/assignments");
      return response.data;
    } catch (error) {
      console.error("Error fetching assignments:", error);
      throw error;
    }
  },

  /**
   * Submit an assignment.
   * POST /assignments/:assignmentId/submit
   */
  submitAssignment: async (id: string, formData: FormData): Promise<any> => {
    try {
      const response = await api.post(`/assignments/${id}/submit`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.error("Error submitting assignment:", error);
      throw error;
    }
  },

  /**
   * Get a single assignment by ID (with submission details).
   * Tries multiple endpoint patterns and returns mock data in development if all fail.
   */
  getAssignmentById: async (assignmentId: string): Promise<any> => {
    const endpoints = [
      `/assignments/my-assignment/${assignmentId}`,
      `/assignments/${assignmentId}`,
      `/api/assignments/${assignmentId}`,
      `/student/assignments/${assignmentId}`,
      `/assignments/${assignmentId}/with-submission`,
    ];

    let lastError = null;

    for (const endpoint of endpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`);
        const response = await api.get(endpoint);
        console.log(`✅ Success with endpoint: ${endpoint}`);
        return response.data;
      } catch (error: any) {
        lastError = error;
        if (error.response?.status !== 404) {
          console.error(`❌ Error with endpoint ${endpoint}:`, error);
          throw error;
        }
        // 404 – continue to next endpoint
      }
    }

    // If all endpoints fail in development, return mock data
    if (process.env.NODE_ENV === 'development') {
      console.warn('All endpoints failed, using mock assignment data');
      return {
        assignment: {
          id: Number(assignmentId),
          title: 'Sample Assignment (Development Mode)',
          description: 'This is mock data because the API endpoint could not be found.',
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        submission: null,
        isSubmitted: false,
      };
    }

    // In production, throw the last error
    throw lastError || new Error('Assignment not found');
  },

  /**
   * Get course details.
   * GET /course-detail/:courseId
   */
  getCourseDetails: async (courseId: string): Promise<any> => {
    try {
      const response = await api.get(`/course-detail/${courseId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching course details:", error);
      throw error;
    }
  },

  /**
   * Update lesson progress.
   * POST /course/:courseId/progress
   */
  updateProgress: async (courseId: string, lessonId: string): Promise<any> => {
    try {
      const response = await api.post(`/course/${courseId}/progress`, { lessonId });
      return response.data;
    } catch (error) {
      console.error("Error updating progress:", error);
      throw error;
    }
  },

  /**
   * Get enrolled courses.
   * GET /courses/my-courses
   */
  getMyCourses: async (): Promise<any[]> => {
    try {
      const response = await api.get("/courses/my-courses");
      return response.data;
    } catch (error) {
      console.error("Error fetching my courses:", error);
      throw error;
    }
  },
};