export const supabase = null;

export async function getUnifiedUser() {
  if (typeof window === "undefined") return null;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      const raw = localStorage.getItem(k);
      if (!raw || !raw.includes("@")) continue;
      try {
        const p = JSON.parse(raw);
        if (p?.user?.email) {
          const u = p.user;
          return {
            email: u.email,
            name: u.user_metadata?.full_name || u.user_metadata?.name || u.email.split("@")[0],
            token: p.access_token || "home-session"
          };
        }
        if (p?.email && typeof p.email === "string" && p.email.includes("@")) {
          return {
            email: p.email,
            name: p.name || p.full_name || p.email.split("@")[0],
            token: p.token || p.access_token || "home-session"
          };
        }
      } catch {}
    }
  } catch {}
  return null;
}

export function signOutUnified() {
  if (typeof window === "undefined") return;
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.includes("auth") || k.includes("user") || k.startsWith("sb-"))) keys.push(k);
    }
    keys.forEach((k) => localStorage.removeItem(k));
  } catch {}
}
