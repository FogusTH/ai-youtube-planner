import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "./supabaseAdmin";

export const authOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const { data: user } = await supabaseAdmin
          .from("users")
          .select("*")
          .eq("email", credentials.email.toLowerCase().trim())
          .single();

        if (!user || !user.password_hash) return null;

        const valid = await bcrypt.compare(credentials.password, user.password_hash);
        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "github" || account?.provider === "google") {
        // หา user เดิมด้วยอีเมล ถ้ายังไม่มีให้สร้างใหม่ในตาราง users ของเราเอง
        const email = user.email?.toLowerCase().trim();
        if (!email) return false;

        const { data: existing } = await supabaseAdmin
          .from("users")
          .select("id")
          .eq("email", email)
          .single();

        if (!existing) {
          await supabaseAdmin.from("users").insert({
            email,
            name: user.name,
            avatar_url: user.image,
          });
        }
      }
      return true;
    },
    async jwt({ token }) {
      if (token.email) {
        const { data: dbUser } = await supabaseAdmin
          .from("users")
          .select("id, name, avatar_url")
          .eq("email", token.email.toLowerCase().trim())
          .single();

        if (dbUser) {
          token.userId = dbUser.id;
          token.name = dbUser.name || token.name;
          token.picture = dbUser.avatar_url || token.picture;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};