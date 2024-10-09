import type { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";


export const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_SECRET_ID as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username:",
          type: "text",
        },
        password: {
          label: "Password:",
          type: "text",
        },
      },
      async authorize(credentials, req) {
        const user = { username: "test", password: "test" };

        if (
          credentials?.username === user.username &&
          credentials?.password === user.password
        ) {
          return {
            id: "1", // Dummy id
            name: credentials?.username,
          };
        } else {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Check if session.user exists
      if (session.user) {
        session.accessToken = token.accessToken;
        session.user.sub = token.sub;
      }
      return session;
    }    
  },
};

