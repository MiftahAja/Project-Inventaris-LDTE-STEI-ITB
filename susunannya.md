# 📁 Susunan Project - Inventaris LDTE

> Dokumentasi lengkap susunan folder dan file project Inventaris LDTE

---

## 🏗️ Arsitektur Project

```
project-inventaris-ldte/
│
├── 🐳 Docker & Deploy
│   ├── Dockerfile                    # Multi-stage Docker build
│   ├── docker-compose.yml            # Docker Compose (App + PostgreSQL + Redis)
│   ├── .dockerignore                 # File yang diabaikan saat build Docker
│   ├── railway.json                  # Konfigurasi deploy ke Railway
│   └── render.yaml                   # Konfigurasi deploy ke Render
│
├── ⚙️ Konfigurasi
│   ├── package.json                  # Dependencies dan scripts
│   ├── pnpm-lock.yaml                # Lock file dependencies
│   ├── next.config.ts                # Konfigurasi Next.js (standalone, security headers)
│   ├── tsconfig.json                 # Konfigurasi TypeScript
│   ├── postcss.config.mjs            # Konfigurasi PostCSS (Tailwind)
│   ├── eslint.config.mjs             # Konfigurasi ESLint
│   └── .env                          # Environment variables (tidak di-commit)
│
├── 📚 Dokumentasi
│   ├── README.md                     # Dokumentasi utama
│   ├── DEPLOYMENT.md                 # Panduan deployment
│   ├── DESKRIPSI.md                  # Deskripsi project
│   ├── WORKFLOW.md                   # Workflow optimasi
│   └── susunannya.md                 # Dokumentasi ini
│
├── 🗄️ Database
│   └── prisma/
│       ├── schema.prisma             # Database schema (Prisma)
│       ├── seed.ts                   # Seed data untuk development
│       └── reset.ts                  # Script reset database
│
├── 🌐 Public Assets
│   └── public/
│       ├── logo.svg                  # Logo aplikasi
│       ├── icon.svg                  # Icon aplikasi
│       ├── next.svg                  # Next.js logo
│       ├── vercel.svg                # Vercel logo
│       ├── file.svg                  # File icon
│       └── globe.svg                 # Globe icon
│
└── 💻 Source Code
    └── src/
        ├── middleware.ts              # Next.js middleware (auth, redirects)
        │
        ├── 📦 Components
        │   └── components/
        │       ├── AuthLayout.tsx         # Layout untuk halaman yang butuh auth
        │       ├── Sidebar.tsx            # Sidebar navigation
        │       ├── DataTable.tsx          # Komponen tabel data universal
        │       ├── DashboardCharts.tsx    # Grafik dashboard (recharts)
        │       ├── ConfirmDialog.tsx      # Modal konfirmasi
        │       ├── ConfirmDeleteModal.tsx # Modal konfirmasi hapus
        │       ├── ThemeScript.tsx        # Script dark mode (anti-FOUC)
        │       └── Aurora.tsx             # Efek aurora (dekoratif)
        │
        ├── 📚 Library
        │   └── lib/
        │       ├── db.ts                  # Prisma client (database)
        │       ├── redis.ts               # Redis client (caching)
        │       ├── cache.ts               # Cache utility (get/set/invalidate)
        │       ├── auth.ts                # Auth utility (requireAuth, requireAdmin)
        │       ├── session.ts             # Session management (JWT)
        │       ├── validators.ts          # Zod validation schemas
        │       ├── utils.ts               # Utility functions (cn, formatDate)
        │       ├── activity-log.ts        # Activity logging
        │       └── performance.ts         # Performance monitoring
        │
        └── 📄 Pages (App Router)
            └── app/
                ├── layout.tsx             # Root layout (fonts, metadata)
                ├── page.tsx               # Root page (redirect ke /login atau /home)
                ├── globals.css            # Global styles (Tailwind)
                ├── logo.svg               # Logo
                └── icon.svg               # Icon
```

---

## 📄 Halaman (Pages)

### 🔐 Autentikasi
```
app/
├── login/
│   ├── page.tsx                   # Halaman login
│   └── LoginClient.tsx            # Client component login form
│
└── register/
    ├── page.tsx                   # Halaman register
    └── RegisterClient.tsx         # Client component register form
```

