import axios from "axios";

const API_URL = "http://172.26.30.1:5000" || "http://localhost:5000";

export const searchQuery = async (endpoint) => {
  try {
    const response = await axios.get(API_URL + endpoint);
    return response.data;
  } catch (error) {
    throw new Error("error fetching data");
  }
};

export const postQuery = async (endpoint, data) => {
  try {
    const response = await axios.post(API_URL + endpoint + data);
    return response.data;
  } catch (error) {
    throw new Error("error fetching data");
  }
};
