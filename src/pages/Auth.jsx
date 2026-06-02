import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react"; // Eye icons import किए

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

  // पासवर्ड विजिबिलिटी स्टेट्स
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  // ---------- LOGIN ----------
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data, error } = await signIn(email, password);

      if (error) {
        toast.error(error.message);
      } else {
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
    if (!email) {
      toast.error("Email is required");
      return;
    }
    try {
      setLoading(true);
      const { error } = await sendOTP(email);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("OTP sent to your email");
      setStep(3);
    } finally {
      setLoading(false);
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
      navigate("/");
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background/50 px-6">
      

      {/* GLOSSY BOX CONTAINER */}
      <div className="w-full max-w-md bg-white/30 backdrop-blur-md border border-white/40 p-8 rounded-3xl shadow-xl flex flex-col items-center">
        
        {/* ---------------- LOGIN ---------------- */}
        {isLogin && (
          <form onSubmit={handleLogin} className="w-full space-y-4">
            <h1 className="text-5xl text-center font-black text-black mb-8 tracking-tight">
        GuildChat
      </h1>
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 rounded-xl text-lg bg-background/50 backdrop-blur-sm border border-white/20 outline-none focus:ring-2 focus:ring-black/20 transition-all"
            />

            {/* Password Input Wrapper with Eye Icon */}
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 pr-12 rounded-xl text-lg bg-background/50 backdrop-blur-sm border border-white/20 outline-none focus:ring-2 focus:ring-black/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-600 hover:text-black transition-colors"
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 rounded-xl text-lg font-bold hover:bg-stone-900 active:scale-[0.99] transition-all shadow-md"
            >
              {loading ? "Please wait..." : "Log In"}
            </button>
          </form>
        )}

        {/* ---------------- SIGNUP FLOW ---------------- */}
        {!isLogin && (
          <div className="w-full space-y-4 flex flex-col">
            
            {/* STEP 1 - Name */}
            {step === 1 && (
              <>
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-4 rounded-xl text-lg bg-white/80 backdrop-blur-sm border border-white/20 outline-none focus:ring-2 focus:ring-black/20"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-4 rounded-xl text-lg bg-white/80 backdrop-blur-sm border border-white/20 outline-none focus:ring-2 focus:ring-black/20"
                />
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!firstName || !lastName}
                  className="w-full bg-black text-white py-4 rounded-xl text-lg font-bold disabled:opacity-50"
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
                  className="w-full p-4 rounded-xl text-lg bg-white/80 backdrop-blur-sm border border-white/20 outline-none focus:ring-2 focus:ring-black/20"
                />
                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={!email || loading}
                  className="w-full bg-black text-white py-4 rounded-xl text-lg font-bold"
                >
                  {loading ? "Sending..." : "Verify Email"}
                </button>
                <button type="button" onClick={prevStep} className="text-stone-700 font-medium text-sm self-center hover:underline">
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
                  className="w-full p-4 rounded-xl text-lg bg-white/80 backdrop-blur-sm border border-white/20 outline-none text-center tracking-widest focus:ring-2 focus:ring-black/20"
                />
                <button
                  type="button"
                  onClick={handleVerifyOTP}
                  disabled={!otp || loading}
                  className="w-full bg-black text-white py-4 rounded-xl text-lg font-bold"
                >
                  {loading ? "Verifying..." : "Confirm OTP"}
                </button>
                <button type="button" onClick={prevStep} className="text-stone-700 font-medium text-sm self-center hover:underline">
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
                  className="w-full p-4 rounded-xl text-lg bg-white/80 backdrop-blur-sm border border-white/20 outline-none focus:ring-2 focus:ring-black/20"
                />
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!username}
                  className="w-full bg-black text-white py-4 rounded-xl text-lg font-bold"
                >
                  Continue
                </button>
                <button type="button" onClick={prevStep} className="text-stone-700 font-medium text-sm self-center hover:underline">
                  Back
                </button>
              </>
            )}

            {/* STEP 5 - Password */}
            {step === 5 && (
              <>
                {/* Signup Password */}
                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-4 pr-12 rounded-xl text-lg bg-white/80 backdrop-blur-sm border border-white/20 outline-none focus:ring-2 focus:ring-black/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-600 hover:text-black"
                  >
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>

                {/* Confirm Password */}
                <div className="relative w-full">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-4 pr-12 rounded-xl text-lg bg-white/80 backdrop-blur-sm border border-white/20 outline-none focus:ring-2 focus:ring-black/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-600 hover:text-black"
                  >
                    {showConfirmPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleSignup}
                  disabled={!password || !confirmPassword || loading}
                  className="w-full bg-black text-white py-4 rounded-xl text-lg font-bold"
                >
                  {loading ? "Creating..." : "Create Account"}
                </button>
                <button type="button" onClick={prevStep} className="text-stone-700 font-medium text-sm self-center hover:underline">
                  Back
                </button>
              </>
            )}
          </div>
        )}

        {/* TOGGLE BUTTON INSIDE/BOTTOM OF GLASS BOX */}
        <p className="mt-6 text-stone-800 text-sm font-medium">
          {isLogin ? "New here? " : "Already have an account? "}
          <span
            onClick={() => {
              setIsLogin(!isLogin);
              resetSignup();
            }}
            className="underline font-bold cursor-pointer text-black hover:text-stone-800 transition-colors"
          >
            {isLogin ? "Sign Up" : "Log In"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;