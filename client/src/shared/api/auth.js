import { apiClient } from "@/shared/api";

export const login = async (credentials) => {
  const response = await apiClient.post(`/auth/login`, credentials);
  const { token, userId } = response.data.user;

  if (token) {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("userId", userId);
  }

  return response.data;
};
