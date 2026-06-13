import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Dumbbell, Mail, Lock, User, Eye, EyeOff, ArrowLeft, Shield, Crown, Dumbbell as DumbbellIcon, Users, ChevronRight, Sparkles } from "lucide-react";
import { authApi, saveSession } from "@/api/client";

type AuthMode = "login" | "register" | "forgot";
type Role = "super_admin" | "gym_owner" | "trainer" | "member";

interface AuthPageProps {
  onNavigate: (page: string, role?: Role) => void;
}

const ROLES = [
  { id: "super_admin" as Role, label: "Super Admin", desc: "Platform administrator", icon: Crown, color: "from-purple-500 to-purple-600", bg: "bg-purple-500/10 border-purple-500/20 hover:border-purple-500/50" },
  { id: "gym_owner" as Role, label: "Gym Owner", desc: "Manage your gym", icon: Shield, color: "from-amber-500 to-orange-500", bg: "bg-amber-500/10 border-amber-500/20 hover:border-amber-500/50" },
  { id: "trainer" as Role, label: "Trainer", desc: "Coach your members", icon: DumbbellIcon, color: "from-blue-500 to-blue-600", bg: "bg-blue-500/10 border-blue-500/20 hover:border-blue-500/50" },
  { id: "member" as Role, label: "Member", desc: "Track your fitness", icon: Users, color: "from-green-500 to-emerald-600", bg: "bg-green-500/10 border-green-500/20 hover:border-green-500/50" },
];

