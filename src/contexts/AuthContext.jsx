import { createContext, useContext, useState, useMemo, useCallback } from "react";
import {
  loginUser,
  registerUser,
  sendOTPApi,
  verifyOTPApi
} from "../Api/authApi";

import api from "../Api/axios";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // State initialization: Safe load from localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("userInfo");
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  // 1. LOGIN logic (Memoized)
  const signIn = useCallback(async (email, password) => {
    try {
      const response = await loginUser(email, password);
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
  }, []);

  // 2. SEND OTP (Memoized)
  const sendOTP = useCallback(async (email) => {
    try {
      if (!email) {
        return { error: { message: "Email is required" } };
      }
      const response = await sendOTPApi(email);
      return { data: response, error: null };
    } catch (error) {
      return { error: error.response?.data || { message: "Failed to send OTP" } };
    }
  }, []);

  // 3. VERIFY OTP (Memoized)
  const verifyEmail = useCallback(async (email, otp) => {
    try {
      await verifyOTPApi(email, otp);
      return { error: null };
    } catch (error) {
      return { error: error.response?.data || { message: "Invalid OTP" } };
    }
  }, []);

  // 4. FINAL SIGNUP (Memoized)
  const signUp = useCallback(async (userData) => {
    try {
      const response = await registerUser(userData);
      const data = response; 

      if (!data || !data.token) {
        return { error: { message: "Account toh ban gaya par login nahi ho paya (No Token)" } };
      }

      const userInfo = { ...data.user, token: data.token };
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      setUser(userInfo);

      return { data: userInfo, error: null };
    } catch (error) {
      return { error: error.response?.data || { message: "Signup failed" } };
    }
  }, []);

  // 5. UPDATE PROFILE (Memoized - relies on 'user' state)
  const updateProfile = useCallback(async (userData) => {
    try {
      const response = await api.put("/auth/profile", userData);
      const updatedUser = response.data; 

      setUser((currentUser) => {
        const newUserInfo = { ...currentUser, ...updatedUser };
        localStorage.setItem("userInfo", JSON.stringify(newUserInfo));
        return newUserInfo;
      });

      return { success: true, data: updatedUser };
    } catch (error) {
      console.error("PROFILE UPDATE ERROR:", error.response || error);
      return {
        success: false,
        error: error.response?.data?.message || "Update failed",
      };
    }
  }, []);

  // 6. LOGOUT (Memoized)
  const logout = useCallback(() => {
    localStorage.removeItem("userInfo");
    setUser(null);
  }, []);

  // 💡 CRITICAL FIX: Pure context value ko useMemo se wrap kiya taaki 
  // jab tak 'user' change na ho, tab tak consumer components re-render na hon.
  const contextValue = useMemo(() => ({
    user,
    signIn,
    signUp,
    logout,
    sendOTP,
    verifyEmail,
    updateProfile
  }), [user, signIn, signUp, logout, sendOTP, verifyEmail, updateProfile]);

  return (
    <AuthContext.Provider value={contextValue}>
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