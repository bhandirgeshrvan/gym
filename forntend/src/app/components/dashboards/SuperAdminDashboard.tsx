import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Building2, Users, DollarSign, TrendingUp,
  Eye, ArrowUpRight, ArrowDownRight, Globe, Filter
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { dashboardApi, gymsApi, type Gym, type SuperAdminStats } from "@/api/client";

const REVENUE_DATA = [
  { month: "Jan", revenue: 520 }, { month: "Feb", revenue: 590 },
  { month: "Mar", revenue: 630 }, { month: "Apr", revenue: 710 },
  { month: "May", revenue: 760 }, { month: "Jun", revenue: 847 },
];
const REGISTRATIONS_DATA = [
  { week: "W1", new: 82 }, { week: "W2", new: 97 }, { week: "W3", new: 74 },
  { week: "W4", new: 113 }, { week: "W5", new: 89 }, { week: "W6", new: 125 },
];
const PLAN_DIST = [
  { name: "Enterprise", value: 15, color: "#8B5CF6" },
  { name: "Pro", value: 45, color: "#22C55E" },
  { name: "Starter", value: 40, color: "#F59E0B" },
];
const TICKETS = [
  { id: "#T-1042", subject: "Payment gateway issue", gym: "IronWill Fitness", priority: "High", status: "Open", time: "2h ago" },
  { id: "#T-1041", subject: "Member data export request", gym: "CoreFit Studios", priority: "Medium", status: "In Progress", time: "5h ago" },
  { id: "#T-1040", subject: "Trainer onboarding help", gym: "Zen Flow Studio", priority: "Low", status: "Resolved", time: "1d ago" },
];

