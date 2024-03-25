import { env } from "@/env";
import { compareSync } from "bcrypt";
import { pick } from "lodash";
import { DefaultSession, NextAuthOptions, getServerSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "./db";

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
                    const { email, password } = credentials;
                    const user = await db.user.findFirstOrThrow({ where: { email } });
                    const passwordMatch = compareSync(password, user.password);
                    if (!passwordMatch) throw new Error("Wrong password");
                    return pick(user, ["id", "email", "name", "role"]);
                } catch (error) {
                    console.log("🚀 ~ authorize: ~ error:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        jwt: async ({ token, user }) => ({ ...token, ...user }),
        session: async ({ session, token }) => ({ ...session, user: { ...session.user, ...token } }),
    },
    pages: {
        signIn: "/sign-in",
    },
};

export const getServerAuthSession = async () => await getServerSession(authOptions);
