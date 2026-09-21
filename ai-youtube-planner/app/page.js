import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Navbar from "@/components/Navbar";
import StatusBadge, { STATUS_ORDER, STATUS_LABELS } from "@/components/StatusBadge";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  const { data: itemsData } = await supabaseAdmin
    .from("content_items")
    .select("*")
    .eq("user_id", session.user.id);
  const items = itemsData || [];

  const { data: ideasData } = await supabaseAdmin
    .from("ideas")
    .select("id")
    .eq("user_id", session.user.id);
  const ideas = ideasData || [];

  const counts = STATUS_ORDER.reduce((acc, s) => {
    acc[s] = (items || []).filter((i) => i.status === s).length;
    return acc;
  }, {});

  const upcoming = (items || [])
    .filter((i) => i.scheduled_date)
    .sort((a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date))
    .slice(0, 5);

  const firstName = session.user.name?.split(" ")[0] || "นักสร้างคอนเทนต์";

  return (
    <div className="flex flex-col md:flex-row">
      <Navbar />
      <main className="flex-1 px-5 md:px-10 py-8 max-w-4xl">
        <h1 className="font-display text-3xl text-ink mb-1">สวัสดี, {firstName}</h1>
        <p className="text-inkmuted mb-8">
          นี่คือภาพรวมช่องของคุณวันนี้ — {ideas?.length || 0} ไอเดีย · {items?.length || 0} งานในไปป์ไลน์
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-10">
          {STATUS_ORDER.map((s) => (
            <div key={s} className="bg-card border border-line rounded-card p-4">
              <p className="text-2xl font-display text-ink">{counts[s]}</p>
              <p className="text-xs text-inkmuted mt-1">{STATUS_LABELS[s]}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-xl text-ink">กำหนดการที่ใกล้ถึง</h2>
          <Link href="/calendar" className="text-sm text-navy hover:text-amber focus-ring">
            ดูปฏิทินทั้งหมด →
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <div className="bg-card border border-dashed border-line rounded-card p-6 text-center">
            <p className="text-inkmuted text-sm">
              ยังไม่มีคอนเทนต์ที่ตั้งวันไว้ — ไปที่หน้า{" "}
              <Link href="/ideas" className="text-navy underline">
                ไอเดีย
              </Link>{" "}
              เพื่อเริ่มวางแผน
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {upcoming.map((item) => (
              <div
                key={item.id}
                className="bg-card border border-line rounded-card p-4 flex items-center justify-between gap-3"
              >
                <div>
                  <p className="text-ink font-medium text-sm">{item.title}</p>
                  <p className="text-xs text-inkmuted mt-0.5">
                    {new Date(item.scheduled_date).toLocaleDateString("th-TH", {
                      day: "numeric",
                      month: "long",
                    })}
                  </p>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
