# Real-Time Order & Job Tracking System

Sistem pelacakan order dan status pekerjaan teknisi lapangan secara *real-time* (end-to-end). Dibangun dengan arsitektur modern berkinerja tinggi: **Golang API** pada backend dan **React 19** pada frontend, dilengkapi dengan **Server-Sent Events (SSE)** untuk sinkronisasi data seketika tanpa perlu me-refresh browser.

---

## 1. Arsitektur & Tech Stack

### • Frontend: React
- **Library**: React 19 (`^19.2.8`)
- **Bahasa**: TypeScript (`~6.0.2`)
- **Tooling**: Vite 8 & Tailwind CSS 4
- **Routing & Networking**: React Router v7 & Axios
- **Real-Time Protocol**: HTML5 Server-Sent Events (`EventSource`)

### • Backend API: Golang
- **Bahasa & Runtime**: Golang `go1.27.1` (kompatibel `go >= 1.22`)
- **Web Framework**: Gin Gonic (`v1.12.0`)
- **Database**: MySQL 8.0
- **Real-Time Engine**: In-Memory Pub/Sub Event Hub (Server-Sent Events)
- **Concurrency Control**: Optimistic Locking (kolom `version`) & Idempotency Check

---

## 2. Cara Menjalankan Project (Cukup Satu Perintah)

Pastikan Docker & Docker Compose sudah terpasang di komputer Anda. Cukup jalankan perintah berikut dari direktori root project:

```bash
docker compose up --build
```

