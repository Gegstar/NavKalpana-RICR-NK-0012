import api from "@/lib/api";
import {
  ApiResponse,
  DefaultSettings,
  GetSettingsRequest,
} from "../models/default.model";

 
class DefaultService {
    private baseUrl = "/default";
  async getSettings(
    data: GetSettingsRequest
  ): Promise<ApiResponse<DefaultSettings>> {
    const response = await api.post<ApiResponse<DefaultSettings>>(
      `${this.baseUrl}/settings`,
      data
    );
    return response.data;
  }
}

export const defaultService = new DefaultService();