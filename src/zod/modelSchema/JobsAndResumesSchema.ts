import { z } from 'zod';
import type { JobWithRelations } from './JobSchema'
import type { JobPartialWithRelations } from './JobSchema'
import type { JobOptionalDefaultsWithRelations } from './JobSchema'
import type { ResumeWithRelations } from './ResumeSchema'
import type { ResumePartialWithRelations } from './ResumeSchema'
import type { ResumeOptionalDefaultsWithRelations } from './ResumeSchema'
import { JobWithRelationsSchema } from './JobSchema'
import { JobPartialWithRelationsSchema } from './JobSchema'
import { JobOptionalDefaultsWithRelationsSchema } from './JobSchema'
import { ResumeWithRelationsSchema } from './ResumeSchema'
import { ResumePartialWithRelationsSchema } from './ResumeSchema'
import { ResumeOptionalDefaultsWithRelationsSchema } from './ResumeSchema'

/////////////////////////////////////////
// JOBS AND RESUMES SCHEMA
/////////////////////////////////////////

export const JobsAndResumesSchema = z.object({
  jobId: z.string(),
  resumeId: z.string(),
})

export type JobsAndResumes = z.infer<typeof JobsAndResumesSchema>

/////////////////////////////////////////
// JOBS AND RESUMES PARTIAL SCHEMA
/////////////////////////////////////////

export const JobsAndResumesPartialSchema = JobsAndResumesSchema.partial()

export type JobsAndResumesPartial = z.infer<typeof JobsAndResumesPartialSchema>

/////////////////////////////////////////
// JOBS AND RESUMES OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const JobsAndResumesOptionalDefaultsSchema = JobsAndResumesSchema.merge(z.object({
}))

export type JobsAndResumesOptionalDefaults = z.infer<typeof JobsAndResumesOptionalDefaultsSchema>

/////////////////////////////////////////
// JOBS AND RESUMES RELATION SCHEMA
/////////////////////////////////////////

export type JobsAndResumesRelations = {
  job: JobWithRelations;
  resume: ResumeWithRelations;
};

export type JobsAndResumesWithRelations = z.infer<typeof JobsAndResumesSchema> & JobsAndResumesRelations

export const JobsAndResumesWithRelationsSchema: z.ZodType<JobsAndResumesWithRelations> = JobsAndResumesSchema.merge(z.object({
  job: z.lazy(() => JobWithRelationsSchema),
  resume: z.lazy(() => ResumeWithRelationsSchema),
}))

/////////////////////////////////////////
// JOBS AND RESUMES OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type JobsAndResumesOptionalDefaultsRelations = {
  job: JobOptionalDefaultsWithRelations;
  resume: ResumeOptionalDefaultsWithRelations;
};

export type JobsAndResumesOptionalDefaultsWithRelations = z.infer<typeof JobsAndResumesOptionalDefaultsSchema> & JobsAndResumesOptionalDefaultsRelations

export const JobsAndResumesOptionalDefaultsWithRelationsSchema: z.ZodType<JobsAndResumesOptionalDefaultsWithRelations> = JobsAndResumesOptionalDefaultsSchema.merge(z.object({
  job: z.lazy(() => JobOptionalDefaultsWithRelationsSchema),
  resume: z.lazy(() => ResumeOptionalDefaultsWithRelationsSchema),
}))

/////////////////////////////////////////
// JOBS AND RESUMES PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type JobsAndResumesPartialRelations = {
  job?: JobPartialWithRelations;
  resume?: ResumePartialWithRelations;
};

export type JobsAndResumesPartialWithRelations = z.infer<typeof JobsAndResumesPartialSchema> & JobsAndResumesPartialRelations

export const JobsAndResumesPartialWithRelationsSchema: z.ZodType<JobsAndResumesPartialWithRelations> = JobsAndResumesPartialSchema.merge(z.object({
  job: z.lazy(() => JobPartialWithRelationsSchema),
  resume: z.lazy(() => ResumePartialWithRelationsSchema),
})).partial()

export type JobsAndResumesOptionalDefaultsWithPartialRelations = z.infer<typeof JobsAndResumesOptionalDefaultsSchema> & JobsAndResumesPartialRelations

export const JobsAndResumesOptionalDefaultsWithPartialRelationsSchema: z.ZodType<JobsAndResumesOptionalDefaultsWithPartialRelations> = JobsAndResumesOptionalDefaultsSchema.merge(z.object({
  job: z.lazy(() => JobPartialWithRelationsSchema),
  resume: z.lazy(() => ResumePartialWithRelationsSchema),
}).partial())

export type JobsAndResumesWithPartialRelations = z.infer<typeof JobsAndResumesSchema> & JobsAndResumesPartialRelations

export const JobsAndResumesWithPartialRelationsSchema: z.ZodType<JobsAndResumesWithPartialRelations> = JobsAndResumesSchema.merge(z.object({
  job: z.lazy(() => JobPartialWithRelationsSchema),
  resume: z.lazy(() => ResumePartialWithRelationsSchema),
}).partial())

export default JobsAndResumesSchema;
