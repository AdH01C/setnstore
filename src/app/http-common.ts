import axios, { AxiosInstance } from "axios";

const apiClient: AxiosInstance = axios.create({
  baseURL: "http://localhost:3001/",
  headers: {
    "Content-type": "application/json",
  },
});

export default apiClient;
