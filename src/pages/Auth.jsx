import { useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    otp: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signIn, signUp, verifyEmail, sendOTP } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const nextStep = useCallback(() => setStep((prev) => Math.min(prev + 1, 5)), []);
  const prevStep = useCallback(() => setStep((prev) => Math.max(prev - 1, 1)), []);

  const resetSignup = useCallback(() => {
    setStep(1);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      otp: "",
      username: "",
      password: "",
      confirmPassword: "",
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, []);

  const toggleAuthMode = useCallback(() => {
    setIsLogin((prev) => !prev);
    resetSignup();
  }, [resetSignup]);

  const toggleShowPassword = useCallback(() => setShowPassword((prev) => !prev), []);
  const toggleShowConfirmPassword = useCallback(() => setShowConfirmPassword((prev) => !prev), []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data, error } = await signIn(formData.email, formData.password);

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data?.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Welcome back! 👋");
        navigate("/");
      } else {
        toast.error("Login failed: Token not received");
      }
    } catch (err) {
      toast.error("Something went wrong during login");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!formData.email) {
      toast.error("Email is required");
      return;
    }
    try {
      setLoading(true);
      const { error } = await sendOTP(formData.email);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("OTP sent to your email");
      setStep(3);
    } catch (err) {
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);
      const { error } = await verifyEmail(formData.email, formData.otp);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Email verified");
      setStep(4);
    } catch (err) {
      toast.error("Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await signUp({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        username: formData.username,
        password: formData.password,
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
    <div className="min-h-screen flex flex-col justify-center items-center px-6 relative z-10 select-none">
      <div className="w-full max-w-md glass-panel p-8 rounded-[2rem] shadow-2xl flex flex-col items-center bg-background/60 backdrop-blur-md border border-white/10">
        {isLogin ? (
          <form onSubmit={handleLogin} className="w-full space-y-4">
            <h1 className="text-5xl text-center font-heading font-black text-foreground mb-8 tracking-tighter uppercase anime-gradient-text">
              GuildChat
            </h1>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-4 rounded-xl text-base bg-muted/30 text-foreground border border-white/10 outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-muted-foreground"
            />

            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-4 pr-12 rounded-xl text-base bg-muted/30 text-foreground border border-white/10 outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-muted-foreground"
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-4 rounded-xl text-base font-bold uppercase tracking-wider hover:opacity-90 active:scale-[0.99] transition-all shadow-lg shadow-primary/20 disabled:opacity-40 cursor-pointer"
            >
              {loading ? "Please wait..." : "Log In"}
            </button>
          </form>
        ) : (
          <div className="w-full space-y-4 flex flex-col">
            <h2 className="text-2xl text-center font-heading font-black text-foreground mb-4 uppercase tracking-wider">
              Create Account
            </h2>
            {step === 1 && (
              <>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full p-4 rounded-xl text-base bg-muted/30 text-foreground border border-white/10 outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-muted-foreground"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full p-4 rounded-xl text-base bg-muted/30 text-foreground border border-white/10 outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!formData.firstName || !formData.lastName}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-xl text-base font-bold uppercase tracking-wider disabled:opacity-30 cursor-pointer"
                >
                  Continue
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-4 rounded-xl text-base bg-muted/30 text-foreground border border-white/10 outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={!formData.email || loading}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-xl text-base font-bold uppercase tracking-wider disabled:opacity-30 cursor-pointer"
                >
                  {loading ? "Sending..." : "Verify Email"}
                </button>
                <button
                  type="button"
                  onClick={prevStep}
                  className="text-muted-foreground font-semibold text-xs self-center hover:text-foreground hover:underline transition-all cursor-pointer"
                >
                  Back
                </button>
              </>
            )}

            {step === 3 && (
              <>
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter 6-digit OTP"
                  value={formData.otp}
                  onChange={handleInputChange}
                  className="w-full p-4 rounded-xl text-base bg-muted/30 text-foreground border border-white/10 outline-none text-center tracking-[0.4em] focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-muted-foreground font-mono"
                />
                <button
                  type="button"
                  onClick={handleVerifyOTP}
                  disabled={!formData.otp || loading}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-xl text-base font-bold uppercase tracking-wider disabled:opacity-30 cursor-pointer"
                >
                  {loading ? "Verifying..." : "Confirm OTP"}
                </button>
                <button
                  type="button"
                  onClick={prevStep}
                  className="text-muted-foreground font-semibold text-xs self-center hover:text-foreground hover:underline transition-all cursor-pointer"
                >
                  Back
                </button>
              </>
            )}

            {step === 4 && (
              <>
                <input
                  type="text"
                  name="username"
                  placeholder="Pick a Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full p-4 rounded-xl text-base bg-muted/30 text-foreground border border-white/10 outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!formData.username}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-xl text-base font-bold uppercase tracking-wider disabled:opacity-30 cursor-pointer"
                >
                  Continue
                </button>
                <button
                  type="button"
                  onClick={prevStep}
                  className="text-muted-foreground font-semibold text-xs self-center hover:text-foreground hover:underline transition-all cursor-pointer"
                >
                  Back
                </button>
              </>
            )}

            {step === 5 && (
              <>
                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full p-4 pr-12 rounded-xl text-base bg-muted/30 text-foreground border border-white/10 outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-muted-foreground"
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <div className="relative w-full">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full p-4 pr-12 rounded-xl text-base bg-muted/30 text-foreground border border-white/10 outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-muted-foreground"
                  />
                  <button
                    type="button"
                    onClick={toggleShowConfirmPassword}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleSignup}
                  disabled={!formData.password || !formData.confirmPassword || loading}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-xl text-base font-bold uppercase tracking-wider disabled:opacity-30 cursor-pointer shadow-lg shadow-primary/20"
                >
                  {loading ? "Creating..." : "Create Account"}
                </button>
                <button
                  type="button"
                  onClick={prevStep}
                  className="text-muted-foreground font-semibold text-xs self-center hover:text-foreground hover:underline transition-all cursor-pointer"
                >
                  Back
                </button>
              </>
            )}
          </div>
        )}

        <p className="mt-6 text-muted-foreground text-sm font-medium">
          {isLogin ? "New here? " : "Already have an account? "}
          <span
            onClick={toggleAuthMode}
            className="underline font-bold cursor-pointer text-foreground hover:opacity-80 transition-all"
          >
            {isLogin ? "Sign Up" : "Log In"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;