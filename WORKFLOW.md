# Workflow Agent Gemini: Panduan Optimasi Skala Besar Next.js (< 200ms)

Halo Kemip, untuk mencapai response time di bawah 200ms tanpa lagging atau buffering pada aplikasi Next.js berskala besar, kita perlu menerapkan strategi optimasi multi-layer dari frontend hingga ke level database dan infrastruktur server Linux.

Berikut adalah arsitektur workflow agent Gemini yang bisa kamu terapkan secara bertahap:

## 1. Agent Profiler & Analis Arsitektur (Fase Diagnostik)
**Tugas:** Mengaudit codebase Next.js untuk mendeteksi bottleneck sebelum melakukan perubahan besar-besaran.
*   **Analisis Rendering:** Memeriksa penggunaan `getServerSideProps` atau Server Components. Berbeda dengan pendekatan pada framework seperti Nuxt, Next.js dengan App Router memiliki paradigma *React Server Components* (RSC) yang bisa sangat cepat jika payload-nya di-cache dengan benar.
*   **Bundle Size Audit:** Mengecek package pihak ketiga yang tidak efisien menggunakan `@next/bundle-analyzer`.
*   **Prompt untuk Agent:** *"Analisa struktur folder `/app` dan `package.json` ini. Identifikasi library yang membebani initial load dan sarankan alternatif yang lebih ringan untuk mempercepat Time to Interactive (TTI)."*

## 2. Agent Frontend & Caching (Fase Akselerasi)
**Tugas:** Memastikan konten disajikan dari cache (CDN) secepat mungkin ke user tanpa harus membebani server terus-menerus.
*   **Strategi ISR (Incremental Static Regeneration):** Ubah halaman SSR yang berat menjadi ISR. Konten akan di-build di background berdasarkan interval waktu tertentu. User akan selalu mendapatkan respons instan dari cache layaknya halaman statis murni.
*   **Optimasi Aset:** Paksa penggunaan komponen bawaan `next/image` dan `next/font` untuk mencegah Cumulative Layout Shift (CLS) dan mengompresi ukuran file secara otomatis.
*   **Prompt untuk Agent:** *"Refactor komponen SSR berikut menjadi menggunakan arsitektur ISR dengan waktu revalidasi 60 detik. Pastikan state management dan data fetching di dalamnya tidak memblokir render pertama."*

## 3. Agent Backend & Database Optimizer (Fase Pengolahan Data)
**Tugas:** Mengamankan response time dari sisi *Data Fetching*. Seringkali bottleneck Next.js ada di waktu tunggu database, bukan di React-nya.
*   **Query Optimization:** Apabila Next.js API routes berkomunikasi dengan database relasional seperti PostgreSQL, atau melakukan proxy ke service backend lain (seperti arsitektur Spring Boot), pastikan terhindar dari *N+1 query problem*.
*   **Connection Pooling:** Gunakan *PgBouncer* atau koneksi pooling dari ORM (Prisma/Drizzle) untuk mencegah antrean koneksi database yang menyebabkan request menjadi buffering/pending.
*   **Prompt untuk Agent:** *"Ini adalah fungsi Next.js Server Action yang melakukan query kompleks ke PostgreSQL. Tolong optimasi query ini, buatkan rekomendasi indexing yang tepat, dan implementasikan strategi caching data layer menggunakan Redis."*

## 4. Agent DevOps & Infrastruktur (Fase Skalabilitas)
**Tugas:** Men-deploy aplikasi di environment yang tahan banting untuk traffic skala enterprise.
*   **Docker & Linux Tuning:** Saat melakukan containerize aplikasi Next.js menggunakan Docker untuk server Linux, pastikan *standalone output* diaktifkan di `next.config.js` untuk memangkas ukuran node_modules.
*   **Edge Computing:** Deploy *middleware* Next.js di Edge Network. Request terkait autentikasi, bot detection, atau redirect bisa diselesaikan langsung di *Edge* (node server terdekat dari user) sebelum menyentuh origin server sama sekali.
*   **Prompt untuk Agent:** *"Buatkan `Dockerfile` multi-stage untuk aplikasi Next.js ini. Aktifkan mode standalone, dan optimasikan agar berjalan seefisien mungkin di production environment Linux."*

---
## Checklist Eksekusi Mandiri:
1. Setup APM (Application Performance Monitoring) untuk memonitor metrik *P99 latency*.
2. Jalankan Agent Profiler terlebih dahulu untuk mendapatkan baseline kecepatan saat ini.
3. Fokuskan iterasi perbaikan mulai dari layer database/backend (karena biasanya penyumbang latensi terbesar), lalu caching strategi, dan terakhir optimasi aset frontend.