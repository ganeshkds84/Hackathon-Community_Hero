import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/** Shared Axios client for backend API requests. */
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
