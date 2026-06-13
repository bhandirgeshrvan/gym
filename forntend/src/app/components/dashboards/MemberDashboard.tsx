import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Dumbbell, CalendarCheck, QrCode, Flame, Award, Zap,
  CheckCircle, Circle, Plus
} from "lucide-react";
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from "recharts";
import {
  attendanceApi, paymentsApi, workoutsApi,
  type Attendance, type Payment, type WorkoutPlan, getSession
} from "@/api/client";

const DIET_TODAY = {
  calories: { current: 1840, target: 2500 },
  protein: { current: 142, target: 190, color: "#22C55E" },
  carbs: { current: 185, target: 250, color: "#F59E0B" },
  fats: { current: 58, target: 80, color: "#3B82F6" },
  meals: [
    { name: "Breakfast", time: "7:30 AM", items: "Oats, banana, protein shake", cal: 520, done: true },
    { name: "Lunch", time: "1:00 PM", items: "Chicken breast, brown rice, salad", cal: 680, done: true },
    { name: "Pre-workout", time: "4:00 PM", items: "Greek yogurt, almonds", cal: 280, done: false },
    { name: "Dinner", time: "8:00 PM", items: "Salmon, sweet potato, broccoli", cal: 720, done: false },
  ],
};
const WEIGHT_DATA = [
  { week: "W1", weight: 82 }, { week: "W2", weight: 81.2 }, { week: "W3", weight: 80.5 },
  { week: "W4", weight: 80.1 }, { week: "W5", weight: 79.4 }, { week: "W6", weight: 78.8 },
];

