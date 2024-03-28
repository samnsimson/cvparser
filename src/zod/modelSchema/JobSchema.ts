import { z } from 'zod';
import { JobTypeSchema } from '../inputTypeSchemas/JobTypeSchema'
import { ShiftTypeSchema } from '../inputTypeSchemas/ShiftTypeSchema'
import type { DepartmentWithRelations } from './DepartmentSchema'
import type { DepartmentPartialWithRelations } from './DepartmentSchema'
import type { DepartmentOptionalDefaultsWithRelations } from './DepartmentSchema'
import type { UserWithRelations } from './UserSchema'
import type { UserPartialWithRelations } from './UserSchema'
import type { UserOptionalDefaultsWithRelations } from './UserSchema'
import type { CandidatesOnJobsWithRelations } from './CandidatesOnJobsSchema'
import type { CandidatesOnJobsPartialWithRelations } from './CandidatesOnJobsSchema'
import type { CandidatesOnJobsOptionalDefaultsWithRelations } from './CandidatesOnJobsSchema'
import type { ShortListedWithRelations } from './ShortListedSchema'
import type { ShortListedPartialWithRelations } from './ShortListedSchema'
import type { ShortListedOptionalDefaultsWithRelations } from './ShortListedSchema'
import { DepartmentWithRelationsSchema } from './DepartmentSchema'
import { DepartmentPartialWithRelationsSchema } from './DepartmentSchema'
import { DepartmentOptionalDefaultsWithRelationsSchema } from './DepartmentSchema'
import { UserWithRelationsSchema } from './UserSchema'
import { UserPartialWithRelationsSchema } from './UserSchema'
import { UserOptionalDefaultsWithRelationsSchema } from './UserSchema'
import { CandidatesOnJobsWithRelationsSchema } from './CandidatesOnJobsSchema'
import { CandidatesOnJobsPartialWithRelationsSchema } from './CandidatesOnJobsSchema'
import { CandidatesOnJobsOptionalDefaultsWithRelationsSchema } from './CandidatesOnJobsSchema'
import { ShortListedWithRelationsSchema } from './ShortListedSchema'
import { ShortListedPartialWithRelationsSchema } from './ShortListedSchema'
import { ShortListedOptionalDefaultsWithRelationsSchema } from './ShortListedSchema'

/////////////////////////////////////////
// JOB SCHEMA
/////////////////////////////////////////

export const JobSchema = z.object({
  jobType: JobTypeSchema,
  shiftType: ShiftTypeSchema,
  id: z.string().uuid(),
  title: z.string().min(1, {message: "Title cannot be empty"}),
  description: z.string().nullish(),
  departmentId: z.string().min(1, {message: "Department is required"}).uuid({message:"User ID is invalid"}),
  location: z.string().nullish(),
  expiryDate: z.coerce.date({invalid_type_error:"Date is invalid"}).nullish(),
  createdById: z.string().min(1, {message: "User is required"}).uuid({message:"User ID is invalid"}),
  createdAt: z.coerce.date(),
  udpatedAt: z.coerce.date(),
})

export type Job = z.infer<typeof JobSchema>

/////////////////////////////////////////
// JOB PARTIAL SCHEMA
/////////////////////////////////////////

export const JobPartialSchema = JobSchema.partial()

export type JobPartial = z.infer<typeof JobPartialSchema>

/////////////////////////////////////////
// JOB OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const JobOptionalDefaultsSchema = JobSchema.merge(z.object({
  jobType: JobTypeSchema.optional(),
  shiftType: ShiftTypeSchema.optional(),
  id: z.string().uuid().optional(),
  createdAt: z.coerce.date().optional(),
  udpatedAt: z.coerce.date().optional(),
}))

export type JobOptionalDefaults = z.infer<typeof JobOptionalDefaultsSchema>

/////////////////////////////////////////
// JOB RELATION SCHEMA
/////////////////////////////////////////

