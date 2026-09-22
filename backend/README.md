# Real-Time Order & Job Tracking — Backend API (Golang)

Backend REST API dan Server-Sent Events (SSE) stream service untuk sistem pelacakan order layanan operasional secara real-time. Dibangun menggunakan **Golang** dengan framework **Gin**, database **MySQL**, dan arsitektur *event-driven* berbasis *concurrency control*.

---

## 1. Tech Stack

- **Bahasa & Runtime**: Golang `go1.27.1` (kompatibel `go >= 1.22`)
- **Web Framework**: [Gin Gonic](https://github.com/gin-gonic/gin) (`v1.12.0`)
- **Database**: MySQL 8.0 dengan driver `github.com/go-sql-driver/mysql`
- **Real-Time Communication**: Server-Sent Events (SSE) dengan In-Memory Pub/Sub Hub
- **CORS Support**: `github.com/gin-contrib/cors`
- **Containerization**: Docker & Docker Compose

---

## 2. Cara Menjalankan Project

### A. Menjalankan Menggunakan Docker Compose (Satu Perintah - Direkomendasikan)
Dari direktori root project:
```bash
docker compose up --build backend mysql
```
Atau menyalakan seluruh stack (termasuk frontend):
```bash
docker compose up --build
```
API akan langsung aktif di `http://localhost:8080/api`. Database MySQL dan seed data otomatis siap digunakan.

### B. Menjalankan Manual (Local Development)

1. **Pastikan MySQL Aktif**:
   Buat database `order_tracking`:
   ```sql
   CREATE DATABASE order_tracking;
   ```

2. **Jalankan Migrasi & Seed Data**:
   Import file SQL berurutan:
   ```bash
   mysql -u root -p order_tracking < backend/migrations/001_create_orders.sql
   mysql -u root -p order_tracking < backend/migrations/002_create_order_events.sql
   mysql -u root -p order_tracking < backend/seeds/seed.sql
   ```

3. **Konfigurasi Environment Variable**:
   Salin file `.env.example` menjadi `.env` di folder `backend/`:
   ```env
   APP_PORT=8080
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=root
   DB_NAME=order_tracking
   GIN_MODE=debug
   ```

4. **Install Dependencies & Jalankan Server**:
   ```bash
   cd backend
   go mod download
   go run ./cmd/server/main.go
   ```
   Server akan berjalan di `http://localhost:8080`.

5. **Menjalankan Unit Test**:
   ```bash
   cd backend
   go test -v ./...
   ```

---

## 3. Daftar Asumsi (Merujuk ke Deliverable A / Case Study)

1. **Konteks Bisnis**: Sistem digunakan oleh perusahaan penyedia jasa/teknisi lapangan untuk mengurangi beban customer service dengan menyediakan transparansi status pekerjaan secara real-time kepada pelanggan dan dispatcher.
2. **Koneksi Lapangan Tidak Stabil**: Teknisi dapat mengalami jaringan terputus (reconnect/retry). Oleh karena itu sistem menerapkan:
   - **Idempotensi**: Setiap event perubahan status memiliki `event_id` unik. Request duplikat tidak akan memicu state transition ganda.
   - **Optimistic Concurrency Control**: Kolom `version` pada setiap order mencegah terjadinya *race condition* dan *lost update* bila dua pihak memperbarui order bersamaan.
3. **Aturan Transisi Status (State Machine)**:
   - `PENDING` ➔ `ASSIGNED` atau `CANCELLED`
   - `ASSIGNED` ➔ `IN_PROGRESS` atau `CANCELLED`
   - `IN_PROGRESS` ➔ `DONE` atau `CANCELLED`
   - `DONE` & `CANCELLED` merupakan status akhir (terminal), tidak dapat diubah kembali.
4. **SSE vs WebSocket**: SSE dipilih untuk pengiriman update dari server ke client karena model aplikasi bertipe *uni-directional push* (update status dibroadcast ke client), lebih hemat resource, dan memiliki fitur *auto-reconnect* bawaan pada browser.

---

## 4. Status Pengerjaan

| Fitur / Komponen | Status | Keterangan |
|---|---|---|
| REST API CRUD & Status Tracking | Selesai | Mengambil list, detail, create, patch status, cancel, history |
| Server-Sent Events (SSE) Stream | Selesai | In-memory Hub publish-subscribe untuk `order.updated` |
| Idempotency Check | Selesai | Pengecekan `event_id` duplikat di `order_events` |
| Optimistic Locking (`version`) | Selesai | Update atomik dengan verifikasi nomor versi |
| State Transition Validation | Selesai | Enforce state machine yang menolak transisi ilegal (422) |
| Unit Testing | Selesai | Pengujian unit test transisi status di `order_service_test.go` |
| Sistem Autentikasi Pengguna | **Di-mock** | Actor ID & Actor Type dioper via payload/default (`ADMIN`/`SYSTEM`), belum ada JWT session login |
| Notifikasi WhatsApp / Email | **Di-mock** | Tercatat pada log sistem tanpa dispatch ke vendor gateway SMS/WA |
| Multi-Node Distributed Pub/Sub | Belum | Masih in-memory channels (belum terhubung ke Redis Pub/Sub) |

---

## 5. Known Limitations (Keterbatasan yang Disadari)

1. **In-Memory SSE Hub**:
   - Event SSE di-broadcast melalui Go channels memori lokal. Jika aplikasi di-deploy dengan *horizontal scaling* (multi-instance / multi-pod) tanpa sticky session atau message broker terpusat (seperti Redis Pub/Sub atau RabbitMQ), event yang dipicu di Pod A tidak akan sampai ke subscriber di Pod B.
2. **Koneksi Database Pool Tunggal**:
   - Query read dan write masih berbagi connection pool MySQL yang sama. Pada beban read tinggi, pemisahan Read Replica dan Master Write DB akan lebih optimal.
3. **Autentikasi & Otorisasi**:
   - `actor_type` dan `actor_id` saat ini dipercaya dari body request atau di-default secara otomatis. Di lingkungan produksi sesungguhnya, identitas aktor wajib di-ekstrak dari token JWT yang terverifikasi secara kriptografis.
4. **Batas Koneksi HTTP/1.1 SSE**:
   - Pada browser tanpa HTTP/2, terdapat limitasi 6 koneksi concurrent per domain untuk EventSource. Disarankan menggunakan reverse proxy (Nginx / Cloudflare) dengan HTTP/2 aktif saat deployment produksi.

---

## 6. Daftar Endpoint API

| Method | Endpoint | Deskripsi | Request Body / Query | Respon Sukses |
|---|---|---|---|---|
| `GET` | `/api/orders` | Mendapatkan seluruh daftar order | - | `200 OK` (Array of Orders) |
| `POST` | `/api/orders` | Membuat order baru | `{"customer_name": "string", "service": "string"}` | `201 Created` |
| `GET` | `/api/orders/:id` | Mengambil detail 1 order | - | `200 OK` (Order object) |
| `PATCH` | `/api/orders/:id/status` | Memperbarui status order | `{"status": "ASSIGNED", "event_id": "...", "actor_type": "...", "actor_id": "..."}` | `200 OK` |
| `PATCH` | `/api/orders/:id` | Alias memperbarui status order | SAMA seperti di atas | `200 OK` |
| `POST` | `/api/orders/:id/cancel` | Membatalkan order | `{"event_id": "...", "actor_id": "..."}` | `200 OK` |
| `GET` | `/api/orders/:id/history` | Mengambil riwayat perubahan order | - | `200 OK` (Array of Events) |
| `GET` | `/api/orders/events` | Stream Server-Sent Events (SSE) | - | `200 OK` (`text/event-stream`) |

---

## 7. Seed / Dummy Data

File dummy data telah disediakan di `backend/seeds/seed.sql` berisi **20 order awal** dengan berbagai variasi status:
- **`PENDING`**: Pesanan baru masuk (menunggu penugasan).
- **`ASSIGNED`**: Pesanan telah ditugaskan ke teknisi.
- **`IN_PROGRESS`**: Pesanan yang sedang dikerjakan di lapangan.
- **`DONE`**: Pesanan yang sudah selesai tuntas.
- **`CANCELLED`**: Pesanan yang dibatalkan.

Variasi layanan meliputi *AC Maintenance, Electrical Repair, CCTV Installation, Machine Inspection, Network Installation, Plumbing Repair*, dan lain-lain, sehingga reviewer dapat langsung menguji fungsionalitas pencarian, filter, transisi status, dan detail order tanpa perlu input data manual terlebih dahulu.
