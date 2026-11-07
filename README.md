# AI YouTube Planner

เว็บแอปวางแผนคอนเทนต์ YouTube — คิดไอเดียด้วย AI, จัดตารางลงปฏิทิน, ติดตามสถานะงานตั้งแต่ไอเดียจนถึงโพสต์จริง (ไอเดีย → สคริปต์ → ถ่ายทำ → ตัดต่อ → โพสต์แล้ว) พร้อมบันทึกผลลัพธ์หลังเผยแพร่

Stack: Next.js 14 (App Router) + NextAuth (GitHub OAuth + Google OAuth + Email/Password) + Supabase (Postgres) + Google Gemini API + YouTube Data API · deploy บน Vercel ฟรี

📄 ดูรายละเอียดข้อกำหนดของระบบแบบเต็มได้ที่ [REQUIREMENTS.md](./REQUIREMENTS.md)

---

## 🌐 วิธีเข้าใช้งานเว็บ (สำหรับอาจารย์/ผู้ตรวจ)

ไม่ต้องติดตั้งอะไรเลย เปิดเว็บที่ deploy แล้วได้ทันทีผ่านเบราว์เซอร์:

**👉 https://ai-youtube-planner3.vercel.app**

### การเข้าสู่ระบบ

เลือกได้ 1 ใน 3 วิธีที่หน้า Login:

1. **Email / Password** (ง่ายที่สุดสำหรับผู้ตรวจ) — กดสลับเป็นโหมด "สมัครสมาชิก" กรอกอีเมลและรหัสผ่านอะไรก็ได้ (อีเมลสมมติได้ เช่น `teacher@example.com`) แล้วกดสมัคร จากนั้นเข้าสู่ระบบด้วยอีเมล/รหัสเดิม
2. **Continue with GitHub** — ล็อกอินด้วยบัญชี GitHub ของคุณ
3. **Continue with Google** — ล็อกอินด้วยบัญชี Google ของคุณ

> ข้อมูลของแต่ละบัญชีแยกจากกัน ผู้ใช้อื่นมองไม่เห็นข้อมูลของคุณ

### ลองใช้งานแบบเร็ว (ประมาณ 3 นาที)

1. เมนู **ไอเดีย** → เลือกประเภทคอนเทนต์ (คลิปยาว / Shorts / หัวข้อสตรีม) → พิมพ์หัวข้อ เช่น "รีวิวมือถือราคาประหยัด" → กด **สร้างไอเดีย** → รอ AI คิดให้สักครู่
2. กด **บันทึกไอเดีย** ที่ชอบ แล้วกด **ลงปฏิทิน** ที่ไอเดียที่บันทึกไว้
3. เมนู **ปฏิทิน** → เห็นงานในบอร์ดสถานะ (ไอเดีย → สคริปต์ → ถ่ายทำ → ตัดต่อ → โพสต์แล้ว) เปลี่ยนสถานะ/ตั้งวันที่ได้ และสลับเป็นมุมมอง "เดือน" ได้
4. กดไอคอน **ดูรายละเอียด** บนการ์ดงาน → กรอกชื่อสำรอง ภาพปก Hook CTA หรือกด **ให้ AI ช่วยคิด** เพื่อสร้างชื่อ/คำอธิบายใต้คลิป/แท็ก (SEO)
5. เมนู **ผลลัพธ์** → ดูยอดวิวของคลิปที่โพสต์แล้ว (วางลิงก์ YouTube แล้วกด "ดึงยอดวิวล่าสุด" ได้)

---

## ฟีเจอร์หลัก

