import { ResumeOptionalDefaultsSchema } from "@/zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

const CreateEntrySchema = z.object({
    data: ResumeOptionalDefaultsSchema.omit({ createdById: true }),
    jobId: z.string().uuid(),
});

export const resumeRouter = createTRPCRouter({
    getResumes: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db.resume.findMany({ where: { createdById: ctx.session.user.id } });
    }),
    getResumesForJobs: protectedProcedure.input(z.object({ jobId: z.string().uuid() })).query(async ({ ctx, input: { jobId } }) => {
        return await ctx.db.resume.findMany({ where: { createdById: ctx.session.user.id, jobs: { some: { jobId } } } });
    }),
    createEntry: protectedProcedure.input(CreateEntrySchema).mutation(async ({ ctx, input: { data, jobId } }) => {
        return await ctx.db.resume.create({
            data: { ...data, createdById: ctx.session.user.id, candidate: undefined, jobs: { create: { job: { connect: { id: jobId } } } } },
        });
    }),
});
