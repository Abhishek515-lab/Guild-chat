import { createContext, useContext, useState, useEffect } from "react";
import {
  loginUser,
  registerUser,
  sendOTPApi,
  verifyOTPApi
} from "../Api/authApi";

import api from "../Api/axios";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // State initialization: 
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("userInfo");
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  // LOGIN logic
  const signIn = async (email, password) => {
    try {
      const response = await loginUser(email, password);

      // Yahan Console karke dekho backend kya bhej raha hai
      console.log("Backend Response:", response);

      // Agar response direct data hai (kyunki api.js mein .data return ho chuka hai)
      const data = response;

      if (!data || !data.token) {
        return { error: { message: "Server ne token nahi bheja!" } };
      }

      const userInfo = { ...data.user, token: data.token };
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      setUser(userInfo);

      return { data: userInfo, error: null };
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
      return { error: error.response?.data || { message: "Failed to send OTP" } };
    }
  };

  // VERIFY OTP
  const verifyEmail = async (email, otp) => {
    try {
      await verifyOTPApi(email, otp);
      return { error: null };
    } catch (error) {
      return { error: error.response?.data || { message: "Invalid OTP" } };
    }
  };

  // FINAL SIGNUP
 const signUp = async (userData) => {
  try {
    const response = await registerUser(userData);
    
    // YAHAN FIX HAI: registerUser pehle hi data bhej raha hai
    const data = response; 

    if (!data || !data.token) {
      // Agar backend se account ban gaya par token nahi aaya
      return { error: { message: "Account toh ban gaya par login nahi ho paya (No Token)" } };
    }

    const userInfo = {
      ...data.user,
      token: data.token
    };

    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    setUser(userInfo);

    return { data: userInfo, error: null };
  } catch (error) {
    // Backend se error message nikaalne ke liye
    return { error: error.response?.data || { message: "Signup failed" } };
  }
};
  // AuthContext.jsx
  const updateProfile = async (userData) => {
    try {
      const response = await api.put("/auth/profile", userData);

      const updatedUser = response.data; //  FIXED

      const newUserInfo = { ...user, ...updatedUser };

      localStorage.setItem("userInfo", JSON.stringify(newUserInfo));
      setUser(newUserInfo);

      return { success: true, data: updatedUser };

    } catch (error) {
      console.error("PROFILE UPDATE ERROR:", error.response || error);

      return {
        success: false,
        error: error.response?.data?.message || "Update failed",
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
      value={{ user, signIn, signUp, logout, sendOTP, verifyEmail, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};