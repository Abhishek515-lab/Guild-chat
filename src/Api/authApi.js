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

export const verifyOTPApi = (email, otp) => {
  return api.post("/auth/send-otp", { email, otp });
};


export const updateProfileApi = (userData) => {
  // Backend route agar PUT hai toh .put use karein
  return api.put("/api/auth/profile", userData);
};
