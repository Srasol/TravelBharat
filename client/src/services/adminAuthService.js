import API from "./api";

export const loginAdmin = async (credentials) => {
  const response = await API.post("/admin/auth/login", credentials);
  return response.data;
};

export const getAdminProfile = async () => {
  const token = localStorage.getItem("adminToken");

  const response = await API.get("/admin/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};