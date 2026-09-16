import axios from "axios";

let rawBaseUrl =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000";

if (
  rawBaseUrl &&
  !rawBaseUrl.startsWith("http://") &&
  !rawBaseUrl.startsWith("https://")
) {
  rawBaseUrl = `https://${rawBaseUrl}`;
}

const api = axios.create({
  baseURL: rawBaseUrl,
});

// Automatically attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;