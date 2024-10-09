// next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

// Extend the default JWT interface to include `accessToken`
declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}

// Extend the default session interface to include `accessToken`
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user?: DefaultUser & {
      sub?: string;
    };
  }
}
