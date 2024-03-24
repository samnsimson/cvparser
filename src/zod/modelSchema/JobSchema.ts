import { z } from "zod";
import { JobTypeSchema } from "../inputTypeSchemas/JobTypeSchema";
import { ShiftTypeSchema } from "../inputTypeSchemas/ShiftTypeSchema";

/////////////////////////////////////////
// JOB SCHEMA
/////////////////////////////////////////

export const JobSchema = z.object({
    type: JobTypeSchema.nullish(),
    shiftType: ShiftTypeSchema.nullish(),
    id: z.string().uuid(),
    title: z.string(),
    description: z.string().nullish(),
    departmentId: z.string(),
    location: z.string().nullish(),
    createdAt: z.coerce.date(),
    udpatedAt: z.coerce.date(),
});

export type Job = z.infer<typeof JobSchema>;

/////////////////////////////////////////
// JOB PARTIAL SCHEMA
/////////////////////////////////////////

export const JobPartialSchema = JobSchema.partial();

export type JobPartial = z.infer<typeof JobPartialSchema>;

export default JobSchema;
