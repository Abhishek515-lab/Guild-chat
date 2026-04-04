import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Verify = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying your email... ⏳");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/verify/${token}`
        );

        setMessage("Email verified successfully 🎉 Redirecting...");
        setTimeout(() => navigate("/auth"), 2000);
      } catch (error) {
        setMessage("Verification failed ❌");
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center text-xl font-bold">
      {message}
    </div>
  );
};

export default Verify;