Setelah proses build selesai, seluruh layanan akan aktif secara otomatis:
- **Frontend Web UI**: [http://localhost:5173](http://localhost:5173)
- **Backend REST API**: [http://localhost:8080/api](http://localhost:8080/api)
- **Database MySQL**: `localhost:3306` (Database: `order_tracking`, User: `order_user`, Password: `order_password`)
- **Dummy / Seed Data**: Otomatis terisi (20 data order siap dicoba langsung).

> **Untuk Menjalankan Secara Terpisah (Local Dev Non-Docker)**:
> - Panduan Backend: silakan lihat [backend/README.md](file:///backend/README.md).
> - Panduan Frontend: silakan lihat [frontend/README.md](file:///frontend/README.md).

---

## 3. Daftar Asumsi (Merujuk ke Deliverable A / Case Study)

1. **Kasus Bisnis**: Perusahaan penyedia jasa teknisi lapangan mengalami penumpukan tiket ke Customer Service dengan pertanyaan *"Pekerjaan saya sudah sampai mana?"*. Solusi ini memberikan transparansi langsung kepada pelanggan dan kontrol pemantauan bagi tim operasional/dispatcher.
2. **Penanganan Jaringan Tidak Stabil di Lapangan**:
   - **Idempotensi**: Setiap request transisi status menyertakan `event_id` unik. Request yang terkirim ulang akibat retry jaringan tidak akan memicu pemrosesan ganda.
   - **Optimistic Concurrency Control**: Setiap data order dilindungi nomor versi (`version`). Jika dua pihak mencoba memperbarui order pada saat yang sama, konflik akan terdeteksi (HTTP 409 Conflict) dan mencegah terjadinya *lost update*.
3. **State Machine Transisi Status**:
   - `PENDING` ➔ `ASSIGNED` atau `CANCELLED`
   - `ASSIGNED` ➔ `IN_PROGRESS` atau `CANCELLED`
   - `IN_PROGRESS` ➔ `DONE` atau `CANCELLED`
   - `DONE` & `CANCELLED` merupakan status akhir (terminal) yang terkunci dari perubahan lebih lanjut.
4. **Pilihan Protokol Real-Time**: Server-Sent Events (SSE) dipilih dibandingkan WebSocket karena alur pembaruan bersifat *uni-directional push* dari server ke browser, lebih hemat daya dan memori, serta didukung *auto-reconnect* bawaan dari protokol HTTP.

---

## 4. Status Pengerjaan

| Fitur / Komponen | Status | Keterangan |
|---|---|---|
| **CRUD & Order Management API** | **Selesai** | Endpoints lengkap di Golang untuk order, status, cancel, dan history |
| **Real-Time SSE Stream Engine** | **Selesai** | In-memory pub/sub hub membroadcast perubahan order ke seluruh client |
| **Optimistic Locking & Idempotency** | **Selesai** | Mencegah race condition dan duplikasi event |
| **Validasi State Machine** | **Selesai** | Menolak transisi status yang tidak valid dengan error 422 |
| **Frontend Orders Dashboard** | **Selesai** | Metric summary, status filter, pencarian interaktif, status koneksi SSE |
| **Ubah Status Inline Tanpa Refresh** | **Selesai** | Dropdown aksi di samping tombol detail pada tabel pesanan |
| **Human-Crafted Order Detail Page** | **Selesai** | Stepper alur horizontal, kartu pelanggan, rincian layanan, salin order no. |
| **Jejak Audit / Timeline Real-Time** | **Selesai** | Visualisasi timeline aktivitas dengan penanda warna dan status *Live Sync* |
| **CI/CD GitHub Actions** | **Selesai** | Workflow test otomatis & build container (`test.yml` dan `deploy.yml`) |
| **Unit Testing Golang** | **Selesai** | Unit test transisi status di `order_service_test.go` |
| **Sistem Autentikasi Login (JWT)** | **Di-mock** | Identitas aktor (`ADMIN`, `CUSTOMER`) dioper via payload tanpa form login |
| **Notifikasi Gateway (WhatsApp / SMS)** | **Di-mock** | Dicatat di log sistem tanpa integrasi ke vendor gateway pihak ketiga |
| **GPS Geolocation Map Tracking** | **Di-mock** | Belum ada integrasi peta Leaflet / Google Maps untuk posisi fisik teknisi |
| **Multi-Node Redis Pub/Sub** | **Belum** | Hub SSE saat ini masih in-memory single instance |

---

## 5. Known Limitations (Keterbatasan yang Disadari)

1. **In-Memory SSE Hub (Single-Instance)**:
   - Hub SSE saat ini berjalan menggunakan Go channels dalam memori server tunggal. Apabila aplikasi di-scale menjadi multi-container/pod di Kubernetes tanpa Redis Pub/Sub atau sticky-session, event yang terjadi di satu instance tidak akan tersiar ke subscriber di instance lainnya.
2. **Koneksi Database Pool Tunggal**:
   - Query baca dan tulis saat ini menggunakan connection pool MySQL yang sama. Untuk beban jutaan pengguna, arsitektur perlu dipisahkan menjadi Read Replica dan Primary Write Database.
3. **Autentikasi Aktor Tanpa Verifikasi Kriptografis**:
   - `actor_type` dan `actor_id` saat ini dipercaya dari payload client atau nilai default sistem. Pada level produksi, data ini wajib diverifikasi melalui token JWT yang ditandatangani.
4. **Paginasi di Sisi Klien (Client-Side Filtering)**:
   - Pencarian dan filter status saat ini dilakukan di memori browser. Sangat cepat dan responsif untuk ratusan pesanan aktif, namun perlu diganti ke *Server-Side Pagination* jika data mencapai puluhan ribu record.

---

## 6. Daftar Endpoint API

| Method | Endpoint | Fungsi | Payload Utama |
|---|---|---|---|
| `GET` | `/api/orders` | Mengambil semua pesanan | - |
| `POST` | `/api/orders` | Membuat pesanan baru | `{"customer_name": "...", "service": "..."}` |
| `GET` | `/api/orders/:id` | Mengambil detail 1 pesanan | - |
| `PATCH` | `/api/orders/:id/status` | Mengubah status pesanan | `{"status": "ASSIGNED"}` *(event_id & actor opsional)* |
| `PATCH` | `/api/orders/:id` | Alias mengubah status pesanan | SAMA seperti di atas |
| `POST` | `/api/orders/:id/cancel` | Membatalkan pesanan | `{"event_id": "...", "actor_id": "..."}` |
| `GET` | `/api/orders/:id/history` | Mengambil riwayat aktivitas order | - |
| `GET` | `/api/orders/events` | Stream real-time Server-Sent Events | - |

---

## 7. Seed / Dummy Data

Database otomatis dilengkapi dengan **20 dummy order** melalui file [backend/seeds/seed.sql](file:///backend/seeds/seed.sql) agar reviewer dapat langsung mencoba sistem:
- **`PENDING`**: Pesanan menunggu penugasan (contoh: `ORD-001`, `ORD-008`, `ORD-012`, `ORD-016`).
- **`ASSIGNED`**: Pesanan telah ditugaskan ke teknisi (contoh: `ORD-002`, `ORD-006`, `ORD-011`, `ORD-015`).
- **`IN_PROGRESS`**: Pesanan sedang dikerjakan (contoh: `ORD-003`, `ORD-007`, `ORD-010`, `ORD-014`).
- **`DONE`**: Pesanan telah tuntas dikerjakan (contoh: `ORD-004`, `ORD-009`, `ORD-013`, `ORD-018`).
- **`CANCELLED`**: Pesanan yang dibatalkan (contoh: `ORD-005`, `ORD-019`).

**Hal yang Dapat Dicoba Langsung oleh Reviewer**:
1. Buka [http://localhost:5173](http://localhost:5173) di browser.
2. Gunakan **Filter Tab** untuk menyaring pesanan (Pending, Assigned, In Progress, Done, Cancelled).
3. Gunakan **Search Bar** untuk mencari order berdasarkan nama pelanggan atau nomor pesanan.
4. Pada kolom **Aksi**, klik tombol **"Ubah Status"** untuk memajukan status order (misal dari `PENDING` ke `ASSIGNED`) dan perhatikan perubahan badge dan versi v1 ➔ v2 secara instan tanpa reload halaman.
5. Klik **"Detail"** untuk melihat halaman detail yang menyajikan *Progress Stepper*, kartu identitas pelanggan, rincian pemesanan, tombol aksi status kontekstual, dan *Audit Trail* real-time.

