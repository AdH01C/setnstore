import type { NextAuthOptions } from "next-auth";

export const options: NextAuthOptions = {
  providers: [
    {
      id: "authlink",
      name: "AuthLink",
      type: "oauth",
      version: "2.0",
      issuer: "http://host.docker.internal:32766/realms/dev", // Add this line
      wellKnown: "http://host.docker.internal:32766/realms/dev/.well-known/openid-configuration",
      authorization: {
        url: "http://host.docker.internal:32766/realms/dev/protocol/openid-connect/auth",
        params: {
          client_id: process.env.APP_OIDC_CLIENT_ID,
          scope: "openid profile email",
          response_type: "code",
          redirect_uri: "http://localhost:3000/api/auth/callback/authlink", // Make sure this is correct
        },
      },
      token: {
        url: "http://host.docker.internal:32766/realms/dev/protocol/openid-connect/token",
      },
      userinfo: {
        url: "http://host.docker.internal:32766/realms/dev/protocol/openid-connect/userinfo",
      },
      clientId: process.env.APP_OIDC_CLIENT_ID,
      clientSecret: process.env.APP_OIDC_CLIENT_SECRET,
      idToken: true,
      checks: ["pkce", "state"],
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name || profile.preferred_username || profile.email,
          email: profile.email,
          image: profile.picture,
        };
      },
    },
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
      if (session.user) {
        session.accessToken = token.accessToken;
        session.user.sub = token.sub;
      }
      return session;
    },
  },
};

