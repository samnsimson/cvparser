import { z } from "zod";
import type { CandidateWithRelations } from "./CandidateSchema";
import type { CandidatePartialWithRelations } from "./CandidateSchema";
import type { CandidateOptionalDefaultsWithRelations } from "./CandidateSchema";
import type { JobWithRelations } from "./JobSchema";
import type { JobPartialWithRelations } from "./JobSchema";
import type { JobOptionalDefaultsWithRelations } from "./JobSchema";
import { CandidateWithRelationsSchema } from "./CandidateSchema";
import { CandidatePartialWithRelationsSchema } from "./CandidateSchema";
import { CandidateOptionalDefaultsWithRelationsSchema } from "./CandidateSchema";
import { JobWithRelationsSchema } from "./JobSchema";
import { JobPartialWithRelationsSchema } from "./JobSchema";
import { JobOptionalDefaultsWithRelationsSchema } from "./JobSchema";

/////////////////////////////////////////
// CANDIDATES ON JOBS SCHEMA
/////////////////////////////////////////

export const CandidatesOnJobsSchema = z.object({
    id: z.string().uuid(),
    candidateId: z.string(),
    jobId: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export type CandidatesOnJobs = z.infer<typeof CandidatesOnJobsSchema>;

/////////////////////////////////////////
// CANDIDATES ON JOBS PARTIAL SCHEMA
/////////////////////////////////////////

export const CandidatesOnJobsPartialSchema = CandidatesOnJobsSchema.partial();

export type CandidatesOnJobsPartial = z.infer<typeof CandidatesOnJobsPartialSchema>;

/////////////////////////////////////////
// CANDIDATES ON JOBS OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const CandidatesOnJobsOptionalDefaultsSchema = CandidatesOnJobsSchema.merge(
    z.object({
        id: z.string().uuid().optional(),
        createdAt: z.coerce.date().optional(),
        updatedAt: z.coerce.date().optional(),
    }),
);

export type CandidatesOnJobsOptionalDefaults = z.infer<typeof CandidatesOnJobsOptionalDefaultsSchema>;

/////////////////////////////////////////
// CANDIDATES ON JOBS RELATION SCHEMA
/////////////////////////////////////////

export type CandidatesOnJobsRelations = {
    candidate: CandidateWithRelations;
    job: JobWithRelations;
};

export type CandidatesOnJobsWithRelations = z.infer<typeof CandidatesOnJobsSchema> & CandidatesOnJobsRelations;

export const CandidatesOnJobsWithRelationsSchema: z.ZodType<CandidatesOnJobsWithRelations> = CandidatesOnJobsSchema.merge(
    z.object({
        candidate: z.lazy(() => CandidateWithRelationsSchema),
        job: z.lazy(() => JobWithRelationsSchema),
    }),
);

/////////////////////////////////////////
// CANDIDATES ON JOBS OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type CandidatesOnJobsOptionalDefaultsRelations = {
    candidate: CandidateOptionalDefaultsWithRelations;
    job: JobOptionalDefaultsWithRelations;
};

export type CandidatesOnJobsOptionalDefaultsWithRelations = z.infer<typeof CandidatesOnJobsOptionalDefaultsSchema> & CandidatesOnJobsOptionalDefaultsRelations;

export const CandidatesOnJobsOptionalDefaultsWithRelationsSchema: z.ZodType<CandidatesOnJobsOptionalDefaultsWithRelations> =
    CandidatesOnJobsOptionalDefaultsSchema.merge(
        z.object({
            candidate: z.lazy(() => CandidateOptionalDefaultsWithRelationsSchema),
            job: z.lazy(() => JobOptionalDefaultsWithRelationsSchema),
        }),
    );

/////////////////////////////////////////
// CANDIDATES ON JOBS PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type CandidatesOnJobsPartialRelations = {
    candidate?: CandidatePartialWithRelations;
    job?: JobPartialWithRelations;
};

export type CandidatesOnJobsPartialWithRelations = z.infer<typeof CandidatesOnJobsPartialSchema> & CandidatesOnJobsPartialRelations;

export const CandidatesOnJobsPartialWithRelationsSchema: z.ZodType<CandidatesOnJobsPartialWithRelations> = CandidatesOnJobsPartialSchema.merge(
    z.object({
        candidate: z.lazy(() => CandidatePartialWithRelationsSchema),
        job: z.lazy(() => JobPartialWithRelationsSchema),
    }),
).partial();

export type CandidatesOnJobsOptionalDefaultsWithPartialRelations = z.infer<typeof CandidatesOnJobsOptionalDefaultsSchema> & CandidatesOnJobsPartialRelations;

export const CandidatesOnJobsOptionalDefaultsWithPartialRelationsSchema: z.ZodType<CandidatesOnJobsOptionalDefaultsWithPartialRelations> =
    CandidatesOnJobsOptionalDefaultsSchema.merge(
        z
            .object({
                candidate: z.lazy(() => CandidatePartialWithRelationsSchema),
                job: z.lazy(() => JobPartialWithRelationsSchema),
            })
            .partial(),
    );

export type CandidatesOnJobsWithPartialRelations = z.infer<typeof CandidatesOnJobsSchema> & CandidatesOnJobsPartialRelations;

export const CandidatesOnJobsWithPartialRelationsSchema: z.ZodType<CandidatesOnJobsWithPartialRelations> = CandidatesOnJobsSchema.merge(
    z
        .object({
            candidate: z.lazy(() => CandidatePartialWithRelationsSchema),
            job: z.lazy(() => JobPartialWithRelationsSchema),
        })
        .partial(),
);

export default CandidatesOnJobsSchema;
