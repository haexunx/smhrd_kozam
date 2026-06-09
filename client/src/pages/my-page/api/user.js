import { apiClient } from "@/shared/api";

export const updateUser = async (userData) => {
  if (!userData) return;

  const response = await apiClient.patch("/user", userData);

  return response.data;
};
