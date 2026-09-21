"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { LayoutGrid, Lightbulb, CalendarDays, LogOut, Film, TrendingUp } from "lucide-react";

const links = [
  { href: "/", label: "ภาพรวม", icon: LayoutGrid },
  { href: "/ideas", label: "ไอเดีย", icon: Lightbulb },
  { href: "/calendar", label: "ปฏิทิน", icon: CalendarDays },
  { href: "/results", label: "ผลลัพธ์", icon: TrendingUp },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="w-full md:w-60 md:min-h-screen bg-navy text-white flex md:flex-col">
      <div className="px-5 py-5 flex items-center gap-2 border-b border-white/10">
        <Film size={20} className="text-amber" />
        <span className="font-display text-lg tracking-tight">YouTube Planner</span>
      </div>

      <nav className="flex md:flex-col flex-1 px-2 py-3 gap-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm transition-colors focus-ring ${
                active ? "bg-white/10 text-white" : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10 flex items-center justify-between">
        <span className="text-xs text-white/60 truncate max-w-[140px]">
          {session?.user?.name || session?.user?.email}
        </span>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-white/60 hover:text-white focus-ring p-1.5 rounded"
          title="ออกจากระบบ"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
