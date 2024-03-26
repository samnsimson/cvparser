import { JobOptionalDefaultsSchema } from "@/zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const jobRouter = createTRPCRouter({
    createJob: protectedProcedure.input(JobOptionalDefaultsSchema.omit({ createdById: true })).mutation(async ({ ctx, input }) => {
        return await ctx.db.job.create({ data: { ...input, createdById: ctx.session.user.id } });
    }),
});
