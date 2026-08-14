import API from "./api";

export const getStates = async () => {
  const response = await API.get("/states");
  return response.data;
};

export const getState = async (id) => {
  const response = await API.get(`/states/${id}`);
  return response.data;
};