import api from "@/lib/api";
import { Module } from "@/models/module.model";

class ModuleService {
  private baseUrl = "/modules";

  // =========================================================
  // GET ALL MODULES
  // =========================================================
  async getAllModules(): Promise<Module[]> {
    const response = await api.get(this.baseUrl);
    return response.data.data;
  }

  // =========================================================
  // GET MODULE BY ID
  // =========================================================
  async getModuleById(id: string): Promise<Module> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  // =========================================================
  // GET MODULES BY COURSE
  // =========================================================
  async getModulesByCourse(courseId: string): Promise<Module[]> {
    const response = await api.get(
      `${this.baseUrl}/course/${courseId}`
    );

    return response.data.data;
  }

  // =========================================================
  // CREATE MODULE
  // =========================================================
  async createModule(data: Partial<Module>): Promise<Module> {
    const response = await api.post(this.baseUrl, data);
    return response.data.data;
  }

  // =========================================================
  // UPDATE MODULE
  // =========================================================
  async updateModule(
    id: string,
    data: Partial<Module>
  ): Promise<Module> {
    const response = await api.patch(
      `${this.baseUrl}/${id}`,
      data
    );

    return response.data.data;
  }

  // =========================================================
  // DELETE MODULE
  // =========================================================
  async deleteModule(id: string) {
    const response = await api.delete(
      `${this.baseUrl}/${id}`
    );

    return response.data.data;
  }
}

export const moduleService = new ModuleService();