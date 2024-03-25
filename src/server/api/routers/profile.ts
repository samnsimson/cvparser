import { ProfileOptionalDefaultsSchema } from "@/zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const profileRouter = createTRPCRouter({
    getProfile: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db.profile.findFirst({
            where: { user: { id: ctx.session.user.id } },
            include: { user: { select: { name: true, email: true, phone: true, role: true } } },
        });
    }),
    createProfile: protectedProcedure.input(ProfileOptionalDefaultsSchema.omit({ userId: true })).mutation(async ({ ctx, input }) => {
        return await ctx.db.profile.create({ data: { ...input, user: { connect: { id: ctx.session.user.id } } } });
    }),
});
