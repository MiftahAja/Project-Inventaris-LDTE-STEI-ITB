# Dokumentasi Aplikasi

Inventaris LDTE — Sistem Manajemen Inventaris Laboratorium

## 1. Pengenalan Aplikasi

Inventaris LDTE adalah aplikasi web yang dirancang untuk mengelola inventaris perangkat dan peralatan di lingkungan laboratorium. Aplikasi ini memungkinkan administrator dan petugas untuk mencatat, memantau, dan melaporkan seluruh aset inventaris secara digital.

Dengan antarmuka yang terstruktur, aplikasi ini membantu memastikan setiap barang tercatat dengan baik beserta kondisi, lokasi, dan riwayat pergerakannya.

## 2. Arsitektur dan Tech Stack

### Frontend

- React 19
- React Router DOM v7
- Tailwind CSS v4
- Vite
- Recharts (grafik)
- Lucide React (ikon)

### Backend

- Next.js 16 (API Routes)
- Prisma ORM
- PostgreSQL
- Supabase (auth adapter)
- Redis (ioredis)
- XLSX (export spreadsheet)

## 3. Struktur Data Utama

| Entitas | Keterangan | Relasi |
| --- | --- | --- |
| User | Akun pengguna (admin / petugas) | Assignment, ActivityLog |
| Barang | Data master barang/jenis peralatan | UnitBarang |
| Ruang Lab | Ruang laboratorium | Meja, UnitBarang, Assignment |
| Meja | Meja di dalam ruang lab | RuangLab, UnitBarang |
| Unit Barang | Satuan/spesimen fisik dari suatu barang | Barang, RuangLab, Meja, MutasiStok |
| Mutasi Stok | Riwayat pergerakan barang (masuk/keluar) | UnitBarang |
| Assignment | Penugasan petugas ke ruang lab | User, RuangLab |
| Activity Log | Catatan aktivitas pengguna | User |

## 4. Sistem Role dan Hak Akses

### Administrator

- Mengelola data barang (CRUD)
- Mengelola ruang lab dan meja
- Mengelola unit barang
- Mengelola data petugas
- Mencatat mutasi stok
- Menugaskan petugas ke lab
- Melihat activity log
- Export data ke spreadsheet
- Akses seluruh fitur aplikasi

### Petugas

- Melihat daftar barang
- Melihat ruang lab dan meja
- Melihat unit barang di lab yang ditugaskan
- Melihat lab yang ditugaskan (Lab Saya)
- Export data lab yang ditugaskan
- Akses dokumentasi dan panduan

## 5. Modul Aplikasi

### 5.1 Dashboard

Halaman utama yang menampilkan ringkasan data inventaris. Informasi yang ditampilkan meliputi total barang, jumlah unit tersedia, kondisi barang (baik, rusak, hilang), grafik barang masuk/keluar 7 hari terakhir, dan distribusi status unit barang.

### 5.2 Manajemen Barang

Modul untuk mengelola data master barang. Setiap barang memiliki nama unik yang menjadi identitas jenis peralatan. Admin dapat menambah, mengedit, dan menghapus data barang.

### 5.3 Ruang Lab

Modul untuk mengelola data ruang laboratorium. Setiap ruang lab memiliki nama dan deskripsi. Ruang lab menjadi lokasi penempatan meja dan unit barang.

### 5.4 Meja

Modul untuk mengelola meja di dalam ruang lab. Setiap meja terhubung ke satu ruang lab dan dapat menampung beberapa unit barang. Kombinasi nama meja dan ruang lab harus unik.

### 5.5 Unit Barang

Modul untuk mengelola satuan/spesimen fisik dari suatu barang. Setiap unit memiliki kode unik (dalam satu ruang lab), kondisi (baik, rusak, hilang), status (tersedia, dipinjam, dll.), serta lokasi penempatan (ruang lab dan meja).

### 5.6 Mutasi Stok

Modul untuk mencatat pergerakan barang masuk dan keluar. Setiap mutasi memiliki tipe (MASUK/KELUAR), tanggal, dan keterangan. Data dapat difilter berdasarkan tanggal.

### 5.7 Manajemen Penugasan

Modul admin untuk menugaskan petugas ke ruang lab tertentu. Setiap lab hanya boleh memiliki satu petugas aktif pada satu waktu. Riwayat penugasan tersimpan untuk keperluan audit.

### 5.8 Lab Saya

Halaman khusus petugas yang menampilkan daftar lab tempat mereka ditugaskan. Dari halaman ini, petugas dapat langsung melihat unit barang di lab terkait.

### 5.9 Activity Log

Modul admin untuk memantau seluruh aktivitas pengguna di dalam sistem. Setiap aktivitas tercatat beserta pelaku, deskripsi, waktu kejadian, dan jenis event.

### 5.10 Export Data

Modul untuk mengunduh data inventaris dalam format spreadsheet (.xlsx). Admin dapat export semua lab sekaligus atau per lab. Petugas hanya dapat export lab yang ditugaskan. File yang dihasilkan berisi detail meja, kondisi, dan status setiap unit barang.

### 5.11 Pusat Dukungan

Halaman untuk mengirim pesan atau pertanyaan terkait penggunaan aplikasi. Pengguna dapat mengisi formulir dengan nama, email, subjek, dan pesan. Respons akan diberikan dalam waktu 1x24 jam.

## 6. Endpoint API

| Endpoint | Method | Keterangan |
| --- | --- | --- |
| /api/auth/login | POST | Autentikasi pengguna |
| /api/auth/logout | POST | Logout pengguna |
| /api/auth/me | GET | Data profil pengguna aktif |
| /api/barang | GET/POST/PUT/DELETE | CRUD data barang |
| /api/unit-barang | GET/POST/PUT/DELETE | CRUD unit barang |
| /api/ruang-lab | GET/POST/PUT/DELETE | CRUD ruang lab |
| /api/meja | GET/POST/PUT/DELETE | CRUD meja |
| /api/mutasi-stok | GET/POST | Data dan pencatatan mutasi |
| /api/petugas | GET/POST/PUT/DELETE | Manajemen data petugas |
| /api/assignments | GET/POST | Penugasan petugas ke lab |
| /api/activity-log | GET | Riwayat aktivitas |
| /api/export-data | GET | Data untuk export spreadsheet |

## 7. Informasi Teknis

### Database

Menggunakan PostgreSQL dengan Prisma ORM. Schema terdiri dari tabel users, sessions, barangs, ruang_labs, mejas, unit_barangs, mutasi_stoks, assignments, activity_logs, dan tabel pendukung lainnya.

### Autentikasi

Sesi pengguna dikelola melalui tabel sessions dengan cookie-based authentication. Password di-hash menggunakan bcryptjs. Token autentikasi dihasilkan menggunakan jose (JWT).

### Deployment

Mendukung deployment menggunakan Docker (docker-compose). Perintah yang tersedia: docker:build, docker:up, docker:down, docker:dev, docker:prod.