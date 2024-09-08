import apiClient from "./apiClient";

export const refreshAccessToken = async () => {
  try {
    const response = await apiClient.post("/refresh-token");
    return response.data.access_token;
  } catch (err) {
    return null;
  }
};
