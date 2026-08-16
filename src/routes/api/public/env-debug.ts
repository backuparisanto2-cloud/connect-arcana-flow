import { createFileRoute } from "@tanstack/react-router";

// DIAGNOSTIC (temporary): reports only presence of env vars, never their values.
export const Route = createFileRoute("/api/public/env-debug")({
  server: {
    handlers: {
      GET: async () => {
        return new Response(
          JSON.stringify({
            hasSiteUser: !!process.env["SITE_USERNAME"],
            hasSitePass: !!process.env["SITE_PASSWORD"],
            hasSessionSecret: !!process.env["SESSION_SECRET"],
            hasMikrotikHost: !!process.env["MIKROTIK_HOST"],
            hasMikrotikPort: !!process.env["MIKROTIK_PORT"],
            hasMikrotikUser: !!process.env["MIKROTIK_USER"],
            hasMikrotikPass: !!process.env["MIKROTIK_PASSWORD"],
          }),
          { status: 200, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } },
        );
      },
    },
  },
});
