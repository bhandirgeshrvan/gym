import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Dumbbell, Zap, Users, BarChart3, Shield, Clock, Star, CheckCircle,
  ChevronDown, ChevronRight, Play, ArrowRight, Phone, Mail, MapPin,
  Instagram, Twitter, Facebook, Youtube, Menu, X, Sparkles, TrendingUp,
  Award, Heart, Target, Cpu, MessageCircle, Calendar, QrCode
} from "lucide-react";

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

const NAV_LINKS = ["Features", "Pricing", "Trainers", "About", "Contact"];

const FEATURES = [
  { icon: Users, title: "Multi-Role Access", desc: "Separate dashboards for admins, gym owners, trainers, and members with granular RBAC permissions.", color: "from-green-500/20 to-green-500/5" },
  { icon: QrCode, title: "Smart Attendance", desc: "QR code, RFID, and manual check-in with real-time tracking and monthly analytics.", color: "from-amber-500/20 to-amber-500/5" },
  { icon: Dumbbell, title: "Workout Management", desc: "AI-powered workout builder with exercise library, video guides, and progress tracking.", color: "from-blue-500/20 to-blue-500/5" },
  { icon: Heart, title: "Diet & Nutrition", desc: "Personalized meal plans with macro tracking, calorie counting, and dietary insights.", color: "from-rose-500/20 to-rose-500/5" },
  { icon: BarChart3, title: "Analytics & Reports", desc: "Revenue trends, member retention, trainer performance, and attendance heatmaps.", color: "from-purple-500/20 to-purple-500/5" },
  { icon: Cpu, title: "AI-Powered Insights", desc: "AI workout generator, diet planner, churn prediction, and smart health recommendations.", color: "from-cyan-500/20 to-cyan-500/5" },
  { icon: Shield, title: "Secure Payments", desc: "Stripe, Razorpay & PayPal integration with auto-renewal, invoicing, and GST support.", color: "from-emerald-500/20 to-emerald-500/5" },
  { icon: MessageCircle, title: "Notifications Hub", desc: "Email, SMS, Push, and WhatsApp alerts for renewals, reminders, and milestones.", color: "from-orange-500/20 to-orange-500/5" },
];

const PLANS = [
  {
    name: "Starter",
    price: 29,
    desc: "Perfect for small gyms just getting started",
    members: "Up to 100 members",
    features: ["1 gym location", "Basic attendance tracking", "Member profiles", "Payment processing", "Email notifications", "Mobile app access"],
    cta: "Start Free Trial",
    popular: false,
    color: "border-border",
  },
  {
    name: "Pro",
    price: 79,
    desc: "For growing gyms that need more power",
    members: "Up to 500 members",
    features: ["3 gym locations", "Advanced analytics", "Workout management", "Diet plans", "AI insights", "WhatsApp notifications", "Trainer dashboards", "Priority support"],
    cta: "Start Free Trial",
    popular: true,
    color: "border-primary",
  },
  {
    name: "Enterprise",
    price: 199,
    desc: "Unlimited scale for gym chains & franchises",
    members: "Unlimited members",
    features: ["Unlimited locations", "White-label branding", "Custom integrations", "Dedicated support", "SLA guarantee", "Advanced CRM", "API access", "Custom reports"],
    cta: "Contact Sales",
    popular: false,
    color: "border-border",
  },
];

const TESTIMONIALS = [
  { name: "Arjun Mehta", role: "Owner, FitLife Gym", avatar: "AM", rating: 5, text: "GymPulse transformed how we run our 3 locations. Revenue is up 40% and member retention has never been better. The AI insights are genuinely useful.", bg: "bg-green-500" },
  { name: "Priya Sharma", role: "Head Trainer, Sculpt Studio", avatar: "PS", rating: 5, text: "The trainer dashboard makes it so easy to manage all my clients' workout and diet plans. I save 2 hours every day on admin work.", bg: "bg-blue-500" },
  { name: "Marcus Johnson", role: "Member, PowerHouse Gym", avatar: "MJ", rating: 5, text: "QR check-in is seamless, my workout plans are always updated, and I love tracking my progress. Best gym experience I've had.", bg: "bg-amber-500" },
  { name: "Sneha Patel", role: "GM, CoreFit Chain", avatar: "SP", rating: 5, text: "Running 8 gyms across two cities used to be a nightmare. Now with the super admin view, everything is in one place and fully transparent.", bg: "bg-purple-500" },
];

