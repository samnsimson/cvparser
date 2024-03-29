import { ResumeOptionalDefaultsWithPartialRelationsSchema } from "@/zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

const CreateEntrySchema = z.object({
    data: ResumeOptionalDefaultsWithPartialRelationsSchema,
    jobId: z.string().uuid(),
});

export const resumeRouter = createTRPCRouter({
    getResumes: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db.resume.findMany();
    }),
    createEntry: protectedProcedure.input(CreateEntrySchema).mutation(async ({ ctx, input: { data, jobId } }) => {
        return await ctx.db.resume.create({ data: { ...data, candidate: undefined, jobs: { create: { job: { connect: { id: jobId } } } } } });
    }),
});
