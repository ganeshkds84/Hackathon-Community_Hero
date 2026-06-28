import { api } from "@/services/api";

export interface ImageUploadResponse {
  image_url: string;
}

export const uploadService = {
  /**
   * Uploads an image file to the backend.
   * @param file The image File to upload.
   * @returns The URL of the uploaded image.
   */
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<ImageUploadResponse>("/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.image_url;
  },
};
