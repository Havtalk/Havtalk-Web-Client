import axios from "axios";
import { BaseUrl } from "./utils";
const baseURL = process.env.NEXT_PUBLIC_API_URL || BaseUrl;
const updatedBaseURL = baseURL+ "/api";
const api = axios.create({
  baseURL: updatedBaseURL, 
  withCredentials: true, // important for cookies/session
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      const event = new CustomEvent("authExpired");
      window.dispatchEvent(event);
    }
    return Promise.reject(error);
  }
);

export default api;
