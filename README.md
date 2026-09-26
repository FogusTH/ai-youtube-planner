# AI YouTube Planner

เว็บแอปวางแผนคอนเทนต์ YouTube — คิดไอเดียด้วย AI, จัดตารางลงปฏิทิน, ติดตามสถานะงานตั้งแต่ไอเดียจนถึงโพสต์จริง (ไอเดีย → สคริปต์ → ถ่ายทำ → ตัดต่อ → โพสต์แล้ว)

Stack: Next.js 14 (App Router) + NextAuth (GitHub OAuth + Google OAuth + Email/Password) + Supabase (Postgres) + Google Gemini API · deploy บน Vercel ฟรี

ทุกขั้นตอนด้านล่างทำผ่านเบราว์เซอร์ล้วนๆ **ไม่ต้องติดตั้งโปรแกรมอะไรในเครื่องเลย**

📄 ดูรายละเอียดข้อกำหนดของระบบแบบเต็มได้ที่ [REQUIREMENTS.md](./REQUIREMENTS.md)

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
| AI สร้างไอเดีย | [Google Gemini API](https://ai.google.dev) (โมเดล gemini-3.6-flash) | คิดไอเดียคอนเทนต์ YouTube ให้อัตโนมัติ |

**โครงสร้างพื้นฐาน (Infrastructure)**
- [GitHub](https://github.com) — เก็บซอร์สโค้ด (Version Control)
- [Vercel](https://vercel.com) — Hosting และ Deploy อัตโนมัติจาก GitHub
- ทั้งหมดใช้งานได้ฟรีบน Free / Hobby Tier ของแต่ละผู้ให้บริการ

---

## ขั้นตอนที่ 1 — สร้าง repo บน GitHub

1. สมัคร/ล็อกอิน https://github.com
2. กด **New repository** → ตั้งชื่อ เช่น `ai-youtube-planner` → เลือก **Public** หรือ **Private** ก็ได้ → **ห้าม**ติ๊ก "Add a README" (เพราะเราจะอัปโหลดของเราเอง) → **Create repository**
3. ในหน้า repo ที่ยังว่างอยู่ กด **uploading an existing file**
4. เปิดโฟลเดอร์โปรเจกต์ที่แตกไฟล์ zip ไว้ แล้ว**ลากไฟล์/โฟลเดอร์ทั้งหมดข้างใน**มาวางในหน้าเว็บ (ลากทั้งหมดพร้อมกันได้ โครงสร้างโฟลเดอร์จะถูกเก็บไว้)
5. เลื่อนลงล่าง ใส่ commit message เช่น "initial commit" → **Commit changes**

---

## ขั้นตอนที่ 2 — ตั้งค่า Supabase (ฐานข้อมูล)

1. สมัคร/ล็อกอิน https://supabase.com → **New project**
2. ตั้งชื่อโปรเจกต์ + ตั้งรหัสผ่านฐานข้อมูล (เก็บไว้ ไม่ต้องใช้ต่อ) → รอสักครู่ให้โปรเจกต์สร้างเสร็จ
3. ไปที่เมนู **SQL Editor** (ด้านซ้าย) → **New query**
4. เปิดไฟล์ `supabase/schema.sql` ในโปรเจกต์ที่คุณอัปโหลด คัดลอกทั้งหมด วางในช่อง SQL Editor → กด **Run**
5. ไปที่ **Project Settings → API** เก็บค่า 2 อย่างนี้ไว้ใช้ในขั้นตอนที่ 5:
   - **Project URL** → ใช้เป็น `NEXT_PUBLIC_SUPABASE_URL`
   - **service_role key** (อยู่ใต้ "Project API keys" — ระวัง อย่าเผยแพร่คีย์นี้ให้ใครเห็น) → ใช้เป็น `SUPABASE_SERVICE_ROLE_KEY`

---

## ขั้นตอนที่ 3 — ขอ Gemini API Key (สำหรับ AI คิดไอเดีย)

1. เข้า https://aistudio.google.com/apikey → ล็อกอินด้วย Google account
2. กด **Create API key** → คัดลอกคีย์เก็บไว้ → ใช้เป็น `GEMINI_API_KEY`
   (ฟรี มี quota ให้ใช้งานรายวัน เพียงพอสำหรับ MVP)

---

## ขั้นตอนที่ 4 — สร้าง GitHub OAuth App (สำหรับปุ่ม "เข้าสู่ระบบด้วย GitHub")

1. ไปที่ https://github.com/settings/developers → **New OAuth App**
2. กรอก:
   - **Application name**: AI YouTube Planner
   - **Homepage URL**: `http://localhost:3000` (ใส่ไปก่อน จะกลับมาแก้ทีหลัง)
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github` (ใส่ไปก่อนเช่นกัน)
3. กด **Register application** → กด **Generate a new client secret**
4. เก็บ **Client ID** → ใช้เป็น `GITHUB_ID`
5. เก็บ **Client secret** → ใช้เป็น `GITHUB_SECRET`

> ⚠️ ขั้นตอนนี้ต้องกลับมาแก้ URL อีกครั้งหลัง deploy เสร็จ (ดูขั้นตอนที่ 6)

---

## ขั้นตอนที่ 5 — Deploy บน Vercel

1. เข้า https://vercel.com → **Sign up** → เลือก **Continue with GitHub** (เชื่อมบัญชีอัตโนมัติ)
2. กด **Add New... → Project** → เลือก repo `ai-youtube-planner` ที่อัปโหลดไว้ → **Import**
3. ก่อนกด Deploy ให้เปิดส่วน **Environment Variables** แล้วใส่ทีละตัว:

   | Key | Value |
   |---|---|
   | `NEXTAUTH_URL` | ใส่ไปก่อนว่า `https://ชื่อโปรเจกต์.vercel.app` (เดาชื่อจากที่ตั้งไว้ตอน import ได้ หรือใส่ค่าไหนก่อนก็ได้แล้วมาแก้ทีหลัง) |
   | `NEXTAUTH_SECRET` | สุ่มค่าที่ https://generate-secret.vercel.app/32 แล้ววางที่นี่ |
   | `GITHUB_ID` | จากขั้นตอนที่ 4 |
   | `GITHUB_SECRET` | จากขั้นตอนที่ 4 |
   | `NEXT_PUBLIC_SUPABASE_URL` | จากขั้นตอนที่ 2 |
   | `SUPABASE_SERVICE_ROLE_KEY` | จากขั้นตอนที่ 2 |
   | `GEMINI_API_KEY` | จากขั้นตอนที่ 3 |

4. กด **Deploy** รอสัก 1-2 นาที

---

## ขั้นตอนที่ 6 — แก้ URL ให้ตรงกับโดเมนจริง (สำคัญมาก)

หลัง deploy เสร็จ Vercel จะให้โดเมนจริงมา เช่น `https://ai-youtube-planner-xxxx.vercel.app`

1. **กลับไปที่ GitHub OAuth App** (ขั้นตอนที่ 4) → แก้ไข:
   - Homepage URL → `https://ai-youtube-planner-xxxx.vercel.app`
   - Authorization callback URL → `https://ai-youtube-planner-xxxx.vercel.app/api/auth/callback/github`
   - กด **Update application**
2. **กลับไปที่ Vercel** → Project → **Settings → Environment Variables** → แก้ `NEXTAUTH_URL` ให้เป็นโดเมนจริง (ไม่มี `/` ปิดท้าย)
3. ไปที่แท็บ **Deployments** → กดจุดสามจุดของ deployment ล่าสุด → **Redeploy**

เสร็จแล้ว! เปิดโดเมนของคุณ จะเจอหน้า login พร้อมใช้งานทั้งสมัครด้วยอีเมลและ GitHub

---

## อัปเดตนี้เพิ่มอะไรบ้าง (v2)

เวอร์ชันนี้เพิ่ม 4 อย่างจากที่คุยกัน:
- **รายละเอียดคอนเทนต์**: ชื่อคลิปสำรอง, ไอเดียภาพปก, Hook เปิดคลิป, Call-to-action, ซีรีส์ — กดไอคอนในการ์ด (หรือปุ่ม "บันทึกผลลัพธ์") เพื่อเปิดกรอกได้
- **หน้า "ผลลัพธ์"**: บันทึกยอดวิว/CTR/สิ่งที่เรียนรู้ หลังโพสต์ พร้อมสรุปว่าซีรีส์ไหนทำผลงานดีสุด
- **ปฏิทินแบบเดือน**: สลับมุมมองบอร์ด/เดือนได้ที่หน้าปฏิทิน
- **กรองตามซีรีส์**: dropdown บนหน้าปฏิทิน

**สำคัญ:** ต้องรันไฟล์ `supabase/migration_002_planning_fields.sql` ใน Supabase SQL Editor ก่อน (เพิ่มคอลัมน์ใหม่ในตาราง `content_items`) ไม่งั้นฟีเจอร์ใหม่จะ error

## การพัฒนาเพิ่มเติม (ถ้าอยากแก้โค้ดในอนาคต)

- แก้โค้ดตรงๆ บนเว็บ GitHub ได้เลย (กดไอคอนดินสอที่ไฟล์ หรือกดปุ่ม `.` บนหน้า repo เพื่อเปิด github.dev ซึ่งเป็น VS Code บนเบราว์เซอร์ ฟรี ไม่ต้องติดตั้ง) — พอ commit ปุ๊บ Vercel จะ deploy ให้อัตโนมัติทุกครั้ง
- ไฟล์หลักที่น่าจะแก้บ่อย: `app/ideas/page.js`, `app/calendar/page.js`, `lib/gemini.js` (ปรับ prompt ของ AI)

## ข้อจำกัดของ MVP นี้

- ยังไม่มี Row Level Security (RLS) บน Supabase — สิทธิ์เข้าถึงข้อมูลถูกเช็คที่ชั้น API เท่านั้น เหมาะกับ MVP/ใช้ส่วนตัวก่อน ถ้าจะเปิดให้คนอื่นใช้เยอะๆ ควรเพิ่ม RLS
- Gemini free tier มี rate limit รายนาที/วัน ถ้าชนโควต้าจะขึ้น error ให้ลองใหม่ภายหลัง
