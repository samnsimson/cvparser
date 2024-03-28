import { z } from 'zod';
import { RoleSchema } from '../inputTypeSchemas/RoleSchema'
import type { ProfileWithRelations } from './ProfileSchema'
import type { ProfilePartialWithRelations } from './ProfileSchema'
import type { ProfileOptionalDefaultsWithRelations } from './ProfileSchema'
import type { JobWithRelations } from './JobSchema'
import type { JobPartialWithRelations } from './JobSchema'
import type { JobOptionalDefaultsWithRelations } from './JobSchema'
import type { DepartmentWithRelations } from './DepartmentSchema'
import type { DepartmentPartialWithRelations } from './DepartmentSchema'
import type { DepartmentOptionalDefaultsWithRelations } from './DepartmentSchema'
import type { ShortListedWithRelations } from './ShortListedSchema'
import type { ShortListedPartialWithRelations } from './ShortListedSchema'
import type { ShortListedOptionalDefaultsWithRelations } from './ShortListedSchema'
import { ProfileWithRelationsSchema } from './ProfileSchema'
import { ProfilePartialWithRelationsSchema } from './ProfileSchema'
import { ProfileOptionalDefaultsWithRelationsSchema } from './ProfileSchema'
import { JobWithRelationsSchema } from './JobSchema'
import { JobPartialWithRelationsSchema } from './JobSchema'
import { JobOptionalDefaultsWithRelationsSchema } from './JobSchema'
import { DepartmentWithRelationsSchema } from './DepartmentSchema'
import { DepartmentPartialWithRelationsSchema } from './DepartmentSchema'
import { DepartmentOptionalDefaultsWithRelationsSchema } from './DepartmentSchema'
import { ShortListedWithRelationsSchema } from './ShortListedSchema'
import { ShortListedPartialWithRelationsSchema } from './ShortListedSchema'
import { ShortListedOptionalDefaultsWithRelationsSchema } from './ShortListedSchema'

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  role: RoleSchema,
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email({message: "Email is invalid"}),
  phone: z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid"),
  password: z.string().min(6).max(16),
  emailVerified: z.boolean(),
  phoneVerified: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// USER PARTIAL SCHEMA
/////////////////////////////////////////

export const UserPartialSchema = UserSchema.partial()

export type UserPartial = z.infer<typeof UserPartialSchema>

/////////////////////////////////////////
// USER OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const UserOptionalDefaultsSchema = UserSchema.merge(z.object({
  role: RoleSchema.optional(),
  id: z.string().uuid().optional(),
  emailVerified: z.boolean().optional(),
  phoneVerified: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type UserOptionalDefaults = z.infer<typeof UserOptionalDefaultsSchema>

/////////////////////////////////////////
// USER RELATION SCHEMA
/////////////////////////////////////////

export type UserRelations = {
  profile?: ProfileWithRelations | null;
  Job: JobWithRelations[];
  Department: DepartmentWithRelations[];
  shortListed: ShortListedWithRelations[];
};

export type UserWithRelations = z.infer<typeof UserSchema> & UserRelations

export const UserWithRelationsSchema: z.ZodType<UserWithRelations> = UserSchema.merge(z.object({
  profile: z.lazy(() => ProfileWithRelationsSchema).nullish(),
  Job: z.lazy(() => JobWithRelationsSchema).array(),
  Department: z.lazy(() => DepartmentWithRelationsSchema).array(),
  shortListed: z.lazy(() => ShortListedWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// USER OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type UserOptionalDefaultsRelations = {
  profile?: ProfileOptionalDefaultsWithRelations | null;
  Job: JobOptionalDefaultsWithRelations[];
  Department: DepartmentOptionalDefaultsWithRelations[];
  shortListed: ShortListedOptionalDefaultsWithRelations[];
};

export type UserOptionalDefaultsWithRelations = z.infer<typeof UserOptionalDefaultsSchema> & UserOptionalDefaultsRelations

export const UserOptionalDefaultsWithRelationsSchema: z.ZodType<UserOptionalDefaultsWithRelations> = UserOptionalDefaultsSchema.merge(z.object({
  profile: z.lazy(() => ProfileOptionalDefaultsWithRelationsSchema).nullish(),
  Job: z.lazy(() => JobOptionalDefaultsWithRelationsSchema).array(),
  Department: z.lazy(() => DepartmentOptionalDefaultsWithRelationsSchema).array(),
  shortListed: z.lazy(() => ShortListedOptionalDefaultsWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// USER PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type UserPartialRelations = {
  profile?: ProfilePartialWithRelations | null;
  Job?: JobPartialWithRelations[];
  Department?: DepartmentPartialWithRelations[];
  shortListed?: ShortListedPartialWithRelations[];
};

export type UserPartialWithRelations = z.infer<typeof UserPartialSchema> & UserPartialRelations

export const UserPartialWithRelationsSchema: z.ZodType<UserPartialWithRelations> = UserPartialSchema.merge(z.object({
  profile: z.lazy(() => ProfilePartialWithRelationsSchema).nullish(),
  Job: z.lazy(() => JobPartialWithRelationsSchema).array(),
  Department: z.lazy(() => DepartmentPartialWithRelationsSchema).array(),
  shortListed: z.lazy(() => ShortListedPartialWithRelationsSchema).array(),
})).partial()

export type UserOptionalDefaultsWithPartialRelations = z.infer<typeof UserOptionalDefaultsSchema> & UserPartialRelations

export const UserOptionalDefaultsWithPartialRelationsSchema: z.ZodType<UserOptionalDefaultsWithPartialRelations> = UserOptionalDefaultsSchema.merge(z.object({
  profile: z.lazy(() => ProfilePartialWithRelationsSchema).nullish(),
  Job: z.lazy(() => JobPartialWithRelationsSchema).array(),
  Department: z.lazy(() => DepartmentPartialWithRelationsSchema).array(),
  shortListed: z.lazy(() => ShortListedPartialWithRelationsSchema).array(),
}).partial())

export type UserWithPartialRelations = z.infer<typeof UserSchema> & UserPartialRelations

export const UserWithPartialRelationsSchema: z.ZodType<UserWithPartialRelations> = UserSchema.merge(z.object({
  profile: z.lazy(() => ProfilePartialWithRelationsSchema).nullish(),
  Job: z.lazy(() => JobPartialWithRelationsSchema).array(),
  Department: z.lazy(() => DepartmentPartialWithRelationsSchema).array(),
  shortListed: z.lazy(() => ShortListedPartialWithRelationsSchema).array(),
}).partial())

export default UserSchema;
