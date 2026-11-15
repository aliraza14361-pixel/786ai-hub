import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

function extractUserFromLocalStorage() {
  if (typeof window === "undefined") return null;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      const raw = localStorage.getItem(k);
      if (!raw || !raw.includes("@")) continue;
      try {
        const parsed = JSON.parse(raw);
        // Supabase v2 session object
        if (parsed?.user?.email) {
          const u = parsed.user;
          return {
            email: u.email,
            name:
              u.user_metadata?.full_name ||
              u.user_metadata?.name ||
              u.email.split("@")[0],
            token: parsed.access_token || "home-session"
          };
        }
        // Custom Home Page user object
        if (parsed?.email && typeof parsed.email === "string" && parsed.email.includes("@")) {
          return {
            email: parsed.email,
            name: parsed.name || parsed.full_name || parsed.email.split("@")[0],
            token: parsed.token || parsed.access_token || "home-session"
          };
        }
      } catch {}
    }
  } catch {}
  return null;
}

export async function getUnifiedUser() {
  if (supabase) {
    try {
      const { data } = await supabase.auth.getSession();
      const session = data?.session;
      if (session?.user?.email) {
        const u = session.user;
        return {
          email: u.email,
          name:
            u.user_metadata?.full_name ||
            u.user_metadata?.name ||
            u.email.split("@")[0],
          token: session.access_token
        };
      }
    } catch {}
  }
  return extractUserFromLocalStorage();
}

export async function signOutUnified() {
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch {}
  }
  if (typeof window !== "undefined") {
    try {
      const toRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.includes("auth") || k.includes("user") || k.startsWith("sb-"))) {
          toRemove.push(k);
        }
      }
      toRemove.forEach((k) => localStorage.removeItem(k));
    } catch {}
  }
}