- **เข้าสู่ระบบ** ได้ 3 ช่องทาง: Email/Password, GitHub OAuth, Google OAuth
- **คิดไอเดียคอนเทนต์ด้วย AI** — ระบุหัวข้อและบริบทช่อง ให้ Gemini สร้างไอเดียให้อัตโนมัติ ปรับมุมคิดตามประเภท (คลิปยาว / Shorts / สตรีม)
- **แยกประเภทคอนเทนต์** — คลิปยาว, Shorts, สตรีม พร้อมตัวกรองในปฏิทิน
- **จัดการไอเดีย** — บันทึก ลบ (พร้อมกล่องยืนยันก่อนลบ) และเพิ่มเข้าปฏิทินได้ในคลิกเดียว
- **วางแผนคอนเทนต์** — บอร์ดสถานะแบบ Kanban และปฏิทินรายเดือน สลับมุมมองได้
- **รายละเอียดก่อนผลิต** — ชื่อคลิปสำรอง ไอเดียภาพปก Hook เปิดคลิป Call-to-action และจัดกลุ่มเป็นซีรีส์
- **SEO ช่วยให้คลิปถูกแนะนำมากขึ้น** — AI ช่วยคิดชื่อคลิปหลายเวอร์ชัน คำอธิบายใต้คลิป และแท็ก
- **สำหรับสตรีมเมอร์** — ตารางสตรีม (เวลา/หัวข้อ), บันทึกไฮไลต์ และสร้างคลิปสั้นจากไฮไลต์ได้ในคลิกเดียว
- **ติดตามผลลัพธ์** — บันทึกยอดวิว, CTR และสรุปซีรีส์ที่ทำผลงานดีที่สุด
- **เชื่อมต่อ YouTube** — ดึงยอดวิวล่าสุดของคลิปที่เผยแพร่แล้วอัตโนมัติผ่าน YouTube Data API
- **ภาพรวม (Dashboard)** — สถิติงานแยกตามสถานะ และกำหนดการที่ใกล้ถึง

---

## 🛠️ วิธีติดตั้งและรันเอง (สำหรับผู้ที่ต้องการรันบนเครื่องตัวเอง)

> ถ้าแค่ต้องการทดลองใช้ ให้ใช้เว็บที่ deploy แล้วด้านบน ไม่ต้องทำส่วนนี้

### สิ่งที่ต้องมี

