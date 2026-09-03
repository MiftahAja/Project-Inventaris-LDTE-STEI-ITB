# 🔧 Setup Environment Variables di Render

Panduan lengkap cara setting environment variables untuk deploy di Render.

---

## 📋 Daftar Isi

1. [Environment Variables yang Dibutuhkan](#1-environment-variables-yang-dibutuhkan)
2. [Cara Setup via Dashboard](#2-cara-setup-via-dashboard)
3. [Cara Setup via render.yaml](#3-cara-setup-via-renderyaml)
4. [Troubleshooting](#4-troubleshooting)

---
ct-Inventaris-LDTE-STEI-ITB
## 1. Environment Variables yang Dibutuhkan

### Required Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Mode produksi |
| `DATABASE_URL` | `postgresql://...` | Koneksi ke PostgreSQL |
| `SESSION_SECRET` | `random-string` | Secret untuk JWT |
| `REDIS_URL` | `redis://...` | Koneksi ke Redis |

### Optional Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `PORT` | `3000` | Port aplikasi (otomatis di Render) |
| `HOSTNAME` | `0.0.0.0` | Host binding |

---

## 2. Cara Setup via Dashboard

### Langkah 1: Buat Akun Render
1. Buka [render.com](https://render.com)
2. Sign up dengan GitHub
3. Verify email

### Langkah 2: Create Web Service
1. Klik **New +** → **Web Service**
2. Connect GitHub repository
3. Pilih repository `project-inventaris-ldte`
4. Konfigurasi:
   - **Name**: `inventaris-ldte`
   - **Runtime**: `Docker`
   - **Dockerfile Path**: `./Dockerfile`
   - **Plan**: `Free`

### Langkah 3: Tambah PostgreSQL
1. Klik **New +** → **PostgreSQL**
2. Konfigurasi:
   - **Name**: `inventaris-db`
   - **Database**: `inventaris_ldte`
   - **Plan**: `Free**
3. Klik **Create Database**
4. Copy **Internal Database URL** (format: `postgresql://user:password@host:5432/dbname`)

### Langkah 4: Tambah Redis
1. Klik **New +** → **Redis**
2. Konfigurasi:
   - **Name**: `inventaris-redis`
   - **Plan**: `Free**
3. Klik **Create Redis**
4. Copy **Internal Redis URL** (format: `redis://user:password@host:port`)

### Langkah 5: Set Environment Variables

Buka Web Service → **Environment** tab → Tambah variables berikut:

```
NODE_ENV=production
DATABASE_URL=<paste Internal Database URL dari PostgreSQL>
SESSION_SECRET=<generate sendiri, lihat cara di bawah>
REDIS_URL=<paste Internal Redis URL dari Redis>
```

### Generate SESSION_SECRET

```bash
# macOS/Linux
openssl rand -base64 32

# Atau gunakan online generator
# https://www.grc.com/passwords.htm
```

Contoh output:
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0=
```

### Langkah 6: Deploy
1. Klik **Manual Deploy** → **Deploy latest commit**
2. Tunggu build selesai (~5-10 menit)
3. Klik **Logs** untuk melihat progress
4. Setelah success, klik URL yang diberikan

---

## 3. Cara Setup via render.yaml

### Menggunakan Blueprint

1. Buka [render.com/blueprints](https://render.com/blueprints)
2. Klik **New Blueprint**
3. Connect GitHub repository
4. Pilih repository
5. Render akan otomatis detect `render.yaml`
6. Klik **Apply**

### Isi render.yaml

```yaml
services:
  # =============================================
  # Next.js Web Service
  # =============================================
  - type: web
    name: inventaris-ldte
    runtime: docker
    dockerfilePath: Dockerfile
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: inventaris-db
          property: connectionString
      - key: SESSION_SECRET
        generateValue: true
      - key: REDIS_URL
        fromService:
          name: inventaris-redis
          property: connectionString
    healthCheckPath: /
    autoDeploy: true
    plan: free

  # =============================================
  # PostgreSQL Database
  # =============================================
  - type: postgres
    name: inventaris-db
    plan: free
    databaseName: inventaris_ldte
    ipAllowList: []

  # =============================================
  # Redis Cache
  # =============================================
  - type: redis
    name: inventaris-redis
    plan: free
    ipAllowList: []
    maxmemoryPolicy: allkeys-lru
```

### Penjelasan render.yaml

| Key | Description |
|-----|-------------|
| `type: web` | Web service (Next.js app) |
| `type: postgres` | PostgreSQL database |
| `type: redis` | Redis cache |
| `fromDatabase` | Auto-link database URL |
| `fromService` | Auto-link service URL |
| `generateValue` | Auto-generate random value |
| `plan: free` | Gunakan free tier |

---

## 4. Troubleshooting

### Masalah: Database Connection Error

**Gejala**: `Error: P1001: Can't reach database server`

**Solusi**:
1. Pastikan PostgreSQL service running
2. Cek **Internal Database URL** benar
3. Pastikan format URL: `postgresql://user:password@host:5432/dbname`
4. Tambahkan `?sslmode=require` jika perlu:
   ```
   DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require
   ```

### Masalah: Redis Connection Error

**Gejala**: `[Redis] Error: connect ECONNREFUSED`

**Solusi**:
1. Pastikan Redis service running
2. Cek **Internal Redis URL** benar
3. Format URL: `redis://user:password@host:port`
4. Jika Redis tidak diperlukan, app tetap jalan tanpa caching

### Masalah: SESSION_SECRET Error

**Gejala**: `Error: secret must be provided`

**Solusi**:
1. Pastikan `SESSION_SECRET` sudah diset
2. Generate secret baru:
   ```bash
   openssl rand -base64 32
   ```
3. Set di Environment Variables

### Masalah: Build Timeout

**Gejala**: `Build timeout after 900 seconds`

**Solusi**:
1. Cek Dockerfile benar
2. Pastikan tidak ada error saat build
3. Upgrade ke paid plan untuk lebih lama

### Masalah: App Sleep (Free Tier)

**Gejala**: App tidak respon setelah idle ~15 menit

**Solusi**: Ini normal untuk free tier
- App akan "wake up" dalam ~30 detik
- Upgrade ke paid plan untuk always-on
- Atau gunakan cron job untuk keep-alive

---

## 📊 Monitoring

### Cek Logs
1. Buka Web Service di Render Dashboard
2. Klik tab **Logs**
3. Filter by severity: `Info`, `Warn`, `Error`

### Cek Metrics
1. Buka Web Service
2. Klik tab **Metrics**
3. Lihat: CPU, Memory, Requests

### Cek Database
1. Buka PostgreSQL service
2. Ktab **Connection**
3. Copy **External Database URL** untuk akses dari local

---

## 🔐 Security Checklist

- [ ] `SESSION_SECRET` sudah di-generate dan kuat
- [ ] `DATABASE_URL` menggunakan internal URL
- [ ] `REDIS_URL` menggunakan internal URL
- [ ] `NODE_ENV=production`
- [ ] Tidak ada secrets yang di-commit ke Git
- [ ] `.env` sudah di-`.gitignore`

---

## 🚀 Quick Start

```bash
# 1. Login ke Render
# Buka render.com dan sign up/login

# 2. Create PostgreSQL
# New + → PostgreSQL → Name: inventaris-db → Plan: Free

# 3. Create Redis
# New + → Redis → Name: inventaris-redis → Plan: Free

# 4. Create Web Service
# New + → Web Service → Connect GitHub → Select repo
# Name: inventaris-ldte
# Runtime: Docker
# Dockerfile Path: ./Dockerfile
# Plan: Free

# 5. Set Environment Variables
# Di Web Service → Environment tab:
NODE_ENV=production
DATABASE_URL=<dari PostgreSQL>
SESSION_SECRET=<generate sendiri>
REDIS_URL=<dari Redis>

# 6. Deploy
# Manual Deploy → Deploy latest commit

# 7. Buka App
# Klik URL yang diberikan
```

---

## 💡 Tips

1. **Internal URLs** hanya bisa diakses dari service lain di Render
2. **External URLs** bisa diakses dari mana saja (butuh SSL)
3. **Free tier** ada sleep mode (~15 menit idle)
4. **Logs** tersimpan 7 hari di free tier
5. **Database** free tier max 1GB storage

---

## 📚 Referensi

- [Render Docs](https://render.com/docs)
- [Render Environment Variables](https://render.com/docs/env-vars)
- [Render PostgreSQL](https://render.com/docs/postgresql)
- [Render Redis](https://render.com/docs/redis)
