import api from "@/lib/api";
import { Course, ViewCourse } from "@/models/course.model";

class CourseService {
  private baseUrl = "/courses";

  async getAllCourses(): Promise<Course[]> {
    const response = await api.get(this.baseUrl);
    return response.data.data;
  }

  async getCourseById(id: string): Promise<Course> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }
  async viewCourse(id: string): Promise<ViewCourse> {
    const response = await api.get(`${this.baseUrl}/view/${id}`);

    return response.data;
  }

  async createCourse(data: Partial<Course>): Promise<Course> {
    const response = await api.post(this.baseUrl, data);
    return response.data;
  }

  async updateCourse(id: string, data: Partial<Course>): Promise<Course> {
    const response = await api.patch(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  async deleteCourse(id: string) {
    const response = await api.delete(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async markLessonComplete(courseId: string, lessonId: string) {
    const response = await api.post(
      `${this.baseUrl}/${courseId}/lessons/${lessonId}/complete`,
    );
    return response.data;
  }
}

export const courseService = new CourseService();
