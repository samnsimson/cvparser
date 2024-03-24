import { z } from 'zod';
import { JobTypeSchema } from '../inputTypeSchemas/JobTypeSchema'
import { ShiftTypeSchema } from '../inputTypeSchemas/ShiftTypeSchema'

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

export default JobSchema;
