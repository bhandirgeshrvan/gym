import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Users, Dumbbell, CalendarCheck, Star, ChevronRight, Plus,
  Clock, MoreHorizontal, MessageSquare
} from "lucide-react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar
} from "recharts";
import { membersApi, workoutsApi, type Member, type WorkoutPlan, getSession } from "@/api/client";

const SCHEDULE = [
  { time: "7:00 AM", member: "Emma Walsh", type: "Strength Training", duration: "60 min", status: "Completed" },
  { time: "9:00 AM", member: "Arjun Mehta", type: "Chest Day", duration: "60 min", status: "Completed" },
  { time: "11:00 AM", member: "Priya Sharma", type: "Cardio + Core", duration: "45 min", status: "Completed" },
  { time: "2:00 PM", member: "Arjun Mehta", type: "Back Day", duration: "60 min", status: "Upcoming" },
  { time: "5:00 PM", member: "Emma Walsh", type: "Yoga Flow", duration: "50 min", status: "Upcoming" },
];
const RADAR_DATA = [
  { subject: "Strength", A: 88 }, { subject: "Cardio", A: 75 }, { subject: "Flexibility", A: 70 },
  { subject: "Endurance", A: 82 }, { subject: "Nutrition", A: 90 }, { subject: "Recovery", A: 78 },
];

