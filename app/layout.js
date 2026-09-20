import { Fraunces, Inter } from "next/font/google";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Providers from "@/components/Providers";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["500", "600"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "AI YouTube Planner",
  description: "วางแผน จัดการ และคิดไอเดียคอนเทนต์ YouTube ด้วย AI",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="th" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-body bg-paper min-h-screen">
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
