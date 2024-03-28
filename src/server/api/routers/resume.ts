import { ResumeOptionalDefaultsWithPartialRelationsSchema } from "@/zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

const CreateEntrySchema = z.object({
    data: ResumeOptionalDefaultsWithPartialRelationsSchema,
    jobId: z.string().uuid(),
});

export const resumeRouter = createTRPCRouter({
    createEntry: protectedProcedure.input(CreateEntrySchema).mutation(async ({ ctx, input: { data, jobId } }) => {
        const { id: resumeId } = await ctx.db.resume.create({ data: { ...data, candidate: undefined, jobs: undefined } });
        return await ctx.db.jobsAndResumes.create({ data: { jobId, resumeId } });
    }),
});
