// src/services/users.service.ts

import api from "@/lib/api";
import {
  User,
  UpdateUserPayload,
  UserQueryParams,
} from "@/models/users.model";

class UsersService {
  private baseUrl = "/users";

  // ================= GET ALL USERS =================
  async getUsers(params?: UserQueryParams): Promise<{
    data: User[];
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  }> {
    const response = await api.get(this.baseUrl, {
      params,
    });
    return response.data;
  }

  // ================= GET SINGLE USER =================
  async getUserById(id: string): Promise<User> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  // ================= CREATE USER =================
  async createUser(data: Partial<User>): Promise<User> {
    const response = await api.post(this.baseUrl, data);
    return response.data;
  }

  // ================= UPDATE USER =================
  async updateUser(
    id: string,
    data: UpdateUserPayload
  ): Promise<User> {
    const response = await api.patch(
      `${this.baseUrl}/${id}`,
      data
    );
    return response.data;
  }

  // ================= DELETE USER =================
  async deleteUser(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  // ================= GET CURRENT USER (/me) =================
  async getCurrentUser(): Promise<User> {
    const response = await api.get(`${this.baseUrl}/me`);
    return response.data;
  }
}

export const usersService = new UsersService();