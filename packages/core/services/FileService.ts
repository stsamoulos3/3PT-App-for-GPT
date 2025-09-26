import hc from "../helpers/api";
import { apiCall } from "../helpers/apiInterceptor";

export interface UserFile {
  id: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  description: string | null;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetUserFilesResponse {
  files: UserFile[];
}

export interface GetSignedUrlResponse {
  signedUrl: string;
  expiresAt: string;
}

export const FileService = {
  getUserFiles: async (apiKey: string): Promise<GetUserFilesResponse> => {
    return apiCall(
      () =>
        hc.user.me.files.$get({
          header: {
            "x-api-key": apiKey,
          },
        }),
      (response) => response.json(),
    );
  },

  getFileSignedUrl: async (
    fileId: string,
    apiKey: string,
    expiresIn?: string,
  ): Promise<GetSignedUrlResponse> => {
    return apiCall(
      () =>
        hc.user.me.files[":fileId"]["signed-url"].$get({
          header: {
            "x-api-key": apiKey,
          },
          param: {
            fileId,
          },
          query: {
            expiresIn,
          },
        }),
      (response) => response.json(),
    );
  },
};