export function AuthPage({ onNavigate }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [selectedRole, setSelectedRole] = useState<Role>("gym_owner");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<"role" | "form">("role");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  const handleLogin = async () => {
    setError("");
    setSubmitted(true);
    try {
      const token = await authApi.login(email, password, selectedRole);
      saveSession(token);
      onNavigate("dashboard", selectedRole);
    } catch (e: any) {
      setError(e.message || "Login failed");
      setSubmitted(false);
    }
  };

  const handleRegister = async () => {
    setError("");
    setSubmitted(true);
    try {
      const token = await authApi.register(firstName, lastName, email, password, selectedRole);
      saveSession(token);
      onNavigate("dashboard", selectedRole);
    } catch (e: any) {
      setError(e.message || "Registration failed");
      setSubmitted(false);
    }
  };

  const handleForgot = async () => {
    setError("");
    try {
      await authApi.forgotPassword(email);
      setForgotSent(true);
    } catch (e: any) {
      setError(e.message || "Failed to send reset link");
    }
  };

  const selectedRoleData = ROLES.find(r => r.id === selectedRole)!;

  return (
    <div className="min-h-screen bg-[#0B1120] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&h=1200&fit=crop&auto=format"
          alt="Gym training"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B1120]/80 via-primary/10 to-[#0B1120]/60" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <span className="font-['Outfit',sans-serif] font-bold text-2xl">GymPulse</span>
          </div>
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary">Trusted by 5,000+ gyms</span>
            </div>
            <h2 className="font-['Outfit',sans-serif] font-black text-4xl leading-tight mb-4">
              Manage your gym<br />smarter with AI
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              From attendance to analytics, workouts to payments — GymPulse handles it all.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {["5,000+ Gyms", "2M+ Members", "98.9% Uptime", "AI-Powered"].map(s => (
                <div key={s} className="flex items-center gap-2 text-sm text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <button
            onClick={() => onNavigate("landing")}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to home
          </button>

          <AnimatePresence mode="wait">
            {mode === "login" && (
              <motion.div key="login" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h1 className="font-['Outfit',sans-serif] font-bold text-3xl text-white mb-1">Welcome back</h1>
                <p className="text-slate-400 mb-8">Sign in to your GymPulse account</p>

                {/* Role selection */}
                <div className="mb-6">
                  <label className="text-sm text-slate-400 mb-3 block">Sign in as</label>
                  <div className="grid grid-cols-2 gap-2">
                    {ROLES.map(role => (
                      <button
                        key={role.id}
                        onClick={() => setSelectedRole(role.id)}
                        className={`flex items-center gap-2 p-3 rounded-xl border transition-all text-left ${selectedRole === role.id
                          ? `bg-gradient-to-br ${role.color} border-transparent text-white`
                          : `bg-[#0F172A] border-white/8 text-slate-300 hover:border-white/20`
                          }`}
                      >
                        <role.icon className="w-4 h-4 shrink-0" />
                        <div>
                          <div className="text-xs font-semibold">{role.label}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-slate-400 mb-1.5 block">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@gym.com"
                        className="w-full bg-[#0F172A] border border-white/8 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-1.5 block">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#0F172A] border border-white/8 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors"
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
                      <input type="checkbox" className="rounded" /> Remember me
                    </label>
                    <button onClick={() => setMode("forgot")} className="text-sm text-primary hover:text-green-400 transition-colors">
                      Forgot password?
                    </button>
                  </div>
                  {error && <p className="text-red-400 text-xs text-center">{error}</p>}
                  <button
                    onClick={handleLogin}
                    disabled={submitted}
                    className="w-full bg-primary hover:bg-green-400 disabled:opacity-70 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    {submitted ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
                    ) : (
                      <>Sign In <ChevronRight className="w-4 h-4" /></>
                    )}
                  </button>

                  <div className="relative flex items-center gap-3 my-2">
                    <div className="flex-1 h-px bg-white/8" />
                    <span className="text-slate-500 text-xs">or continue with</span>
                    <div className="flex-1 h-px bg-white/8" />
                  </div>

                  <button className="w-full flex items-center justify-center gap-3 bg-[#0F172A] border border-white/8 hover:border-white/20 text-white py-3 rounded-xl text-sm font-medium transition-all">
                    <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    Continue with Google
                  </button>
                </div>

                <p className="text-center text-sm text-slate-400 mt-6">
                  No account?{" "}
                  <button onClick={() => setMode("register")} className="text-primary hover:text-green-400 font-medium transition-colors">
                    Create one free
                  </button>
                </p>
              </motion.div>
            )}

            {mode === "register" && (
              <motion.div key="register" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h1 className="font-['Outfit',sans-serif] font-bold text-3xl text-white mb-1">Create account</h1>
                <p className="text-slate-400 mb-6">Start your 14-day free trial</p>

                <div className="mb-6">
                  <label className="text-sm text-slate-400 mb-3 block">I am a</label>
                  <div className="grid grid-cols-2 gap-2">
                    {ROLES.map(role => (
                      <button
                        key={role.id}
                        onClick={() => setSelectedRole(role.id)}
                        className={`flex items-center gap-2 p-3 rounded-xl border transition-all text-left ${selectedRole === role.id
                          ? `bg-gradient-to-br ${role.color} border-transparent text-white`
                          : `bg-[#0F172A] border-white/8 text-slate-300 hover:border-white/20`
                          }`}
                      >
                        <role.icon className="w-4 h-4 shrink-0" />
                        <div>
                          <div className="text-xs font-semibold">{role.label}</div>
                          <div className="text-xs opacity-70">{role.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-slate-400 mb-1.5 block">First Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Alex" className="w-full bg-[#0F172A] border border-white/8 rounded-xl pl-9 pr-3 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-slate-400 mb-1.5 block">Last Name</label>
                      <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Rivera" className="w-full bg-[#0F172A] border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-1.5 block">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input type="email" placeholder="you@gym.com" className="w-full bg-[#0F172A] border border-white/8 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-1.5 block">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input type={showPassword ? "text" : "password"} placeholder="Min 8 characters" className="w-full bg-[#0F172A] border border-white/8 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors" />
                      <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <label className="flex items-start gap-2 text-sm text-slate-400 cursor-pointer">
                    <input type="checkbox" className="mt-0.5 rounded" />
                    I agree to GymPulse's <span className="text-primary hover:underline">Terms of Service</span> and <span className="text-primary hover:underline">Privacy Policy</span>
                  </label>
                  {error && <p className="text-red-400 text-xs text-center">{error}</p>}
                  <button
                    onClick={handleRegister}
                    disabled={submitted}
                    className="w-full bg-primary hover:bg-green-400 disabled:opacity-70 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    {submitted ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating...</>
                    ) : "Create Account — Free 14 days"}
                  </button>
                </div>

                <p className="text-center text-sm text-slate-400 mt-6">
                  Already have an account?{" "}
                  <button onClick={() => setMode("login")} className="text-primary hover:text-green-400 font-medium transition-colors">
                    Sign in
                  </button>
                </p>
              </motion.div>
            )}

            {mode === "forgot" && (
              <motion.div key="forgot" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h1 className="font-['Outfit',sans-serif] font-bold text-3xl text-white mb-1">Reset password</h1>
                <p className="text-slate-400 mb-8">Enter your email and we'll send reset instructions.</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-slate-400 mb-1.5 block">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input type="email" placeholder="you@gym.com" className="w-full bg-[#0F172A] border border-white/8 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors" />
                    </div>
                  </div>
                  {forgotSent && <p className="text-primary text-xs text-center">Reset link sent! Check your inbox.</p>}
                  {error && <p className="text-red-400 text-xs text-center">{error}</p>}
                  <button onClick={handleForgot} className="w-full bg-primary hover:bg-green-400 text-white py-3 rounded-xl font-semibold transition-all">
                    Send Reset Link
                  </button>
                </div>
                <p className="text-center text-sm text-slate-400 mt-6">
                  Remember your password?{" "}
                  <button onClick={() => setMode("login")} className="text-primary hover:text-green-400 font-medium transition-colors">
                    Sign in
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
