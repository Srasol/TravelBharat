import API from "./api";

export const searchPlaces = async (search = "", state = "", category = "") => {
  let url = "/places?";

  if (search) {
    url += `search=${search}&`;
  }

  if (state) {
    url += `state=${state}&`;
  }

  if (category) {
    url += `category=${category}&`;
  }

  const response = await API.get(url);

  return response.data;
};