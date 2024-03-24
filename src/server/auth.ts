import { PrismaAdapter } from "@auth/prisma-adapter";
import { getServerSession, type DefaultSession, type NextAuthOptions } from "next-auth";
import { type Adapter } from "next-auth/adapters";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/server/db";

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: DefaultSession["user"] & {
            id: string;
        };
    }
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db) as Adapter,
    callbacks: {
        session: ({ session, user }) => ({ ...session, user: { ...session.user, id: user.id } }),
    },
    providers: [
        Credentials({
            type: "credentials",
            credentials: { email: {}, password: {} },
            authorize: async (credentials) => {
                if (!credentials) return null;
                return null;
            },
        }),
    ],
};

export const getServerAuthSession = () => getServerSession(authOptions);
