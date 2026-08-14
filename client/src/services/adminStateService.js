import API from "./api";

export const getStates = async () => {
  const response = await API.get("/states");
  return response.data;
};

export const createState = async (formData) => {
  const response = await API.post("/states", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const updateState = async (id, formData) => {
  const response = await API.put(`/states/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const deleteState = async (id) => {
  const response = await API.delete(`/states/${id}`);
  return response.data;
};