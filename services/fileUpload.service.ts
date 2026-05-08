import api from '@/lib/api';

export interface FileUploadResponse {
  fileName: string;
  path: string;
  type: string;
  size: number;
  url: string;
  visibility: string;
  businessUnitId: string;
}

class FileUploadService {
  private baseUrl = '/file-uploads';

  async upload(
    file: File,
    fileName: string,
    folderName: string
  ): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(
      `${this.baseUrl}/upload`,
      formData,
      {
        params: {
          fileName,
          folderName,
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  }
}

export const fileUploadService = new FileUploadService();