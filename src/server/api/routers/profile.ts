import { ProfileOptionalDefaultsSchema } from "@/zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const profileRouter = createTRPCRouter({
    createProfile: protectedProcedure.input(ProfileOptionalDefaultsSchema).mutation(async ({ ctx, input }) => {
        return await ctx.db.profile.create({ data: { ...input, user: { connect: { id: ctx.session.user.id } } } });
    }),
});
