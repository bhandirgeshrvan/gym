const BASE_URL = "/api";

// ── JWT helpers ───────────────────────────────────────
function parseJwtPayload(token: string): Record<string, any> | null {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const payload = parseJwtPayload(token);
  if (!payload?.exp) return true;
  return Date.now() / 1000 > payload.exp;
}

function getToken(): string | null {
  const token = localStorage.getItem("gympulse_token");
  if (!token) return null;
  if (isTokenExpired(token)) {
    clearSession();
    return null;
  }
  return token;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (res.status === 401) {
    clearSession();
    window.location.reload(); // force back to login
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(err.detail || "Request failed");
  }
  return res.json();
}

// ── Types ──────────────────────────────────────────────
export type Role = "super_admin" | "gym_owner" | "trainer" | "member";

export interface TokenResponse {
  access_token: string;
  token_type: string;
  role: Role;
  user_id: number;
  name: string;
}

export interface Gym {
  id: number; name: string; location: string; plan: string;
  is_active: boolean; owner_id: number; created_at: string;
}

export interface Member {
  id: number; user_id: number; gym_id: number; trainer_id: number | null;
  membership_plan: string; status: string; join_date: string; expiry_date: string | null;
}

export interface Trainer {
  id: number; user_id: number; gym_id: number;
  specialty: string; experience_years: number; rating: number;
}

export interface Attendance {
  id: number; member_id: number; checked_in_at: string; method: string;
}

export interface Payment {
  id: number; member_id: number; amount: number; description: string;
  method: string; status: string; invoice_number: string | null; paid_at: string;
}

export interface WorkoutPlan {
  id: number; name: string; trainer_id: number; member_id: number | null;
  duration_minutes: number; level: string; exercises: string; created_at: string;
}

export interface SuperAdminStats {
  total_gyms: number; active_users: number; monthly_revenue: number; churn_rate: number;
}

export interface GymOwnerStats {
  total_members: number; monthly_revenue: number; active_members: number; attendance_today: number;
}

// ── Auth ──────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string, role: Role) =>
    request<TokenResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, role }),
    }),
  register: (first_name: string, last_name: string, email: string, password: string, role: Role) =>
    request<TokenResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ first_name, last_name, email, password, role }),
    }),
  forgotPassword: (email: string) =>
    request<{ message: string }>(`/auth/forgot-password?email=${encodeURIComponent(email)}`, { method: "POST" }),
  me: () => request<{ id: number; first_name: string; last_name: string; email: string; role: Role }>("/auth/me"),
};

// ── Gyms ──────────────────────────────────────────────
export const gymsApi = {
  list: () => request<Gym[]>("/gyms/"),
  create: (data: { name: string; location: string; plan?: string }) =>
    request<Gym>("/gyms/", { method: "POST", body: JSON.stringify(data) }),
  get: (id: number) => request<Gym>(`/gyms/${id}`),
  update: (id: number, data: { name: string; location: string; plan: string }) =>
    request<Gym>(`/gyms/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: number) => request<{ message: string }>(`/gyms/${id}`, { method: "DELETE" }),
};

// ── Members ───────────────────────────────────────────
export const membersApi = {
  list: (gym_id?: number) => request<Member[]>(`/members/${gym_id ? `?gym_id=${gym_id}` : ""}`),
  create: (data: Omit<Member, "id" | "join_date">) =>
    request<Member>("/members/", { method: "POST", body: JSON.stringify(data) }),
  get: (id: number) => request<Member>(`/members/${id}`),
  update: (id: number, data: Partial<Member>) =>
    request<Member>(`/members/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: number) => request<{ message: string }>(`/members/${id}`, { method: "DELETE" }),
};

// ── Trainers ──────────────────────────────────────────
export const trainersApi = {
  list: (gym_id?: number) => request<Trainer[]>(`/trainers/${gym_id ? `?gym_id=${gym_id}` : ""}`),
  create: (data: Omit<Trainer, "id" | "rating">) =>
    request<Trainer>("/trainers/", { method: "POST", body: JSON.stringify(data) }),
  get: (id: number) => request<Trainer>(`/trainers/${id}`),
  update: (id: number, data: Partial<Trainer>) =>
    request<Trainer>(`/trainers/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
};

// ── Attendance ────────────────────────────────────────
export const attendanceApi = {
  checkIn: (member_id: number, method = "manual") =>
    request<Attendance>("/attendance/checkin", { method: "POST", body: JSON.stringify({ member_id, method }) }),
  memberHistory: (member_id: number) => request<Attendance[]>(`/attendance/member/${member_id}`),
  todayCount: (gym_id: number) => request<{ gym_id: number; date: string; count: number }>(`/attendance/gym/${gym_id}/today`),
  weekly: (gym_id: number) => request<{ day: string; count: number }[]>(`/attendance/gym/${gym_id}/weekly`),
};

// ── Payments ──────────────────────────────────────────
export const paymentsApi = {
  list: (member_id?: number) => request<Payment[]>(`/payments/${member_id ? `?member_id=${member_id}` : ""}`),
  create: (data: { member_id: number; amount: number; description: string; method?: string; invoice_number?: string }) =>
    request<Payment>("/payments/", { method: "POST", body: JSON.stringify(data) }),
  get: (id: number) => request<Payment>(`/payments/${id}`),
};

// ── Workouts ──────────────────────────────────────────
export const workoutsApi = {
  list: (trainer_id?: number, member_id?: number) => {
    const params = new URLSearchParams();
    if (trainer_id) params.set("trainer_id", String(trainer_id));
    if (member_id) params.set("member_id", String(member_id));
    return request<WorkoutPlan[]>(`/workouts/${params.toString() ? `?${params}` : ""}`);
  },
  create: (data: Omit<WorkoutPlan, "id" | "created_at">) =>
    request<WorkoutPlan>("/workouts/", { method: "POST", body: JSON.stringify(data) }),
  get: (id: number) => request<WorkoutPlan>(`/workouts/${id}`),
  update: (id: number, data: Partial<WorkoutPlan>) =>
    request<WorkoutPlan>(`/workouts/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: number) => request<{ message: string }>(`/workouts/${id}`, { method: "DELETE" }),
};

// ── Dashboard ─────────────────────────────────────────
export const dashboardApi = {
  superAdmin: () => request<SuperAdminStats>("/dashboard/super-admin"),
  gymOwner: (gym_id: number) => request<GymOwnerStats>(`/dashboard/gym-owner/${gym_id}`),
};

// ── Session helpers ───────────────────────────────────
export function saveSession(token: TokenResponse) {
  localStorage.setItem("gympulse_token", token.access_token);
  localStorage.setItem("gympulse_user", JSON.stringify(token));
}

export function getSession(): TokenResponse | null {
  const raw = localStorage.getItem("gympulse_user");
  return raw ? JSON.parse(raw) : null;
}

export function clearSession() {
  localStorage.removeItem("gympulse_token");
  localStorage.removeItem("gympulse_user");
}
