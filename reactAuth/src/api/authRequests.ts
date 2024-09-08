import apiClient from "./apiClient";

export const refreshAccessToken = async () => {
  try {
    const response = await apiClient.get("/refresh-token");
    return response.data.access_token;
  } catch (err: any) {
    console.log("error", err.response?.data || err.message || err);

    throw err;
  }
};

export const login = async () => {
  try {
    const response = await apiClient.post("/login");
    return response.data.access_token;
  } catch (err) {
    return null;
  }
};
