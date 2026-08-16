import { createServerFn } from "@tanstack/react-start";

import type { DeviceInput } from "./devices-types";
import { normalizeDeviceInput } from "./devices-types";

export const DEVICE_IMAGE_BUCKET = "device-images";

export const listDevices = createServerFn({ method: "GET" }).handler(async () => {
  const { requireUnlocked } = await import("./gate.server");
  await requireUnlocked();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("devices")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const saveDevice = createServerFn({ method: "POST" })
  .inputValidator((input: DeviceInput & { id?: string }) => ({
    id: input.id ? String(input.id) : null,
    values: normalizeDeviceInput(input),
  }))
  .handler(async ({ data }) => {
    const { requireUnlocked } = await import("./gate.server");
    await requireUnlocked();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (data.id) {
      const { error } = await supabaseAdmin
        .from("devices")
        .update(data.values)
        .eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin.from("devices").insert(data.values);
      if (error) throw new Error(error.message);
    }
    return { ok: true as const };
  });

export const deleteDevice = createServerFn({ method: "POST" })
  .inputValidator((input: { id: string }) => ({ id: String(input.id) }))
  .handler(async ({ data }) => {
    const { requireUnlocked } = await import("./gate.server");
    await requireUnlocked();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("devices").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

/** URL unggah bertanda tangan agar browser bisa mengirim file tanpa akses publik. */
export const createDeviceImageUpload = createServerFn({ method: "POST" })
  .inputValidator((input: { ext: string }) => ({
    ext: /^[a-z0-9]{2,5}$/i.test(input.ext) ? input.ext.toLowerCase() : "webp",
  }))
  .handler(async ({ data }) => {
    const { requireUnlocked } = await import("./gate.server");
    await requireUnlocked();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const path = `${crypto.randomUUID()}.${data.ext}`;
    const { data: signed, error } = await supabaseAdmin.storage
      .from(DEVICE_IMAGE_BUCKET)
      .createSignedUploadUrl(path);
    if (error || !signed) throw new Error(error?.message ?? "Gagal menyiapkan unggahan.");
    return { path, token: signed.token };
  });

export const getDeviceImageSignedUrl = createServerFn({ method: "POST" })
  .inputValidator((input: { path: string }) => ({ path: String(input.path) }))
  .handler(async ({ data }) => {
    const { requireUnlocked } = await import("./gate.server");
    await requireUnlocked();
    if (/^https?:\/\//.test(data.path)) return { url: data.path };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: signed, error } = await supabaseAdmin.storage
      .from(DEVICE_IMAGE_BUCKET)
      .createSignedUrl(data.path, 60 * 60);
    if (error || !signed) return { url: null };
    return { url: signed.signedUrl };
  });
