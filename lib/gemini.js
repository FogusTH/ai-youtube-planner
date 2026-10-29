const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent";

const MAX_ATTEMPTS = 3;

async function callGemini(prompt) {
  let lastError;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const res = await fetch(`${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.9 },
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      return rawText.replace(/```json|```/g, "").trim();
    }

    const errText = await res.text();
    lastError = new Error(`Gemini API error: ${res.status} ${errText}`);

    const isOverloaded = res.status === 503 || res.status === 429;
    if (isOverloaded && attempt < MAX_ATTEMPTS) {
      await new Promise((r) => setTimeout(r, attempt * 1500));
      continue;
    }
    throw lastError;
  }
  throw lastError;
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("ไม่สามารถแปลงผลลัพธ์จาก AI เป็น JSON ได้");
  }
}

const CONTENT_TYPE_GUIDE = {
  video: "คลิปยาวแบบปกติ (5-20 นาที) เน้นเนื้อหาละเอียด มีโครงเรื่องต้น-กลาง-จบ",
  shorts:
    "คลิปสั้นแนวตั้ง (YouTube Shorts) ความยาวไม่เกิน 60 วินาที ต้องมี hook ที่ดึงความสนใจคนดูภายใน 1-2 วินาทีแรก เนื้อหากระชับ ตัดเข้าประเด็นไว จบเร็ว",
  stream:
    "หัวข้อ/เกม/กิจกรรมสำหรับไลฟ์สตรีม เน้นสิ่งที่ทำให้คนอยากเข้ามาดูสดและอยู่ดูนาน มีช่วงให้มีปฏิสัมพันธ์กับแชทได้",
};

/**
 * ขอไอเดียคอนเทนต์ YouTube จาก Gemini เป็น JSON array
 * คืนค่า: [{ title, description, category }]
 * contentType: "video" | "shorts" | "stream" — ปรับมุมคิดไอเดียให้เหมาะกับรูปแบบนั้นๆ
 */
export async function generateYoutubeIdeas({
  topic,
  channelDescription,
  count = 5,
  contentType = "video",
}) {
  const guide = CONTENT_TYPE_GUIDE[contentType] || CONTENT_TYPE_GUIDE.video;

  const prompt = `คุณคือที่ปรึกษาคอนเทนต์ YouTube มืออาชีพ ช่วยคิดไอเดีย ${count} ไอเดีย สำหรับรูปแบบคอนเทนต์นี้โดยเฉพาะ: ${guide}
หัวข้อ/ทิศทางที่ต้องการ: ${topic || "ไม่ระบุ ให้คิดอิสระตามบริบทช่อง"}
เกี่ยวกับช่อง: ${channelDescription || "ไม่ระบุ"}

ตอบกลับเป็น JSON array เท่านั้น ห้ามมีข้อความอื่นนอกเหนือจาก JSON ห้ามใส่ backtick หรือ markdown
รูปแบบแต่ละไอเดีย:
{"title": "ชื่อคลิปที่ดึงดูดคนกด", "description": "อธิบายไอเดียและมุมนำเสนอ 1-2 ประโยค", "category": "หมวดสั้นๆ เช่น รีวิว, ไลฟ์สไตล์, ความรู้"}

ส่งกลับเป็น array ของ object แบบนี้ ${count} รายการ`;

  const text = await callGemini(prompt);
  return parseJson(text);
}

/**
 * ให้ AI ช่วยคิดชื่อคลิป (หลายเวอร์ชัน), คำอธิบายใต้คลิป และแท็ก
 * เพื่อช่วยเพิ่มโอกาสให้คลิปถูกอัลกอริทึมของ YouTube แนะนำ (SEO)
 */
export async function generateYoutubeSeoMeta({ title, description }) {
  const prompt = `คุณเป็นผู้เชี่ยวชาญด้าน YouTube SEO ที่ช่วยเพิ่มโอกาสให้คลิปถูกอัลกอริทึมของ YouTube แนะนำ (recommend) และค้นเจอง่ายขึ้น

ชื่อคลิป (ไอเดียตั้งต้น): ${title}
รายละเอียดคร่าวๆ ของคลิป: ${description || "ไม่ระบุ"}

ช่วยคิดสิ่งต่อไปนี้สำหรับตอนอัปโหลดคลิปขึ้น YouTube จริง โดยตอบกลับเป็น JSON object เท่านั้น ไม่ต้องมีข้อความอื่นนอกเหนือจาก JSON รูปแบบ:
{
  "titles": ["ชื่อคลิปเวอร์ชันที่ปรับให้ดึงดูดคนดูและมีคีย์เวิร์ดค้นหาที่คนนิยมค้น เวอร์ชัน 1", "เวอร์ชัน 2", "เวอร์ชัน 3"],
  "description": "คำอธิบายใต้คลิปแบบเต็ม 3-5 ย่อหน้าสั้นๆ ย่อหน้าแรกต้องมีคีย์เวิร์ดสำคัญและสรุปว่าคลิปนี้เกี่ยวกับอะไรภายใน 1-2 ประโยคแรก ตามด้วยรายละเอียดเพิ่มเติม และชวนกดติดตาม/กดกระดิ่งแจ้งเตือนท้ายคำอธิบาย",
  "tags": ["คำค้นหาที่เกี่ยวข้อง 10-15 คำ แยกเป็น array ของ string สั้นๆ แต่ละคำ"]
}`;

  const text = await callGemini(prompt);
  return parseJson(text);
}
