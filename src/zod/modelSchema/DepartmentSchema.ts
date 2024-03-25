import { z } from 'zod';
import type { JobWithRelations } from './JobSchema'
import type { JobPartialWithRelations } from './JobSchema'
import type { JobOptionalDefaultsWithRelations } from './JobSchema'
import { JobWithRelationsSchema } from './JobSchema'
import { JobPartialWithRelationsSchema } from './JobSchema'
import { JobOptionalDefaultsWithRelationsSchema } from './JobSchema'

/////////////////////////////////////////
// DEPARTMENT SCHEMA
/////////////////////////////////////////

export const DepartmentSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullish(),
  isDeleted: z.boolean(),
  createdAt: z.coerce.date(),
  udpatedAt: z.coerce.date(),
})

export type Department = z.infer<typeof DepartmentSchema>

/////////////////////////////////////////
// DEPARTMENT PARTIAL SCHEMA
/////////////////////////////////////////

export const DepartmentPartialSchema = DepartmentSchema.partial()

export type DepartmentPartial = z.infer<typeof DepartmentPartialSchema>

/////////////////////////////////////////
// DEPARTMENT OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const DepartmentOptionalDefaultsSchema = DepartmentSchema.merge(z.object({
  id: z.string().uuid().optional(),
  isDeleted: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  udpatedAt: z.coerce.date().optional(),
}))

export type DepartmentOptionalDefaults = z.infer<typeof DepartmentOptionalDefaultsSchema>

/////////////////////////////////////////
// DEPARTMENT RELATION SCHEMA
/////////////////////////////////////////

export type DepartmentRelations = {
  Job: JobWithRelations[];
};

export type DepartmentWithRelations = z.infer<typeof DepartmentSchema> & DepartmentRelations

export const DepartmentWithRelationsSchema: z.ZodType<DepartmentWithRelations> = DepartmentSchema.merge(z.object({
  Job: z.lazy(() => JobWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// DEPARTMENT OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type DepartmentOptionalDefaultsRelations = {
  Job: JobOptionalDefaultsWithRelations[];
};

export type DepartmentOptionalDefaultsWithRelations = z.infer<typeof DepartmentOptionalDefaultsSchema> & DepartmentOptionalDefaultsRelations

export const DepartmentOptionalDefaultsWithRelationsSchema: z.ZodType<DepartmentOptionalDefaultsWithRelations> = DepartmentOptionalDefaultsSchema.merge(z.object({
  Job: z.lazy(() => JobOptionalDefaultsWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// DEPARTMENT PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type DepartmentPartialRelations = {
  Job?: JobPartialWithRelations[];
};

export type DepartmentPartialWithRelations = z.infer<typeof DepartmentPartialSchema> & DepartmentPartialRelations

export const DepartmentPartialWithRelationsSchema: z.ZodType<DepartmentPartialWithRelations> = DepartmentPartialSchema.merge(z.object({
  Job: z.lazy(() => JobPartialWithRelationsSchema).array(),
})).partial()

export type DepartmentOptionalDefaultsWithPartialRelations = z.infer<typeof DepartmentOptionalDefaultsSchema> & DepartmentPartialRelations

export const DepartmentOptionalDefaultsWithPartialRelationsSchema: z.ZodType<DepartmentOptionalDefaultsWithPartialRelations> = DepartmentOptionalDefaultsSchema.merge(z.object({
  Job: z.lazy(() => JobPartialWithRelationsSchema).array(),
}).partial())

export type DepartmentWithPartialRelations = z.infer<typeof DepartmentSchema> & DepartmentPartialRelations

export const DepartmentWithPartialRelationsSchema: z.ZodType<DepartmentWithPartialRelations> = DepartmentSchema.merge(z.object({
  Job: z.lazy(() => JobPartialWithRelationsSchema).array(),
}).partial())

export default DepartmentSchema;