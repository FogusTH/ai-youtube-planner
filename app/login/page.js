"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Github, Film } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCredentials(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "register") {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "สมัครสมาชิกไม่สำเร็จ");
        setLoading(false);
        return;
      }
    }

    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);

    if (result?.error) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-paper">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-8">
          <Film size={24} className="text-navy" />
          <span className="font-display text-xl text-ink">YouTube Planner</span>
        </div>

        <div className="bg-card border border-line rounded-card p-6">
          <h1 className="font-display text-2xl text-ink mb-1">
            {mode === "login" ? "เข้าสู่ระบบ" : "สร้างบัญชีใหม่"}
          </h1>
          <p className="text-sm text-inkmuted mb-5">
            วางแผนคอนเทนต์ YouTube ด้วย AI ฟรี
          </p>

          <button
            onClick={() => signIn("github", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-2 bg-navy text-white rounded-md py-2.5 text-sm font-medium hover:bg-navydeep transition-colors focus-ring mb-4"
          >
            <Github size={17} />
            เข้าสู่ระบบด้วย GitHub
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="h-px bg-line flex-1" />
            <span className="text-xs text-inkmuted">หรือใช้อีเมล</span>
            <div className="h-px bg-line flex-1" />
          </div>

          <form onSubmit={handleCredentials} className="flex flex-col gap-3">
            {mode === "register" && (
              <input
                type="text"
                placeholder="ชื่อของคุณ"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-line rounded-md px-3 py-2.5 text-sm focus-ring bg-white"
              />
            )}
            <input
              type="email"
              required
              placeholder="อีเมล"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-line rounded-md px-3 py-2.5 text-sm focus-ring bg-white"
            />
            <input
              type="password"
              required
              placeholder="รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-line rounded-md px-3 py-2.5 text-sm focus-ring bg-white"
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="bg-amber text-navydeep font-medium rounded-md py-2.5 text-sm hover:brightness-95 transition disabled:opacity-60 focus-ring"
            >
              {loading ? "กำลังดำเนินการ..." : mode === "login" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
            </button>
          </form>

          <button
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError("");
            }}
            className="text-sm text-inkmuted hover:text-ink mt-4 w-full text-center focus-ring"
          >
            {mode === "login" ? "ยังไม่มีบัญชี? สมัครสมาชิก" : "มีบัญชีแล้ว? เข้าสู่ระบบ"}
          </button>
        </div>
      </div>
    </div>
  );
}