export type JobRelations = {
  department: DepartmentWithRelations;
  createdBy: UserWithRelations;
  candidates: CandidatesOnJobsWithRelations[];
  shortListedCandidates: ShortListedWithRelations[];
};

export type JobWithRelations = z.infer<typeof JobSchema> & JobRelations

export const JobWithRelationsSchema: z.ZodType<JobWithRelations> = JobSchema.merge(z.object({
  department: z.lazy(() => DepartmentWithRelationsSchema),
  createdBy: z.lazy(() => UserWithRelationsSchema),
  candidates: z.lazy(() => CandidatesOnJobsWithRelationsSchema).array(),
  shortListedCandidates: z.lazy(() => ShortListedWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// JOB OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type JobOptionalDefaultsRelations = {
  department: DepartmentOptionalDefaultsWithRelations;
  createdBy: UserOptionalDefaultsWithRelations;
  candidates: CandidatesOnJobsOptionalDefaultsWithRelations[];
  shortListedCandidates: ShortListedOptionalDefaultsWithRelations[];
};

export type JobOptionalDefaultsWithRelations = z.infer<typeof JobOptionalDefaultsSchema> & JobOptionalDefaultsRelations

export const JobOptionalDefaultsWithRelationsSchema: z.ZodType<JobOptionalDefaultsWithRelations> = JobOptionalDefaultsSchema.merge(z.object({
  department: z.lazy(() => DepartmentOptionalDefaultsWithRelationsSchema),
  createdBy: z.lazy(() => UserOptionalDefaultsWithRelationsSchema),
  candidates: z.lazy(() => CandidatesOnJobsOptionalDefaultsWithRelationsSchema).array(),
  shortListedCandidates: z.lazy(() => ShortListedOptionalDefaultsWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// JOB PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type JobPartialRelations = {
  department?: DepartmentPartialWithRelations;
  createdBy?: UserPartialWithRelations;
  candidates?: CandidatesOnJobsPartialWithRelations[];
  shortListedCandidates?: ShortListedPartialWithRelations[];
};

export type JobPartialWithRelations = z.infer<typeof JobPartialSchema> & JobPartialRelations

export const JobPartialWithRelationsSchema: z.ZodType<JobPartialWithRelations> = JobPartialSchema.merge(z.object({
  department: z.lazy(() => DepartmentPartialWithRelationsSchema),
  createdBy: z.lazy(() => UserPartialWithRelationsSchema),
  candidates: z.lazy(() => CandidatesOnJobsPartialWithRelationsSchema).array(),
  shortListedCandidates: z.lazy(() => ShortListedPartialWithRelationsSchema).array(),
})).partial()

export type JobOptionalDefaultsWithPartialRelations = z.infer<typeof JobOptionalDefaultsSchema> & JobPartialRelations

export const JobOptionalDefaultsWithPartialRelationsSchema: z.ZodType<JobOptionalDefaultsWithPartialRelations> = JobOptionalDefaultsSchema.merge(z.object({
  department: z.lazy(() => DepartmentPartialWithRelationsSchema),
  createdBy: z.lazy(() => UserPartialWithRelationsSchema),
  candidates: z.lazy(() => CandidatesOnJobsPartialWithRelationsSchema).array(),
  shortListedCandidates: z.lazy(() => ShortListedPartialWithRelationsSchema).array(),
}).partial())

export type JobWithPartialRelations = z.infer<typeof JobSchema> & JobPartialRelations

export const JobWithPartialRelationsSchema: z.ZodType<JobWithPartialRelations> = JobSchema.merge(z.object({
  department: z.lazy(() => DepartmentPartialWithRelationsSchema),
  createdBy: z.lazy(() => UserPartialWithRelationsSchema),
  candidates: z.lazy(() => CandidatesOnJobsPartialWithRelationsSchema).array(),
  shortListedCandidates: z.lazy(() => ShortListedPartialWithRelationsSchema).array(),
}).partial())

export default JobSchema;
