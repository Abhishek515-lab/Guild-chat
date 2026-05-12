import api from "./axios";

export const loginUser = async (email, password) => {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
};

export const registerUser = async (userData) => {
  const { data } = await api.post("/auth/register", userData);
  return data;
};

export const sendOTPApi = async (email) => {
  if (!email) throw new Error("Email is required for OTP");

  const { data } = await api.post("/auth/send-otp", { email });
  return data;
};

export const verifyOTPApi = async (email, otp) => {
  const { data } = await api.post("/auth/verify-otp", { email, otp });
  return data;
};

export const updateProfileApi = async (userData) => {
  const { data } = await api.put("/auth/profile", userData);
  return data;
};