const TRAINERS = [
  { name: "Coach Alex Rivera", specialty: "Strength & Conditioning", experience: "12 years", members: 47, img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop&auto=format", rating: 4.9 },
  { name: "Coach Divya Nair", specialty: "Yoga & Mindfulness", experience: "8 years", members: 63, img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&auto=format", rating: 4.8 },
  { name: "Coach Raj Kumar", specialty: "CrossFit & HIIT", experience: "10 years", members: 52, img: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&h=400&fit=crop&auto=format", rating: 4.9 },
  { name: "Coach Emma Walsh", specialty: "Nutrition & Weight Loss", experience: "6 years", members: 38, img: "https://images.unsplash.com/photo-1550345332-09e3ac987658?w=400&h=400&fit=crop&auto=format", rating: 4.7 },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Register Your Gym", desc: "Sign up in minutes, add your gym details, set up membership plans, and invite your team.", icon: Target },
  { step: "02", title: "Onboard Members", desc: "Members join via web or app. Assign trainers, set workout & diet plans, issue QR codes.", icon: Users },
  { step: "03", title: "Track & Optimize", desc: "Monitor attendance, revenue, and fitness progress with real-time analytics and AI insights.", icon: TrendingUp },
  { step: "04", title: "Scale Effortlessly", desc: "Add locations, trainers, and members without limits. Franchise management built in.", icon: Award },
];

const FAQS = [
  { q: "Is there a free trial?", a: "Yes! Every plan comes with a 14-day free trial. No credit card required." },
  { q: "Can I manage multiple gym locations?", a: "Absolutely. The Pro plan supports up to 3 locations, and Enterprise supports unlimited locations with centralized management." },
  { q: "What payment gateways are supported?", a: "We support Stripe, Razorpay, and PayPal with auto-renewal, invoicing, GST, and refund management built in." },
  { q: "Is there a mobile app for members?", a: "Yes. Members get a fully responsive web app and native mobile experience with QR check-in, workout plans, and progress tracking." },
  { q: "How does the AI workout generator work?", a: "Our AI analyzes member goals, fitness level, available equipment, and progress history to generate personalized, progressive workout plans." },
  { q: "Is my data secure?", a: "Yes. We use JWT with refresh tokens, rate limiting, CSRF/XSS protection, encrypted data at rest, and SOC 2 compliant infrastructure." },
];

const SUCCESS_STORIES = [
  { metric: "40%", label: "Revenue Increase", desc: "Average revenue growth within 3 months of switching to GymPulse." },
  { metric: "2.3x", label: "Member Retention", desc: "Gyms using our notification system retain 2.3x more members annually." },
  { metric: "5hrs", label: "Saved Per Week", desc: "Trainers save an average of 5 hours weekly on admin and scheduling." },
  { metric: "98%", label: "Uptime SLA", desc: "Enterprise-grade reliability with 99.9% uptime and 24/7 support." },
];

export function LandingPage({ onNavigate }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [billingAnnual, setBillingAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B1120] text-white font-['Inter',sans-serif] overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0B1120]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Dumbbell className="w-4 h-4 text-white" />
              </div>
              <span className="font-['Outfit',sans-serif] font-bold text-xl">GymPulse</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="text-sm text-slate-400 hover:text-white transition-colors">{l}</a>
              ))}
            </div>
            <div className="hidden md:flex items-center gap-3">
              <button onClick={() => onNavigate("auth")} className="text-sm text-slate-400 hover:text-white transition-colors px-4 py-2">Log In</button>
              <button onClick={() => onNavigate("auth")} className="text-sm bg-primary hover:bg-green-400 text-white px-4 py-2 rounded-xl font-medium transition-all">Start Free Trial</button>
            </div>
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/5 bg-[#0B1120] px-4 py-4 flex flex-col gap-4">
            {NAV_LINKS.map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} className="text-slate-300">{l}</a>
            ))}
            <button onClick={() => onNavigate("auth")} className="w-full bg-primary text-white py-2 rounded-xl font-medium">Get Started</button>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&h=1080&fit=crop&auto=format"
            alt="Modern gym interior with equipment"
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1120]/60 via-[#0B1120]/80 to-[#0B1120]" />
        </div>
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary font-medium">Now with AI-powered coaching</span>
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="font-['Outfit',sans-serif] font-black text-5xl sm:text-6xl lg:text-7xl leading-tight mb-6"
            >
              The{" "}
              <span className="bg-gradient-to-r from-primary to-emerald-300 bg-clip-text text-transparent">
                All-in-One
              </span>{" "}
              Gym Management Platform
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto"
            >
              GymPulse gives you everything to run, grow, and scale your fitness business — member management, workouts, nutrition, payments, and AI insights in one platform.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={() => onNavigate("auth")}
                className="flex items-center justify-center gap-2 bg-primary hover:bg-green-400 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105"
              >
                Start Free Trial <ArrowRight className="w-5 h-5" />
              </button>
              <button className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all">
                <Play className="w-5 h-5 fill-white" /> Watch Demo
              </button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500"
            >
              {["No credit card required", "14-day free trial", "Cancel anytime"].map(t => (
                <div key={t} className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-primary" /> {t}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Hero Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { value: "5,000+", label: "Gyms Worldwide" },
              { value: "2M+", label: "Active Members" },
              { value: "98.9%", label: "Uptime SLA" },
              { value: "4.9★", label: "App Rating" },
            ].map(({ value, label }) => (
              <div key={label} className="bg-white/5 backdrop-blur border border-white/8 rounded-2xl p-5 text-center">
                <div className="font-['Outfit',sans-serif] font-bold text-3xl text-primary mb-1">{value}</div>
                <div className="text-sm text-slate-400">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-[#080E1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-4">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Powerful Features</span>
            </div>
            <h2 className="font-['Outfit',sans-serif] font-black text-4xl sm:text-5xl mb-4">
              Everything your gym needs,
              <br />
              <span className="bg-gradient-to-r from-primary to-emerald-300 bg-clip-text text-transparent">nothing you don't</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">Built for modern fitness businesses, from boutique studios to enterprise chains.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }} viewport={{ once: true }}
                className="group bg-[#0F172A] border border-white/6 rounded-2xl p-6 hover:border-primary/30 transition-all hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4`}>
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-['Outfit',sans-serif] font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-[#0B1120]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-['Outfit',sans-serif] font-black text-4xl sm:text-5xl mb-4">
              Up and running in{" "}
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">4 simple steps</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="relative"
              >
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 right-0 w-full h-px bg-gradient-to-r from-primary/30 to-transparent translate-x-1/2" />
                )}
                <div className="bg-[#0F172A] border border-white/6 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-['JetBrains_Mono',monospace] text-xs text-primary font-bold">{s.step}</span>
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <s.icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-['Outfit',sans-serif] font-semibold text-lg mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-400">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-[#0B1120] to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-['Outfit',sans-serif] font-black text-4xl sm:text-5xl mb-4">Proven Results</h2>
            <p className="text-slate-400">Real numbers from gyms using GymPulse</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {SUCCESS_STORIES.map((s, i) => (
              <motion.div
                key={s.metric}
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="text-center bg-[#0F172A] border border-white/6 rounded-2xl p-6"
              >
                <div className="font-['Outfit',sans-serif] font-black text-4xl text-primary mb-1">{s.metric}</div>
                <div className="font-semibold text-white mb-2">{s.label}</div>
                <p className="text-xs text-slate-500">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-[#080E1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-['Outfit',sans-serif] font-black text-4xl sm:text-5xl mb-4">
              Simple,{" "}
              <span className="bg-gradient-to-r from-primary to-emerald-300 bg-clip-text text-transparent">transparent pricing</span>
            </h2>
            <p className="text-slate-400 mb-6">No hidden fees. Cancel anytime.</p>
            <div className="inline-flex items-center bg-[#0F172A] border border-white/6 rounded-xl p-1">
              <button
                onClick={() => setBillingAnnual(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!billingAnnual ? "bg-primary text-white" : "text-slate-400"}`}
              >Monthly</button>
              <button
                onClick={() => setBillingAnnual(true)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${billingAnnual ? "bg-primary text-white" : "text-slate-400"}`}
              >Annual <span className="text-xs text-amber-400 ml-1">−20%</span></button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className={`relative bg-[#0F172A] border rounded-2xl p-8 ${plan.popular ? "border-primary shadow-lg shadow-primary/20" : "border-white/6"}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="font-['Outfit',sans-serif] font-bold text-xl mb-1">{plan.name}</h3>
                <p className="text-slate-400 text-sm mb-4">{plan.desc}</p>
                <div className="mb-2">
                  <span className="font-['Outfit',sans-serif] font-black text-4xl">${billingAnnual ? Math.round(plan.price * 0.8) : plan.price}</span>
                  <span className="text-slate-400 text-sm">/mo</span>
                </div>
                <p className="text-xs text-slate-500 mb-6">{plan.members}</p>
                <button
                  onClick={() => onNavigate("auth")}
                  className={`w-full py-3 rounded-xl font-semibold transition-all mb-6 ${plan.popular ? "bg-primary hover:bg-green-400 text-white" : "bg-white/5 hover:bg-white/10 text-white border border-white/10"}`}
                >{plan.cta}</button>
                <ul className="space-y-3">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-primary shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trainers */}
      <section id="trainers" className="py-24 bg-[#0B1120]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-['Outfit',sans-serif] font-black text-4xl sm:text-5xl mb-4">
              Elite Trainer Network
            </h2>
            <p className="text-slate-400">Connect your members with certified, experienced coaches</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRAINERS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="group bg-[#0F172A] border border-white/6 rounded-2xl overflow-hidden hover:border-primary/30 transition-all"
              >
                <div className="relative h-56 bg-slate-800 overflow-hidden">
                  <img src={t.img} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] to-transparent" />
                  <div className="absolute bottom-3 left-3 bg-primary/90 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
                    ⭐ {t.rating}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-['Outfit',sans-serif] font-semibold text-base mb-1">{t.name}</h3>
                  <p className="text-primary text-xs font-medium mb-2">{t.specialty}</p>
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>{t.experience} exp.</span>
                    <span>{t.members} members</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-[#080E1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-['Outfit',sans-serif] font-black text-4xl sm:text-5xl mb-4">
              Loved by gym operators{" "}
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">worldwide</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="bg-[#0F172A] border border-white/6 rounded-2xl p-6"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 mb-5 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${t.bg} flex items-center justify-center text-white text-sm font-bold`}>{t.avatar}</div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-slate-400 text-xs">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-[#0B1120]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-['Outfit',sans-serif] font-black text-4xl sm:text-5xl mb-4">Frequently Asked</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-[#0F172A] border border-white/6 rounded-2xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-medium">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-4 text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 bg-[#080E1A]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="font-['Outfit',sans-serif] font-black text-4xl mb-4">Get in touch</h2>
              <p className="text-slate-400 mb-8">Have questions? Our team is ready to help you get the most from GymPulse.</p>
              <div className="space-y-4">
                {[
                  { icon: Mail, label: "hello@gympulse.io" },
                  { icon: Phone, label: "+1 (800) 555-GYM1" },
                  { icon: MapPin, label: "San Francisco, CA" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3 text-slate-300">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    {label}
                  </div>
                ))}
              </div>
            </div>
            <form className="space-y-4" onSubmit={e => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" className="bg-[#0F172A] border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors" />
                <input type="text" placeholder="Last Name" className="bg-[#0F172A] border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors" />
              </div>
              <input type="email" placeholder="Email Address" className="w-full bg-[#0F172A] border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors" />
              <textarea rows={4} placeholder="Your message..." className="w-full bg-[#0F172A] border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors resize-none" />
              <button type="submit" className="w-full bg-primary hover:bg-green-400 text-white py-3 rounded-xl font-semibold transition-all">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-gradient-to-r from-primary/20 via-[#0B1120] to-amber-500/10 border-y border-white/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-['Outfit',sans-serif] font-black text-4xl sm:text-5xl mb-4">
            Ready to transform your gym?
          </h2>
          <p className="text-slate-400 mb-8">Join 5,000+ gyms already using GymPulse to grow their business.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => onNavigate("auth")} className="flex items-center justify-center gap-2 bg-primary hover:bg-green-400 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all shadow-lg shadow-primary/25">
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </button>
            <button className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all">
              <Calendar className="w-5 h-5" /> Book a Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#060C16] py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Dumbbell className="w-4 h-4 text-white" />
                </div>
                <span className="font-['Outfit',sans-serif] font-bold text-xl">GymPulse</span>
              </div>
              <p className="text-slate-400 text-sm mb-4 max-w-xs">The all-in-one gym management platform for modern fitness businesses.</p>
              <div className="flex gap-3">
                {[Twitter, Instagram, Facebook, Youtube].map((Icon, i) => (
                  <div key={i} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center cursor-pointer transition-colors">
                    <Icon className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
            {[
              { title: "Product", links: ["Features", "Pricing", "Integrations", "Changelog", "Roadmap"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Press", "Partners"] },
              { title: "Legal", links: ["Privacy", "Terms", "Security", "GDPR", "Cookies"] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="font-semibold text-sm mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map(l => (
                    <li key={l}><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">© 2026 GymPulse Inc. All rights reserved.</p>
            <p className="text-slate-600 text-xs">Built with ❤️ for fitness professionals worldwide</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
