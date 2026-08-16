# Pastikan grafik MRTG Ether1 selalu tampil di dashboard

## Diagnosis (sudah diverifikasi)

- Proxy `/api/graph/ether1.gif` **berfungsi**: mengembalikan GIF harian 500×170 asli dari
  `http://117.121.207.223:2627/graphs/iface/ether1/daily.gif` (sumber utama), dan
  `http://192.168.35.1/...` (sumber cadangan) gagal dengan benar saat LAN tidak terjangkau.
  Jadi data gambar sudah sampai ke aplikasi — bukan masalah jaringan.
- Saat Anda melihat layar kosong, dev server sedang **terputus** (HMR "server connection
  lost. Polling for restart..." pukul 09:15, tepat saat restart setelah edit). Selama jendela
  itu request gambar gagal → `onError` → komponen menampilkan blok fallback, terlihat
  seperti "tidak tampil sama sekali".
- Komponen `Ether1Graph.tsx` punya pola rapuh: `<img>` pakai `absolute inset-0` saat loading
  lalu jadi in-flow setelah `onLoad`; timer 60 detik mengganti `key={stamp}` yang me-remount
  `<img>` padahal state `loaded` masih `true`. Saat remount, container bisa sebentar collapse
  jadi 0 tinggi → grafik kedap/lenyap tiap auto-refresh.

## Yang akan diubah

1. **Perbaiki `src/components/Ether1Graph.tsx`** — hapus pola absolute-positioning:
   - `<img>` selalu in-flow (tidak pernah `absolute`), tinggi container ditop oleh skeleton
     `min-h` sebelum load dan oleh dimensi gambar setelah load, jadi tidak bisa collapse.
   - Saat `key`/`stamp` berganti (auto-refresh 60 detik), reset `loaded=false` dulu lewat
     `useEffect([stamp])` agar skeleton muncul kembali, bukan img kosong setengah-load.
   - Pertahankan `image-rendering: pixelated` + latar putih + scroll horizontal untuk mobile.

2. **Tambah tombol "Segarkan"** di header kartu grafik (sebelah "Buka gambar penuh"):
   - Klik → `setStamp(Date.now())` untuk memaksa re-fetch gambar baru seketika.
   - Menampilkan ikon refresh yang berputar selama ~1 detik pembaruan.

3. **Verifikasi setelah perbaikan** (langkah akhir, lewat Playwright):
   - Login pakai `griya-arca` di `/auth`, tunggu dashboard, screenshot section Ether1.
   - Konfirmasi GIF 500×170 tampil penuh (bukan skeleton/fallback), dan klik "Segarkan"
     lalu screenshot lagi untuk pastikan tetap tampil setelah re-fetch.

## Catatan teknis

- Tidak menyentuh rute proxy `/api/graph/ether1[.]gif.ts` — sudah benar (dua sumber,
  dua percobaan, placeholder SVG bila semua gagal).
- Tidak mengubah rute dashboard `src/routes/_gated/index.tsx` — `<Ether1Graph>` sudah
      dipasang di baris 120.
- Tetap failsafe: bila kedua sumber gagal, tetap tampilkan blok fallback berisi dua link
  ("Dari luar kost" / "Dari dalam kost") seperti sekarang.
