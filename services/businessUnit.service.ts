import api from "@/lib/api";
import { BusinessUnit } from "@/models/businessUnit.model";

class BusinessUnitService {
  private baseUrl = "/business-units";

  // ================= GET BY SUBDOMAIN =================
  async getBySubdomain(subdomain: string): Promise<BusinessUnit> {
    const response = await api.get(`/public/business-unit`, {
      params: { subdomain },
    });
    return response.data;
  }

  // ================= GET ALL =================
  async getAll(skip = 0, take = 10) {
    const response = await api.get(this.baseUrl, {
      params: { skip, take },
    });
    return response.data;
  }

  // ================= GET ONE =================
  async getById(id: string): Promise<BusinessUnit> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  // ================= CREATE =================
  async create(payload: Partial<BusinessUnit>): Promise<BusinessUnit> {
    const response = await api.post(this.baseUrl, payload);
    return response.data;
  }

  // ================= UPDATE =================
  async update(id: string, payload: Partial<BusinessUnit>): Promise<BusinessUnit> {
    const response = await api.patch(`${this.baseUrl}/${id}`, payload);
    return response.data;
  }

  // ================= DELETE =================
  async delete(id: string) {
    const response = await api.delete(`${this.baseUrl}/${id}`);
    return response.data;
  }
}

export const businessUnitService = new BusinessUnitService();