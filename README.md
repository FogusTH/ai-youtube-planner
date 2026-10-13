# AI YouTube Planner

เว็บแอปวางแผนคอนเทนต์ YouTube — คิดไอเดียด้วย AI, จัดตารางลงปฏิทิน, ติดตามสถานะงานตั้งแต่ไอเดียจนถึงโพสต์จริง (ไอเดีย → สคริปต์ → ถ่ายทำ → ตัดต่อ → โพสต์แล้ว) พร้อมบันทึกผลลัพธ์หลังเผยแพร่

Stack: Next.js 14 (App Router) + NextAuth (GitHub OAuth + Google OAuth + Email/Password) + Supabase (Postgres) + Google Gemini API · deploy บน Vercel ฟรี

📄 ดูรายละเอียดข้อกำหนดของระบบแบบเต็มได้ที่ [REQUIREMENTS.md](./REQUIREMENTS.md)

---

## ฟีเจอร์หลัก

- **เข้าสู่ระบบ** ได้ 3 ช่องทาง: Email/Password, GitHub OAuth, Google OAuth
- **คิดไอเดียคอนเทนต์ด้วย AI** — ระบุหัวข้อและบริบทช่อง ให้ Gemini สร้างไอเดียให้อัตโนมัติ
- **จัดการไอเดีย** — บันทึก ลบ (พร้อมกล่องยืนยันก่อนลบ) และเพิ่มเข้าปฏิทินได้ในคลิกเดียว
- **วางแผนคอนเทนต์** — บอร์ดสถานะแบบ Kanban และปฏิทินรายเดือน สลับมุมมองได้
- **รายละเอียดก่อนผลิต** — ชื่อคลิปสำรอง ไอเดียภาพปก Hook เปิดคลิป Call-to-action และจัดกลุ่มเป็นซีรีส์
- **ติดตามผลลัพธ์** — บันทึกยอดวิว, CTR และสรุปซีรีส์ที่ทำผลงานดีที่สุด
- **ภาพรวม (Dashboard)** — สถิติงานแยกตามสถานะ และกำหนดการที่ใกล้ถึง

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

## โครงสร้างโปรเจกต์

```
app/              หน้าเว็บและ API routes (Next.js App Router)
  api/            API endpoints (auth, ideas, content)
  calendar/       หน้าปฏิทินคอนเทนต์
  ideas/          หน้าคิดไอเดียด้วย AI
  results/        หน้าผลลัพธ์หลังเผยแพร่
  login/          หน้าเข้าสู่ระบบ / สมัครสมาชิก
components/       React components ที่ใช้ร่วมกัน
lib/              การเชื่อมต่อ Supabase, NextAuth, Gemini API
supabase/         SQL schema และ migration ของฐานข้อมูล
```

---

## ข้อจำกัดของ MVP นี้

- ยังไม่มี Row Level Security (RLS) บน Supabase — สิทธิ์เข้าถึงข้อมูลถูกเช็คที่ชั้น API เท่านั้น เหมาะกับ MVP/ใช้ส่วนตัวก่อน ถ้าจะเปิดให้คนอื่นใช้เยอะๆ ควรเพิ่ม RLS
- Gemini free tier มี rate limit รายนาที/วัน ถ้าชนโควต้าระบบจะลองเรียกซ้ำอัตโนมัติก่อนแจ้ง error
