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
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // Direct assignment safe hai
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor (Error handle karne ke liye)
api.interceptors.response.use(
  (response) => response, // Agar success hai toh data return karo
  (error) => {
    // Agar 401 (Unauthorized) aata hai, matlab token expire ho gaya
    if (error.response && error.response.status === 401) {
      console.error("Session expired or unauthorized. Logging out...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Optional: User ko login page par redirect kar sakte hain
      // window.location.href = "/auth"; 
    }
    return Promise.reject(error);
  }
);

export default api;