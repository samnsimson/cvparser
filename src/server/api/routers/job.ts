import { JobOptionalDefaultsSchema } from "@/zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const jobRouter = createTRPCRouter({
    getJobs: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db.job.findMany({ where: { createdById: ctx.session.user.id }, include: { department: true } });
    }),
    createJob: protectedProcedure.input(JobOptionalDefaultsSchema.omit({ createdById: true })).mutation(async ({ ctx, input }) => {
        return await ctx.db.job.create({ data: { ...input, createdById: ctx.session.user.id } });
    }),
    deleteJob: protectedProcedure.input(z.object({ id: z.string().uuid() })).mutation(async ({ ctx, input }) => {
        return await ctx.db.job.delete({ where: { id: input.id } });
    }),
});
