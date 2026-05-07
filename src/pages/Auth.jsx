import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const { signIn, signUp, verifyEmail, sendOTP } = useAuth();
  const navigate = useNavigate();

  // ---------- STEP CONTROL ----------
  const nextStep = () => setStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const resetSignup = () => {
    setStep(1);
    setFirstName("");
    setLastName("");
    setEmail("");
    setOtp("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
  };

  // ---------- LOGIN ----------

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // 1. signIn se data (jisne token ho) aur error nikaalein
      const { data, error } = await signIn(email, password);

      if (error) {
        toast.error(error.message);
      } else {
        // 2. TOKEN SAVE KARO (Ye missing tha!)
        if (data && data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          toast.success("Welcome back! 👋");
          navigate("/");
        } else {
          toast.error("Login failed: Token not received");
        }
      }
    } catch (err) {
      toast.error("Something went wrong during login");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ---------- SEND OTP ----------
  const handleSendOTP = async () => {
  try {
    setLoading(true);
    const { error } = await sendOTP(email);
    if (error) throw error;
    toast.success("OTP sent!");
    setStep(3);
  } catch (err) {
    toast.error(err.message || "OTP failed");
  } finally {
    setLoading(false); // Ye button ko hamesha reset karega
  }
};

  // ---------- VERIFY OTP ----------
  const handleVerifyOTP = async () => {
    try {
      setLoading(true);

      const { error } = await verifyEmail(email, otp);

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Email verified ");
      setStep(4);
    } finally {
      setLoading(false);
    }
  };

  // ---------- FINAL SIGNUP ----------
  const handleSignup = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await signUp({
        firstName,
        lastName,
        email,
        username,
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Account created successfully! 🎉");
      navigate("/"); // Context update ho chuka hai, ab navigate safe hai.

    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-pink-200 px-6">
      <h1 className="text-5xl font-black text-black mb-6">
        GuildChat
      </h1>

      {/* ---------------- LOGIN ---------------- */}
      {isLogin && (
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 rounded-xl text-lg"
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 rounded-xl text-lg "
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-full text-lg font-bold"
          >
            {loading ? "Please wait..." : "Log In"}
          </button>
        </form>
      )}

      {/* ---------------- SIGNUP FLOW ---------------- */}
      {!isLogin && (
        <div className="w-full max-w-sm space-y-4">

          {/* STEP 1 - Name */}
          {step === 1 && (
            <>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-4 rounded-xl text-lg outline-none"
              />

              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-4 rounded-xl text-lg outline-none"
              />

              <button
                type="button"
                onClick={nextStep}
                disabled={!firstName || !lastName}
                className="w-full bg-black text-white py-4 rounded-full text-lg font-bold"
              >
                Continue
              </button>
            </>
          )}

          {/* STEP 2 - Email */}
          {step === 2 && (
            <>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 rounded-xl text-lg outline-none"
              />

              <button
                type="button"
                onClick={handleSendOTP}
                disabled={!email || loading}
                className="w-full bg-black text-white py-4 rounded-full text-lg font-bold"
              >
                {loading ? "Sending..." : "Verify Email"}
              </button>

              <button type="button" onClick={prevStep} className="text-white text-sm">
                Back
              </button>
            </>
          )}

          {/* STEP 3 - OTP */}
          {step === 3 && (
            <>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-4 rounded-xl text-lg outline-none text-center tracking-widest"
              />

              <button
                type="button"
                onClick={handleVerifyOTP}
                disabled={!otp || loading}
                className="w-full bg-black text-white py-4 rounded-full text-lg font-bold"
              >
                {loading ? "Verifying..." : "Confirm OTP"}
              </button>

              <button type="button" onClick={prevStep} className="text-white text-sm">
                Back
              </button>
            </>
          )}

          {/* STEP 4 - Username */}
          {step === 4 && (
            <>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-4 rounded-xl text-lg outline-none"
              />

              <button
                type="button"
                onClick={nextStep}
                disabled={!username}
                className="w-full bg-black text-white py-4 rounded-full text-lg font-bold"
              >
                Continue
              </button>

              <button type="button" onClick={prevStep} className="text-white text-sm">
                Back
              </button>
            </>
          )}

          {/* STEP 5 - Password */}
          {step === 5 && (
            <>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 rounded-xl text-lg outline-none"
              />

              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-4 rounded-xl text-lg outline-none"
              />

              <button
                type="button"
                onClick={handleSignup}
                disabled={!password || !confirmPassword || loading}
                className="w-full bg-black text-white py-4 rounded-full text-lg font-bold"
              >
                {loading ? "Creating..." : "Create Account"}
              </button>

              <button type="button" onClick={prevStep} className="text-white text-sm">
                Back
              </button>
            </>
          )}
        </div>
      )}

      {/* TOGGLE */}
      <p className="mt-8 text-white text-sm">
        {isLogin ? "New here?" : "Already have an account?"}{" "}
        <span
          onClick={() => {
            setIsLogin(!isLogin);
            resetSignup();
          }}
          className="underline font-semibold cursor-pointer"
        >
          {isLogin ? "Sign Up" : "Log In"}
        </span>
      </p>
    </div>
  );
};

export default Auth;