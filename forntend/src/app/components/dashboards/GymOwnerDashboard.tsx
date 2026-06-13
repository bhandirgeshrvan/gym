import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Users, DollarSign, TrendingUp, UserPlus, CalendarCheck,
  ArrowUpRight, ArrowDownRight, Plus, Filter, ChevronRight, MapPin
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie
} from "recharts";
import {
  dashboardApi, membersApi, trainersApi, paymentsApi, attendanceApi,
  gymsApi, type GymOwnerStats, type Member, type Trainer, type Payment,
  getSession
} from "@/api/client";

const REVENUE_DATA = [
  { month: "Jan", revenue: 18200, expenses: 8100 }, { month: "Feb", revenue: 19500, expenses: 7800 },
  { month: "Mar", revenue: 20100, expenses: 9200 }, { month: "Apr", revenue: 22000, expenses: 8500 },
  { month: "May", revenue: 22150, expenses: 9100 }, { month: "Jun", revenue: 24800, expenses: 9600 },
];
const MEMBERSHIP_DIST = [
  { name: "Annual", value: 42, color: "#22C55E" }, { name: "Half-Yearly", value: 28, color: "#F59E0B" },
  { name: "Quarterly", value: 18, color: "#3B82F6" }, { name: "Monthly", value: 12, color: "#8B5CF6" },
];