### 🏠 Dashboard
```
app/
└── home/
    ├── page.tsx                   # Dashboard utama (server component)
    └── DashboardChartsWrapper.tsx # Wrapper grafik (dynamic import)
```

### 📦 Master Data Barang
```
app/
├── barang/
│   ├── page.tsx                   # Daftar barang
│   ├── BarangClient.tsx           # Client component barang
│   ├── BarangForm.tsx             # Form tambah/edit barang
│   ├── create/
│   │   └── page.tsx               # Halaman tambah barang
│   └── edit/
│       └── [id]/
│           └── page.tsx           # Halaman edit barang
│
├── unit-barang/
│   ├── page.tsx                   # Daftar unit barang
│   ├── UnitBarangClient.tsx       # Client component unit barang
│   ├── UnitBarangForm.tsx         # Form tambah/edit unit barang
│   ├── create/
│   │   └── page.tsx               # Halaman tambah unit barang
│   └── edit/
│       └── [id]/
│           └── page.tsx           # Halaman edit unit barang
│
├── ruang-lab/
│   ├── page.tsx                   # Daftar ruang lab
│   ├── RuangLabClient.tsx         # Client component ruang lab
│   ├── RuangLabForm.tsx           # Form tambah/edit ruang lab
│   ├── create/
│   │   └── page.tsx               # Halaman tambah ruang lab
│   └── edit/
│       └── [id]/
│           └── page.tsx           # Halaman edit ruang lab
│
└── meja/
    ├── page.tsx                   # Daftar meja
    ├── MejaClient.tsx             # Client component meja
    ├── MejaForm.tsx               # Form tambah/edit meja
    ├── create/
    │   └── page.tsx               # Halaman tambah meja
    └── edit/
        └── [id]/
            └── page.tsx           # Halaman edit meja
```

### 👥 Petugas (Admin Only)
```
app/
└── petugas/
    ├── page.tsx                   # Daftar petugas
    ├── PetugasClient.tsx          # Client component petugas
    ├── PetugasForm.tsx            # Form tambah/edit petugas
    ├── create/
    │   └── page.tsx               # Halaman tambah petugas
    └── edit/
        └── [id]/
            └── page.tsx           # Halaman edit petugas
```

### 📊 Transaksi (Admin Only)
```
app/
├── mutasi-stok/
│   ├── page.tsx                   # Daftar mutasi stok
│   ├── MutasiStokClient.tsx       # Client component mutasi stok
│   ├── MutasiStokForm.tsx         # Form tambah mutasi stok
│   └── create/
│       └── page.tsx               # Halaman tambah mutasi stok
│
└── assignments/
    ├── page.tsx                   # Daftar penugasan
    ├── AssignmentClient.tsx       # Client component penugasan
    └── ruang-lab/
        └── [id]/
            └── page.tsx           # Penugasan per ruang lab
```

### 📋 Lainnya
```
app/
├── my-labs/
│   └── page.tsx                   # Lab saya (petugas)
│
├── activity-log/
│   ├── page.tsx                   # Daftar activity log
│   └── ActivityLogClient.tsx      # Client component activity log
│
├── export/
│   ├── page.tsx                   # Export data
│   └── ExportClient.tsx           # Client component export
│
├── documentation/
│   └── page.tsx                   # Dokumentasi
│
├── panduan-aplikasi/
│   └── page.tsx                   # Panduan aplikasi
│
└── customer-service/
    ├── page.tsx                   # Customer service
    └── CustomerServiceClient.tsx  # Client component CS
```

---

## 🔌 API Routes

### 🔐 Auth API
```
app/api/auth/
├── login/
│   └── route.ts                   # POST /api/auth/login
├── logout/
│   └── route.ts                   # POST /api/auth/logout
└── register/
    └── route.ts                   # POST /api/auth/register
```

