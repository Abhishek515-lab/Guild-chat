import api from "./axios";

export const loginUser = (email, password) => {
  return api.post("/auth/login", { email, password });
};

export const registerUser = (userData) => {
  return api.post("/auth/register", userData);
};

export const sendOTPApi = (email) => {
  return api.post("/auth/send-otp", { email });
};

// FIX: Yahan /send-otp ki jagah /verify-otp aayega
export const verifyOTPApi = (email, otp) => {
  return api.post("/auth/verify-otp", { email, otp });
};

export const updateProfileApi = (userData) => {
  // Axios baseURL mein /api pehle se hai, isliye yahan sirf /auth/profile kaafi hai
  return api.put("/auth/profile", userData);
};