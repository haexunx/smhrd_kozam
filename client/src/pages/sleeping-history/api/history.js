import { apiClient } from "@/shared/api";

export const getReportList = async (payload) => {
  const response = await apiClient.get("/history/reports");
  return response.data;
};

export const getReport = async (reportId, payload) => {
  const response = await apiClient.get(`/history/reports/${reportId}`);
  return response.data;
};
