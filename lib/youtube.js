const YT_API = "https://www.googleapis.com/youtube/v3";

/**
 * รับลิงก์ YouTube รูปแบบต่างๆ หรือรหัสวิดีโอดิบ แล้วคืนค่ารหัสวิดีโอ (11 ตัวอักษร)
 * รองรับ: youtube.com/watch?v=..., youtu.be/..., youtube.com/shorts/..., หรือรหัสวิดีโอตรงๆ
 */
function extractVideoId(input) {
  if (!input) return null;
  const trimmed = input.trim();

  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed);
    if (url.hostname.includes("youtu.be")) return url.pathname.slice(1);
    const v = url.searchParams.get("v");
    if (v) return v;
    const shortsMatch = url.pathname.match(/\/shorts\/([\w-]{11})/);
    if (shortsMatch) return shortsMatch[1];
  } catch {
    // ไม่ใช่ URL ที่ parse ได้ — ปล่อยให้ API เป็นผู้ตัดสินว่ารหัสนี้ใช้ได้ไหม
  }

  return trimmed;
}

/**
 * ดึงสถิติสาธารณะของวิดีโอ YouTube (ยอดวิว, ไลก์, คอมเมนต์) ผ่าน YouTube Data API v3
 * ใช้ได้กับวิดีโอสาธารณะทุกคลิป ไม่จำเป็นต้องเป็นเจ้าของช่อง
 */
export async function fetchYoutubeVideoStats(videoIdOrUrl) {
  const videoId = extractVideoId(videoIdOrUrl);
  if (!videoId) {
    throw new Error("ไม่พบรหัสวิดีโอ กรุณาวางลิงก์หรือรหัสวิดีโอ YouTube ให้ถูกต้อง");
  }

  const res = await fetch(
    `${YT_API}/videos?part=statistics,snippet&id=${encodeURIComponent(videoId)}&key=${process.env.YOUTUBE_API_KEY}`
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`YouTube API error: ${res.status} ${text}`);
  }

  const data = await res.json();
  const video = data.items?.[0];
  if (!video) {
    throw new Error("ไม่พบวิดีโอนี้บน YouTube (ตรวจสอบลิงก์/รหัสวิดีโอ หรือวิดีโออาจถูกตั้งเป็นส่วนตัว)");
  }

  return {
    videoId,
    title: video.snippet?.title || "",
    views: Number(video.statistics?.viewCount || 0),
    likes: Number(video.statistics?.likeCount || 0),
    comments: Number(video.statistics?.commentCount || 0),
  };
}
