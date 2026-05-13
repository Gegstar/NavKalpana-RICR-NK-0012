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

export interface HlsUploadResponse {
  success: boolean;

  type: string;

  videoName: string;

  playlistUrl: string;

  businessUnitId: string;

  visibility: string;
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
   // =====================================================
  // VIDEO → HLS UPLOAD
  // =====================================================

  async uploadHlsVideo(
    file: File,
  ): Promise<HlsUploadResponse> {
    const formData = new FormData();

    formData.append('file', file);

    const response = await api.post(
      `${this.baseUrl}/video-upload`,
      formData,
      {
        headers: {
          'Content-Type':
            'multipart/form-data',
        },

        onUploadProgress: (
          progressEvent,
        ) => {
          const percent =
            Math.round(
              (progressEvent.loaded *
                100) /
                (progressEvent.total ||
                  1),
            );

          console.log(
            `Upload Progress: ${percent}%`,
          );
        },
      },
    );

    return response.data;
  }
}

export const fileUploadService = new FileUploadService();