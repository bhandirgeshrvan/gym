import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Dumbbell, LayoutDashboard, Users, CalendarCheck, CreditCard, BarChart3,
  Bell, Settings, LogOut, Menu, X, ChevronDown, Sun, Moon, Crown,
  Shield, Dumbbell as TrainerIcon, User, Building2, Utensils, TrendingUp,
  MessageSquare, QrCode, Package, FileText, HelpCircle, Search, Home
} from "lucide-react";

export type Role = "super_admin" | "gym_owner" | "trainer" | "member";

interface NavItem {
  icon: React.ElementType;
  label: string;
  id: string;
  badge?: number;
}

const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  super_admin: [
    { icon: LayoutDashboard, label: "Overview", id: "overview" },
    { icon: Building2, label: "Manage Gyms", id: "gyms" },
    { icon: Users, label: "User Management", id: "users" },
    { icon: CreditCard, label: "Subscriptions", id: "subscriptions" },
    { icon: BarChart3, label: "Revenue Analytics", id: "analytics" },
    { icon: MessageSquare, label: "Support Tickets", id: "support", badge: 7 },
    { icon: FileText, label: "Audit Logs", id: "audit" },
    { icon: Settings, label: "System Settings", id: "settings" },
  ],
  gym_owner: [
    { icon: LayoutDashboard, label: "Overview", id: "overview" },
    { icon: Users, label: "Members", id: "members" },
    { icon: TrainerIcon, label: "Trainers", id: "trainers" },
    { icon: CalendarCheck, label: "Attendance", id: "attendance" },
    { icon: CreditCard, label: "Payments", id: "payments" },
    { icon: Package, label: "Membership Plans", id: "plans" },
    { icon: Utensils, label: "Inventory", id: "inventory" },
    { icon: BarChart3, label: "Reports", id: "reports" },
    { icon: Bell, label: "Notifications", id: "notifications", badge: 3 },
    { icon: Settings, label: "Settings", id: "settings" },
  ],
  trainer: [
    { icon: LayoutDashboard, label: "Overview", id: "overview" },
    { icon: Users, label: "My Members", id: "members" },
    { icon: Dumbbell, label: "Workout Plans", id: "workouts" },
    { icon: Utensils, label: "Diet Plans", id: "diet" },
    { icon: CalendarCheck, label: "Schedule", id: "schedule" },
    { icon: TrendingUp, label: "Progress", id: "progress" },
    { icon: MessageSquare, label: "Chat", id: "chat", badge: 2 },
    { icon: Settings, label: "Settings", id: "settings" },
  ],
  member: [
    { icon: LayoutDashboard, label: "Dashboard", id: "overview" },
    { icon: User, label: "My Profile", id: "profile" },
    { icon: QrCode, label: "QR Check-In", id: "checkin" },
    { icon: Dumbbell, label: "Workouts", id: "workouts" },
    { icon: Utensils, label: "Diet Plan", id: "diet" },
    { icon: TrendingUp, label: "Progress", id: "progress" },
    { icon: CalendarCheck, label: "Attendance", id: "attendance" },
    { icon: CreditCard, label: "Payments", id: "payments" },
    { icon: Bell, label: "Notifications", id: "notifications", badge: 1 },
  ],
};

const ROLE_META: Record<Role, { label: string; color: string; icon: React.ElementType }> = {
  super_admin: { label: "Super Admin", color: "text-purple-400", icon: Crown },
  gym_owner: { label: "Gym Owner", color: "text-amber-400", icon: Shield },
  trainer: { label: "Trainer", color: "text-blue-400", icon: TrainerIcon },
  member: { label: "Member", color: "text-green-400", icon: User },
};

const USER_BY_ROLE: Record<Role, { name: string; gym: string; avatar: string }> = {
  super_admin: { name: "Raj Patel", gym: "GymPulse HQ", avatar: "RP" },
  gym_owner: { name: "Sarah Chen", gym: "CoreFit Studio", avatar: "SC" },
  trainer: { name: "Alex Rivera", gym: "PowerHouse Gym", avatar: "AR" },
  member: { name: "Marcus Johnson", gym: "FitLife Center", avatar: "MJ" },
};

interface DashboardLayoutProps {
  role: Role;
  activeSection: string;
  onSectionChange: (s: string) => void;
  onNavigate: (page: string) => void;
  children: React.ReactNode;
  darkMode: boolean;
  onToggleDark: () => void;
  userName?: string;
}

