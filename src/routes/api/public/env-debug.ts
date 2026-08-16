import { createFileRoute } from "@tanstack/react-router";

// DIAGNOSTIC (temporary): reports only presence/lengths/match — never raw values.
export const Route = createFileRoute("/api/public/env-debug")({
  server: {
    handlers: {
      GET: async () => {
        const { credentialsMatch } = await import("@/lib/gate.server");
        const u = process.env["SITE_USERNAME"] ?? "";
        const p = process.env["SITE_PASSWORD"] ?? "";
        return new Response(
          JSON.stringify({
            hasSiteUser: !!u,
            hasSitePass: !!p,
            userLen: u.length,
            passLen: p.length,
            matchExpected: credentialsMatch("griya-arca", "majubersama@2026"),
            hasSessionSecret: !!process.env["SESSION_SECRET"],
            hasMikrotikHost: !!process.env["MIKROTIK_HOST"],
          }),
          { status: 200, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } },
        );
      },
    },
  },
});
