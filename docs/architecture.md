
---

# 3. `docs/case-study.md`

```md
# Case Study
# Real-Time Order & Job Tracking

## 1. Business Context

Sebuah platform layanan operasional atau jasa lapangan mengalami peningkatan jumlah pertanyaan dari client mengenai status pekerjaan.

Pertanyaan yang sering diterima Customer Service:

> "Pekerjaan saya sudah sampai mana?"

Customer Service harus melakukan pengecekan secara manual kepada tim operasional atau teknisi.

Kondisi tersebut menyebabkan:

- workload Customer Service meningkat
- client harus menunggu informasi
- informasi status tidak selalu real-time
- terdapat risiko informasi yang terlambat
- proses monitoring menjadi tidak efisien

Solusi yang diusulkan adalah sistem Real-Time Order & Job Tracking.

---

# 2. Business Objective

Sistem memiliki beberapa tujuan:

1. Memberikan informasi status pekerjaan secara real-time.
2. Mengurangi kebutuhan client menghubungi Customer Service.
3. Memungkinkan teknisi memperbarui status pekerjaan.
4. Memungkinkan admin/dispatcher memonitor seluruh order.
5. Menyediakan history perubahan status.
6. Menangani koneksi yang tidak stabil.
7. Mencegah duplicate event dan conflicting update.

---

# 3. Actors

## Client

Client dapat:

- membuat order
- melihat order
- melihat status pekerjaan
- melihat timeline
- membatalkan order pada tahap tertentu

---

## Admin / Dispatcher

Admin dapat:

- melihat seluruh order
- melakukan monitoring
- melakukan assignment
- mengubah status
- melihat history
- menangani order yang membutuhkan perhatian

---

## Field Officer / Technician

Teknisi dapat:

- melihat pekerjaan
- memperbarui status
- memberikan update dari lapangan

Teknisi dapat memiliki koneksi internet yang tidak stabil sehingga sistem harus mampu menangani retry dan reconnect.

---

# 4. Order Lifecycle

Lifecycle utama:

```text
PENDING
   |
   v
ASSIGNED
   |
   v
IN_PROGRESS
   |
   v
DONE