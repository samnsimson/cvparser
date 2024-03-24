import { env } from "@/env";
import { api } from "@/trpc/server";
import { DefaultSession, NextAuthOptions, getServerSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: DefaultSession["user"] & {
            id: string;
        };
    }
}

export const authOptions: NextAuthOptions = {
    secret: env.NEXTAUTH_SECRET,
    session: { strategy: "jwt" },
    providers: [
        Credentials({
            name: "credentials",
            credentials: { email: {}, password: {} },
            authorize: async (credentials) => {
                try {
                    if (!credentials) return null;
                    const user = await api.user.signin(credentials);
                    return user;
                } catch (error) {
                    console.log("🚀 ~ authorize: ~ error:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        jwt: ({ token, user }) => ({ ...token, ...user }),
        session: ({ session, token }) => ({ ...session, user: { ...session.user, ...token } }),
    },
    pages: {
        signIn: "/sign-in",
    },
};

export const getServerAuthSession = async () => getServerSession(authOptions);
