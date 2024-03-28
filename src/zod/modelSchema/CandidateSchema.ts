import { z } from 'zod';
import { JsonValueSchema } from '../inputTypeSchemas/JsonValueSchema'
import { GenderSchema } from '../inputTypeSchemas/GenderSchema'
import type { JsonValueType } from '../inputTypeSchemas/JsonValueSchema';
import type { ResumeWithRelations } from './ResumeSchema'
import type { ResumePartialWithRelations } from './ResumeSchema'
import type { ResumeOptionalDefaultsWithRelations } from './ResumeSchema'
import type { CandidatesOnJobsWithRelations } from './CandidatesOnJobsSchema'
import type { CandidatesOnJobsPartialWithRelations } from './CandidatesOnJobsSchema'
import type { CandidatesOnJobsOptionalDefaultsWithRelations } from './CandidatesOnJobsSchema'
import type { ShortListedWithRelations } from './ShortListedSchema'
import type { ShortListedPartialWithRelations } from './ShortListedSchema'
import type { ShortListedOptionalDefaultsWithRelations } from './ShortListedSchema'
import { ResumeWithRelationsSchema } from './ResumeSchema'
import { ResumePartialWithRelationsSchema } from './ResumeSchema'
import { ResumeOptionalDefaultsWithRelationsSchema } from './ResumeSchema'
import { CandidatesOnJobsWithRelationsSchema } from './CandidatesOnJobsSchema'
import { CandidatesOnJobsPartialWithRelationsSchema } from './CandidatesOnJobsSchema'
import { CandidatesOnJobsOptionalDefaultsWithRelationsSchema } from './CandidatesOnJobsSchema'
import { ShortListedWithRelationsSchema } from './ShortListedSchema'
import { ShortListedPartialWithRelationsSchema } from './ShortListedSchema'
import { ShortListedOptionalDefaultsWithRelationsSchema } from './ShortListedSchema'

/////////////////////////////////////////
// CANDIDATE SCHEMA
/////////////////////////////////////////

