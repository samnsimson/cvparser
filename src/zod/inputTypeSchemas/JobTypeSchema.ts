import { z } from "zod";

export const JobTypeSchema = z.enum(["FULL_TIME", "PART_TIME", "FREELANCE", "REMOTE"]);

export type JobTypeType = `${z.infer<typeof JobTypeSchema>}`;

export default JobTypeSchema;