export function MemberDashboard({ activeSection, darkMode }: { activeSection: string; darkMode: boolean }) {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [workout, setWorkout] = useState<WorkoutPlan | null>(null);
  const [exercises, setExercises] = useState<{ name: string; sets: number; reps: string; weight: string; done: boolean }[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);

  const cardClass = `rounded-2xl border p-5 ${darkMode ? "bg-[#0F172A] border-white/6" : "bg-white border-slate-100 shadow-sm"}`;
  const textMuted = darkMode ? "text-slate-400" : "text-slate-500";
  const textMain = darkMode ? "text-white" : "text-slate-900";

  const session = getSession();
  const calPercent = Math.round((DIET_TODAY.calories.current / DIET_TODAY.calories.target) * 100);

  useEffect(() => {
    Promise.all([
      workoutsApi.list(),
      paymentsApi.list(),
    ]).then(([w, p]) => {
      if (w.length > 0) {
        setWorkout(w[0]);
        try {
          const parsed = JSON.parse(w[0].exercises);
          setExercises(parsed.map((e: any) => ({ ...e, done: false })));
        } catch { setExercises([]); }
      }
      setPayments(p.slice(0, 3));
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleCheckIn = async () => {
    setCheckingIn(true);
    try {
      // member_id 1 as placeholder — in production use session member profile id
      await attendanceApi.checkIn(1, "qr");
      alert("✅ Checked in successfully!");
    } catch (e: any) {
      alert(e.message);
    } finally {
      setCheckingIn(false);
    }
  };

  const toggleExercise = (idx: number) => {
    setExercises(prev => prev.map((e, i) => i === idx ? { ...e, done: !e.done } : e));
  };

  const doneCount = exercises.filter(e => e.done).length;

  // Build this-week attendance heatmap from API data
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weekAttendance = days.map(day => ({
    day,
    done: attendance.some(a => {
      const d = new Date(a.checked_in_at).toLocaleDateString("en", { weekday: "short" });
      return d === day;
    }),
  }));

  const MEMBER_STATS = [
    { label: "Streak", value: `${attendance.length} days`, icon: Flame, color: "text-orange-400", bg: "bg-orange-500/10" },
    { label: "This Month", value: `${attendance.length} sessions`, icon: CalendarCheck, color: "text-primary", bg: "bg-primary/10" },
    { label: "Calories Burned", value: "4,820", icon: Zap, color: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "Personal Records", value: "7 PRs", icon: Award, color: "text-purple-400", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className={`font-['Outfit',sans-serif] font-bold text-2xl ${textMain}`}>Hey, {session?.name?.split(" ")[0] || "there"}! 👋</h1>
          <p className={`text-sm ${textMuted}`}>Keep going — track your workout and nutrition today!</p>
        </div>
        <button
          onClick={handleCheckIn}
          disabled={checkingIn}
          className={`flex items-center gap-2 text-sm px-3 py-2 rounded-xl border disabled:opacity-60 ${darkMode ? "border-white/8 bg-primary/5 text-primary" : "border-primary/20 bg-primary/5 text-primary"}`}
        >
          <QrCode className="w-4 h-4" /> {checkingIn ? "Checking in..." : "Check-In Today"}
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {MEMBER_STATS.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className={cardClass}>
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div className={`font-['Outfit',sans-serif] font-bold text-xl ${textMain} mb-0.5`}>{s.value}</div>
            <div className={`text-xs ${textMuted}`}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-primary via-emerald-500 to-emerald-600 p-6 relative">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/70 text-xs font-medium mb-1">MEMBERSHIP STATUS</p>
              <h2 className="font-['Outfit',sans-serif] font-bold text-2xl text-white mb-1">Annual Plan</h2>
              <p className="text-white/80 text-sm">GymPulse · Active</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-xl p-2">
              <QrCode className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="flex items-center gap-6 mt-4">
            <div>
              <p className="text-white/60 text-xs">Member since</p>
              <p className="text-white font-semibold text-sm">Jan 2026</p>
            </div>
            <div>
              <p className="text-white/60 text-xs">Valid until</p>
              <p className="text-white font-semibold text-sm">Jun 2027</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`font-semibold ${textMain}`}>Today's Workout</h3>
              <p className={`text-xs ${textMuted}`}>{workout?.name || "No workout assigned"}</p>
            </div>
            <div className="text-right">
              <div className={`text-xs font-bold ${textMain}`}>{doneCount}/{exercises.length} done</div>
              <div className={`text-xs ${textMuted}`}>{workout?.duration_minutes || 0} min</div>
            </div>
          </div>
          <div className={`h-1.5 rounded-full ${darkMode ? "bg-white/10" : "bg-slate-200"} mb-4`}>
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: exercises.length ? `${(doneCount / exercises.length) * 100}%` : "0%" }} />
          </div>
          {exercises.length === 0 ? (
            <p className={`text-sm ${textMuted} text-center py-4`}>No exercises in this plan.</p>
          ) : (
            <div className="space-y-2">
              {exercises.map((ex, i) => (
                <button key={i} onClick={() => toggleExercise(i)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${ex.done ? darkMode ? "bg-primary/10" : "bg-green-50" : darkMode ? "bg-white/3" : "bg-slate-50"}`}>
                  {ex.done ? <CheckCircle className="w-4 h-4 text-primary shrink-0" /> : <Circle className="w-4 h-4 text-slate-400 shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <span className={`text-sm font-medium ${ex.done ? "text-primary line-through opacity-70" : textMain}`}>{ex.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 shrink-0">
                    <span>{ex.sets}×{ex.reps}</span>
                    <span className={`font-['JetBrains_Mono',monospace] font-semibold ${textMain}`}>{ex.weight}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`font-semibold ${textMain}`}>Today's Nutrition</h3>
              <p className={`text-xs ${textMuted}`}>{DIET_TODAY.calories.current} / {DIET_TODAY.calories.target} kcal</p>
            </div>
            <div className="relative w-16 h-16">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15" fill="none" stroke={darkMode ? "rgba(255,255,255,0.08)" : "#f1f5f9"} strokeWidth="3" />
                <circle cx="18" cy="18" r="15" fill="none" stroke="#22C55E" strokeWidth="3"
                  strokeDasharray={`${calPercent * 0.942} 94.2`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-xs font-bold ${textMain}`}>{calPercent}%</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[{ label: "Protein", ...DIET_TODAY.protein }, { label: "Carbs", ...DIET_TODAY.carbs }, { label: "Fats", ...DIET_TODAY.fats }].map(m => (
              <div key={m.label} className={`p-3 rounded-xl text-center ${darkMode ? "bg-white/3" : "bg-slate-50"}`}>
                <div className="font-semibold text-lg" style={{ color: m.color }}>{m.current}g</div>
                <div className={`text-xs ${textMuted}`}>{m.label}</div>
                <div className="text-xs text-slate-500">/ {m.target}g</div>
                <div className={`h-1 rounded-full mt-1.5 ${darkMode ? "bg-white/10" : "bg-slate-200"}`}>
                  <div className="h-full rounded-full" style={{ width: `${Math.min((m.current / m.target) * 100, 100)}%`, background: m.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {DIET_TODAY.meals.map((meal, i) => (
              <div key={i} className={`flex items-center gap-3 p-2.5 rounded-xl ${meal.done ? darkMode ? "bg-primary/8" : "bg-green-50" : darkMode ? "bg-white/3" : "bg-slate-50"}`}>
                {meal.done ? <CheckCircle className="w-4 h-4 text-primary shrink-0" /> : <Circle className="w-4 h-4 text-slate-400 shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-semibold ${textMain}`}>{meal.name} <span className="font-normal text-slate-500">· {meal.time}</span></div>
                  <div className={`text-xs ${textMuted} truncate`}>{meal.items}</div>
                </div>
                <span className={`text-xs font-semibold ${textMain} shrink-0`}>{meal.cal} kcal</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={cardClass}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={`font-semibold ${textMain}`}>Weight Progress</h3>
            <p className="text-xs text-primary font-medium">−3.2kg in 6 weeks 🎯</p>
          </div>
          <button className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Log Weight
          </button>
        </div>
        <ResponsiveContainer width="100%" height={150}>
          <AreaChart data={WEIGHT_DATA}>
            <defs>
              <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22C55E" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
            <YAxis domain={[77, 84]} tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}kg`} />
            <Tooltip contentStyle={{ background: darkMode ? "#0F172A" : "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} formatter={(v: number) => [`${v}kg`, "Weight"]} />
            <Area type="monotone" dataKey="weight" stroke="#22C55E" strokeWidth={2} fill="url(#wGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold ${textMain}`}>Payment History</h3>
          </div>
          {payments.length === 0 ? (
            <p className={`text-sm ${textMuted} text-center py-6`}>No payment records yet.</p>
          ) : (
            <div className="space-y-3">
              {payments.map(p => (
                <div key={p.id} className="flex items-start justify-between gap-3">
                  <div>
                    <div className={`text-sm font-medium ${textMain}`}>{p.description}</div>
                    <div className={`text-xs ${textMuted}`}>{new Date(p.paid_at).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })} · <span className="font-['JetBrains_Mono',monospace]">{p.invoice_number}</span></div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`font-semibold text-sm ${textMain}`}>${p.amount}</div>
                    <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-md">{p.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={cardClass}>
          <h3 className={`font-semibold ${textMain} mb-4`}>This Week's Attendance</h3>
          <div className="flex gap-2">
            {weekAttendance.map(d => (
              <div key={d.day} className="flex flex-col items-center gap-2 flex-1">
                <div className={`w-full aspect-square rounded-xl flex items-center justify-center ${d.done ? "bg-primary shadow-lg shadow-primary/25" : darkMode ? "bg-white/5" : "bg-slate-100"}`}>
                  {d.done && <CheckCircle className="w-4 h-4 text-white" />}
                </div>
                <span className={`text-xs ${textMuted}`}>{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
