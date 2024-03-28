import { z } from 'zod';
import type { UserWithRelations } from './UserSchema'
import type { UserPartialWithRelations } from './UserSchema'
import type { UserOptionalDefaultsWithRelations } from './UserSchema'
import type { CandidateWithRelations } from './CandidateSchema'
import type { CandidatePartialWithRelations } from './CandidateSchema'
import type { CandidateOptionalDefaultsWithRelations } from './CandidateSchema'
import type { JobWithRelations } from './JobSchema'
import type { JobPartialWithRelations } from './JobSchema'
import type { JobOptionalDefaultsWithRelations } from './JobSchema'
import { UserWithRelationsSchema } from './UserSchema'
import { UserPartialWithRelationsSchema } from './UserSchema'
import { UserOptionalDefaultsWithRelationsSchema } from './UserSchema'
import { CandidateWithRelationsSchema } from './CandidateSchema'
import { CandidatePartialWithRelationsSchema } from './CandidateSchema'
import { CandidateOptionalDefaultsWithRelationsSchema } from './CandidateSchema'
import { JobWithRelationsSchema } from './JobSchema'
import { JobPartialWithRelationsSchema } from './JobSchema'
import { JobOptionalDefaultsWithRelationsSchema } from './JobSchema'

/////////////////////////////////////////
// SHORT LISTED SCHEMA
/////////////////////////////////////////

export const ShortListedSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  candidateId: z.string(),
  jobId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type ShortListed = z.infer<typeof ShortListedSchema>

/////////////////////////////////////////
// SHORT LISTED PARTIAL SCHEMA
/////////////////////////////////////////

export const ShortListedPartialSchema = ShortListedSchema.partial()

export type ShortListedPartial = z.infer<typeof ShortListedPartialSchema>

/////////////////////////////////////////
// SHORT LISTED OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const ShortListedOptionalDefaultsSchema = ShortListedSchema.merge(z.object({
  id: z.string().uuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type ShortListedOptionalDefaults = z.infer<typeof ShortListedOptionalDefaultsSchema>

/////////////////////////////////////////
// SHORT LISTED RELATION SCHEMA
/////////////////////////////////////////

export type ShortListedRelations = {
  user: UserWithRelations;
  candidate: CandidateWithRelations;
  job: JobWithRelations;
};

export type ShortListedWithRelations = z.infer<typeof ShortListedSchema> & ShortListedRelations

export const ShortListedWithRelationsSchema: z.ZodType<ShortListedWithRelations> = ShortListedSchema.merge(z.object({
  user: z.lazy(() => UserWithRelationsSchema),
  candidate: z.lazy(() => CandidateWithRelationsSchema),
  job: z.lazy(() => JobWithRelationsSchema),
}))

/////////////////////////////////////////
// SHORT LISTED OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type ShortListedOptionalDefaultsRelations = {
  user: UserOptionalDefaultsWithRelations;
  candidate: CandidateOptionalDefaultsWithRelations;
  job: JobOptionalDefaultsWithRelations;
};

export type ShortListedOptionalDefaultsWithRelations = z.infer<typeof ShortListedOptionalDefaultsSchema> & ShortListedOptionalDefaultsRelations

export const ShortListedOptionalDefaultsWithRelationsSchema: z.ZodType<ShortListedOptionalDefaultsWithRelations> = ShortListedOptionalDefaultsSchema.merge(z.object({
  user: z.lazy(() => UserOptionalDefaultsWithRelationsSchema),
  candidate: z.lazy(() => CandidateOptionalDefaultsWithRelationsSchema),
  job: z.lazy(() => JobOptionalDefaultsWithRelationsSchema),
}))

/////////////////////////////////////////
// SHORT LISTED PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type ShortListedPartialRelations = {
  user?: UserPartialWithRelations;
  candidate?: CandidatePartialWithRelations;
  job?: JobPartialWithRelations;
};

export type ShortListedPartialWithRelations = z.infer<typeof ShortListedPartialSchema> & ShortListedPartialRelations

export const ShortListedPartialWithRelationsSchema: z.ZodType<ShortListedPartialWithRelations> = ShortListedPartialSchema.merge(z.object({
  user: z.lazy(() => UserPartialWithRelationsSchema),
  candidate: z.lazy(() => CandidatePartialWithRelationsSchema),
  job: z.lazy(() => JobPartialWithRelationsSchema),
})).partial()

export type ShortListedOptionalDefaultsWithPartialRelations = z.infer<typeof ShortListedOptionalDefaultsSchema> & ShortListedPartialRelations

export const ShortListedOptionalDefaultsWithPartialRelationsSchema: z.ZodType<ShortListedOptionalDefaultsWithPartialRelations> = ShortListedOptionalDefaultsSchema.merge(z.object({
  user: z.lazy(() => UserPartialWithRelationsSchema),
  candidate: z.lazy(() => CandidatePartialWithRelationsSchema),
  job: z.lazy(() => JobPartialWithRelationsSchema),
}).partial())

export type ShortListedWithPartialRelations = z.infer<typeof ShortListedSchema> & ShortListedPartialRelations

export const ShortListedWithPartialRelationsSchema: z.ZodType<ShortListedWithPartialRelations> = ShortListedSchema.merge(z.object({
  user: z.lazy(() => UserPartialWithRelationsSchema),
  candidate: z.lazy(() => CandidatePartialWithRelationsSchema),
  job: z.lazy(() => JobPartialWithRelationsSchema),
}).partial())

export default ShortListedSchema;
