import { useState, useEffect } from "react";
import { LandingPage } from "./components/landing/LandingPage";
import { AuthPage } from "./components/auth/AuthPage";
import { DashboardLayout, type Role } from "./components/shared/DashboardLayout";
import { SuperAdminDashboard } from "./components/dashboards/SuperAdminDashboard";
import { GymOwnerDashboard } from "./components/dashboards/GymOwnerDashboard";
import { TrainerDashboard } from "./components/dashboards/TrainerDashboard";
import { MemberDashboard } from "./components/dashboards/MemberDashboard";
import { getSession, clearSession, authApi, type TokenResponse } from "@/api/client";

type Page = "landing" | "auth" | "dashboard";

export default function App() {
  const [page, setPage] = useState<Page>("landing");
  const [role, setRole] = useState<Role>("gym_owner");
  const [section, setSection] = useState("overview");
  const [darkMode, setDarkMode] = useState(true);
  const [session, setSession] = useState<TokenResponse | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const s = getSession();
    if (!s) { setAuthChecked(true); return; }
    // Verify token is still valid against the server
    authApi.me()
      .then(() => { setSession(s); setRole(s.role); setPage("dashboard"); })
      .catch(() => { clearSession(); })
      .finally(() => setAuthChecked(true));
  }, []);

  const navigate = (targetPage: string, targetRole?: Role) => {
    if (targetPage === "landing") { clearSession(); setSession(null); }
    if (targetPage === "dashboard" && targetRole) {
      setRole(targetRole);
      setSection("overview");
      setSession(getSession());
    }
    setPage(targetPage as Page);
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (page === "landing") {
    return <LandingPage onNavigate={navigate} />;
  }

  if (page === "auth") {
    return <AuthPage onNavigate={navigate} />;
  }

  const DashboardContent = () => {
    switch (role) {
      case "super_admin":
        return <SuperAdminDashboard activeSection={section} darkMode={darkMode} />;
      case "gym_owner":
        return <GymOwnerDashboard activeSection={section} darkMode={darkMode} />;
      case "trainer":
        return <TrainerDashboard activeSection={section} darkMode={darkMode} />;
      case "member":
        return <MemberDashboard activeSection={section} darkMode={darkMode} />;
    }
  };

  return (
    <DashboardLayout
      role={role}
      activeSection={section}
      onSectionChange={setSection}
      onNavigate={navigate}
      darkMode={darkMode}
      onToggleDark={() => setDarkMode(d => !d)}
      userName={session?.name}
    >
      <DashboardContent />
    </DashboardLayout>
  );
}
