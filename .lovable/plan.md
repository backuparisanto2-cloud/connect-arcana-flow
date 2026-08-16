# MRTG Ether1 di Dashboard + Impor IP-Binding Hotspot

## 1. Rapikan tampilan grafik MRTG (halaman awal dashboard)

Grafik sudah tampil di dashboard dan proxy failsafe-nya bekerja (sumber publik `117.121.207.223:2627` berhasil, sumber lokal `192.168.35.1` sebagai cadangan). Masalahnya murni tampilan: gambar MRTG berukuran asli sekitar 500x170 px tetapi saat ini dipaksa melebar sampai 760 px sehingga pecah/buram.

Perbaikan:
- Tampilkan gambar pada ukuran aslinya dan tengah, tidak diregangkan melebihi lebar asli.
- Di layar kecil, gambar bisa digeser horizontal (scroll) agar tetap terbaca, bukan dikecilkan sampai tidak terbaca.
- Rendering gambar disetel tajam (pixelated) agar garis grafik tidak blur.
- Tambah tombol "Buka gambar penuh" dan keterangan sumber yang sedang dipakai (publik/lokal).
- Tetap ada auto-refresh 60 detik, placeholder saat gagal, dan dua tautan sumber sebagai cadangan.

## 2. Impor IP-Binding Hotspot MikroTik ke daftar perangkat

Sinkronisasi otomatis setiap halaman Perangkat dibuka.

Alur:
1. Server membaca `/ip/hotspot/ip-binding/print` dari router (MAC address, alamat IP/to-address, tipe, status disabled, comment).
2. Setiap entri dipetakan menjadi perangkat:
   - Nama = comment router; bila comment kosong, pakai MAC address.
   - MAC address, IP address diisi dari binding.
   - Catatan diisi info binding (tipe bypass/blocked/regular, status aktif/nonaktif, sumber "IP-Binding MikroTik").
   - Tipe perangkat diisi "Lainnya" untuk entri baru.
3. Pencocokan memakai MAC address:
   - MAC belum ada -> perangkat baru ditambahkan.
   - MAC sudah ada -> hanya nama (bila masih dari impor), IP, dan catatan yang disegarkan; foto, tipe, lokasi, user/password, dan SSID yang sudah Anda isi manual tidak ditimpa.
   - Perangkat yang Anda buat manual tanpa MAC tidak tersentuh, dan entri yang hilang dari router tidak dihapus.
4. Halaman Perangkat menampilkan status sinkron ("Sinkron dari MikroTik: X baru, Y diperbarui") atau pesan ringkas bila router tidak terjangkau — daftar tetap tampil dari database.

## Detail teknis

- `src/routes/api/graph/ether1[.]gif.ts`: tetap; tambahkan header sumber yang sudah ada agar bisa ditampilkan di UI.
- `src/components/Ether1Graph.tsx`: perbaikan layout (max-width sesuai ukuran asli, container scroll, image-rendering, tombol buka penuh).
- `src/lib/mikrotik-hotspot.server.ts` (atau file baru `mikrotik-binding.server.ts`): fungsi `fetchIpBindings()` memanggil `runRouterCommands([{ command: "/ip/hotspot/ip-binding/print" }])` dan mengembalikan array ternormalisasi; error ditangani seperti pola hotspot yang ada (mengembalikan `{ ok: false, error }`, tidak melempar).
- `src/lib/devices.functions.ts`: server function baru `syncDevicesFromBindings` (POST) — `requireUnlocked()`, ambil binding, baca `devices` via `supabaseAdmin`, lakukan upsert manual berdasarkan `mac_address` (dinormalisasi huruf besar), kembalikan `{ ok, created, updated, error? }`.
- `src/routes/_gated/perangkat.tsx`: `useMutation`/`useQuery` yang menjalankan sync sekali saat halaman mount, lalu `invalidateQueries(["devices"])`; tampilkan ringkasan hasil sync di atas tabel.
- Tidak ada perubahan skema database (kolom `mac_address`, `notes` sudah ada).
