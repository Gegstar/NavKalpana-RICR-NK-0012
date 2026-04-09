import api from "@/lib/api";

class CourseService {
  private baseUrl = "/courses";

  async getAllCourses() {
    const response = await api.get(`${this.baseUrl}`);
    return response.data;
  }

  async getCourseById(id: string) {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async createCourse(data: any) {
    const response = await api.post(`${this.baseUrl}`, data);
    return response.data;
  }

  // ✅ Add this method
  async markLessonComplete(courseId: number, lessonId: number) {
    const response = await api.post(`${this.baseUrl}/${courseId}/lessons/${lessonId}/complete`);
    return response.data;
  }
}

export const courseService = new CourseService();