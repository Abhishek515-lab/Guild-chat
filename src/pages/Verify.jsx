import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const Verify = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState("Verifying your email... ⏳");
  
  // StrictMode me double request block karne ke liye ref
  const hasRequested = useRef(false);

  useEffect(() => {
    // Agar token nahi hai ya request pehle hi chal chuki hai toh ruk jao
    if (!token || hasRequested.current) return;
    hasRequested.current = true;

    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/verify/${token}`
        );

        setStatus("success");
        setMessage(response.data?.message || "Email verified successfully! 🎉 Redirecting...");
        
        setTimeout(() => navigate("/auth"), 2500);
      } catch (error) {
        setStatus("error");
        setMessage(error.response?.data?.message || "Verification failed or token expired ❌");
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background/50 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-8 rounded-3xl max-w-sm w-full text-center shadow-xl border border-white/10"
      >
        {status === "loading" && (
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        )}
        
        <p className={`text-base font-bold font-heading ${
          status === "success" ? "text-green-400" : status === "error" ? "text-red-400" : "text-foreground"
        }`}>
          {message}
        </p>

        {status === "error" && (
          <button 
            onClick={() => navigate("/auth")}
            className="mt-6 px-6 py-2 rounded-xl anime-gradient text-white text-xs font-bold shadow-md"
          >
            Back to Login
          </button>
        )}
      </motion.div>
    </div>
  );
};

export default Verify;