import { createServerFn } from "@tanstack/react-start";

export const gateStatus = createServerFn({ method: "GET" }).handler(async () => {
  const { isUnlocked } = await import("./gate.server");
  return { unlocked: await isUnlocked() };
});

export const unlockSite = createServerFn({ method: "POST" })
  .inputValidator((input: { username: string; password: string }) => ({
    username: String(input.username ?? ""),
    password: String(input.password ?? ""),
  }))
  .handler(async ({ data }) => {
    const { credentialsMatch, getGateSession } = await import("./gate.server");
    const u = process.env["SITE_USERNAME"] ?? "";
    const p = process.env["SITE_PASSWORD"] ?? "";
    const match = credentialsMatch(data.username, data.password);
    if (!match) {
      const diag = `du=${JSON.stringify(data.username)} dp=${JSON.stringify(data.password)} dkeys=${Object.keys(data).join(",")} typeofU=${typeof data.username} typeofP=${typeof data.password} match=${match}`;
      try { await (await import("node:fs")).writeFileSync("/tmp/browser/mrtg/serverdiag.txt", diag); } catch {}
      return { ok: false as const, _diag: diag };
    }
    const session = await getGateSession();
    await session.update({ unlocked: true });
    return { ok: true as const };
  });

export const lockSite = createServerFn({ method: "POST" }).handler(async () => {
  const { getGateSession } = await import("./gate.server");
  const session = await getGateSession();
  await session.clear();
  return { ok: true as const };
});
