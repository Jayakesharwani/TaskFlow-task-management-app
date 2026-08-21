import api from "./api";
import type { AuthResponse } from "@/types/auth";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export async function registerUser(
  data: RegisterData,
): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>(
    "/auth/register",
    data,
  );

  return response.data;
}

export async function loginUser(
  data: LoginData,
): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>(
    "/auth/login",
    data,
  );

  return response.data;
}