- [Node.js](https://nodejs.org) เวอร์ชัน 18 ขึ้นไป
- บัญชีฟรีของ [Supabase](https://supabase.com), [Google AI Studio](https://aistudio.google.com) (ขอ Gemini API key) และ [Google Cloud Console](https://console.cloud.google.com) (เปิด YouTube Data API v3)
- (ไม่บังคับ) GitHub OAuth App และ Google OAuth Client สำหรับปุ่ม Login ด้วย GitHub/Google — ถ้าไม่ตั้ง จะยังใช้ Email/Password ได้

### 1. ดาวน์โหลดโค้ดและติดตั้ง dependencies

```bash
git clone https://github.com/FogusTH/ai-youtube-planner.git
cd ai-youtube-planner
npm install
```

### 2. สร้างฐานข้อมูลบน Supabase

1. สร้างโปรเจกต์ใหม่ที่ Supabase
2. เปิด **SQL Editor → New query** แล้วรันไฟล์ใน `supabase/` ตามลำดับนี้ (วางเนื้อหาไฟล์ → Run):
   1. `schema.sql`
   2. `migration_002_planning_fields.sql`
   3. `migration_003_youtube_sync.sql`
   4. `migration_004_seo_fields.sql`
   5. `migration_005_content_types.sql`
3. ไปที่ **Project Settings → API** เก็บค่า `Project URL` และ `service_role` key (แท็บ *Legacy anon, service_role API keys*)

### 3. ตั้งค่า Environment Variables

คัดลอกไฟล์ตัวอย่างแล้วกรอกค่า:

```bash
cp .env.example .env.local
```

| ตัวแปร | ได้มาจากไหน |
|---|---|
| `NEXTAUTH_URL` | ตอนรันบนเครื่องใช้ `http://localhost:3000` |
| `NEXTAUTH_SECRET` | สตริงสุ่มยาวๆ สร้างด้วย `openssl rand -base64 32` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → service_role key (ห้ามเปิดเผย) |
| `GEMINI_API_KEY` | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |
| `YOUTUBE_API_KEY` | Google Cloud Console → เปิด *YouTube Data API v3* → Credentials → Create API key |
| `GITHUB_ID` / `GITHUB_SECRET` | (ไม่บังคับ) GitHub → Settings → Developer settings → OAuth Apps — Callback URL: `http://localhost:3000/api/auth/callback/github` |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | (ไม่บังคับ) Google Cloud Console → Credentials → OAuth client ID — Redirect URI: `http://localhost:3000/api/auth/callback/google` |

### 4. รันเว็บ

```bash
npm run dev
```

เปิดเบราว์เซอร์ไปที่ http://localhost:3000 แล้วสมัครสมาชิกด้วย Email/Password เพื่อเริ่มใช้งาน

คำสั่งอื่นๆ: `npm run build` (สร้างเวอร์ชันโปรดักชัน) และ `npm start` (รันเวอร์ชันที่ build แล้ว)

### Deploy ขึ้น Vercel (ฟรี)

1. Push โค้ดขึ้น GitHub
2. ที่ [Vercel](https://vercel.com) กด **Add New → Project** แล้วเลือก repo นี้
3. ใส่ Environment Variables ตามตารางข้างบน โดยตั้ง `NEXTAUTH_URL` เป็นโดเมนจริงของ Vercel (เช่น `https://ชื่อโปรเจกต์.vercel.app`)
4. กด Deploy — หลังจากนี้ทุกครั้งที่ push ขึ้น GitHub Vercel จะ deploy ให้อัตโนมัติ
5. อัปเดต Callback URL ของ GitHub/Google OAuth ให้ตรงกับโดเมน Vercel

---

## เทคโนโลยีและภาษาที่ใช้

**ภาษาโปรแกรมมิ่ง**
- JavaScript (React / Next.js — ฝั่งหน้าเว็บและ API)
- SQL (PostgreSQL — สร้างและจัดการฐานข้อมูล)
- HTML / CSS (ผ่าน JSX และ Tailwind CSS)

**Framework และไลบรารีหลัก**

| ส่วน | เทคโนโลยี | หน้าที่ |
|---|---|---|
| Frontend + Backend | [Next.js 14](https://nextjs.org) (App Router) | เรนเดอร์หน้าเว็บ (React) และเป็น API server ในตัวเดียวกัน |
| UI Styling | [Tailwind CSS](https://tailwindcss.com) | จัดสไตล์หน้าตาเว็บทั้งหมด |
| ไอคอน | [lucide-react](https://lucide.dev) | ไอคอนต่างๆ ในแอป |
| ระบบยืนยันตัวตน | [NextAuth.js](https://next-auth.js.org) | จัดการ Login ทั้ง 3 ช่องทาง (Email/Password, GitHub OAuth, Google OAuth) |
| เข้ารหัสรหัสผ่าน | [bcryptjs](https://www.npmjs.com/package/bcryptjs) | แฮชรหัสผ่านก่อนเก็บลงฐานข้อมูล |
| ฐานข้อมูล | [Supabase](https://supabase.com) (PostgreSQL) | เก็บข้อมูลผู้ใช้ ไอเดีย และคอนเทนต์ทั้งหมด |
| AI สร้างไอเดีย/SEO | [Google Gemini API](https://ai.google.dev) (โมเดล gemini-3.6-flash) | คิดไอเดียคอนเทนต์ YouTube และชื่อ/คำอธิบาย/แท็กให้อัตโนมัติ |
| ข้อมูลวิดีโอ | [YouTube Data API v3](https://developers.google.com/youtube/v3) | ดึงยอดวิวของคลิปที่เผยแพร่แล้ว |

**โครงสร้างพื้นฐาน (Infrastructure)**
- [GitHub](https://github.com) — เก็บซอร์สโค้ด (Version Control)
- [Vercel](https://vercel.com) — Hosting และ Deploy อัตโนมัติจาก GitHub
- ทั้งหมดใช้งานได้ฟรีบน Free / Hobby Tier ของแต่ละผู้ให้บริการ

---

## โครงสร้างโปรเจกต์

```
app/              หน้าเว็บและ API routes (Next.js App Router)
  api/            API endpoints (auth, ideas, content, youtube)
  calendar/       หน้าปฏิทินคอนเทนต์
  ideas/          หน้าคิดไอเดียด้วย AI
  results/        หน้าผลลัพธ์หลังเผยแพร่
  login/          หน้าเข้าสู่ระบบ / สมัครสมาชิก
components/       React components ที่ใช้ร่วมกัน
lib/              การเชื่อมต่อ Supabase, NextAuth, Gemini API, YouTube API
supabase/         SQL schema และ migration ของฐานข้อมูล
```

---

## ข้อจำกัดของ MVP นี้

- ยังไม่มี Row Level Security (RLS) บน Supabase — สิทธิ์เข้าถึงข้อมูลถูกเช็คที่ชั้น API เท่านั้น เหมาะกับ MVP/ใช้ส่วนตัวก่อน ถ้าจะเปิดให้คนอื่นใช้เยอะๆ ควรเพิ่ม RLS
- Gemini free tier มี rate limit รายนาที/วัน ถ้าชนโควต้าระบบจะลองเรียกซ้ำอัตโนมัติก่อนแจ้ง error
- ยอดวิวดึงได้เมื่อกดปุ่มเท่านั้น (ไม่ใช่อัปเดตสดอัตโนมัติ) และ CTR/Retention ต้องกรอกเองจาก YouTube Studio เพราะ YouTube ไม่เปิดข้อมูลส่วนนี้ผ่าน API สาธารณะ
