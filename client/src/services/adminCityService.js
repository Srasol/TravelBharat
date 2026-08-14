import API from "./api";

export const getCities = async () => {
  const response = await API.get("/cities");
  return response.data;
};

export const createCity = async (formData) => {
  const response = await API.post("/cities", formData);
  return response.data;
};

export const updateCity = async (id, formData) => {
  const response = await API.put(`/cities/${id}`, formData);
  return response.data;
};

export const deleteCity = async (id) => {
  const response = await API.delete(`/cities/${id}`);
  return response.data;
};