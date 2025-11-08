import axiosInstance from '../utils/axiosInstance'
import { API_PATH } from '../utils/apiPath'

export const uploadService = {
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('image', file)

    const response = await axiosInstance.post<{ path: string; message: string; filename: string }>(
      API_PATH.UPLOAD.IMAGE.path,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data.path
  },
}

