import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import {
  loginUser,
  registerUser,
  sendOTPApi,
  verifyOTPApi
} from "../Api/authApi";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // LOGIN

const signIn = async (email, password) => {
  try {
    const { data } = await loginUser(email, password);
    
    // Yahan galti thi: data.user lene se token chhut jata tha
    // Hume pura object chahiye jisme token aur user dono hon
    const userInfo = {
      ...data.user,    // User details (name, email etc.)
      token: data.token // Backend se aaya hua token
    };

    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    setUser(userInfo);

    return { error: null };
  } catch (error) {
    return { error: error.response?.data || { message: "Login failed" } };
  }
};

  // SEND OTP
  const sendOTP = async (email) => {
  try {
    await sendOTPApi(email);
    return { error: null };
  } catch (error) {
    return {
      error: error.response?.data || { message: "Failed to send OTP" },
    };
  }
};

  // VERIFY OTP
 const verifyEmail = async (email, otp) => {
  try {
    await verifyOTPApi(email, otp);
    return { error: null };
  } catch (error) {
    return {
      error: error.response?.data || { message: "Invalid OTP" },
    };
  }
};

  // FINAL SIGNUP
  const signUp = async (userData) => {
  try {
    const { data } = await registerUser(userData);

    localStorage.setItem("userInfo", JSON.stringify(data));
    setUser(data);

    return { error: null };
  } catch (error) {
    return {
      error: error.response?.data || { message: "Signup failed" },
    };
  }
};

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, signIn, signUp, logout, sendOTP, verifyEmail }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};