export function GymOwnerDashboard({ activeSection, darkMode }: { activeSection: string; darkMode: boolean }) {
  const [stats, setStats] = useState<GymOwnerStats | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [weeklyAttendance, setWeeklyAttendance] = useState<{ day: string; count: number }[]>([]);
  const [gymName, setGymName] = useState("My Gym");
  const [gymLocation, setGymLocation] = useState("");
  const [gymId, setGymId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const cardClass = `rounded-2xl border p-5 ${darkMode ? "bg-[#0F172A] border-white/6" : "bg-white border-slate-100 shadow-sm"}`;
  const textMuted = darkMode ? "text-slate-400" : "text-slate-500";
  const textMain = darkMode ? "text-white" : "text-slate-900";

  useEffect(() => {
    gymsApi.list().then(async (gyms) => {
      if (gyms.length === 0) { setLoading(false); return; }
      const gym = gyms[0];
      setGymId(gym.id);
      setGymName(gym.name);
      setGymLocation(gym.location);
      const [s, m, t, p, a] = await Promise.all([
        dashboardApi.gymOwner(gym.id),
        membersApi.list(gym.id),
        trainersApi.list(gym.id),
        paymentsApi.list(),
        attendanceApi.weekly(gym.id),
      ]);
      setStats(s); setMembers(m); setTrainers(t); setPayments(p.slice(0, 4));
      setWeeklyAttendance([...a].reverse());
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const KPI_DATA = stats ? [
    { label: "Total Members", value: stats.total_members.toLocaleString(), change: "+4.2%", up: true, icon: Users, sub: "registered members", color: "text-primary", bg: "bg-primary/10" },
    { label: "Monthly Revenue", value: `$${stats.monthly_revenue.toLocaleString()}`, change: "+12%", up: true, icon: DollarSign, sub: "total collected", color: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "Active Members", value: stats.active_members.toLocaleString(), change: "+2.1%", up: true, icon: TrendingUp, sub: `${stats.total_members ? Math.round((stats.active_members / stats.total_members) * 100) : 0}% activation rate`, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Attendance Today", value: stats.attendance_today.toLocaleString(), change: "+5%", up: true, icon: CalendarCheck, sub: "check-ins today", color: "text-purple-400", bg: "bg-purple-500/10" },
  ] : [];

  const attendanceChartData = weeklyAttendance.map(d => ({
    day: new Date(d.day).toLocaleDateString("en", { weekday: "short" }),
    count: d.count,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className={`font-['Outfit',sans-serif] font-bold text-2xl ${textMain}`}>{gymName}</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span className={`text-sm ${textMuted}`}>{gymLocation || "—"}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className={`text-sm px-3 py-2 rounded-xl border flex items-center gap-1.5 ${darkMode ? "border-white/8 text-slate-300 hover:bg-white/5" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center gap-2 text-sm bg-primary hover:bg-green-400 text-white px-4 py-2 rounded-xl font-medium transition-all">
            <UserPlus className="w-4 h-4" /> Add Member
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
                <div className={`w-10 h-10 rounded-xl ${k.bg} flex items-center justify-center`}>
                  <k.icon className={`w-5 h-5 ${k.color}`} />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-semibold ${k.up ? "text-primary" : "text-red-400"}`}>
                  {k.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}{k.change}
                </span>
              </div>
              <div className={`font-['Outfit',sans-serif] font-bold text-2xl ${textMain} mb-0.5`}>{k.value}</div>
              <div className={`text-xs font-medium ${textMuted} mb-0.5`}>{k.label}</div>
              <div className="text-xs text-slate-500">{k.sub}</div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-4">
        <div className={`${cardClass} lg:col-span-3`}>
          <h3 className={`font-semibold ${textMain} mb-1`}>Revenue vs Expenses</h3>
          <p className={`text-xs ${textMuted} mb-4`}>Last 6 months ($)</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={REVENUE_DATA}>
              <defs>
                <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: darkMode ? "#0F172A" : "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} formatter={(v: number) => [`$${v.toLocaleString()}`, ""]} />
              <Area type="monotone" dataKey="revenue" stroke="#22C55E" strokeWidth={2} fill="url(#revG)" name="Revenue" />
              <Area type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} fill="url(#expG)" name="Expenses" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className={`${cardClass} lg:col-span-2`}>
          <h3 className={`font-semibold ${textMain} mb-4`}>Membership Mix</h3>
          <ResponsiveContainer width="100%" height={130}>
            <PieChart>
              <Pie data={MEMBERSHIP_DIST} cx="50%" cy="50%" innerRadius={38} outerRadius={58} paddingAngle={4} dataKey="value">
                {MEMBERSHIP_DIST.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-3">
            {MEMBERSHIP_DIST.map(p => (
              <div key={p.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
                <span className={textMuted}>{p.name}</span>
                <span className={`font-semibold ${textMain} ml-auto`}>{p.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={cardClass}>
        <h3 className={`font-semibold ${textMain} mb-4`}>This Week's Attendance</h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={attendanceChartData.length ? attendanceChartData : [{ day: "—", count: 0 }]}>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: darkMode ? "#0F172A" : "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
            <Bar dataKey="count" fill="#22C55E" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className={`${cardClass} lg:col-span-2`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold ${textMain}`}>Members</h3>
            <span className={`text-xs ${textMuted}`}>{members.length} total</span>
          </div>
          {members.length === 0 ? (
            <p className={`text-sm ${textMuted} text-center py-6`}>No members yet. Add your first member.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={`text-xs ${textMuted} border-b ${darkMode ? "border-white/6" : "border-slate-100"}`}>
                    {["Member ID", "Plan", "Status", "Expiry"].map(h => (
                      <th key={h} className="text-left pb-3 pr-4 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {members.slice(0, 5).map(m => (
                    <tr key={m.id} className={`border-b last:border-0 ${darkMode ? "border-white/4" : "border-slate-50"}`}>
                      <td className={`py-3 pr-4 font-medium ${textMain}`}>#{m.user_id}</td>
                      <td className={`py-3 pr-4 text-xs ${textMuted}`}>{m.membership_plan}</td>
                      <td className="py-3 pr-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${m.status === "Active" ? "bg-primary/10 text-primary" : m.status === "Expiring" ? "bg-amber-500/10 text-amber-400" : "bg-slate-500/10 text-slate-400"}`}>{m.status}</span>
                      </td>
                      <td className={`py-3 text-xs ${textMuted}`}>{m.expiry_date ? new Date(m.expiry_date).toLocaleDateString("en", { month: "short", year: "numeric" }) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold ${textMain}`}>Trainers</h3>
            <span className={`text-xs ${textMuted}`}>{trainers.length} total</span>
          </div>
          {trainers.length === 0 ? (
            <p className={`text-sm ${textMuted} text-center py-6`}>No trainers yet.</p>
          ) : (
            <div className="space-y-3">
              {trainers.map(t => (
                <div key={t.id} className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? "bg-white/3" : "bg-slate-50"}`}>
                  <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">T{t.id}</div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-semibold ${textMain} truncate`}>Trainer #{t.user_id}</div>
                    <div className={`text-xs ${textMuted}`}>{t.specialty} · {t.experience_years}y exp</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-amber-400 font-semibold">⭐ {t.rating.toFixed(1)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={cardClass}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-semibold ${textMain}`}>Recent Payments</h3>
          <button className="text-xs text-primary hover:underline">View all</button>
        </div>
        {payments.length === 0 ? (
          <p className={`text-sm ${textMuted} text-center py-6`}>No payments recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {payments.map(p => (
              <div key={p.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">#</div>
                  <div>
                    <div className={`text-sm font-medium ${textMain}`}>{p.description}</div>
                    <div className={`text-xs ${textMuted}`}>{p.method} · {new Date(p.paid_at).toLocaleDateString("en", { month: "short", day: "numeric" })}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-semibold text-sm ${textMain}`}>${p.amount.toLocaleString()}</div>
                  <div className="text-xs text-slate-500">{p.status}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
