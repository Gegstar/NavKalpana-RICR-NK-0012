import { api } from "@/lib/api";

export const fileUploadService = {
  async uploadFile(file: File): Promise<{ url: string; fileUrl: string }> {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data; // should return { url: "...", fileUrl: "..." }
  },
};