import API from "./api";

export const getPlace = async (id) => {
  const response = await API.get(`/places/${id}`);
  return response.data;
};

export const getPlaces = async () => {
  const response = await API.get("/places");
  return response.data;
};