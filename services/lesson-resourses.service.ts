import api from "@/lib/api";

import {
  LessonResource,
} from "@/models/lesson-resources.model";

class LessonResourceService {
  private baseUrl = "/lesson-resources";

  // =====================================================
  // GET ALL
  // =====================================================

  async getAllResources(): Promise<
    LessonResource[]
  > {
    const response = await api.get(
      this.baseUrl,
    );

    return response.data.data;
  }

  // =====================================================
  // GET BY ID
  // =====================================================

  async getResourceById(
    id: string,
  ): Promise<LessonResource> {
    const response = await api.get(
      `${this.baseUrl}/${id}`,
    );

    return response.data;
  }

  // =====================================================
  // GET BY LESSON
  // =====================================================

  async getResourcesByLesson(
    lessonId: string,
  ): Promise<LessonResource[]> {
    const response = await api.get(
      `/lessons/${lessonId}/resources`,
    );

    return response.data.data;
  }

  // =====================================================
  // CREATE
  // =====================================================

  async createResource(
    data: Partial<LessonResource>,
  ): Promise<LessonResource> {
    const response = await api.post(
      this.baseUrl,
      data,
    );

    return response.data.data;
  }

  // =====================================================
  // UPDATE
  // =====================================================

  async updateResource(
    id: string,
    data: Partial<LessonResource>,
  ): Promise<LessonResource> {
    const response = await api.patch(
      `${this.baseUrl}/${id}`,
      data,
    );

    return response.data.data;
  }

  // =====================================================
  // DELETE
  // =====================================================

  async deleteResource(id: string) {
    const response = await api.delete(
      `${this.baseUrl}/${id}`,
    );

    return response.data.data;
  }
}

export const lessonResourceService =
  new LessonResourceService();