export const CandidateSchema = z.object({
  gender: GenderSchema,
  id: z.string().uuid(),
  name: z.string().min(1, {message:"Name cannot be empty"}),
  email: z.string().email({message:"Email is invalid"}).nullish(),
  phone: z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid").nullish(),
  address: z.string().min(1, {message: "Address cannot be empty"}).nullish(),
  city: z.string().min(1, {message: "City cannot be empty"}).nullish(),
  state: z.string().min(1, {message: "State cannot be empty"}).nullish(),
  country: z.string().min(1, {message: "Country cannot be empty"}).nullish(),
  zipCode: z.string().min(1, {message: "Zip code cannot be empty"}).nullish(),
  age: z.number().positive({message:"Age must be a valid number"}).nullish(),
  dob: z.coerce.date({invalid_type_error:"Date is invalid"}).nullish(),
  jobExperience: JsonValueSchema,
  totalExperience: JsonValueSchema,
  relevantExperience: JsonValueSchema,
  skills: JsonValueSchema,
  pros: JsonValueSchema,
  cons: JsonValueSchema,
  score: z.number().positive({message:"Score must be a valid number"}).nullish(),
  activeResumeId: z.string().nullish(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  resumeId: z.string(),
})

export type Candidate = z.infer<typeof CandidateSchema>

/////////////////////////////////////////
// CANDIDATE PARTIAL SCHEMA
/////////////////////////////////////////

export const CandidatePartialSchema = CandidateSchema.partial()

export type CandidatePartial = z.infer<typeof CandidatePartialSchema>

/////////////////////////////////////////
// CANDIDATE OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const CandidateOptionalDefaultsSchema = CandidateSchema.merge(z.object({
  gender: GenderSchema.optional(),
  id: z.string().uuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type CandidateOptionalDefaults = z.infer<typeof CandidateOptionalDefaultsSchema>

/////////////////////////////////////////
// CANDIDATE RELATION SCHEMA
/////////////////////////////////////////

export type CandidateRelations = {
  resume: ResumeWithRelations[];
  jobs: CandidatesOnJobsWithRelations[];
  shortListedJobs: ShortListedWithRelations[];
};

export type CandidateWithRelations = Omit<z.infer<typeof CandidateSchema>, "jobExperience" | "totalExperience" | "relevantExperience" | "skills" | "pros" | "cons"> & {
  jobExperience?: JsonValueType | null;
  totalExperience?: JsonValueType | null;
  relevantExperience?: JsonValueType | null;
  skills?: JsonValueType | null;
  pros?: JsonValueType | null;
  cons?: JsonValueType | null;
} & CandidateRelations

export const CandidateWithRelationsSchema: z.ZodType<CandidateWithRelations> = CandidateSchema.merge(z.object({
  resume: z.lazy(() => ResumeWithRelationsSchema).array(),
  jobs: z.lazy(() => CandidatesOnJobsWithRelationsSchema).array(),
  shortListedJobs: z.lazy(() => ShortListedWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// CANDIDATE OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type CandidateOptionalDefaultsRelations = {
  resume: ResumeOptionalDefaultsWithRelations[];
  jobs: CandidatesOnJobsOptionalDefaultsWithRelations[];
  shortListedJobs: ShortListedOptionalDefaultsWithRelations[];
};

export type CandidateOptionalDefaultsWithRelations = Omit<z.infer<typeof CandidateOptionalDefaultsSchema>, "jobExperience" | "totalExperience" | "relevantExperience" | "skills" | "pros" | "cons"> & {
  jobExperience?: JsonValueType | null;
  totalExperience?: JsonValueType | null;
  relevantExperience?: JsonValueType | null;
  skills?: JsonValueType | null;
  pros?: JsonValueType | null;
  cons?: JsonValueType | null;
} & CandidateOptionalDefaultsRelations

export const CandidateOptionalDefaultsWithRelationsSchema: z.ZodType<CandidateOptionalDefaultsWithRelations> = CandidateOptionalDefaultsSchema.merge(z.object({
  resume: z.lazy(() => ResumeOptionalDefaultsWithRelationsSchema).array(),
  jobs: z.lazy(() => CandidatesOnJobsOptionalDefaultsWithRelationsSchema).array(),
  shortListedJobs: z.lazy(() => ShortListedOptionalDefaultsWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// CANDIDATE PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type CandidatePartialRelations = {
  resume?: ResumePartialWithRelations[];
  jobs?: CandidatesOnJobsPartialWithRelations[];
  shortListedJobs?: ShortListedPartialWithRelations[];
};

export type CandidatePartialWithRelations = Omit<z.infer<typeof CandidatePartialSchema>, "jobExperience" | "totalExperience" | "relevantExperience" | "skills" | "pros" | "cons"> & {
  jobExperience?: JsonValueType | null;
  totalExperience?: JsonValueType | null;
  relevantExperience?: JsonValueType | null;
  skills?: JsonValueType | null;
  pros?: JsonValueType | null;
  cons?: JsonValueType | null;
} & CandidatePartialRelations

export const CandidatePartialWithRelationsSchema: z.ZodType<CandidatePartialWithRelations> = CandidatePartialSchema.merge(z.object({
  resume: z.lazy(() => ResumePartialWithRelationsSchema).array(),
  jobs: z.lazy(() => CandidatesOnJobsPartialWithRelationsSchema).array(),
  shortListedJobs: z.lazy(() => ShortListedPartialWithRelationsSchema).array(),
})).partial()

export type CandidateOptionalDefaultsWithPartialRelations = Omit<z.infer<typeof CandidateOptionalDefaultsSchema>, "jobExperience" | "totalExperience" | "relevantExperience" | "skills" | "pros" | "cons"> & {
  jobExperience?: JsonValueType | null;
  totalExperience?: JsonValueType | null;
  relevantExperience?: JsonValueType | null;
  skills?: JsonValueType | null;
  pros?: JsonValueType | null;
  cons?: JsonValueType | null;
} & CandidatePartialRelations

export const CandidateOptionalDefaultsWithPartialRelationsSchema: z.ZodType<CandidateOptionalDefaultsWithPartialRelations> = CandidateOptionalDefaultsSchema.merge(z.object({
  resume: z.lazy(() => ResumePartialWithRelationsSchema).array(),
  jobs: z.lazy(() => CandidatesOnJobsPartialWithRelationsSchema).array(),
  shortListedJobs: z.lazy(() => ShortListedPartialWithRelationsSchema).array(),
}).partial())

export type CandidateWithPartialRelations = Omit<z.infer<typeof CandidateSchema>, "jobExperience" | "totalExperience" | "relevantExperience" | "skills" | "pros" | "cons"> & {
  jobExperience?: JsonValueType | null;
  totalExperience?: JsonValueType | null;
  relevantExperience?: JsonValueType | null;
  skills?: JsonValueType | null;
  pros?: JsonValueType | null;
  cons?: JsonValueType | null;
} & CandidatePartialRelations

export const CandidateWithPartialRelationsSchema: z.ZodType<CandidateWithPartialRelations> = CandidateSchema.merge(z.object({
  resume: z.lazy(() => ResumePartialWithRelationsSchema).array(),
  jobs: z.lazy(() => CandidatesOnJobsPartialWithRelationsSchema).array(),
  shortListedJobs: z.lazy(() => ShortListedPartialWithRelationsSchema).array(),
}).partial())

export default CandidateSchema;