export function TrainerDashboard({ activeSection, darkMode }: { activeSection: string; darkMode: boolean }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState([
    { week: "W1", sessions: 6 }, { week: "W2", sessions: 8 }, { week: "W3", sessions: 7 },
    { week: "W4", sessions: 9 }, { week: "W5", sessions: 8 }, { week: "W6", sessions: 10 },
  ]);

  const cardClass = `rounded-2xl border p-5 ${darkMode ? "bg-[#0F172A] border-white/6" : "bg-white border-slate-100 shadow-sm"}`;
  const textMuted = darkMode ? "text-slate-400" : "text-slate-500";
  const textMain = darkMode ? "text-white" : "text-slate-900";

  const session = getSession();

  useEffect(() => {
    Promise.all([
      membersApi.list(),
      workoutsApi.list(),
    ]).then(([m, w]) => {
      setMembers(m);
      setWorkouts(w);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const KPI = [
    { label: "Assigned Members", value: members.length.toString(), icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { label: "Sessions Today", value: SCHEDULE.filter(s => s.status === "Upcoming").length.toString(), icon: CalendarCheck, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Avg Client Rating", value: "4.9★", icon: Star, color: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "Plans Created", value: workouts.length.toString(), icon: Dumbbell, color: "text-purple-400", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className={`font-['Outfit',sans-serif] font-bold text-2xl ${textMain}`}>Trainer Dashboard</h1>
          <p className={`text-sm ${textMuted}`}>Welcome back, Coach. You have {SCHEDULE.filter(s => s.status === "Upcoming").length} sessions today.</p>
        </div>
        <button className="flex items-center gap-2 text-sm bg-primary hover:bg-green-400 text-white px-4 py-2 rounded-xl font-medium transition-all">
          <Plus className="w-4 h-4" /> Create Workout
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI.map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className={cardClass}>
            <div className={`w-10 h-10 rounded-xl ${k.bg} flex items-center justify-center mb-3`}>
              <k.icon className={`w-5 h-5 ${k.color}`} />
            </div>
            <div className={`font-['Outfit',sans-serif] font-bold text-2xl ${textMain} mb-0.5`}>{k.value}</div>
            <div className={`text-xs ${textMuted}`}>{k.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        <div className={`${cardClass} lg:col-span-3`}>
          <h3 className={`font-semibold ${textMain} mb-4`}>Today's Schedule</h3>
          <div className="space-y-2">
            {SCHEDULE.map((s, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? "bg-white/3" : "bg-slate-50"}`}>
                <div className="text-right w-16 shrink-0">
                  <span className="font-['JetBrains_Mono',monospace] text-xs text-slate-500">{s.time}</span>
                </div>
                <div className={`w-2 h-2 rounded-full shrink-0 ${s.status === "Completed" ? "bg-primary" : "bg-amber-400"}`} />
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium ${textMain} truncate`}>{s.member}</div>
                  <div className={`text-xs ${textMuted}`}>{s.type} · {s.duration}</div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${s.status === "Completed" ? "bg-primary/10 text-primary" : "bg-amber-500/10 text-amber-400"}`}>
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className={`${cardClass} lg:col-span-2`}>
          <h3 className={`font-semibold ${textMain} mb-2`}>Avg Client Performance</h3>
          <p className={`text-xs ${textMuted} mb-3`}>Across all clients this month</p>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={RADAR_DATA}>
              <PolarGrid stroke={darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"} />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#94A3B8" }} />
              <PolarRadiusAxis tick={{ fontSize: 9, fill: "#94A3B8" }} domain={[0, 100]} />
              <Radar dataKey="A" stroke="#22C55E" fill="#22C55E" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={cardClass}>
        <h3 className={`font-semibold ${textMain} mb-4`}>Sessions Conducted (Last 6 Weeks)</h3>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={progressData}>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: darkMode ? "#0F172A" : "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
            <Bar dataKey="sessions" fill="#22C55E" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className={cardClass}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-semibold ${textMain}`}>My Members</h3>
          <span className={`text-xs ${textMuted}`}>{members.length} assigned</span>
        </div>
        {loading ? (
          <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className={`h-14 rounded-xl animate-pulse ${darkMode ? "bg-white/5" : "bg-slate-100"}`} />)}</div>
        ) : members.length === 0 ? (
          <p className={`text-sm ${textMuted} text-center py-6`}>No members assigned yet.</p>
        ) : (
          <div className="space-y-3">
            {members.slice(0, 5).map(m => (
              <div key={m.id} className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? "bg-white/3" : "bg-slate-50"}`}>
                <div className="w-9 h-9 rounded-xl bg-green-500 flex items-center justify-center text-white text-xs font-bold shrink-0">M{m.id}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${textMain}`}>Member #{m.user_id}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${m.status === "Active" ? "bg-primary/10 text-primary" : "bg-amber-500/10 text-amber-400"}`}>{m.status}</span>
                  </div>
                  <div className={`text-xs ${textMuted}`}>{m.membership_plan} · Expires {m.expiry_date ? new Date(m.expiry_date).toLocaleDateString("en", { month: "short", year: "numeric" }) : "—"}</div>
                </div>
                <button className={`p-1.5 rounded-lg ${darkMode ? "hover:bg-white/8" : "hover:bg-slate-200"} transition-colors`}>
                  <MessageSquare className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={cardClass}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-semibold ${textMain}`}>Workout Plans</h3>
          <button className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors">
            <Plus className="w-3.5 h-3.5" /> New Plan
          </button>
        </div>
        {workouts.length === 0 ? (
          <p className={`text-sm ${textMuted} text-center py-6`}>No workout plans created yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {workouts.slice(0, 4).map(w => {
              const exercises = (() => { try { return JSON.parse(w.exercises); } catch { return []; } })();
              return (
                <div key={w.id} className={`p-4 rounded-xl border ${darkMode ? "border-white/6 bg-white/3" : "border-slate-100 bg-slate-50"}`}>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h4 className={`font-medium text-sm ${textMain}`}>{w.name}</h4>
                    <button><MoreHorizontal className="w-4 h-4 text-slate-400 shrink-0" /></button>
                  </div>
                  <div className={`flex items-center gap-4 text-xs ${textMuted}`}>
                    <span className="flex items-center gap-1"><Dumbbell className="w-3 h-3" /> {exercises.length} exercises</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {w.duration_minutes} min</span>
                  </div>
                  <span className={`mt-2 inline-block text-xs px-2 py-0.5 rounded-full ${w.level === "Advanced" ? "bg-red-500/10 text-red-400" : w.level === "Intermediate" ? "bg-amber-500/10 text-amber-400" : "bg-primary/10 text-primary"}`}>{w.level}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
