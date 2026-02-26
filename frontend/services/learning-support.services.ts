import { api } from "@/lib/api";

// Types
export interface DoubtSubmission {
  id?: number;
  courseId: number;
  courseName?: string;
  topic: string;
  description: string;
  attachmentUrl?: string;
  status: 'pending' | 'resolved' | 'in-progress';
  createdAt?: string;
  updatedAt?: string;
  response?: string;
  respondedAt?: string;
}

export interface BackupClassRequest {
  id?: number;
  courseId: number;
  courseName?: string;
  topic: string;
  preferredDate: string;
  preferredTime: string;
  reason: string;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  createdAt?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  meetingLink?: string;
}

export interface Course {
  id: number;
  name: string;
  instructor: string;
  topics: string[];
}

// Mock data for development
const mockCourses: Course[] = [
  {
    id: 1,
    name: "Advanced React Development",
    instructor: "Dr. Sarah Johnson",
    topics: ["React Hooks", "State Management", "Performance Optimization", "Testing", "Server Components"]
  },
  {
    id: 2,
    name: "Node.js Masterclass",
    instructor: "Prof. Michael Chen",
    topics: ["Express.js", "Database Integration", "Authentication", "API Design", "WebSockets"]
  },
  {
    id: 3,
    name: "Full Stack TypeScript",
    instructor: "Eng. Emily Davis",
    topics: ["TypeScript Basics", "Advanced Types", "React with TypeScript", "Node.js with TypeScript", "Type Safety"]
  },
];

