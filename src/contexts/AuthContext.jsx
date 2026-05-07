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
  const [user, setUser] = useState(() => {
    // Hamesha 'userInfo' use karein consistency ke liye
    const savedUser = localStorage.getItem("userInfo");
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const signIn = async (email, password) => {
    try {
      const data = await loginUser(email, password); // API file already returns .data

      if (!data || !data.token) {
        return { error: { message: "Server error: Token missing" } };
      }

      const userInfo = { ...data.user, token: data.token };
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      // Axios interceptor ke liye bhi alag se token rakh sakte hain agar zaroorat ho
      localStorage.setItem("token", data.token); 
      
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
      const data = await registerUser(userData);

      if (!data || !data.token) {
        return { error: { message: "Signup successful but token missing" } };
      }

      // password hatane ke liye sirf backend ka data lo
      const userInfo = { ...data.user, token: data.token };
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      localStorage.setItem("token", data.token);

      setUser(userInfo);
      return { data: userInfo, error: null };
    } catch (error) {
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