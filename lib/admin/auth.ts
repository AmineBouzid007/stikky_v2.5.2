import "server-only";

import { createClient } from "@/lib/supabase/server";

export interface AdminUser {
  id: string;
  email: string | null;
  fullName: string | null;
}

/**
 * Returns the current logged-in user for admin screens, or null.
 *
 * Note: route-level auth (redirecting anonymous visitors away from
 * /admin/*) is already handled by proxy.ts / lib/supabase/proxy.ts.
 * This helper just exposes the user's display info to the admin UI
 * (header profile section) without adding any extra gating, so it
 * can't lock anyone out on its own.
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    return {
      id: user.id,
      email: user.email ?? null,
      fullName: (user.user_metadata?.full_name as string | undefined) ?? null,
    };
  } catch {
    return null;
  }
}
