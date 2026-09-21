const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

/**
 * ขอไอเดียคอนเทนต์ YouTube จาก Gemini เป็น JSON array
 * คืนค่า: [{ title, description, category }]
 */
export async function generateYoutubeIdeas({ topic, channelDescription, count = 5 }) {
  const prompt = `คุณคือที่ปรึกษาคอนเทนต์ YouTube มืออาชีพ ช่วยคิดไอเดียวิดีโอ ${count} ไอเดีย
หัวข้อ/ทิศทางที่ต้องการ: ${topic || "ไม่ระบุ ให้คิดอิสระตามบริบทช่อง"}
เกี่ยวกับช่อง: ${channelDescription || "ไม่ระบุ"}

ตอบกลับเป็น JSON array เท่านั้น ห้ามมีข้อความอื่นนอกเหนือจาก JSON ห้ามใส่ backtick หรือ markdown
รูปแบบแต่ละไอเดีย:
{"title": "ชื่อคลิปที่ดึงดูดคนกด", "description": "อธิบายไอเดียและมุมนำเสนอ 1-2 ประโยค", "category": "หมวดสั้นๆ เช่น รีวิว, ไลฟ์สไตล์, ความรู้"}

ส่งกลับเป็น array ของ object แบบนี้ ${count} รายการ`;

  const res = await fetch(`${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.9 },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error: ${res.status} ${errText}`);
  }

  const data = await res.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
  const cleaned = rawText.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error("ไม่สามารถแปลงผลลัพธ์จาก AI เป็น JSON ได้");
  }
}
