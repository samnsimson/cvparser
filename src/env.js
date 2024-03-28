import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        DATABASE_URL: z.string().url(),
        NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
        NEXTAUTH_SECRET: process.env.NODE_ENV === "production" ? z.string() : z.string().optional(),
        NEXTAUTH_URL: z.preprocess((str) => process.env.VERCEL_URL ?? str, process.env.VERCEL ? z.string() : z.string().url()),
    },
    client: {
        NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
        NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
        NEXT_PUBLIC_RESUME_FILE_PATH: z.string(),
        NEXT_PUBLIC_RESUME_BUCKET: z.string(),
    },
    runtimeEnv: {
        DATABASE_URL: process.env.DATABASE_URL,
        NODE_ENV: process.env.NODE_ENV,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        NEXT_PUBLIC_RESUME_FILE_PATH: process.env.NEXT_PUBLIC_RESUME_FILE_PATH,
        NEXT_PUBLIC_RESUME_BUCKET: process.env.NEXT_PUBLIC_RESUME_BUCKET,
    },
    skipValidation: !!process.env.SKIP_ENV_VALIDATION,
    emptyStringAsUndefined: true,
});
