import { useState } from "react";
import { motion } from "motion/react";
import { Package, Eye, EyeOff } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';

export default function SignUp() {
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    
    if (!email || !password) {
      setErrorMsg("Email and password are required.");
      return;
    }

    setIsLoading(true);
    // Simulate backend network delay
    setTimeout(() => {
      setIsLoading(false);
      
      const usersDB = JSON.parse(localStorage.getItem("stockSenseUsersDB") || "{}");

      if (!isLogin) {
        // Registration Flow
        if (usersDB[email]) {
          setErrorMsg("An account with this email already exists.");
          return;
        }
        
        const finalName = `${firstName || "Demo"} ${lastName || "User"}`.trim();
        usersDB[email] = {
          name: finalName,
          password: password,
        };
        localStorage.setItem("stockSenseUsersDB", JSON.stringify(usersDB));
        
        // Auto-login after successful registration
        localStorage.setItem("stockSenseUser", JSON.stringify({ name: finalName }));
        navigate("/dashboard");
      } else {
        // Login Flow
        const user = usersDB[email];
        
        if (!user) {
           setErrorMsg("No account found with this email.");
           return;
        }

        if (user.password !== password) {
           setErrorMsg("Incorrect password.");
           return;
        }

        // Login successful
        localStorage.setItem("stockSenseUser", JSON.stringify({ name: user.name }));
        navigate("/dashboard");
      }
    }, 1000);
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }).then(res => res.json());
        
        setIsLoading(false);
        localStorage.setItem("stockSenseUser", JSON.stringify({ name: userInfo.name || "Google User" }));
        navigate("/dashboard");
      } catch {
        setIsLoading(false);
        setErrorMsg("Failed to fetch Google user profile.");
      }
    },
    onError: () => {
      setErrorMsg("Google login failed.");
    }
  });

  const handleGoogleAuth = () => {
    loginWithGoogle();
  };

  return (
    <main className="flex min-h-screen w-full bg-[#f0f0f0] text-[#1E325A] selection:bg-[#1E325A]/20 p-2 transition-all duration-500 lg:h-screen lg:overflow-hidden lg:p-4 font-inter antialiased">
      
      {/* Left Column (Hero & Background Video) */}
      <div className="relative hidden flex-col items-center justify-end pb-32 px-12 rounded-[2rem] overflow-hidden shadow-2xl h-full lg:flex w-[52%]">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260506_081238_406ed0e3-5d83-436e-a512-0bbff7ec5b95.mp4" type="video/mp4" />
        </video>

        {/* Hero Content Container */}
        <motion.div 
          className="z-10 w-full max-w-xs space-y-8 bg-black/20 backdrop-blur-md p-8 rounded-[2rem] border border-white/20 shadow-xl"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { 
              opacity: 1, 
              transition: { staggerChildren: 0.15, delayChildren: 0.2 } 
            }
          }}
        >
          {/* Brand/Logo */}
          <Link to="/">
            <motion.div 
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }} 
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold tracking-tight text-white drop-shadow-sm">StockSense</span>
            </motion.div>
          </Link>

          {/* Heading Block */}
          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
            <h1 className="text-4xl font-medium tracking-tight whitespace-nowrap text-white drop-shadow-md">Join StockSense</h1>
            <p className="text-white/90 text-sm leading-relaxed mt-2 font-medium drop-shadow-sm">
              Follow these 3 quick phases to activate your space.
            </p>
          </motion.div>

          {/* Steps */}
          <motion.div 
            className="space-y-4"
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
          >
            <StepItem number={1} text="Register your identity" active />
            <StepItem number={2} text="Setup your warehouse" />
            <StepItem number={3} text="Finalize your profile" />
          </motion.div>

        </motion.div>
      </div>

      {/* Right Column (Sign Up Form) */}
      <div className="flex-1 flex flex-col items-center justify-center py-12 lg:py-6 px-4 sm:px-12 lg:px-16 xl:px-24 overflow-y-auto lg:overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-xl space-y-8 lg:space-y-6 sm:space-y-10"
        >
          {/* Header */}
          <div>
            <h2 className="text-3xl font-medium tracking-tight text-[#1E325A]">{isLogin ? "Welcome Back" : "Create New Profile"}</h2>
            <p className="text-[rgba(30,50,90,0.6)] text-sm mt-2">{isLogin ? "Enter your credentials to access your account." : "Input your basic details to begin the journey."}</p>
          </div>

          {/* Form Layout */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {errorMsg && <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">{errorMsg}</div>}
            {successMsg && <div className="p-3 bg-green-50 text-green-600 text-sm font-medium rounded-xl border border-green-100">{successMsg}</div>}

            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <InputGroup label="First Name" placeholder="Enter your first name" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                <InputGroup label="Last Name" placeholder="Enter your last name" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
            )}
            
            <InputGroup label="Email" placeholder="Enter your email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[rgba(30,50,90,0.8)]">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/50 border border-white/40 shadow-sm rounded-xl h-11 px-4 text-[#1E325A] placeholder:text-[rgba(30,50,90,0.3)] focus:ring-2 focus:ring-[rgba(30,50,90,0.2)] focus:outline-none pr-10 transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center p-1 cursor-pointer">
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-[rgba(30,50,90,0.6)] hover:text-[rgba(30,50,90,0.9)] transition-colors" />
                  ) : (
                    <Eye className="w-4 h-4 text-[rgba(30,50,90,0.4)] hover:text-[rgba(30,50,90,0.8)] transition-colors" />
                  )}
                </button>
              </div>
              <p className="text-[10px] text-[rgba(30,50,90,0.5)] mt-1">Requires at least 8 symbols.</p>
            </div>

            <button disabled={isLoading} type="submit" className="w-full flex items-center justify-center h-14 bg-[rgba(30,50,90,0.9)] text-white font-semibold rounded-xl hover:bg-[rgba(30,50,90,1)] active:scale-[0.98] mt-4 transition-all cursor-pointer shadow-md disabled:opacity-70 disabled:cursor-not-allowed">
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                isLogin ? "Log In" : "Create Account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-[#1E325A]/10"></div>
            <span className="flex-shrink-0 bg-[#f0f0f0] px-4 text-xs font-medium text-[rgba(30,50,90,0.4)] uppercase tracking-widest">Or</span>
            <div className="flex-grow border-t border-[#1E325A]/10"></div>
          </div>

          {/* Social Buttons */}
          <div className="flex justify-center w-full">
            <button type="button" onClick={handleGoogleAuth} disabled={isLoading} className="flex items-center justify-center gap-4 h-14 w-[340px] max-w-full bg-white border border-gray-300 rounded-xl hover:bg-gray-50 shadow-sm transition-all text-base font-medium text-gray-700 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed">
              <svg viewBox="0 0 24 24" width="22" height="22" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </div>

          {/* Footer Link */}
          <div className="text-center text-sm text-[rgba(30,50,90,0.6)]">
            {isLogin ? (
              <>New user? <span onClick={() => { setIsLogin(false); setErrorMsg(""); setSuccessMsg(""); setPassword(""); }} className="text-[rgba(30,50,90,1)] hover:underline font-medium cursor-pointer">Register</span></>
            ) : (
              <>Already have an account? <span onClick={() => { setIsLogin(true); setErrorMsg(""); setSuccessMsg(""); setPassword(""); }} className="text-[rgba(30,50,90,1)] hover:underline font-medium cursor-pointer">Log in</span></>
            )}
          </div>

        </motion.div>
      </div>

    </main>
  );
}

