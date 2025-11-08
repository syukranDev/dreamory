import axiosInstance from '../utils/axiosInstance'
import { API_PATH } from '../utils/apiPath'

interface LoginRequest {
  email: string
  password: string
}

interface SignupRequest {
  fullName: string
  email: string
  password: string
  profileImageUrl?: string
}

interface AuthResponse {
  token: string
  user: {
    id: number
    fullName: string
    email: string
    profileImageUrl: string | null
    createdAt: string
    updatedAt: string
  }
}

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>(
      API_PATH.AUTH.LOGIN.path,
      credentials
    )
    return response.data
  },

  async signup(userData: SignupRequest): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>(
      API_PATH.AUTH.SIGNUP.path,
      userData
    )
    return response.data
  },
}

