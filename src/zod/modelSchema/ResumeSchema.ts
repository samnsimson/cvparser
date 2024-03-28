import { z } from 'zod';
import type { CandidateWithRelations } from './CandidateSchema'
import type { CandidatePartialWithRelations } from './CandidateSchema'
import type { CandidateOptionalDefaultsWithRelations } from './CandidateSchema'
import { CandidateWithRelationsSchema } from './CandidateSchema'
import { CandidatePartialWithRelationsSchema } from './CandidateSchema'
import { CandidateOptionalDefaultsWithRelationsSchema } from './CandidateSchema'

/////////////////////////////////////////
// RESUME SCHEMA
/////////////////////////////////////////

export const ResumeSchema = z.object({
  id: z.string().uuid(),
  url: z.string().url({message:"URL is invalid"}),
  candidateId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Resume = z.infer<typeof ResumeSchema>

/////////////////////////////////////////
// RESUME PARTIAL SCHEMA
/////////////////////////////////////////

export const ResumePartialSchema = ResumeSchema.partial()

export type ResumePartial = z.infer<typeof ResumePartialSchema>

/////////////////////////////////////////
// RESUME OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const ResumeOptionalDefaultsSchema = ResumeSchema.merge(z.object({
  id: z.string().uuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type ResumeOptionalDefaults = z.infer<typeof ResumeOptionalDefaultsSchema>

/////////////////////////////////////////
// RESUME RELATION SCHEMA
/////////////////////////////////////////

export type ResumeRelations = {
  candidate: CandidateWithRelations;
};

export type ResumeWithRelations = z.infer<typeof ResumeSchema> & ResumeRelations

export const ResumeWithRelationsSchema: z.ZodType<ResumeWithRelations> = ResumeSchema.merge(z.object({
  candidate: z.lazy(() => CandidateWithRelationsSchema),
}))

/////////////////////////////////////////
// RESUME OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type ResumeOptionalDefaultsRelations = {
  candidate: CandidateOptionalDefaultsWithRelations;
};

export type ResumeOptionalDefaultsWithRelations = z.infer<typeof ResumeOptionalDefaultsSchema> & ResumeOptionalDefaultsRelations

export const ResumeOptionalDefaultsWithRelationsSchema: z.ZodType<ResumeOptionalDefaultsWithRelations> = ResumeOptionalDefaultsSchema.merge(z.object({
  candidate: z.lazy(() => CandidateOptionalDefaultsWithRelationsSchema),
}))

/////////////////////////////////////////
// RESUME PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type ResumePartialRelations = {
  candidate?: CandidatePartialWithRelations;
};

export type ResumePartialWithRelations = z.infer<typeof ResumePartialSchema> & ResumePartialRelations

export const ResumePartialWithRelationsSchema: z.ZodType<ResumePartialWithRelations> = ResumePartialSchema.merge(z.object({
  candidate: z.lazy(() => CandidatePartialWithRelationsSchema),
})).partial()

export type ResumeOptionalDefaultsWithPartialRelations = z.infer<typeof ResumeOptionalDefaultsSchema> & ResumePartialRelations

export const ResumeOptionalDefaultsWithPartialRelationsSchema: z.ZodType<ResumeOptionalDefaultsWithPartialRelations> = ResumeOptionalDefaultsSchema.merge(z.object({
  candidate: z.lazy(() => CandidatePartialWithRelationsSchema),
}).partial())

export type ResumeWithPartialRelations = z.infer<typeof ResumeSchema> & ResumePartialRelations

export const ResumeWithPartialRelationsSchema: z.ZodType<ResumeWithPartialRelations> = ResumeSchema.merge(z.object({
  candidate: z.lazy(() => CandidatePartialWithRelationsSchema),
}).partial())

export default ResumeSchema;
