-- ─────────────────────────────────────────────────────────────────
-- PANDUAN PENGGUNAAN:
--
-- 1. Buka dashboard.supabase.com → pilih project kamu
-- 2. Klik "SQL Editor" di sidebar kiri
-- 3. Paste seluruh isi file ini, lalu klik "Run"
--
-- CARA ISI certificate_url:
--   - AWS Skill Builder  : buka sertifikat → Share → copy link
--   - Coursera           : coursera.org/account/accomplishments/verify/XXXX
--   - Udemy              : udemy.com/certificate/UC-XXXXXXXX
--   - Dicoding           : app.dicoding.com/certificates/XXXX
--   - LinkedIn Learning  : linkedin.com/learning/certificates/XXXX
--   - PDF upload         : upload ke Storage bucket "certificates",
--                          lalu copy public URL-nya
--
-- CARA ISI thumbnail_url (logo issuer):
--   - Gunakan path lokal yang sudah ada di /public/icons/
--     contoh: /icons/aws.svg, /icons/google.svg, /icons/udemy.svg
--   - Atau biarkan null (akan tampil huruf awal sebagai badge)
-- ─────────────────────────────────────────────────────────────────

-- Hapus data lama (opsional — comment out jika tidak ingin reset)
-- truncate table certificates restart identity;

insert into certificates (title, issuer, thumbnail_url, certificate_url, credential_id, issued_date)
values
  -- ── AWS ────────────────────────────────────────────────────────
  (
    'AWS Amplify Getting Started',
    'Amazon Web Services (AWS)',
    '/icons/aws.svg',
    null,   -- ganti dengan URL sertifikat asli
    null,   -- ganti dengan credential/badge ID dari AWS
    '2025-12-01'
  ),
  (
    'AWS Command Line Interface (CLI) Basics',
    'Amazon Web Services (AWS)',
    '/icons/aws.svg',
    null,
    null,
    '2025-12-01'
  ),
  (
    'Introduction to Amazon CloudFront',
    'Amazon Web Services (AWS)',
    '/icons/aws.svg',
    null,
    null,
    '2025-12-01'
  ),
  (
    'Job Roles in the Cloud',
    'Amazon Web Services (AWS)',
    '/icons/aws.svg',
    null,
    null,
    '2025-12-01'
  ),
  (
    'Official Practice Question Set: AWS Certified Cloud Practitioner (CLF-C02)',
    'Amazon Web Services (AWS)',
    '/icons/aws.svg',
    null,
    null,
    '2025-12-01'
  ),
  -- ── Frontend Masters ───────────────────────────────────────────
  (
    'Course Completed: AWS For Front-End Engineers, v2',
    'Frontend Masters',
    null,   -- tidak ada icon, akan tampil badge "FM"
    null,
    null,
    '2025-11-01'
  ),
  -- ── AWS (lanjutan) ─────────────────────────────────────────────
  (
    'AWS Educate Introduction to Generative AI',
    'Amazon Web Services (AWS)',
    '/icons/aws.svg',
    null,
    null,
    '2025-07-01'
  ),
  -- ── Dicoding ───────────────────────────────────────────────────
  (
    'Financial Literacy 101',
    'Dicoding Indonesia',
    null,   -- akan tampil badge "DC"
    null,   -- contoh: 'https://app.dicoding.com/certificates/XXXX'
    null,   -- contoh: 'MEPJX3LYQXV3'
    '2025-05-01'
  ),
  -- ── Google ─────────────────────────────────────────────────────
  (
    'Automate Data Capture at Scale with Document AI',
    'Google',
    '/icons/google.svg',
    null,
    null,
    '2025-02-01'
  ),
  (
    'Boost Productivity with Gemini in BigQuery',
    'Google',
    '/icons/google.svg',
    null,
    null,
    '2025-02-01'
  ),
  -- ── Frontend Masters ───────────────────────────────────────────
  (
    'React and TypeScript',
    'Frontend Masters',
    null,
    null,
    null,
    '2025-01-15'
  ),
  -- ── Udemy ──────────────────────────────────────────────────────
  (
    'Introduction to Go Programming',
    'Udemy',
    '/icons/udemy.svg',
    null,   -- contoh: 'https://udemy.com/certificate/UC-XXXXXXXX'
    null,   -- contoh: 'UC-12345678-abcd-1234-efgh-1234567890ab'
    '2024-12-10'
  ),
  (
    'Docker & Kubernetes: The Practical Guide',
    'Udemy',
    '/icons/udemy.svg',
    null,
    null,
    '2024-11-20'
  ),
  -- ── Dicoding ───────────────────────────────────────────────────
  (
    'Belajar Dasar Pemrograman Web',
    'Dicoding Indonesia',
    null,
    null,
    null,
    '2024-10-05'
  ),
  -- ── Coursera ───────────────────────────────────────────────────
  (
    'PostgreSQL for Everybody',
    'Coursera',
    '/icons/coursera.svg',
    null,   -- contoh: 'https://coursera.org/account/accomplishments/verify/XXXXXXXXXX'
    null,   -- contoh: 'XXXXXXXXXX'
    '2024-09-01'
  ),
  -- ── Udemy ──────────────────────────────────────────────────────
  (
    'Blender 3D: Your First 3D Character',
    'Udemy',
    '/icons/udemy.svg',
    null,
    null,
    '2024-08-10'
  ),
  -- ── Linux Foundation ───────────────────────────────────────────
  (
    'Introduction to Linux',
    'Linux Foundation',
    '/icons/linux-foundation.svg',
    null,   -- contoh: dari training.linuxfoundation.org
    null,
    '2024-07-01'
  ),
  -- ── Dicoding ───────────────────────────────────────────────────
  (
    'Belajar Fundamental Aplikasi Back-End',
    'Dicoding Indonesia',
    null,
    null,
    null,
    '2024-06-15'
  ),
  -- ── Udemy ──────────────────────────────────────────────────────
  (
    'Complete Next.js Developer in 2024',
    'Udemy',
    '/icons/udemy.svg',
    null,
    null,
    '2024-05-20'
  ),
  -- ── Google ─────────────────────────────────────────────────────
  (
    'Google Cloud Fundamentals: Core Infrastructure',
    'Google',
    '/icons/google.svg',
    null,
    null,
    '2024-04-10'
  );
