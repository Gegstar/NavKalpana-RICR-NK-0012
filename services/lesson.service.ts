import api from "@/lib/api";
import { Lesson } from "@/models/lessons.model";

class LessonService {
  private baseUrl = "/lessons";

  async getAllLessons(): Promise<Lesson[]> {
    const response = await api.get(this.baseUrl);
    return response.data.data;
  }

  async getLessonById(id: string): Promise<Lesson> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data.data;
  }

  async createLesson(data: Partial<Lesson>): Promise<Lesson> {
    const response = await api.post(this.baseUrl, data);
    return response.data.data;
  }

  async updateLesson(
    id: string,
    data: Partial<Lesson>
  ): Promise<Lesson> {
    const response = await api.patch(`${this.baseUrl}/${id}`, data);
    return response.data.data;
  }

  async deleteLesson(id: string) {
    const response = await api.delete(`${this.baseUrl}/${id}`);
    return response.data.data;
  }

  async getLessonsByModule(moduleId: string): Promise<Lesson[]> {
    const response = await api.get(`/modules/${moduleId}/lessons`);
    return response.data.data;
  }

  async markLessonComplete(id: string) {
    const response = await api.post(`${this.baseUrl}/${id}/complete`);
    return response.data.data;
  }
}

export const lessonService = new LessonService();