### 📦 Data API
```
app/api/
├── barang/
│   ├── route.ts                   # GET, POST /api/barang
│   └── [id]/
│       └── route.ts               # PUT, DELETE /api/barang/:id
│
├── unit-barang/
│   ├── route.ts                   # GET, POST /api/unit-barang
│   └── [id]/
│       └── route.ts               # PUT, DELETE /api/unit-barang/:id
│
├── ruang-lab/
│   ├── route.ts                   # GET, POST /api/ruang-lab
│   └── [id]/
│       └── route.ts               # PUT, DELETE /api/ruang-lab/:id
│
├── meja/
│   ├── route.ts                   # GET, POST /api/meja
│   └── [id]/
│       └── route.ts               # PUT, DELETE /api/meja/:id
│
├── petugas/
│   ├── route.ts                   # GET, POST /api/petugas
│   └── [id]/
│       └── route.ts               # PUT, DELETE /api/petugas/:id
│
├── mutasi-stok/
│   └── route.ts                   # GET, POST /api/mutasi-stok
│
└── assignments/
    ├── route.ts                   # GET, POST /api/assignments
    └── [id]/
        └── route.ts               # DELETE /api/assignments/:id
```

---

## 🗄️ Database Schema (Prisma)

### Tabel Utama

```
┌─────────────────────────────────────────────────────────────────┐
│                        DATABASE SCHEMA                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐  │
│  │    users      │      │  tambah_      │      │  sessions    │  │
│  │──────────────│ 1───1 │  petugas     │      │──────────────│  │
│  │ id           │      │──────────────│      │ id           │  │
│  │ name         │      │ user_id      │      │ user_id      │  │
│  │ email        │      │ no_telp      │      │ ip_address   │  │
│  │ role         │      │ alamat       │      │ user_agent   │  │
│  │ password     │      └──────────────┘      │ payload      │  │
│  └──────────────┘                            └──────────────┘  │
│                                                                  │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐  │
│  │  fakultas     │      │program_studis│      │ mata_kuliahs │  │
│  │──────────────│ 1───N │──────────────│ 1───N │──────────────│  │
│  │ id           │      │ id           │      │ id           │  │
│  │ name         │      │ fakultas_id  │      │ program_     │  │
│  └──────────────┘      │ name         │      │   studi_id   │  │
│                         └──────────────┘      │ kode         │  │
│                                                │ nama         │  │
│                                                └──────────────┘  │
│                                                                  │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐  │
│  │   barangs     │      │  ruang_labs  │      │    mejas     │  │
│  │──────────────│      │──────────────│      │──────────────│  │
│  │ id           │      │ id           │ 1───N │ id           │  │
│  │ nama_barang  │      │ nama_ruang   │      │ ruang_lab_id │  │
│  └──────────────┘      │ deskripsi    │      │ meja         │  │
│                         └──────────────┘      └──────────────┘  │
│                              │                      │            │
│                              │ 1                    │ 1          │
│                              │                      │            │
│                              ▼                      ▼            │
│                    ┌──────────────────────────────────────┐      │
│                    │         unit_barangs                  │      │
│                    │──────────────────────────────────────│      │
│                    │ id                                   │      │
│                    │ barang_id ──────────────────────┐    │      │
│                    │ kode_barang                      │    │      │
│                    │ kondisi_barang                   │    │      │
│                    │ status                           │    │      │
│                    │ ruang_lab_id ──────────────────┐ │    │      │
│                    │ meja_id ─────────────────────┐ │ │    │      │
│                    └──────────────────────────────┼─┼─┼────┘      │
│                                                   │ │ │           │
│                    ┌──────────────────────────────┘ │ │           │
│                    │                                │ │           │
│                    ▼                                ▼ │           │
│          ┌──────────────┐                  ┌──────────────┐      │
│          │ mutasi_stoks │                  │ barang_masuks│      │
│          │──────────────│                  │──────────────│      │
│          │ id           │                  │ id           │      │
│          │ unit_barang_id│                  │ unit_barang_id│      │
│          │ tipe         │                  │ kode_barang  │      │
│          │ tanggal      │                  │ keterangan   │      │
│          │ keterangan   │                  │ tgl_barang_  │      │
│          └──────────────┘                  │   masuk      │      │
│                                             └──────────────┘      │
│                                                                  │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐  │
│  │ assignments  │      │ activity_    │      │   cache      │  │
│  │──────────────│      │   logs       │      │──────────────│  │
│  │ id           │      │──────────────│      │ key          │  │
│  │ user_id      │      │ id           │      │ value        │  │
│  │ ruang_lab_id │      │ log_name     │      │ expiration   │  │
│  │ is_active    │      │ description  │      └──────────────┘  │
│  │ assigned_by  │      │ subject_type │                        │
│  └──────────────┘      │ subject_id   │                        │
│                         │ event        │                        │
│                         │ causer_id    │                        │
│                         │ properties   │                        │
│                         └──────────────┘                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Teknologi yang Digunakan

### Frontend
| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| Next.js | 16.3.4 | React Framework |
| React | 19.2.8 | UI Library |
| TypeScript | 5.x | Type Safety |
| Tailwind CSS | 4.x | Styling |
| Lucide React | 1.39.0 | Icons |
| Recharts | 3.10.1 | Grafik |
| Zod | 4.5.4 | Validation |

### Backend
| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| Prisma | 6.19.3 | ORM |
| PostgreSQL | 16 | Database |
| Redis | 7 | Caching |
| bcryptjs | 3.0.3 | Password Hashing |
| jose | 6.2.10 | JWT |
| ioredis | 6.0.0 | Redis Client |

### DevOps
| Teknologi | Fungsi |
|-----------|--------|
| Docker | Containerization |
| Docker Compose | Multi-container |
| Railway | Cloud Deploy |
| Render | Cloud Deploy |

---

## 🚀 Scripts

```json
{
  "dev": "next dev --webpack",
  "build": "prisma generate && next build --webpack",
  "start": "next start",
  "lint": "eslint",
  "postinstall": "prisma generate || exit 0",
  "db:push": "prisma db push",
  "db:seed": "npx tsx prisma/seed.ts",
  "db:reset": "prisma db push --force-reset && npm run db:seed",
  "db:empty": "npx tsx prisma/reset.ts",
  "docker:build": "docker-compose build",
  "docker:up": "docker-compose up -d",
  "docker:down": "docker-compose down",
  "docker:logs": "docker-compose logs -f",
  "docker:dev": "docker-compose up -d && docker-compose logs -f app",
  "docker:prod": "docker-compose -f docker-compose.yml up -d --build",
  "docker:clean": "docker-compose down -v --rmi all"
}
```

---

## 📊 Flow Aplikasi

```
┌─────────────────────────────────────────────────────────────────┐
│                     FLOW APLIKASI                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  User                                                            │
│    │                                                             │
│    ▼                                                             │
│  ┌──────────────┐                                               │
│  │   Login      │ ◄─── /login                                   │
│  │   Page       │                                               │
│  └──────────────┘                                               │
│    │                                                             │
│    ├─► Register ──────► /register                               │
│    │                                                             │
│    ▼                                                             │
│  ┌──────────────┐                                               │
│  │   Middleware  │ ◄─── JWT Validation                           │
│  │   (Edge)     │                                               │
│  └──────────────┘                                               │
│    │                                                             │
│    ├─► Not Authenticated ──► /login                             │
│    │                                                             │
│    ▼                                                             │
│  ┌──────────────┐                                               │
│  │   Dashboard  │ ◄─── /home                                    │
│  │   (Home)     │                                               │
│  └──────────────┘                                               │
│    │                                                             │
│    ├──► Barang ──────► /barang                                  │
│    ├──► Ruang Lab ───► /ruang-lab                               │
│    ├──► Meja ────────► /meja                                    │
│    ├──► Unit Barang ─► /unit-barang                             │
│    ├──► Mutasi Stok ─► /mutasi-stok (admin)                    │
│    ├──► Petugas ─────► /petugas (admin)                        │
│    ├──► Penugasan ───► /assignments (admin)                    │
│    ├──► Activity Log ─► /activity-log (admin)                  │
│    └──► Export ──────► /export (admin)                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Flow Autentikasi

