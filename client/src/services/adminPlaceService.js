import API from "./api";

export const getPlaces = async () => {
  const response = await API.get("/places");
  return response.data;
};

export const createPlace = async (formData) => {
  const response = await API.post(
    "/places",
    formData
  );

  return response.data;
};

export const updatePlace = async (id, formData) => {
  const response = await API.put(
    `/places/${id}`,
    formData
  );

  return response.data;
};

export const deletePlace = async (id) => {
  const response = await API.delete(
    `/places/${id}`
  );

  return response.data;
};