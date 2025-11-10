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

export interface AuthUser {
  id: number
  fullName: string
  email: string
  profileImageUrl: string | null
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  token: string
  user: AuthUser
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

  async getCurrentUser(): Promise<AuthUser> {
    const response = await axiosInstance.get<AuthUser>(API_PATH.AUTH.ME.path)
    return response.data
  },
}

