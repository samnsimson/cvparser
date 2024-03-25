import { z } from 'zod';
import { JobTypeSchema } from '../inputTypeSchemas/JobTypeSchema'
import { ShiftTypeSchema } from '../inputTypeSchemas/ShiftTypeSchema'
import type { DepartmentWithRelations } from './DepartmentSchema'
import type { DepartmentPartialWithRelations } from './DepartmentSchema'
import type { DepartmentOptionalDefaultsWithRelations } from './DepartmentSchema'
import { DepartmentWithRelationsSchema } from './DepartmentSchema'
import { DepartmentPartialWithRelationsSchema } from './DepartmentSchema'
import { DepartmentOptionalDefaultsWithRelationsSchema } from './DepartmentSchema'

/////////////////////////////////////////
// JOB SCHEMA
/////////////////////////////////////////

export const JobSchema = z.object({
  type: JobTypeSchema,
  shiftType: ShiftTypeSchema,
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullish(),
  departmentId: z.string(),
  location: z.string().nullish(),
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
  type: JobTypeSchema.optional(),
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
};

export type JobWithRelations = z.infer<typeof JobSchema> & JobRelations

export const JobWithRelationsSchema: z.ZodType<JobWithRelations> = JobSchema.merge(z.object({
  department: z.lazy(() => DepartmentWithRelationsSchema),
}))

/////////////////////////////////////////
// JOB OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type JobOptionalDefaultsRelations = {
  department: DepartmentOptionalDefaultsWithRelations;
};

export type JobOptionalDefaultsWithRelations = z.infer<typeof JobOptionalDefaultsSchema> & JobOptionalDefaultsRelations

export const JobOptionalDefaultsWithRelationsSchema: z.ZodType<JobOptionalDefaultsWithRelations> = JobOptionalDefaultsSchema.merge(z.object({
  department: z.lazy(() => DepartmentOptionalDefaultsWithRelationsSchema),
}))

/////////////////////////////////////////
// JOB PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type JobPartialRelations = {
  department?: DepartmentPartialWithRelations;
};

export type JobPartialWithRelations = z.infer<typeof JobPartialSchema> & JobPartialRelations

export const JobPartialWithRelationsSchema: z.ZodType<JobPartialWithRelations> = JobPartialSchema.merge(z.object({
  department: z.lazy(() => DepartmentPartialWithRelationsSchema),
})).partial()

export type JobOptionalDefaultsWithPartialRelations = z.infer<typeof JobOptionalDefaultsSchema> & JobPartialRelations

export const JobOptionalDefaultsWithPartialRelationsSchema: z.ZodType<JobOptionalDefaultsWithPartialRelations> = JobOptionalDefaultsSchema.merge(z.object({
  department: z.lazy(() => DepartmentPartialWithRelationsSchema),
}).partial())

export type JobWithPartialRelations = z.infer<typeof JobSchema> & JobPartialRelations

export const JobWithPartialRelationsSchema: z.ZodType<JobWithPartialRelations> = JobSchema.merge(z.object({
  department: z.lazy(() => DepartmentPartialWithRelationsSchema),
}).partial())

export default JobSchema;