export function DashboardLayout({
  role, activeSection, onSectionChange, onNavigate, children, darkMode, onToggleDark, userName
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const nav = NAV_BY_ROLE[role];
  const meta = ROLE_META[role];
  const fallbackUser = USER_BY_ROLE[role];
  const displayName = userName || fallbackUser.name;
  const avatarLetters = displayName.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase();
  const totalBadge = nav.reduce((s, n) => s + (n.badge || 0), 0);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shrink-0">
          <Dumbbell className="w-4 h-4 text-white" />
        </div>
        <span className="font-['Outfit',sans-serif] font-bold text-xl text-sidebar-foreground">GymPulse</span>
      </div>

      {/* Role badge */}
      <div className="px-4 py-3">
        <div className={`flex items-center gap-2 text-xs font-semibold ${meta.color} bg-white/5 rounded-lg px-3 py-2`}>
          <meta.icon className="w-3.5 h-3.5" />
          {meta.label}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto py-2">
        {nav.map(item => {
          const active = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { onSectionChange(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-slate-400 hover:text-sidebar-foreground hover:bg-white/5"
                }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
              </div>
              {item.badge && (
                <span className="bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Switch role */}
      <div className="px-3 pb-3 border-t border-sidebar-border pt-3">
        <button
          onClick={() => onNavigate("auth")}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
        >
          <Home className="w-4 h-4" /> Switch Role
        </button>
      </div>

      {/* User */}
      <div className="px-4 py-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
            {avatarLetters}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-sidebar-foreground truncate">{displayName}</div>
            <div className="text-xs text-slate-500 truncate">{fallbackUser.gym}</div>
          </div>
          <button onClick={() => onNavigate("landing")} className="text-slate-500 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? "dark bg-[#0B1120]" : "bg-[#F8FAFC]"}`}>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col bg-sidebar border-r border-sidebar-border">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/60 z-40"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-60 bg-sidebar border-r border-sidebar-border z-50 flex flex-col"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className={`h-16 shrink-0 flex items-center justify-between px-4 lg:px-6 border-b ${darkMode ? "bg-[#0F172A] border-white/5" : "bg-white border-slate-100"}`}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-black/5">
              <Menu className="w-5 h-5" />
            </button>
            <div className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl ${darkMode ? "bg-white/5" : "bg-slate-100"} w-64`}>
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search anything..."
                className="bg-transparent text-sm text-foreground placeholder-slate-400 focus:outline-none flex-1"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleDark}
              className={`p-2 rounded-xl transition-colors ${darkMode ? "bg-white/5 hover:bg-white/10 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-600"}`}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className={`relative p-2 rounded-xl transition-colors ${darkMode ? "bg-white/5 hover:bg-white/10 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-600"}`}
              >
                <Bell className="w-4 h-4" />
                {totalBadge > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {totalBadge}
                  </span>
                )}
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className={`absolute right-0 mt-2 w-80 rounded-2xl border shadow-xl z-50 overflow-hidden ${darkMode ? "bg-[#0F172A] border-white/8" : "bg-white border-slate-100"}`}
                  >
                    <div className="p-4 border-b border-inherit">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">Notifications</span>
                        <span className="text-xs text-primary cursor-pointer">Mark all read</span>
                      </div>
                    </div>
                    {[
                      { title: "Membership expires soon", desc: "Marcus Johnson's membership expires in 3 days", time: "5m ago", dot: "bg-amber-400" },
                      { title: "New member registered", desc: "Priya Sharma joined PowerHouse Gym", time: "1h ago", dot: "bg-green-400" },
                      { title: "Payment received", desc: "$149.00 from Raj Kumar", time: "3h ago", dot: "bg-blue-400" },
                    ].map((n, i) => (
                      <div key={i} className={`flex gap-3 p-4 hover:bg-black/5 cursor-pointer border-b border-inherit last:border-0`}>
                        <div className={`w-2 h-2 rounded-full ${n.dot} mt-1.5 shrink-0`} />
                        <div>
                          <div className="text-sm font-medium">{n.title}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{n.desc}</div>
                          <div className="text-xs text-slate-500 mt-1">{n.time}</div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-2 pl-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                {avatarLetters}
              </div>
              <span className={`hidden sm:block text-sm font-medium ${darkMode ? "text-white" : "text-slate-700"}`}>{displayName}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