// Subcomponents
function StepItem({ number, text, active }: { number: number, text: string, active?: boolean }) {
  if (active) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-xl bg-white text-[rgba(30,50,90,1)] border border-white/80 shadow-sm">
        <div className="w-8 h-8 rounded-full bg-[rgba(30,50,90,0.9)] text-white flex items-center justify-center text-sm font-medium">
          {number}
        </div>
        <span className="font-medium">{text}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-black/30 backdrop-blur-md text-white border border-white/20">
      <div className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center text-sm font-medium">
        {number}
      </div>
      <span className="font-medium text-white/90">{text}</span>
    </div>
  );
}

// Removed unused SocialButton component

function InputGroup({ label, placeholder, type, value, onChange }: { label: string, placeholder: string, type: string, value?: string, onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div className="flex flex-col space-y-1.5">
      <label className="text-sm font-medium text-[rgba(30,50,90,0.8)]">{label}</label>
      <input 
        type={type} 
        placeholder={placeholder} 
        value={value}
        onChange={onChange}
        className="bg-white/50 border border-white/40 shadow-sm rounded-xl h-11 px-4 text-[#1E325A] placeholder:text-[rgba(30,50,90,0.3)] focus:ring-2 focus:ring-[rgba(30,50,90,0.2)] focus:outline-none transition-all" 
      />
    </div>
  );
}
