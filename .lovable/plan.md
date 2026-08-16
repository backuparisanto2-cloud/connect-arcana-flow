# Impor Arcana Connect Hub ke proyek ini

Menyalin seluruh aplikasi dari repo `backuparisanto2-cloud/arcana-connect-hub` ke proyek ini. Repo memakai stack yang sama (TanStack Start + Tailwind v4 + shadcn), jadi penyalinan bisa hampir 1:1.

## Apa yang akan ada setelah impor

- Splash screen bergaya Griya Arcana + header situs dan logo
- Halaman utama terkunci satu login sederhana (gate) dengan kata sandi
- Halaman Perangkat: daftar perangkat jaringan (nama, tipe, lokasi, IP/MAC, SSID, serial, foto)
- Halaman Hotspot MikroTik: status dan daftar pengguna hotspot
- Halaman Grafik: grafik trafik ether1 (MRTG) yang mobile friendly
- Ikon PWA/manifest agar bisa dipasang di ponsel

## Langkah pengerjaan

1. Aktifkan Lovable Cloud (database, storage, autentikasi) untuk proyek ini.
2. Jalankan ulang dua migrasi dari repo: tabel `devices` (+ kolom `serial_number`, `image_url`), grant, RLS policy, trigger `updated_at`, dan bucket storage `device-images` beserta policy-nya.
3. Pasang dependensi tambahan yang dipakai repo (radix components, recharts, sonner, react-hook-form, zod, date-fns, embla, vaul, dll).
4. Salin file sumber: `src/components/*`, `src/components/ui/*`, `src/lib/*` (devices, gate, mikrotik), `src/routes/*` (`__root`, `auth`, `_gated/*`, `api/graph/ether1.gif`), `src/styles.css`, `src/assets/logo.png`, aset `public/` (favicon, ikon PWA, manifest).
5. Sesuaikan integrasi Supabase ke klien yang dihasilkan proyek ini (`src/integrations/supabase/*` versi baru), termasuk middleware auth di `src/start.ts`.
6. Isi ulang secret yang dibutuhkan (tidak ikut tersalin dari repo): kata sandi gate dan kredensial MikroTik (host, user, password/port). Saya akan minta nilainya saat tahap ini.
7. Verifikasi: buka setiap halaman, cek konsol dan build, pastikan gate, daftar perangkat, upload foto, dan grafik berjalan.

## Catatan teknis

- Data lama di database repo tidak ikut; tabel akan kosong. Jika perlu, data perangkat bisa dimasukkan manual atau lewat impor terpisah.
- Fitur MikroTik (hotspot, status, grafik ether1) hanya berfungsi jika router bisa dijangkau dari internet dan kredensialnya benar; kalau tidak, halaman akan menampilkan error koneksi.
- Policy `anon` yang sangat terbuka pada tabel `devices` ikut disalin apa adanya (sesuai desain repo: halaman perangkat tanpa login). Bisa diperketat nanti jika diinginkan.