export function SuperAdminDashboard({ activeSection, darkMode }: { activeSection: string; darkMode: boolean }) {
  const [stats, setStats] = useState<SuperAdminStats | null>(null);
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(true);

  const cardClass = `rounded-2xl border p-5 ${darkMode ? "bg-[#0F172A] border-white/6" : "bg-white border-slate-100 shadow-sm"}`;
  const textMuted = darkMode ? "text-slate-400" : "text-slate-500";
  const textMain = darkMode ? "text-white" : "text-slate-900";

  useEffect(() => {
    Promise.all([dashboardApi.superAdmin(), gymsApi.list()])
      .then(([s, g]) => { setStats(s); setGyms(g); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const KPI_DATA = stats ? [
    { label: "Total Gyms", value: stats.total_gyms.toLocaleString(), change: "+12%", up: true, icon: Building2, color: "bg-purple-500/10 text-purple-400" },
    { label: "Active Users", value: stats.active_users.toLocaleString(), change: "+8.4%", up: true, icon: Users, color: "bg-primary/10 text-primary" },
    { label: "Monthly Revenue", value: `$${(stats.monthly_revenue / 1000).toFixed(0)}K`, change: "+23%", up: true, icon: DollarSign, color: "bg-amber-500/10 text-amber-400" },
    { label: "Churn Rate", value: `${stats.churn_rate}%`, change: "-0.5%", up: false, icon: TrendingUp, color: "bg-red-500/10 text-red-400" },
  ] : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`font-['Outfit',sans-serif] font-bold text-2xl ${textMain}`}>Platform Overview</h1>
          <p className={`text-sm ${textMuted}`}>Welcome back. Here's what's happening across all gyms.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className={`flex items-center gap-2 text-sm px-3 py-2 rounded-xl border transition-colors ${darkMode ? "border-white/8 text-slate-300 hover:bg-white/5" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center gap-2 text-sm bg-primary hover:bg-green-400 text-white px-4 py-2 rounded-xl font-medium transition-all">
            <Globe className="w-4 h-4" /> Add Gym
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className={`${cardClass} h-28 animate-pulse`} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {KPI_DATA.map((k, i) => (
            <motion.div key={k.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className={cardClass}>
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${k.color} flex items-center justify-center`}>
                  <k.icon className="w-5 h-5" />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-semibold ${k.up ? "text-primary" : "text-red-400"}`}>
                  {k.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />} {k.change}
                </span>
              </div>
              <div className={`font-['Outfit',sans-serif] font-bold text-2xl ${textMain} mb-0.5`}>{k.value}</div>
              <div className={`text-xs ${textMuted}`}>{k.label}</div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-4">
        <div className={`${cardClass} lg:col-span-2`}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className={`font-semibold ${textMain}`}>Revenue Growth</h3>
              <p className={`text-xs ${textMuted}`}>Monthly recurring revenue ($K)</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={REVENUE_DATA}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: darkMode ? "#0F172A" : "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} labelStyle={{ color: darkMode ? "#F8FAFC" : "#0F172A" }} />
              <Area type="monotone" dataKey="revenue" stroke="#22C55E" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className={cardClass}>
          <h3 className={`font-semibold ${textMain} mb-4`}>Subscription Plans</h3>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={PLAN_DIST} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={4} dataKey="value">
                {PLAN_DIST.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-3">
            {PLAN_DIST.map(p => (
              <div key={p.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                  <span className={textMuted}>{p.name}</span>
                </div>
                <span className={`font-semibold ${textMain}`}>{p.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={cardClass}>
        <h3 className={`font-semibold ${textMain} mb-5`}>New Gym Registrations</h3>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={REGISTRATIONS_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: darkMode ? "#0F172A" : "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
            <Bar dataKey="new" fill="#22C55E" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className={cardClass}>
        <div className="flex items-center justify-between mb-5">
          <h3 className={`font-semibold ${textMain}`}>All Gyms</h3>
          <span className={`text-xs ${textMuted}`}>{gyms.length} total</span>
        </div>
        {gyms.length === 0 && !loading ? (
          <p className={`text-sm ${textMuted} text-center py-6`}>No gyms registered yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`text-xs ${textMuted} border-b ${darkMode ? "border-white/6" : "border-slate-100"}`}>
                  {["Gym Name", "Location", "Plan", "Status", ""].map(h => (
                    <th key={h} className="text-left pb-3 pr-4 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {gyms.map(g => (
                  <tr key={g.id} className={`border-b last:border-0 ${darkMode ? "border-white/4" : "border-slate-50"}`}>
                    <td className={`py-3 pr-4 font-medium ${textMain}`}>{g.name}</td>
                    <td className={`py-3 pr-4 ${textMuted}`}>{g.location}</td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${g.plan === "Enterprise" ? "bg-purple-500/10 text-purple-400" : g.plan === "Pro" ? "bg-primary/10 text-primary" : "bg-amber-500/10 text-amber-400"}`}>{g.plan}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${g.is_active ? "bg-primary/10 text-primary" : "bg-red-500/10 text-red-400"}`}>{g.is_active ? "Active" : "Suspended"}</span>
                    </td>
                    <td className="py-3">
                      <button className={`p-1.5 rounded-lg ${darkMode ? "hover:bg-white/5" : "hover:bg-slate-100"} transition-colors`}>
                        <Eye className="w-4 h-4 text-slate-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className={cardClass}>
        <div className="flex items-center justify-between mb-5">
          <h3 className={`font-semibold ${textMain}`}>Support Tickets</h3>
          <span className="text-xs bg-red-500/10 text-red-400 px-2 py-1 rounded-full font-medium">7 open</span>
        </div>
        <div className="space-y-3">
          {TICKETS.map(t => (
            <div key={t.id} className={`flex items-center justify-between p-3 rounded-xl ${darkMode ? "bg-white/3" : "bg-slate-50"}`}>
              <div className="flex items-center gap-3">
                <span className="font-['JetBrains_Mono',monospace] text-xs text-slate-500">{t.id}</span>
                <div>
                  <div className={`text-sm font-medium ${textMain}`}>{t.subject}</div>
                  <div className={`text-xs ${textMuted}`}>{t.gym} · {t.time}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${t.priority === "High" ? "bg-red-500/10 text-red-400" : t.priority === "Medium" ? "bg-amber-500/10 text-amber-400" : "bg-slate-500/10 text-slate-400"}`}>{t.priority}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${t.status === "Open" ? "bg-blue-500/10 text-blue-400" : t.status === "In Progress" ? "bg-amber-500/10 text-amber-400" : "bg-primary/10 text-primary"}`}>{t.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
