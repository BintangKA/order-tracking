# Real-Time Order & Job Tracking — Frontend UI (React)

Antarmuka web modern untuk sistem pelacakan order dan pekerjaan teknisi secara langsung (*real-time*). Dibangun menggunakan **React 19**, **TypeScript**, **Vite**, dan **Tailwind CSS**, dengan integrasi Server-Sent Events (SSE) untuk pembaruan data instan tanpa refresh halaman.

---

## 1. Tech Stack

- **Framework**: [React 19](https://react.dev/) (`^19.2.8`)
- **Language**: TypeScript (`~6.0.2`)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Real-Time Stream**: Native Web API `EventSource` (Server-Sent Events)

---

## 2. Cara Menjalankan Project

### A. Menjalankan Menggunakan Docker Compose (Satu Perintah - Direkomendasikan)
Dari direktori root project:
```bash
docker compose up --build
```
Aplikasi frontend akan langsung dapat diakses di:
`http://localhost:5173`

### B. Menjalankan Manual (Local Development)

1. **Pastikan Node.js Terpasang**:
   Direkomendasikan Node.js `v20.x` atau `v22.x`+ (mendukung hingga `v24.x`).

2. **Konfigurasi Environment Variable**:
   Pastikan file `.env` tersedia di folder `frontend/` (atau salin dari `.env.example`):
   ```env
   VITE_API_URL=http://localhost:8080/api
   ```

3. **Install Dependencies & Jalankan Server**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Buka browser pada tautan `http://localhost:5173`.

4. **Linting & Build Test**:
   ```bash
   npm run lint
   npm run build
   ```

---

## 3. Daftar Asumsi (Merujuk ke Deliverable A / Case Study)

1. **Aktor Utama**:
   - **Dispatcher / Admin**: Menggunakan antarmuka ini untuk memantau status seluruh pesanan pekerjaan lapangan, menugaskan order ke tim (`ASSIGNED`), memulai proses (`IN_PROGRESS`), atau menandai tuntas (`DONE`).
   - **Client**: Memeriksa progres status order dan riwayat aktivitas timeline secara transparan.
2. **Konektivitas Dinamis**:
   - Status koneksi real-time dipantau oleh komponen `ConnectionStatus` (hijau = *Connected*, kuning = *Reconnecting*, merah = *Disconnected*).
   - Jika koneksi internet terputus sesaat, browser secara otomatis melakukan *retry* dan melakukan sinkronisasi ulang data terbaru begitu koneksi pulih (`onReconnect`).
3. **Pembaruan Tanpa Refresh (Instant UI Update)**:
   - Aksi perubahan status pesanan pada tabel (`UpdateStatusAction`) dan halaman detail langsung mengubah state lokal UI seketika serta membroadcast perubahannya ke tab/client lain melalui Server-Sent Events (SSE).
4. **Validasi Alur Status**:
   - UI membatasi opsi perubahan status hanya pada langkah-langkah yang diizinkan oleh sistem state machine (`PENDING` ➔ `ASSIGNED` ➔ `IN_PROGRESS` ➔ `DONE`, atau `CANCELLED`).
   - Order yang telah berstatus akhir (`DONE` / `CANCELLED`) dikunci agar tidak dapat diubah lagi secara tidak sengaja.

---

## 4. Status Pengerjaan

| Fitur / Halaman | Status | Keterangan |
|---|---|---|
| Dashboard Daftar Pesanan (`OrdersPage`) | Selesai | Tabel order, metric cards, live SSE status, pencarian & filter |
| Komponen Ubah Status Inline (`UpdateStatusAction`) | Selesai | Mengubah status langsung di baris tabel tanpa refresh halaman |
| Halaman Detail Pesanan (`OrderDetailPage`) | Selesai | Desain *human-crafted*, kartu pelanggan, rincian layanan, aksi status |
| Visual Stepper Tracker (`OrderProgressTracker`) | Selesai | Tahapan alur visual horizontal (`Masuk` ➔ `Penugasan` ➔ `Proses` ➔ `Selesai`) |
| Audit Trail / Timeline (`OrderTimeline`) | Selesai | Jejak audit riwayat status dengan warna kontekstual dan Live Sync |
| Tombol Salin Cepat Nomor Order | Selesai | Salin instan ke clipboard dengan feedback animasi "Tersalin!" |
| Sinkronisasi Real-Time SSE | Selesai | Hook `useOrderEvents` stabil dengan auto-reconnect |
| Form Input Login & Manajemen Akun | **Di-mock** | Identitas aktor (`admin-table`, `admin-web`) di-inject otomatis tanpa form login |
| Geolocation Map Tracking Teknisi | **Di-mock** | Belum ada integrasi peta Leaflet/Google Maps posisi GPS live |
| Ekspor Laporan Excel/PDF | Belum | Belum diimplementasikan |

---

## 5. Known Limitations (Keterbatasan yang Disadari)

1. **Autentikasi Pengguna**:
   - Belum terdapat form login JWT dan manajemen sesi. User yang mengakses antarmuka saat ini diasumsikan sebagai admin/operator dengan role penuh.
2. **Manajemen State Global**:
   - State saat ini dikelola secara lokal pada masing-masing page (`useState`, `useCallback`, dan `useMemo`) yang disinkronkan via custom hook SSE `useOrderEvents`. Untuk skala aplikasi yang jauh lebih masif (ribuan order/menit), state management library seperti Zustand atau TanStack React Query dapat dipertimbangkan untuk query caching.
3. **Paginasi di Sisi Server (Server-Side Pagination)**:
   - Filter dan pencarian saat ini berjalan di sisi client (*in-memory filtering*). Cocok dan sangat responsif untuk puluhan hingga ratusan pesanan aktif, namun memerlukan paginasi server-side jika data order mencapai puluhan ribu record di database.

---

## 6. Daftar Endpoint API yang Dikonsumsi

| Method | Endpoint | Fungsi di Frontend | Lokasi Service |
|---|---|---|---|
| `GET` | `/api/orders` | Mengambil seluruh order untuk ditampilkan di tabel | `services/orderService.ts` |
| `GET` | `/api/orders/:id` | Mengambil data lengkap spesifik satu order | `services/orderService.ts` |
| `POST` | `/api/orders` | Membuat order baru | `services/orderService.ts` |
| `PATCH` | `/api/orders/:id/status` | Mengubah status order dari tabel atau halaman detail | `services/orderService.ts` |
| `POST` | `/api/orders/:id/cancel` | Membatalkan order | `services/orderService.ts` |
| `GET` | `/api/orders/:id/history` | Mengambil seluruh log event riwayat order | `services/orderService.ts` |
| `GET` | `/api/orders/events` | Mendengarkan event update secara real-time (SSE) | `services/sseService.ts` |

---

## 7. Seed / Dummy Data

Untuk mempermudah pengujian oleh reviewer, database backend telah dilengkapi dengan **20 dummy order** yang mencakup:
- Seluruh variasi status: `PENDING`, `ASSIGNED`, `IN_PROGRESS`, `DONE`, dan `CANCELLED`.
- Ragam jenis layanan: *AC Repair, CCTV Maintenance, Electrical Installation, Generator Repair*, dll.
- Riwayat perubahan data dengan nomor versi optimistik (`version`).

Reviewer dapat langsung menguji:
1. **Search bar**: Mencari berdasarkan nama pelanggan (misal: "Budi", "Dewi", "Agus") atau nomor order ("ORD-001").
2. **Filter tab**: Menyortir order berdasarkan status pesanan.
3. **Ubah Status**: Mengklik tombol dropdown **"Ubah Status"** pada tabel dan menyaksikan badge serta nomor versi berganti seketika tanpa refresh halaman.
4. **Halaman Detail**: Menekan tombol **Detail** untuk melihat informasi pelanggan, progress stepper horizontal, dan timeline audit aktivitas real-time.
