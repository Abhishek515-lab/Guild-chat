import axios from "axios";

// 1. Instance Create Karein
const api = axios.create({
  // Vite mein env variables VITE_ se start hote hain
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Agar backend CORS mein allowed hai toh
});

// 2. Request Interceptor (Token attach karne ke liye)
// 2. Request Interceptor
api.interceptors.request.use(
  (config) => {
    // userInfo se token nikaalo (kyunki aapne Context mein yahi save kiya hai)
    const savedData = localStorage.getItem("userInfo");
    if (savedData) {
      const { token } = JSON.parse(savedData);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Session expired. Clearing storage...");
      localStorage.removeItem("userInfo"); // Sahi key remove karo
      // window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

export default api;