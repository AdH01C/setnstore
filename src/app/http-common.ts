import axios, { AxiosInstance } from "axios";

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND,
  headers: {
    "Content-type": "application/json",
    "ngrok-skip-browser-warning": "true"
  },
});

export default apiClient;
