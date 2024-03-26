import { ProfileOptionalDefaultsSchema } from "@/zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const profileRouter = createTRPCRouter({
    getProfile: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db.profile.findFirst({
            where: { user: { id: ctx.session.user.id } },
            include: { user: { select: { name: true, email: true, phone: true, role: true } } },
        });
    }),
    updateProfile: protectedProcedure.input(ProfileOptionalDefaultsSchema.omit({ userId: true })).mutation(async ({ ctx, input }) => {
        const profile = await ctx.db.profile.findFirst({ where: { user: { id: ctx.session.user.id } } });
        const result = profile
            ? await ctx.db.profile.update({ where: { id: profile.id }, data: input })
            : await ctx.db.profile.create({ data: { ...input, user: { connect: { id: ctx.session.user.id } } } });
        return result;
    }),
});
