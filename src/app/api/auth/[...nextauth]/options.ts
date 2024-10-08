import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"
import bcrypt from 'bcryptjs';
import UserDataService from "@/app/services/UserDataService";

export const options: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_SECRET_ID as string
        }),
        CredentialsProvider ({
            name: "Credentials",
            credentials: {
                username: {
                    label: "Username:",
                    type: "text",
                },
                password: {
                    label: "Password:",
                    type: "text",
                }
            },
            async authorize(credentials, req) {
                // try {
                //     const res = await UserDataService.getUserByUsername(credentials?.username);

                //     const user = await res.json();

                //     if (!res.ok || !user) {
                //         return null;
                //     }

                //     const hashedPassword = user.Password;

                //     const isPasswordValid = await bcrypt.compare(credentials?.password, hashedPassword);

                //     if (isPasswordValid) {
                //         return {
                //             id: user.id,
                //             name: user.username
                //         };
                //     } else {
                //         return null;
                //     }
                // } catch (error) {
                //     console.error("Error authorizing user:", error);
                //     return null;
                // }
            
                //dummy user
                const user = { username: 'test', password: 'test' };

                if (credentials?.username === user.username && credentials?.password === user.password) {
                    return {
                        name: credentials?.username
                    };
                } else {
                    return null;
                }
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, account }) {
            // Persist the OAuth access_token and token for the session
            if (account) {
                token.accessToken = account.access_token;
            }
            console.log('token: ', token);
            return token;
        },
        async session({ session, token }) {
            // Send properties to the client
            session.accessToken = token.accessToken;
            session.user.sub = token.sub;
            console.log('session', session);
            return session;
        },
    },
    // pages: {
    //     signIn: 'auth/login'
    // },
    
}