```
┌─────────────────────────────────────────────────────────────────┐
│                  FLOW AUTENTIKASI                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. User Login                                                   │
│     POST /api/auth/login                                         │
│     │                                                            │
│     ▼                                                            │
│  ┌──────────────┐                                               │
│  │  Validate    │ ◄─── Check email & password                    │
│  │  Credentials │     (bcrypt compare)                           │
│  └──────────────┘                                               │
│     │                                                            │
│     ▼                                                            │
│  ┌──────────────┐                                               │
│  │  Create      │ ◄─── Generate JWT token                        │
│  │  Session     │     (jose SignJWT)                             │
│  └──────────────┘                                               │
│     │                                                            │
│     ▼                                                            │
│  ┌──────────────┐                                               │
│  │  Set Cookie  │ ◄─── httpOnly, secure, sameSite                │
│  │  (session)   │                                                │
│  └──────────────┘                                               │
│     │                                                            │
│     ▼                                                            │
│  Redirect to /home                                               │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  2. Subsequent Requests                                          │
│     │                                                            │
│     ▼                                                            │
│  ┌──────────────┐                                               │
│  │  Middleware   │ ◄─── Check session cookie                      │
│  │  (Edge)      │     (jose jwtVerify)                           │
│  └──────────────┘                                               │
│     │                                                            │
│     ├─► Valid ──────► Continue to page                           │
│     │                                                            │
│     └─► Invalid ────► Redirect to /login                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flow Caching (Redis)

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLOW CACHING                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  API Request                                                     │
│    │                                                             │
│    ▼                                                             │
│  ┌──────────────┐                                               │
│  │  Check Redis │ ◄─── getCache(key)                             │
│  │  Cache       │                                                │
│  └──────────────┘                                               │
│    │                                                             │
│    ├─► Cache Hit ──────► Return cached data                      │
│    │                      (30-60 seconds)                        │
│    │                                                             │
│    └─► Cache Miss ─────► Query PostgreSQL                        │
│                              │                                   │
│                              ▼                                   │
│                        ┌──────────────┐                          │
│                        │  Store in    │ ◄─── setCache(key, data) │
│                        │  Redis       │      (TTL: 30s)          │
│                        └──────────────┘                          │
│                              │                                   │
│                              ▼                                   │
│                        Return fresh data                         │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  Cache Invalidation (on write operations)                        │
│    │                                                             │
│    ▼                                                             │
│  ┌──────────────┐                                               │
│  │  Delete      │ ◄─── invalidateEntityCache("barangs")          │
│  │  Related     │                                                │
│  │  Cache Keys  │                                                │
│  └──────────────┘                                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🐳 Docker Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    DOCKER ARCHITECTURE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                  Docker Network                          │    │
│  │                                                          │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │    │
│  │  │   Next.js   │  │ PostgreSQL  │  │    Redis    │    │    │
│  │  │   :3000     │  │   :5432     │  │   :6379     │    │    │
│  │  │             │  │             │  │             │    │    │
│  │  │  ┌───────┐  │  │  ┌───────┐  │  │  ┌───────┐  │    │    │
│  │  │  │ Node  │  │  │  │ Postgres│  │  │  │ Redis │  │    │    │
│  │  │  │ Server│  │  │  │ Server│  │  │  │ Server│  │    │    │
│  │  │  └───────┘  │  │  └───────┘  │  │  └───────┘  │    │    │
│  │  │             │  │             │  │             │    │    │
│  │  │  /app/      │  │  /var/lib/  │  │  /data/     │    │    │
│  │  │  .next/     │  │  postgresql/│  │             │    │    │
│  │  │  standalone/│  │  data/      │  │             │    │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘    │    │
│  │                                                          │    │
│  │  Volumes:                                                │    │
│  │  - redis_data (Redis persistence)                       │    │
│  │  - postgres_data (PostgreSQL data)                       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Resource Limits:                                                │
│  - App: 2 CPU, 1GB RAM                                          │
│  - PostgreSQL: 1 CPU, 512MB RAM                                 │
│  - Redis: 0.5 CPU, 256MB RAM                                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 File Size Summary

| Folder | File Count | Description |
|--------|------------|-------------|
| `src/app/` | ~40 files | Pages & API routes |
| `src/components/` | 8 files | Reusable components |
| `src/lib/` | 9 files | Utility functions |
| `prisma/` | 3 files | Database schema & scripts |
| `public/` | 6 files | Static assets |
| Root | ~15 files | Config files |

---

## 🎯 Summary

Project **Inventaris LDTE** adalah aplikasi manajemen inventaris laboratorium yang dibangun dengan:

- **Framework**: Next.js 16 dengan App Router
- **Database**: PostgreSQL dengan Prisma ORM
- **Caching**: Redis untuk performa optimal
- **Auth**: JWT-based authentication
- **Deployment**: Docker-based (Railway/Render)
- **Styling**: Tailwind CSS

Aplikasi ini mendukung:
- ✅ CRUD Barang, Unit Barang, Ruang Lab, Meja
- ✅ Mutasi Stok (MASUK/KELUAR)
- ✅ Manajemen Petugas & Penugasan
- ✅ Activity Log
- ✅ Export Data
- ✅ Dark Mode
- ✅ Responsive Design
