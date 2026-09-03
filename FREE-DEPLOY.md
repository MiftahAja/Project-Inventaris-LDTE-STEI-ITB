# 🆓 Deploy GRATIS Tanpa Kartu Kredit

Panduan deploy aplikasi Inventaris LDTE **100% gratis** tanpa kartu kredit!

---

## 🎯 Stack Gratis

| Platform | Fungsi | Free Tier | Credit Card? |
|----------|--------|-----------|--------------|
| **Vercel** | Hosting Next.js | ✅ Unlimited deploys | ❌ Tidak |
| **Supabase** | PostgreSQL Database | ✅ 500MB, 50K rows | ❌ Tidak |
| **Upstash** | Redis Cache | ✅ 10K commands/day | ❌ Tidak |

---

## 📋 Langkah-langkah

### Langkah 1: Setup Supabase (Database)

#### 1.1 Buat Akun Supabase
1. Buka [supabase.com](https://supabase.com)
2. Sign up dengan GitHub (gratis)
3. **Tidak perlu kartu kredit!**

#### 1.2 Buat Project
1. Klik **New Project**
2. Isi:
   - **Organization**: Pilih atau buat baru
   - **Project name**: `inventaris-ldte`
   - **Database Password**: Buat password kuat
   - **Region**: Pilih terdekat (Singapore)
3. Klik **Create new project**
4. Tunggu ~2 menit

#### 1.3 Copy Database URL
1. Buka project yang sudah dibuat
2. Klik **Settings** (icon gear)
3. Klik **Database**
4. Scroll ke **Connection string**
5. Pilih **URI** tab
6. Copy URL, contoh:
   ```
   postgresql://postgres.xxxx:password@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```

#### 1.4 Setup Database Schema
1. Klik **SQL Editor** di sidebar
2. Copy isi `prisma/schema.prisma` (bagian model)
3. Buat SQL query untuk create tables
4. Atau gunakan Prisma:
   ```bash
   DATABASE_URL="<paste-url>" npx prisma db push
   ```

---

### Langkah 2: Setup Upstash (Redis)

#### 2.1 Buat Akun Upstash
1. Buka [upstash.com](https://upstash.com)
2. Sign up dengan GitHub (gratis)
3. **Tidak perlu kartu kredit!**

#### 2.2 Buat Database
1. Klik **Create Database**
2. Isi:
   - **Name**: `inventaris-redis`
   - **Region**: Pilih terdekat
3. Klik **Create**
4. **Tidak perlu card!**

#### 2.3 Copy Redis URL
1. Buka database yang sudah dibuat
2. Klik **Details** tab
3. Copy **REDIS_URL**, contoh:
   ```
   redis://default:xxxx@apn1-xxxx.upstash.io:6379
   ```

---

### Langkah 3: Setup Vercel (Hosting)

#### 3.1 Buat Akun Vercel
1. Buka [vercel.com](https://vercel.com)
2. Sign up dengan GitHub (gratis)
3. **Tidak perlu kartu kredit!**

#### 3.2 Import Project
1. Klik **Add New** → **Project**
2. Pilih **Import Git Repository**
3. Pilih repository `project-inventaris-ldte`
4. Klik **Import**

#### 3.3 Konfigurasi Build
- **Framework Preset**: Next.js
- **Build Command**: `prisma generate && next build`
- **Output Directory**: `.next`
- **Install Command**: `pnpm install`

#### 3.4 Set Environment Variables
Klik **Environment Variables** tab, tambah:

```
DATABASE_URL = <paste dari Supabase>
SESSION_SECRET = <generate sendiri>
REDIS_URL = <paste dari Upstash>
```

**Generate SESSION_SECRET:**
```bash
openssl rand -base64 32
```

#### 3.5 Deploy
1. Klik **Deploy**
2. Tunggu ~2-3 menit
3. Selesai! 🎉

---

## 🔧 Konfigurasi di Vercel

### Build Settings

```
Framework Preset: Next.js
Build Command: prisma generate && next build
Output Directory: .next
Install Command: pnpm install
Node.js Version: 20.x
```

### Environment Variables

| Key | Value | Source |
|-----|-------|--------|
| `DATABASE_URL` | `postgresql://...` | Supabase |
| `SESSION_SECRET` | `random-string` | Generate sendiri |
| `REDIS_URL` | `redis://...` | Upstash |

### Advanced Settings

```
Include Files: prisma/**
Ignore Build Step: false
```

---

## 📊 Arsitektur Gratis

```
┌─────────────────────────────────────────────────────────────────┐
│                    STACK GRATIS                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                      USER BROWSER                         │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    VERCEL CDN                             │  │
│  │                  (Global Edge Network)                    │  │
│  │                                                           │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │  │
│  │  │   Next.js   │  │   Static    │  │   Server    │     │  │
│  │  │   Server    │  │   Assets    │  │   Functions │     │  │
│  │  │   (Edge)    │  │   (CDN)     │  │   (Lambda)  │     │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘     │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│              ┌───────────────┴───────────────┐                  │
│              │                               │                  │
│              ▼                               ▼                  │
│  ┌─────────────────────┐       ┌─────────────────────┐         │
│  │     SUPABASE        │       │      UPSTASH        │         │
│  │   (PostgreSQL)      │       │     (Redis)         │         │
│  │                     │       │                     │         │
│  │  ┌───────────────┐  │       │  ┌───────────────┐  │         │
│  │  │   Database    │  │       │  │     Cache     │  │         │
│  │  │   (500MB)     │  │       │  │   (10K/day)   │  │         │
│  │  └───────────────┘  │       │  └───────────────┘  │         │
│  │                     │       │                     │         │
│  │  ┌───────────────┐  │       └─────────────────────┘         │
│  │  │  Auth, API    │  │                                       │
│  │  └───────────────┘  │                                       │
│  └─────────────────────┘                                       │
│                                                                  │
│  Biaya: $0/bulan (100% Gratis!)                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

```bash
# 1. Setup Supabase
# Buka supabase.com → Sign up → New Project → Copy DATABASE_URL

# 2. Setup Upstash
# Buka upstash.com → Sign up → Create Database → Copy REDIS_URL

# 3. Setup Vercel
# Buka vercel.com → Sign up → Import Project → Set Env Vars → Deploy

# 4. Generate SESSION_SECRET
openssl rand -base64 32

# 5. Set di Vercel Dashboard
# Settings → Environment Variables → Add:
# DATABASE_URL = <supabase-url>
# SESSION_SECRET = <random-string>
# REDIS_URL = <upstash-url>

# 6. Deploy!
# Vercel akan otomatis deploy saat push ke GitHub
```

---

## ⚠️ Catatan Penting

### Supabase Free Tier
- ✅ 500MB database
- ✅ 50,000 rows per table
- ✅ 500K Edge Function invocations
- ✅ 1GB file storage
- ⚠️ Database sleep setelah 7 hari tidak aktif

### Upstash Free Tier
- ✅ 10,000 commands/day
- ✅ 256MB storage
- ✅ 100 connections
- ⚠️ Melewati limit = error (app tetap jalan tanpa cache)

### Vercel Free Tier
- ✅ Unlimited deploys
- ✅ 100GB bandwidth
- ✅ Serverless Functions
- ⚠️ 10s timeout untuk Hobby plan

---

## 🔐 Environment Variables

```bash
# Database (Supabase)
DATABASE_URL=postgresql://postgres.xxxx:password@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres

# Session Secret (generate sendiri)
SESSION_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0=

# Redis (Upstash)
REDIS_URL=redis://default:xxxx@apn1-xxxx.upstash.io:6379
```

---

## 🛠️ Troubleshooting

### Masalah: Database Connection Error
```
Error: P1001: Can't reach database server
```
**Solusi:**
1. Pastikan Supabase project aktif
2. Cek `DATABASE_URL` benar
3. Tambahkan `?sslmode=require`:
   ```
   DATABASE_URL=postgresql://...?sslmode=require
   ```

### Masalah: Redis Connection Error
```
[Redis] Error: connect ECONNREFUSED
```
**Solusi:**
1. Pastikan Upstash database aktif
2. Cek `REDIS_URL` benar
3. App tetap jalan tanpa caching

### Masalah: Build Error
```
Error: prisma generate failed
```
**Solusi:**
1. Pastikan `prisma` ada di devDependencies
2. Build command: `prisma generate && next build`

### Masalah: 404 on API Routes
```
404: NOT_FOUND
```
**Solusi:**
1. Pastikan `output: "standalone"` di `next.config.ts`
2. Cek file structure benar

---

## 📊 Monitoring

### Vercel Dashboard
- **Deployments**: Lihat semua deploy
- **Analytics**: Lihat traffic
- **Logs**: Lihat function logs
- **Speed Insights**: Lihat performa

### Supabase Dashboard
- **Database**: Lihat tables & data
- **Authentication**: Lihat users
- **Storage**: Lihat files
- **Logs**: Lihat queries

### Upstash Dashboard
- **Console**: Lihat commands
- **Metrics**: Lihat usage
- **Logs**: Lihat requests

---

## 💡 Tips

1. **Vercel** otomatis deploy saat push ke GitHub
2. **Supabase** punya dashboard untuk manage database
3. **Upstash** punya REST API (bukan TCP)
4. Gunakan **Vercel CLI** untuk deploy lokal:
   ```bash
   npm i -g vercel
   vercel dev
   ```

---

## 📚 Referensi

- [Vercel Docs](https://vercel.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Upstash Docs](https://upstash.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