const mockDoubts: DoubtSubmission[] = [
  {
    id: 1,
    courseId: 1,
    courseName: "Advanced React Development",
    topic: "useEffect cleanup function",
    description: "I'm confused about when the cleanup function runs and how to properly clean up subscriptions.",
    status: 'resolved',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    response: "The cleanup function runs before the component unmounts and before re-renders. Here's an example...",
    respondedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    courseId: 2,
    courseName: "Node.js Masterclass",
    topic: "JWT Authentication",
    description: "How do I implement refresh tokens with JWT? The token expires too quickly.",
    status: 'in-progress',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
];

const mockBackupRequests: BackupClassRequest[] = [
  {
    id: 1,
    courseId: 1,
    courseName: "Advanced React Development",
    topic: "React Hooks Deep Dive",
    preferredDate: "2024-03-10",
    preferredTime: "15:00",
    reason: "I missed the original class due to technical issues",
    status: 'scheduled',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    scheduledDate: "2024-03-12",
    scheduledTime: "14:00",
    meetingLink: "https://meet.google.com/abc-defg-hij"
  }
];

export const learningSupportService = {
  // ==================== COURSES ====================
  
  /**
   * Get all available courses (for dropdown)
   * GET /api/courses
   */
  getCourses: async (): Promise<Course[]> => {
    try {
      // Real API call - uncomment when backend is ready
      // const response = await api.get("/courses?enrolled=true");
      // return response.data;
      
      // Mock implementation for development
      console.log("Fetching courses...");
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      return mockCourses;
    } catch (error) {
      console.error("Error fetching courses:", error);
      // Return mock data as fallback
      return mockCourses;
    }
  },

  /**
   * Get topics for a specific course
   * GET /api/courses/:courseId/topics
   */
  getCourseTopics: async (courseId: number): Promise<string[]> => {
    try {
      // Real API call - uncomment when backend is ready
      // const response = await api.get(`/courses/${courseId}/topics`);
      // return response.data;
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 300));
      const course = mockCourses.find(c => c.id === courseId);
      return course?.topics || [];
    } catch (error) {
      console.error("Error fetching course topics:", error);
      const course = mockCourses.find(c => c.id === courseId);
      return course?.topics || [];
    }
  },

  // ==================== DOUBT SUBMISSION ====================
  
  /**
   * Submit a new doubt
   * POST /api/learning-support/doubts
   */
  submitDoubt: async (data: FormData): Promise<DoubtSubmission> => {
    try {
      // Real API call - uncomment when backend is ready
      // const response = await api.post("/learning-support/doubts", data, {
      //   headers: { "Content-Type": "multipart/form-data" }
      // });
      // return response.data;
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1500));
      const courseId = Number(data.get('courseId'));
      const course = mockCourses.find(c => c.id === courseId);
      const newDoubt: DoubtSubmission = {
        id: Math.floor(Math.random() * 1000),
        courseId: courseId,
        courseName: course?.name || 'Unknown Course',
        topic: data.get('topic') as string,
        description: data.get('description') as string,
        attachmentUrl: data.get('attachment') ? URL.createObjectURL(data.get('attachment') as File) : undefined,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      return newDoubt;
    } catch (error) {
      console.error("Error submitting doubt:", error);
      throw error;
    }
  },

  /**
   * Get all doubts for current student
   * GET /api/learning-support/doubts
   */
  getMyDoubts: async (): Promise<DoubtSubmission[]> => {
    try {
      // Real API call - uncomment when backend is ready
      // const response = await api.get("/learning-support/doubts");
      // return response.data;
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockDoubts;
    } catch (error) {
      console.error("Error fetching doubts:", error);
      return mockDoubts;
    }
  },

  /**
   * Get a specific doubt by ID
   * GET /api/learning-support/doubts/:id
   */
  getDoubtById: async (id: number): Promise<DoubtSubmission> => {
    try {
      // const response = await api.get(`/learning-support/doubts/${id}`);
      // return response.data;
      
      await new Promise(resolve => setTimeout(resolve, 500));
      const doubt = mockDoubts.find(d => d.id === id);
      if (!doubt) throw new Error("Doubt not found");
      return doubt;
    } catch (error) {
      console.error("Error fetching doubt:", error);
      throw error;
    }
  },

  // ==================== BACKUP CLASS REQUESTS ====================

  /**
   * Request a backup class
   * POST /api/learning-support/backup-classes
   */
  requestBackupClass: async (data: BackupClassRequest): Promise<BackupClassRequest> => {
    try {
      // Real API call - uncomment when backend is ready
      // const response = await api.post("/learning-support/backup-classes", data);
      // return response.data;
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1500));
      const course = mockCourses.find(c => c.id === data.courseId);
      const newRequest: BackupClassRequest = {
        ...data,
        id: Math.floor(Math.random() * 1000),
        courseName: course?.name,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      return newRequest;
    } catch (error) {
      console.error("Error requesting backup class:", error);
      throw error;
    }
  },

  /**
   * Get all backup class requests for current student
   * GET /api/learning-support/backup-classes
   */
  getMyBackupRequests: async (): Promise<BackupClassRequest[]> => {
    try {
      // const response = await api.get("/learning-support/backup-classes");
      // return response.data;
      
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockBackupRequests;
    } catch (error) {
      console.error("Error fetching backup requests:", error);
      return mockBackupRequests;
    }
  },

  /**
   * Get a specific backup request by ID
   * GET /api/learning-support/backup-classes/:id
   */
  getBackupRequestById: async (id: number): Promise<BackupClassRequest> => {
    try {
      // const response = await api.get(`/learning-support/backup-classes/${id}`);
      // return response.data;
      
      await new Promise(resolve => setTimeout(resolve, 500));
      const request = mockBackupRequests.find(r => r.id === id);
      if (!request) throw new Error("Request not found");
      return request;
    } catch (error) {
      console.error("Error fetching backup request:", error);
      throw error;
    }
  },

  /**
   * Cancel a backup request
   * PATCH /api/learning-support/backup-classes/:id/cancel
   */
  cancelBackupRequest: async (id: number): Promise<void> => {
    try {
      // await api.patch(`/learning-support/backup-classes/${id}/cancel`);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log(`Request ${id} cancelled`);
    } catch (error) {
      console.error("Error cancelling backup request:", error);
      throw error;
    }
  },
};