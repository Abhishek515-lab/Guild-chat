import api from "./axios";

// Helper to handle data return consistently
const handleResponse = (response) => response.data;

export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data; // Data direct return karne se components mein kaam aasaan ho jata hai
};

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const sendOTPApi = async (email) => {
  const response = await api.post("/auth/send-otp", { email });
  return response.data;
};

export const verifyOTPApi = async (email, otp) => {
  // Fix confirmed: /verify-otp is the correct endpoint
  const response = await api.post("/auth/verify-otp", { email, otp });
  return response.data;
};

export const updateProfileApi = async (userData) => {
  // Note: Ensure backend expects PUT and the route is /api/auth/profile
  const response = await api.put("/auth/profile", userData);
  return response.data;
};