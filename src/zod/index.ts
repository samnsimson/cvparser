import { z } from 'zod';
import { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// JSON
//------------------------------------------------------

export type NullableJsonInput = Prisma.JsonValue | null | 'JsonNull' | 'DbNull' | Prisma.NullTypes.DbNull | Prisma.NullTypes.JsonNull;

export const transformJsonNull = (v?: NullableJsonInput) => {
  if (!v || v === 'DbNull') return Prisma.DbNull;
  if (v === 'JsonNull') return Prisma.JsonNull;
  return v;
};

export const JsonValueSchema: z.ZodType<Prisma.JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.literal(null),
    z.record(z.lazy(() => JsonValueSchema.optional())),
    z.array(z.lazy(() => JsonValueSchema)),
  ])
);

export type JsonValueType = z.infer<typeof JsonValueSchema>;

export const NullableJsonValue = z
  .union([JsonValueSchema, z.literal('DbNull'), z.literal('JsonNull')])
  .nullable()
  .transform((v) => transformJsonNull(v));

export type NullableJsonValueType = z.infer<typeof NullableJsonValue>;

export const InputJsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.object({ toJSON: z.function(z.tuple([]), z.any()) }),
    z.record(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
    z.array(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
  ])
);

export type InputJsonValueType = z.infer<typeof InputJsonValueSchema>;


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','name','email','phone','password','role','emailVerified','phoneVerified','createdAt','updatedAt']);

export const ProfileScalarFieldEnumSchema = z.enum(['id','firstName','lastName','address','city','state','country','zipCode','userId','createdAt','updatedAt']);

export const JobScalarFieldEnumSchema = z.enum(['id','title','description','jobType','departmentId','location','shiftType','expiryDate','createdById','createdAt','udpatedAt']);

export const DepartmentScalarFieldEnumSchema = z.enum(['id','title','description','isDeleted','createdById','createdAt','udpatedAt']);

export const CandidateScalarFieldEnumSchema = z.enum(['id','name','email','phone','address','city','state','country','zipCode','age','dob','gender','jobExperience','totalExperience','relevantExperience','skills','pros','cons','score','resumeId','activeResumeId','createdAt','updatedAt']);

export const CandidatesOnJobsScalarFieldEnumSchema = z.enum(['id','candidateId','jobId','createdAt','updatedAt']);

export const ShortListedScalarFieldEnumSchema = z.enum(['id','userId','candidateId','jobId','createdAt','updatedAt']);

export const ResumeScalarFieldEnumSchema = z.enum(['id','fileKey','path','fullPath','url','candidateId','createdById','createdAt','updatedAt']);

export const JobsAndResumesScalarFieldEnumSchema = z.enum(['jobId','resumeId']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const NullableJsonNullValueInputSchema = z.enum(['DbNull','JsonNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.DbNull : value);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const JsonNullValueFilterSchema = z.enum(['DbNull','JsonNull','AnyNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.JsonNull : value === 'AnyNull' ? Prisma.AnyNull : value);

export const GenderSchema = z.enum(['MALE','FEMALE']);

export type GenderType = `${z.infer<typeof GenderSchema>}`

export const JobTypeSchema = z.enum(['FULL_TIME','PART_TIME','HYBRID','REMOTE']);

export type JobTypeType = `${z.infer<typeof JobTypeSchema>}`

export const ShiftTypeSchema = z.enum(['DAY','NIGHT','MIXED']);

export type ShiftTypeType = `${z.infer<typeof ShiftTypeSchema>}`

export const RoleSchema = z.enum(['USER','ADMIN']);

export type RoleType = `${z.infer<typeof RoleSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

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

// USER OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const UserOptionalDefaultsSchema = UserSchema.merge(z.object({
  role: RoleSchema.optional(),
  id: z.string().uuid().optional(),
  emailVerified: z.boolean().optional(),
  phoneVerified: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type UserOptionalDefaults = z.infer<typeof UserOptionalDefaultsSchema>

// USER RELATION SCHEMA
//------------------------------------------------------

export type UserRelations = {
  profile?: ProfileWithRelations | null;
  job: JobWithRelations[];
  departments: DepartmentWithRelations[];
  shortListed: ShortListedWithRelations[];
  ownedResumes: ResumeWithRelations[];
};

export type UserWithRelations = z.infer<typeof UserSchema> & UserRelations

export const UserWithRelationsSchema: z.ZodType<UserWithRelations> = UserSchema.merge(z.object({
  profile: z.lazy(() => ProfileWithRelationsSchema).nullish(),
  job: z.lazy(() => JobWithRelationsSchema).array(),
  departments: z.lazy(() => DepartmentWithRelationsSchema).array(),
  shortListed: z.lazy(() => ShortListedWithRelationsSchema).array(),
  ownedResumes: z.lazy(() => ResumeWithRelationsSchema).array(),
}))

// USER OPTIONAL DEFAULTS RELATION SCHEMA
//------------------------------------------------------

export type UserOptionalDefaultsRelations = {
  profile?: ProfileOptionalDefaultsWithRelations | null;
  job: JobOptionalDefaultsWithRelations[];
  departments: DepartmentOptionalDefaultsWithRelations[];
  shortListed: ShortListedOptionalDefaultsWithRelations[];
  ownedResumes: ResumeOptionalDefaultsWithRelations[];
};

export type UserOptionalDefaultsWithRelations = z.infer<typeof UserOptionalDefaultsSchema> & UserOptionalDefaultsRelations

export const UserOptionalDefaultsWithRelationsSchema: z.ZodType<UserOptionalDefaultsWithRelations> = UserOptionalDefaultsSchema.merge(z.object({
  profile: z.lazy(() => ProfileOptionalDefaultsWithRelationsSchema).nullish(),
  job: z.lazy(() => JobOptionalDefaultsWithRelationsSchema).array(),
  departments: z.lazy(() => DepartmentOptionalDefaultsWithRelationsSchema).array(),
  shortListed: z.lazy(() => ShortListedOptionalDefaultsWithRelationsSchema).array(),
  ownedResumes: z.lazy(() => ResumeOptionalDefaultsWithRelationsSchema).array(),
}))

// USER PARTIAL RELATION SCHEMA
//------------------------------------------------------

export type UserPartialRelations = {
  profile?: ProfilePartialWithRelations | null;
  job?: JobPartialWithRelations[];
  departments?: DepartmentPartialWithRelations[];
  shortListed?: ShortListedPartialWithRelations[];
  ownedResumes?: ResumePartialWithRelations[];
};

export type UserPartialWithRelations = z.infer<typeof UserPartialSchema> & UserPartialRelations

export const UserPartialWithRelationsSchema: z.ZodType<UserPartialWithRelations> = UserPartialSchema.merge(z.object({
  profile: z.lazy(() => ProfilePartialWithRelationsSchema).nullish(),
  job: z.lazy(() => JobPartialWithRelationsSchema).array(),
  departments: z.lazy(() => DepartmentPartialWithRelationsSchema).array(),
  shortListed: z.lazy(() => ShortListedPartialWithRelationsSchema).array(),
  ownedResumes: z.lazy(() => ResumePartialWithRelationsSchema).array(),
})).partial()

export type UserOptionalDefaultsWithPartialRelations = z.infer<typeof UserOptionalDefaultsSchema> & UserPartialRelations

export const UserOptionalDefaultsWithPartialRelationsSchema: z.ZodType<UserOptionalDefaultsWithPartialRelations> = UserOptionalDefaultsSchema.merge(z.object({
  profile: z.lazy(() => ProfilePartialWithRelationsSchema).nullish(),
  job: z.lazy(() => JobPartialWithRelationsSchema).array(),
  departments: z.lazy(() => DepartmentPartialWithRelationsSchema).array(),
  shortListed: z.lazy(() => ShortListedPartialWithRelationsSchema).array(),
  ownedResumes: z.lazy(() => ResumePartialWithRelationsSchema).array(),
}).partial())

export type UserWithPartialRelations = z.infer<typeof UserSchema> & UserPartialRelations

export const UserWithPartialRelationsSchema: z.ZodType<UserWithPartialRelations> = UserSchema.merge(z.object({
  profile: z.lazy(() => ProfilePartialWithRelationsSchema).nullish(),
  job: z.lazy(() => JobPartialWithRelationsSchema).array(),
  departments: z.lazy(() => DepartmentPartialWithRelationsSchema).array(),
  shortListed: z.lazy(() => ShortListedPartialWithRelationsSchema).array(),
  ownedResumes: z.lazy(() => ResumePartialWithRelationsSchema).array(),
}).partial())

/////////////////////////////////////////
// PROFILE SCHEMA
/////////////////////////////////////////

export const ProfileSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string().min(3, {message: "Value cannot be empty"}),
  lastName: z.string().min(3, {message: "Value cannot be empty"}).nullish(),
  address: z.string().min(3, {message: "Value cannot be empty"}).nullish(),
  city: z.string().min(3, {message: "Value cannot be empty"}).nullish(),
  state: z.string().min(3, {message: "Value cannot be empty"}).nullish(),
  country: z.string().min(3, {message: "Value cannot be empty"}).nullish(),
  zipCode: z.string().min(3, {message: "Value cannot be empty"}).nullish(),
  userId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Profile = z.infer<typeof ProfileSchema>

/////////////////////////////////////////
// PROFILE PARTIAL SCHEMA
/////////////////////////////////////////

export const ProfilePartialSchema = ProfileSchema.partial()

export type ProfilePartial = z.infer<typeof ProfilePartialSchema>

// PROFILE OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const ProfileOptionalDefaultsSchema = ProfileSchema.merge(z.object({
  id: z.string().uuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type ProfileOptionalDefaults = z.infer<typeof ProfileOptionalDefaultsSchema>

// PROFILE RELATION SCHEMA
//------------------------------------------------------

export type ProfileRelations = {
  user: UserWithRelations;
};

export type ProfileWithRelations = z.infer<typeof ProfileSchema> & ProfileRelations

export const ProfileWithRelationsSchema: z.ZodType<ProfileWithRelations> = ProfileSchema.merge(z.object({
  user: z.lazy(() => UserWithRelationsSchema),
}))

// PROFILE OPTIONAL DEFAULTS RELATION SCHEMA
//------------------------------------------------------

export type ProfileOptionalDefaultsRelations = {
  user: UserOptionalDefaultsWithRelations;
};

export type ProfileOptionalDefaultsWithRelations = z.infer<typeof ProfileOptionalDefaultsSchema> & ProfileOptionalDefaultsRelations

export const ProfileOptionalDefaultsWithRelationsSchema: z.ZodType<ProfileOptionalDefaultsWithRelations> = ProfileOptionalDefaultsSchema.merge(z.object({
  user: z.lazy(() => UserOptionalDefaultsWithRelationsSchema),
}))

// PROFILE PARTIAL RELATION SCHEMA
//------------------------------------------------------

export type ProfilePartialRelations = {
  user?: UserPartialWithRelations;
};

export type ProfilePartialWithRelations = z.infer<typeof ProfilePartialSchema> & ProfilePartialRelations

export const ProfilePartialWithRelationsSchema: z.ZodType<ProfilePartialWithRelations> = ProfilePartialSchema.merge(z.object({
  user: z.lazy(() => UserPartialWithRelationsSchema),
})).partial()

export type ProfileOptionalDefaultsWithPartialRelations = z.infer<typeof ProfileOptionalDefaultsSchema> & ProfilePartialRelations

export const ProfileOptionalDefaultsWithPartialRelationsSchema: z.ZodType<ProfileOptionalDefaultsWithPartialRelations> = ProfileOptionalDefaultsSchema.merge(z.object({
  user: z.lazy(() => UserPartialWithRelationsSchema),
}).partial())

export type ProfileWithPartialRelations = z.infer<typeof ProfileSchema> & ProfilePartialRelations

export const ProfileWithPartialRelationsSchema: z.ZodType<ProfileWithPartialRelations> = ProfileSchema.merge(z.object({
  user: z.lazy(() => UserPartialWithRelationsSchema),
}).partial())

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

// JOB OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const JobOptionalDefaultsSchema = JobSchema.merge(z.object({
  jobType: JobTypeSchema.optional(),
  shiftType: ShiftTypeSchema.optional(),
  id: z.string().uuid().optional(),
  createdAt: z.coerce.date().optional(),
  udpatedAt: z.coerce.date().optional(),
}))

export type JobOptionalDefaults = z.infer<typeof JobOptionalDefaultsSchema>

// JOB RELATION SCHEMA
//------------------------------------------------------

export type JobRelations = {
  department: DepartmentWithRelations;
  createdBy: UserWithRelations;
  resumes: JobsAndResumesWithRelations[];
  candidates: CandidatesOnJobsWithRelations[];
  shortListedCandidates: ShortListedWithRelations[];
};

export type JobWithRelations = z.infer<typeof JobSchema> & JobRelations

export const JobWithRelationsSchema: z.ZodType<JobWithRelations> = JobSchema.merge(z.object({
  department: z.lazy(() => DepartmentWithRelationsSchema),
  createdBy: z.lazy(() => UserWithRelationsSchema),
  resumes: z.lazy(() => JobsAndResumesWithRelationsSchema).array(),
  candidates: z.lazy(() => CandidatesOnJobsWithRelationsSchema).array(),
  shortListedCandidates: z.lazy(() => ShortListedWithRelationsSchema).array(),
}))

// JOB OPTIONAL DEFAULTS RELATION SCHEMA
//------------------------------------------------------

export type JobOptionalDefaultsRelations = {
  department: DepartmentOptionalDefaultsWithRelations;
  createdBy: UserOptionalDefaultsWithRelations;
  resumes: JobsAndResumesOptionalDefaultsWithRelations[];
  candidates: CandidatesOnJobsOptionalDefaultsWithRelations[];
  shortListedCandidates: ShortListedOptionalDefaultsWithRelations[];
};

export type JobOptionalDefaultsWithRelations = z.infer<typeof JobOptionalDefaultsSchema> & JobOptionalDefaultsRelations

export const JobOptionalDefaultsWithRelationsSchema: z.ZodType<JobOptionalDefaultsWithRelations> = JobOptionalDefaultsSchema.merge(z.object({
  department: z.lazy(() => DepartmentOptionalDefaultsWithRelationsSchema),
  createdBy: z.lazy(() => UserOptionalDefaultsWithRelationsSchema),
  resumes: z.lazy(() => JobsAndResumesOptionalDefaultsWithRelationsSchema).array(),
  candidates: z.lazy(() => CandidatesOnJobsOptionalDefaultsWithRelationsSchema).array(),
  shortListedCandidates: z.lazy(() => ShortListedOptionalDefaultsWithRelationsSchema).array(),
}))

// JOB PARTIAL RELATION SCHEMA
//------------------------------------------------------

export type JobPartialRelations = {
  department?: DepartmentPartialWithRelations;
  createdBy?: UserPartialWithRelations;
  resumes?: JobsAndResumesPartialWithRelations[];
  candidates?: CandidatesOnJobsPartialWithRelations[];
  shortListedCandidates?: ShortListedPartialWithRelations[];
};

export type JobPartialWithRelations = z.infer<typeof JobPartialSchema> & JobPartialRelations

export const JobPartialWithRelationsSchema: z.ZodType<JobPartialWithRelations> = JobPartialSchema.merge(z.object({
  department: z.lazy(() => DepartmentPartialWithRelationsSchema),
  createdBy: z.lazy(() => UserPartialWithRelationsSchema),
  resumes: z.lazy(() => JobsAndResumesPartialWithRelationsSchema).array(),
  candidates: z.lazy(() => CandidatesOnJobsPartialWithRelationsSchema).array(),
  shortListedCandidates: z.lazy(() => ShortListedPartialWithRelationsSchema).array(),
})).partial()

export type JobOptionalDefaultsWithPartialRelations = z.infer<typeof JobOptionalDefaultsSchema> & JobPartialRelations

export const JobOptionalDefaultsWithPartialRelationsSchema: z.ZodType<JobOptionalDefaultsWithPartialRelations> = JobOptionalDefaultsSchema.merge(z.object({
  department: z.lazy(() => DepartmentPartialWithRelationsSchema),
  createdBy: z.lazy(() => UserPartialWithRelationsSchema),
  resumes: z.lazy(() => JobsAndResumesPartialWithRelationsSchema).array(),
  candidates: z.lazy(() => CandidatesOnJobsPartialWithRelationsSchema).array(),
  shortListedCandidates: z.lazy(() => ShortListedPartialWithRelationsSchema).array(),
}).partial())

export type JobWithPartialRelations = z.infer<typeof JobSchema> & JobPartialRelations

export const JobWithPartialRelationsSchema: z.ZodType<JobWithPartialRelations> = JobSchema.merge(z.object({
  department: z.lazy(() => DepartmentPartialWithRelationsSchema),
  createdBy: z.lazy(() => UserPartialWithRelationsSchema),
  resumes: z.lazy(() => JobsAndResumesPartialWithRelationsSchema).array(),
  candidates: z.lazy(() => CandidatesOnJobsPartialWithRelationsSchema).array(),
  shortListedCandidates: z.lazy(() => ShortListedPartialWithRelationsSchema).array(),
}).partial())

/////////////////////////////////////////
// DEPARTMENT SCHEMA
/////////////////////////////////////////

export const DepartmentSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, {message: "Title cannot be empty"}),
  description: z.string().nullish(),
  isDeleted: z.boolean(),
  createdById: z.string().min(1, {message: "User is required"}).uuid({message:"User ID is invalid"}),
  createdAt: z.coerce.date(),
  udpatedAt: z.coerce.date(),
})

export type Department = z.infer<typeof DepartmentSchema>

/////////////////////////////////////////
// DEPARTMENT PARTIAL SCHEMA
/////////////////////////////////////////

export const DepartmentPartialSchema = DepartmentSchema.partial()

export type DepartmentPartial = z.infer<typeof DepartmentPartialSchema>

// DEPARTMENT OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const DepartmentOptionalDefaultsSchema = DepartmentSchema.merge(z.object({
  id: z.string().uuid().optional(),
  isDeleted: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  udpatedAt: z.coerce.date().optional(),
}))

export type DepartmentOptionalDefaults = z.infer<typeof DepartmentOptionalDefaultsSchema>

// DEPARTMENT RELATION SCHEMA
//------------------------------------------------------

export type DepartmentRelations = {
  job: JobWithRelations[];
  createdBy: UserWithRelations;
};

export type DepartmentWithRelations = z.infer<typeof DepartmentSchema> & DepartmentRelations

export const DepartmentWithRelationsSchema: z.ZodType<DepartmentWithRelations> = DepartmentSchema.merge(z.object({
  job: z.lazy(() => JobWithRelationsSchema).array(),
  createdBy: z.lazy(() => UserWithRelationsSchema),
}))

// DEPARTMENT OPTIONAL DEFAULTS RELATION SCHEMA
//------------------------------------------------------

export type DepartmentOptionalDefaultsRelations = {
  job: JobOptionalDefaultsWithRelations[];
  createdBy: UserOptionalDefaultsWithRelations;
};

export type DepartmentOptionalDefaultsWithRelations = z.infer<typeof DepartmentOptionalDefaultsSchema> & DepartmentOptionalDefaultsRelations

export const DepartmentOptionalDefaultsWithRelationsSchema: z.ZodType<DepartmentOptionalDefaultsWithRelations> = DepartmentOptionalDefaultsSchema.merge(z.object({
  job: z.lazy(() => JobOptionalDefaultsWithRelationsSchema).array(),
  createdBy: z.lazy(() => UserOptionalDefaultsWithRelationsSchema),
}))

// DEPARTMENT PARTIAL RELATION SCHEMA
//------------------------------------------------------

export type DepartmentPartialRelations = {
  job?: JobPartialWithRelations[];
  createdBy?: UserPartialWithRelations;
};

export type DepartmentPartialWithRelations = z.infer<typeof DepartmentPartialSchema> & DepartmentPartialRelations

export const DepartmentPartialWithRelationsSchema: z.ZodType<DepartmentPartialWithRelations> = DepartmentPartialSchema.merge(z.object({
  job: z.lazy(() => JobPartialWithRelationsSchema).array(),
  createdBy: z.lazy(() => UserPartialWithRelationsSchema),
})).partial()

export type DepartmentOptionalDefaultsWithPartialRelations = z.infer<typeof DepartmentOptionalDefaultsSchema> & DepartmentPartialRelations

export const DepartmentOptionalDefaultsWithPartialRelationsSchema: z.ZodType<DepartmentOptionalDefaultsWithPartialRelations> = DepartmentOptionalDefaultsSchema.merge(z.object({
  job: z.lazy(() => JobPartialWithRelationsSchema).array(),
  createdBy: z.lazy(() => UserPartialWithRelationsSchema),
}).partial())

export type DepartmentWithPartialRelations = z.infer<typeof DepartmentSchema> & DepartmentPartialRelations

export const DepartmentWithPartialRelationsSchema: z.ZodType<DepartmentWithPartialRelations> = DepartmentSchema.merge(z.object({
  job: z.lazy(() => JobPartialWithRelationsSchema).array(),
  createdBy: z.lazy(() => UserPartialWithRelationsSchema),
}).partial())

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
  resumeId: z.string(),
  activeResumeId: z.string().nullish(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Candidate = z.infer<typeof CandidateSchema>

/////////////////////////////////////////
// CANDIDATE PARTIAL SCHEMA
/////////////////////////////////////////

export const CandidatePartialSchema = CandidateSchema.partial()

export type CandidatePartial = z.infer<typeof CandidatePartialSchema>

// CANDIDATE OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const CandidateOptionalDefaultsSchema = CandidateSchema.merge(z.object({
  gender: GenderSchema.optional(),
  id: z.string().uuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type CandidateOptionalDefaults = z.infer<typeof CandidateOptionalDefaultsSchema>

// CANDIDATE RELATION SCHEMA
//------------------------------------------------------

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

// CANDIDATE OPTIONAL DEFAULTS RELATION SCHEMA
//------------------------------------------------------

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

// CANDIDATE PARTIAL RELATION SCHEMA
//------------------------------------------------------

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

/////////////////////////////////////////
// CANDIDATES ON JOBS SCHEMA
/////////////////////////////////////////

export const CandidatesOnJobsSchema = z.object({
  id: z.string().uuid(),
  candidateId: z.string(),
  jobId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type CandidatesOnJobs = z.infer<typeof CandidatesOnJobsSchema>

/////////////////////////////////////////
// CANDIDATES ON JOBS PARTIAL SCHEMA
/////////////////////////////////////////

export const CandidatesOnJobsPartialSchema = CandidatesOnJobsSchema.partial()

export type CandidatesOnJobsPartial = z.infer<typeof CandidatesOnJobsPartialSchema>

// CANDIDATES ON JOBS OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const CandidatesOnJobsOptionalDefaultsSchema = CandidatesOnJobsSchema.merge(z.object({
  id: z.string().uuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type CandidatesOnJobsOptionalDefaults = z.infer<typeof CandidatesOnJobsOptionalDefaultsSchema>

// CANDIDATES ON JOBS RELATION SCHEMA
//------------------------------------------------------

export type CandidatesOnJobsRelations = {
  candidate: CandidateWithRelations;
  job: JobWithRelations;
};

export type CandidatesOnJobsWithRelations = z.infer<typeof CandidatesOnJobsSchema> & CandidatesOnJobsRelations

export const CandidatesOnJobsWithRelationsSchema: z.ZodType<CandidatesOnJobsWithRelations> = CandidatesOnJobsSchema.merge(z.object({
  candidate: z.lazy(() => CandidateWithRelationsSchema),
  job: z.lazy(() => JobWithRelationsSchema),
}))

// CANDIDATES ON JOBS OPTIONAL DEFAULTS RELATION SCHEMA
//------------------------------------------------------

export type CandidatesOnJobsOptionalDefaultsRelations = {
  candidate: CandidateOptionalDefaultsWithRelations;
  job: JobOptionalDefaultsWithRelations;
};

export type CandidatesOnJobsOptionalDefaultsWithRelations = z.infer<typeof CandidatesOnJobsOptionalDefaultsSchema> & CandidatesOnJobsOptionalDefaultsRelations

export const CandidatesOnJobsOptionalDefaultsWithRelationsSchema: z.ZodType<CandidatesOnJobsOptionalDefaultsWithRelations> = CandidatesOnJobsOptionalDefaultsSchema.merge(z.object({
  candidate: z.lazy(() => CandidateOptionalDefaultsWithRelationsSchema),
  job: z.lazy(() => JobOptionalDefaultsWithRelationsSchema),
}))

// CANDIDATES ON JOBS PARTIAL RELATION SCHEMA
//------------------------------------------------------

export type CandidatesOnJobsPartialRelations = {
  candidate?: CandidatePartialWithRelations;
  job?: JobPartialWithRelations;
};

export type CandidatesOnJobsPartialWithRelations = z.infer<typeof CandidatesOnJobsPartialSchema> & CandidatesOnJobsPartialRelations

export const CandidatesOnJobsPartialWithRelationsSchema: z.ZodType<CandidatesOnJobsPartialWithRelations> = CandidatesOnJobsPartialSchema.merge(z.object({
  candidate: z.lazy(() => CandidatePartialWithRelationsSchema),
  job: z.lazy(() => JobPartialWithRelationsSchema),
})).partial()

export type CandidatesOnJobsOptionalDefaultsWithPartialRelations = z.infer<typeof CandidatesOnJobsOptionalDefaultsSchema> & CandidatesOnJobsPartialRelations

export const CandidatesOnJobsOptionalDefaultsWithPartialRelationsSchema: z.ZodType<CandidatesOnJobsOptionalDefaultsWithPartialRelations> = CandidatesOnJobsOptionalDefaultsSchema.merge(z.object({
  candidate: z.lazy(() => CandidatePartialWithRelationsSchema),
  job: z.lazy(() => JobPartialWithRelationsSchema),
}).partial())

export type CandidatesOnJobsWithPartialRelations = z.infer<typeof CandidatesOnJobsSchema> & CandidatesOnJobsPartialRelations

export const CandidatesOnJobsWithPartialRelationsSchema: z.ZodType<CandidatesOnJobsWithPartialRelations> = CandidatesOnJobsSchema.merge(z.object({
  candidate: z.lazy(() => CandidatePartialWithRelationsSchema),
  job: z.lazy(() => JobPartialWithRelationsSchema),
}).partial())

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

// SHORT LISTED OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const ShortListedOptionalDefaultsSchema = ShortListedSchema.merge(z.object({
  id: z.string().uuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type ShortListedOptionalDefaults = z.infer<typeof ShortListedOptionalDefaultsSchema>

// SHORT LISTED RELATION SCHEMA
//------------------------------------------------------

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

// SHORT LISTED OPTIONAL DEFAULTS RELATION SCHEMA
//------------------------------------------------------

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

// SHORT LISTED PARTIAL RELATION SCHEMA
//------------------------------------------------------

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

/////////////////////////////////////////
// RESUME SCHEMA
/////////////////////////////////////////

export const ResumeSchema = z.object({
  id: z.string().uuid(),
  fileKey: z.string().uuid({message:"Key is invalid"}),
  path: z.string().nullish(),
  fullPath: z.string().nullish(),
  url: z.string().url({message:"URL is invalid"}),
  candidateId: z.string().nullish(),
  createdById: z.string().nullish(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Resume = z.infer<typeof ResumeSchema>

/////////////////////////////////////////
// RESUME PARTIAL SCHEMA
/////////////////////////////////////////

export const ResumePartialSchema = ResumeSchema.partial()

export type ResumePartial = z.infer<typeof ResumePartialSchema>

// RESUME OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const ResumeOptionalDefaultsSchema = ResumeSchema.merge(z.object({
  id: z.string().uuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type ResumeOptionalDefaults = z.infer<typeof ResumeOptionalDefaultsSchema>

// RESUME RELATION SCHEMA
//------------------------------------------------------

export type ResumeRelations = {
  candidate?: CandidateWithRelations | null;
  jobs: JobsAndResumesWithRelations[];
  createdBy?: UserWithRelations | null;
};

export type ResumeWithRelations = z.infer<typeof ResumeSchema> & ResumeRelations

export const ResumeWithRelationsSchema: z.ZodType<ResumeWithRelations> = ResumeSchema.merge(z.object({
  candidate: z.lazy(() => CandidateWithRelationsSchema).nullish(),
  jobs: z.lazy(() => JobsAndResumesWithRelationsSchema).array(),
  createdBy: z.lazy(() => UserWithRelationsSchema).nullish(),
}))

// RESUME OPTIONAL DEFAULTS RELATION SCHEMA
//------------------------------------------------------

export type ResumeOptionalDefaultsRelations = {
  candidate?: CandidateOptionalDefaultsWithRelations | null;
  jobs: JobsAndResumesOptionalDefaultsWithRelations[];
  createdBy?: UserOptionalDefaultsWithRelations | null;
};

export type ResumeOptionalDefaultsWithRelations = z.infer<typeof ResumeOptionalDefaultsSchema> & ResumeOptionalDefaultsRelations

export const ResumeOptionalDefaultsWithRelationsSchema: z.ZodType<ResumeOptionalDefaultsWithRelations> = ResumeOptionalDefaultsSchema.merge(z.object({
  candidate: z.lazy(() => CandidateOptionalDefaultsWithRelationsSchema).nullish(),
  jobs: z.lazy(() => JobsAndResumesOptionalDefaultsWithRelationsSchema).array(),
  createdBy: z.lazy(() => UserOptionalDefaultsWithRelationsSchema).nullish(),
}))

// RESUME PARTIAL RELATION SCHEMA
//------------------------------------------------------

export type ResumePartialRelations = {
  candidate?: CandidatePartialWithRelations | null;
  jobs?: JobsAndResumesPartialWithRelations[];
  createdBy?: UserPartialWithRelations | null;
};

export type ResumePartialWithRelations = z.infer<typeof ResumePartialSchema> & ResumePartialRelations

export const ResumePartialWithRelationsSchema: z.ZodType<ResumePartialWithRelations> = ResumePartialSchema.merge(z.object({
  candidate: z.lazy(() => CandidatePartialWithRelationsSchema).nullish(),
  jobs: z.lazy(() => JobsAndResumesPartialWithRelationsSchema).array(),
  createdBy: z.lazy(() => UserPartialWithRelationsSchema).nullish(),
})).partial()

export type ResumeOptionalDefaultsWithPartialRelations = z.infer<typeof ResumeOptionalDefaultsSchema> & ResumePartialRelations

export const ResumeOptionalDefaultsWithPartialRelationsSchema: z.ZodType<ResumeOptionalDefaultsWithPartialRelations> = ResumeOptionalDefaultsSchema.merge(z.object({
  candidate: z.lazy(() => CandidatePartialWithRelationsSchema).nullish(),
  jobs: z.lazy(() => JobsAndResumesPartialWithRelationsSchema).array(),
  createdBy: z.lazy(() => UserPartialWithRelationsSchema).nullish(),
}).partial())

export type ResumeWithPartialRelations = z.infer<typeof ResumeSchema> & ResumePartialRelations

export const ResumeWithPartialRelationsSchema: z.ZodType<ResumeWithPartialRelations> = ResumeSchema.merge(z.object({
  candidate: z.lazy(() => CandidatePartialWithRelationsSchema).nullish(),
  jobs: z.lazy(() => JobsAndResumesPartialWithRelationsSchema).array(),
  createdBy: z.lazy(() => UserPartialWithRelationsSchema).nullish(),
}).partial())

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

// JOBS AND RESUMES OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const JobsAndResumesOptionalDefaultsSchema = JobsAndResumesSchema.merge(z.object({
}))

export type JobsAndResumesOptionalDefaults = z.infer<typeof JobsAndResumesOptionalDefaultsSchema>

// JOBS AND RESUMES RELATION SCHEMA
//------------------------------------------------------

export type JobsAndResumesRelations = {
  job: JobWithRelations;
  resume: ResumeWithRelations;
};

export type JobsAndResumesWithRelations = z.infer<typeof JobsAndResumesSchema> & JobsAndResumesRelations

export const JobsAndResumesWithRelationsSchema: z.ZodType<JobsAndResumesWithRelations> = JobsAndResumesSchema.merge(z.object({
  job: z.lazy(() => JobWithRelationsSchema),
  resume: z.lazy(() => ResumeWithRelationsSchema),
}))

// JOBS AND RESUMES OPTIONAL DEFAULTS RELATION SCHEMA
//------------------------------------------------------

export type JobsAndResumesOptionalDefaultsRelations = {
  job: JobOptionalDefaultsWithRelations;
  resume: ResumeOptionalDefaultsWithRelations;
};

export type JobsAndResumesOptionalDefaultsWithRelations = z.infer<typeof JobsAndResumesOptionalDefaultsSchema> & JobsAndResumesOptionalDefaultsRelations

export const JobsAndResumesOptionalDefaultsWithRelationsSchema: z.ZodType<JobsAndResumesOptionalDefaultsWithRelations> = JobsAndResumesOptionalDefaultsSchema.merge(z.object({
  job: z.lazy(() => JobOptionalDefaultsWithRelationsSchema),
  resume: z.lazy(() => ResumeOptionalDefaultsWithRelationsSchema),
}))

// JOBS AND RESUMES PARTIAL RELATION SCHEMA
//------------------------------------------------------

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

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  profile: z.union([z.boolean(),z.lazy(() => ProfileArgsSchema)]).optional(),
  job: z.union([z.boolean(),z.lazy(() => JobFindManyArgsSchema)]).optional(),
  departments: z.union([z.boolean(),z.lazy(() => DepartmentFindManyArgsSchema)]).optional(),
  shortListed: z.union([z.boolean(),z.lazy(() => ShortListedFindManyArgsSchema)]).optional(),
  ownedResumes: z.union([z.boolean(),z.lazy(() => ResumeFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z.object({
  job: z.boolean().optional(),
  departments: z.boolean().optional(),
  shortListed: z.boolean().optional(),
  ownedResumes: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  email: z.boolean().optional(),
  phone: z.boolean().optional(),
  password: z.boolean().optional(),
  role: z.boolean().optional(),
  emailVerified: z.boolean().optional(),
  phoneVerified: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  profile: z.union([z.boolean(),z.lazy(() => ProfileArgsSchema)]).optional(),
  job: z.union([z.boolean(),z.lazy(() => JobFindManyArgsSchema)]).optional(),
  departments: z.union([z.boolean(),z.lazy(() => DepartmentFindManyArgsSchema)]).optional(),
  shortListed: z.union([z.boolean(),z.lazy(() => ShortListedFindManyArgsSchema)]).optional(),
  ownedResumes: z.union([z.boolean(),z.lazy(() => ResumeFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// PROFILE
//------------------------------------------------------

export const ProfileIncludeSchema: z.ZodType<Prisma.ProfileInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const ProfileArgsSchema: z.ZodType<Prisma.ProfileDefaultArgs> = z.object({
  select: z.lazy(() => ProfileSelectSchema).optional(),
  include: z.lazy(() => ProfileIncludeSchema).optional(),
}).strict();

export const ProfileSelectSchema: z.ZodType<Prisma.ProfileSelect> = z.object({
  id: z.boolean().optional(),
  firstName: z.boolean().optional(),
  lastName: z.boolean().optional(),
  address: z.boolean().optional(),
  city: z.boolean().optional(),
  state: z.boolean().optional(),
  country: z.boolean().optional(),
  zipCode: z.boolean().optional(),
  userId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// JOB
//------------------------------------------------------

export const JobIncludeSchema: z.ZodType<Prisma.JobInclude> = z.object({
  department: z.union([z.boolean(),z.lazy(() => DepartmentArgsSchema)]).optional(),
  createdBy: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  resumes: z.union([z.boolean(),z.lazy(() => JobsAndResumesFindManyArgsSchema)]).optional(),
  candidates: z.union([z.boolean(),z.lazy(() => CandidatesOnJobsFindManyArgsSchema)]).optional(),
  shortListedCandidates: z.union([z.boolean(),z.lazy(() => ShortListedFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => JobCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const JobArgsSchema: z.ZodType<Prisma.JobDefaultArgs> = z.object({
  select: z.lazy(() => JobSelectSchema).optional(),
  include: z.lazy(() => JobIncludeSchema).optional(),
}).strict();

export const JobCountOutputTypeArgsSchema: z.ZodType<Prisma.JobCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => JobCountOutputTypeSelectSchema).nullish(),
}).strict();

export const JobCountOutputTypeSelectSchema: z.ZodType<Prisma.JobCountOutputTypeSelect> = z.object({
  resumes: z.boolean().optional(),
  candidates: z.boolean().optional(),
  shortListedCandidates: z.boolean().optional(),
}).strict();

export const JobSelectSchema: z.ZodType<Prisma.JobSelect> = z.object({
  id: z.boolean().optional(),
  title: z.boolean().optional(),
  description: z.boolean().optional(),
  jobType: z.boolean().optional(),
  departmentId: z.boolean().optional(),
  location: z.boolean().optional(),
  shiftType: z.boolean().optional(),
  expiryDate: z.boolean().optional(),
  createdById: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  udpatedAt: z.boolean().optional(),
  department: z.union([z.boolean(),z.lazy(() => DepartmentArgsSchema)]).optional(),
  createdBy: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  resumes: z.union([z.boolean(),z.lazy(() => JobsAndResumesFindManyArgsSchema)]).optional(),
  candidates: z.union([z.boolean(),z.lazy(() => CandidatesOnJobsFindManyArgsSchema)]).optional(),
  shortListedCandidates: z.union([z.boolean(),z.lazy(() => ShortListedFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => JobCountOutputTypeArgsSchema)]).optional(),
}).strict()

// DEPARTMENT
//------------------------------------------------------

export const DepartmentIncludeSchema: z.ZodType<Prisma.DepartmentInclude> = z.object({
  job: z.union([z.boolean(),z.lazy(() => JobFindManyArgsSchema)]).optional(),
  createdBy: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => DepartmentCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const DepartmentArgsSchema: z.ZodType<Prisma.DepartmentDefaultArgs> = z.object({
  select: z.lazy(() => DepartmentSelectSchema).optional(),
  include: z.lazy(() => DepartmentIncludeSchema).optional(),
}).strict();

export const DepartmentCountOutputTypeArgsSchema: z.ZodType<Prisma.DepartmentCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => DepartmentCountOutputTypeSelectSchema).nullish(),
}).strict();

export const DepartmentCountOutputTypeSelectSchema: z.ZodType<Prisma.DepartmentCountOutputTypeSelect> = z.object({
  job: z.boolean().optional(),
}).strict();

export const DepartmentSelectSchema: z.ZodType<Prisma.DepartmentSelect> = z.object({
  id: z.boolean().optional(),
  title: z.boolean().optional(),
  description: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
  createdById: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  udpatedAt: z.boolean().optional(),
  job: z.union([z.boolean(),z.lazy(() => JobFindManyArgsSchema)]).optional(),
  createdBy: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => DepartmentCountOutputTypeArgsSchema)]).optional(),
}).strict()

// CANDIDATE
//------------------------------------------------------

export const CandidateIncludeSchema: z.ZodType<Prisma.CandidateInclude> = z.object({
  resume: z.union([z.boolean(),z.lazy(() => ResumeFindManyArgsSchema)]).optional(),
  jobs: z.union([z.boolean(),z.lazy(() => CandidatesOnJobsFindManyArgsSchema)]).optional(),
  shortListedJobs: z.union([z.boolean(),z.lazy(() => ShortListedFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CandidateCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const CandidateArgsSchema: z.ZodType<Prisma.CandidateDefaultArgs> = z.object({
  select: z.lazy(() => CandidateSelectSchema).optional(),
  include: z.lazy(() => CandidateIncludeSchema).optional(),
}).strict();

export const CandidateCountOutputTypeArgsSchema: z.ZodType<Prisma.CandidateCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CandidateCountOutputTypeSelectSchema).nullish(),
}).strict();

export const CandidateCountOutputTypeSelectSchema: z.ZodType<Prisma.CandidateCountOutputTypeSelect> = z.object({
  resume: z.boolean().optional(),
  jobs: z.boolean().optional(),
  shortListedJobs: z.boolean().optional(),
}).strict();

export const CandidateSelectSchema: z.ZodType<Prisma.CandidateSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  email: z.boolean().optional(),
  phone: z.boolean().optional(),
  address: z.boolean().optional(),
  city: z.boolean().optional(),
  state: z.boolean().optional(),
  country: z.boolean().optional(),
  zipCode: z.boolean().optional(),
  age: z.boolean().optional(),
  dob: z.boolean().optional(),
  gender: z.boolean().optional(),
  jobExperience: z.boolean().optional(),
  totalExperience: z.boolean().optional(),
  relevantExperience: z.boolean().optional(),
  skills: z.boolean().optional(),
  pros: z.boolean().optional(),
  cons: z.boolean().optional(),
  score: z.boolean().optional(),
  resumeId: z.boolean().optional(),
  activeResumeId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  resume: z.union([z.boolean(),z.lazy(() => ResumeFindManyArgsSchema)]).optional(),
  jobs: z.union([z.boolean(),z.lazy(() => CandidatesOnJobsFindManyArgsSchema)]).optional(),
  shortListedJobs: z.union([z.boolean(),z.lazy(() => ShortListedFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CandidateCountOutputTypeArgsSchema)]).optional(),
}).strict()

// CANDIDATES ON JOBS
//------------------------------------------------------

export const CandidatesOnJobsIncludeSchema: z.ZodType<Prisma.CandidatesOnJobsInclude> = z.object({
  candidate: z.union([z.boolean(),z.lazy(() => CandidateArgsSchema)]).optional(),
  job: z.union([z.boolean(),z.lazy(() => JobArgsSchema)]).optional(),
}).strict()

export const CandidatesOnJobsArgsSchema: z.ZodType<Prisma.CandidatesOnJobsDefaultArgs> = z.object({
  select: z.lazy(() => CandidatesOnJobsSelectSchema).optional(),
  include: z.lazy(() => CandidatesOnJobsIncludeSchema).optional(),
}).strict();

export const CandidatesOnJobsSelectSchema: z.ZodType<Prisma.CandidatesOnJobsSelect> = z.object({
  id: z.boolean().optional(),
  candidateId: z.boolean().optional(),
  jobId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  candidate: z.union([z.boolean(),z.lazy(() => CandidateArgsSchema)]).optional(),
  job: z.union([z.boolean(),z.lazy(() => JobArgsSchema)]).optional(),
}).strict()

// SHORT LISTED
//------------------------------------------------------

export const ShortListedIncludeSchema: z.ZodType<Prisma.ShortListedInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  candidate: z.union([z.boolean(),z.lazy(() => CandidateArgsSchema)]).optional(),
  job: z.union([z.boolean(),z.lazy(() => JobArgsSchema)]).optional(),
}).strict()

export const ShortListedArgsSchema: z.ZodType<Prisma.ShortListedDefaultArgs> = z.object({
  select: z.lazy(() => ShortListedSelectSchema).optional(),
  include: z.lazy(() => ShortListedIncludeSchema).optional(),
}).strict();

export const ShortListedSelectSchema: z.ZodType<Prisma.ShortListedSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  candidateId: z.boolean().optional(),
  jobId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  candidate: z.union([z.boolean(),z.lazy(() => CandidateArgsSchema)]).optional(),
  job: z.union([z.boolean(),z.lazy(() => JobArgsSchema)]).optional(),
}).strict()

// RESUME
//------------------------------------------------------

export const ResumeIncludeSchema: z.ZodType<Prisma.ResumeInclude> = z.object({
  candidate: z.union([z.boolean(),z.lazy(() => CandidateArgsSchema)]).optional(),
  jobs: z.union([z.boolean(),z.lazy(() => JobsAndResumesFindManyArgsSchema)]).optional(),
  createdBy: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ResumeCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const ResumeArgsSchema: z.ZodType<Prisma.ResumeDefaultArgs> = z.object({
  select: z.lazy(() => ResumeSelectSchema).optional(),
  include: z.lazy(() => ResumeIncludeSchema).optional(),
}).strict();

export const ResumeCountOutputTypeArgsSchema: z.ZodType<Prisma.ResumeCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => ResumeCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ResumeCountOutputTypeSelectSchema: z.ZodType<Prisma.ResumeCountOutputTypeSelect> = z.object({
  jobs: z.boolean().optional(),
}).strict();

export const ResumeSelectSchema: z.ZodType<Prisma.ResumeSelect> = z.object({
  id: z.boolean().optional(),
  fileKey: z.boolean().optional(),
  path: z.boolean().optional(),
  fullPath: z.boolean().optional(),
  url: z.boolean().optional(),
  candidateId: z.boolean().optional(),
  createdById: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  candidate: z.union([z.boolean(),z.lazy(() => CandidateArgsSchema)]).optional(),
  jobs: z.union([z.boolean(),z.lazy(() => JobsAndResumesFindManyArgsSchema)]).optional(),
  createdBy: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ResumeCountOutputTypeArgsSchema)]).optional(),
}).strict()

// JOBS AND RESUMES
//------------------------------------------------------

export const JobsAndResumesIncludeSchema: z.ZodType<Prisma.JobsAndResumesInclude> = z.object({
  job: z.union([z.boolean(),z.lazy(() => JobArgsSchema)]).optional(),
  resume: z.union([z.boolean(),z.lazy(() => ResumeArgsSchema)]).optional(),
}).strict()

export const JobsAndResumesArgsSchema: z.ZodType<Prisma.JobsAndResumesDefaultArgs> = z.object({
  select: z.lazy(() => JobsAndResumesSelectSchema).optional(),
  include: z.lazy(() => JobsAndResumesIncludeSchema).optional(),
}).strict();

export const JobsAndResumesSelectSchema: z.ZodType<Prisma.JobsAndResumesSelect> = z.object({
  jobId: z.boolean().optional(),
  resumeId: z.boolean().optional(),
  job: z.union([z.boolean(),z.lazy(() => JobArgsSchema)]).optional(),
  resume: z.union([z.boolean(),z.lazy(() => ResumeArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  phone: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  password: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumRoleNullableFilterSchema),z.lazy(() => RoleSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.lazy(() => BoolNullableFilterSchema),z.boolean() ]).optional().nullable(),
  phoneVerified: z.union([ z.lazy(() => BoolNullableFilterSchema),z.boolean() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  profile: z.union([ z.lazy(() => ProfileNullableRelationFilterSchema),z.lazy(() => ProfileWhereInputSchema) ]).optional().nullable(),
  job: z.lazy(() => JobListRelationFilterSchema).optional(),
  departments: z.lazy(() => DepartmentListRelationFilterSchema).optional(),
  shortListed: z.lazy(() => ShortListedListRelationFilterSchema).optional(),
  ownedResumes: z.lazy(() => ResumeListRelationFilterSchema).optional()
}).strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  role: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  emailVerified: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  phoneVerified: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  profile: z.lazy(() => ProfileOrderByWithRelationInputSchema).optional(),
  job: z.lazy(() => JobOrderByRelationAggregateInputSchema).optional(),
  departments: z.lazy(() => DepartmentOrderByRelationAggregateInputSchema).optional(),
  shortListed: z.lazy(() => ShortListedOrderByRelationAggregateInputSchema).optional(),
  ownedResumes: z.lazy(() => ResumeOrderByRelationAggregateInputSchema).optional()
}).strict();

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.string().uuid(),
    email: z.string().email({message: "Email is invalid"}),
    phone: z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid")
  }),
  z.object({
    id: z.string().uuid(),
    email: z.string().email({message: "Email is invalid"}),
  }),
  z.object({
    id: z.string().uuid(),
    phone: z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid"),
  }),
  z.object({
    id: z.string().uuid(),
  }),
  z.object({
    email: z.string().email({message: "Email is invalid"}),
    phone: z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid"),
  }),
  z.object({
    email: z.string().email({message: "Email is invalid"}),
  }),
  z.object({
    phone: z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid"),
  }),
])
.and(z.object({
  id: z.string().uuid().optional(),
  email: z.string().email({message: "Email is invalid"}).optional(),
  phone: z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid").optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string().min(1) ]).optional(),
  password: z.union([ z.lazy(() => StringFilterSchema),z.string().min(6).max(16) ]).optional(),
  role: z.union([ z.lazy(() => EnumRoleNullableFilterSchema),z.lazy(() => RoleSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.lazy(() => BoolNullableFilterSchema),z.boolean() ]).optional().nullable(),
  phoneVerified: z.union([ z.lazy(() => BoolNullableFilterSchema),z.boolean() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  profile: z.union([ z.lazy(() => ProfileNullableRelationFilterSchema),z.lazy(() => ProfileWhereInputSchema) ]).optional().nullable(),
  job: z.lazy(() => JobListRelationFilterSchema).optional(),
  departments: z.lazy(() => DepartmentListRelationFilterSchema).optional(),
  shortListed: z.lazy(() => ShortListedListRelationFilterSchema).optional(),
  ownedResumes: z.lazy(() => ResumeListRelationFilterSchema).optional()
}).strict());

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  role: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  emailVerified: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  phoneVerified: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional()
}).strict();

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  phone: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  password: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumRoleNullableWithAggregatesFilterSchema),z.lazy(() => RoleSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.lazy(() => BoolNullableWithAggregatesFilterSchema),z.boolean() ]).optional().nullable(),
  phoneVerified: z.union([ z.lazy(() => BoolNullableWithAggregatesFilterSchema),z.boolean() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ProfileWhereInputSchema: z.ZodType<Prisma.ProfileWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ProfileWhereInputSchema),z.lazy(() => ProfileWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProfileWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProfileWhereInputSchema),z.lazy(() => ProfileWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  firstName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lastName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  address: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  city: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  state: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  country: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  zipCode: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const ProfileOrderByWithRelationInputSchema: z.ZodType<Prisma.ProfileOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  address: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  city: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  state: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  country: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  zipCode: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const ProfileWhereUniqueInputSchema: z.ZodType<Prisma.ProfileWhereUniqueInput> = z.union([
  z.object({
    id: z.string().uuid(),
    userId: z.string()
  }),
  z.object({
    id: z.string().uuid(),
  }),
  z.object({
    userId: z.string(),
  }),
])
.and(z.object({
  id: z.string().uuid().optional(),
  userId: z.string().optional(),
  AND: z.union([ z.lazy(() => ProfileWhereInputSchema),z.lazy(() => ProfileWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProfileWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProfileWhereInputSchema),z.lazy(() => ProfileWhereInputSchema).array() ]).optional(),
  firstName: z.union([ z.lazy(() => StringFilterSchema),z.string().min(3, {message: "Value cannot be empty"}) ]).optional(),
  lastName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string().min(3, {message: "Value cannot be empty"}) ]).optional().nullable(),
  address: z.union([ z.lazy(() => StringNullableFilterSchema),z.string().min(3, {message: "Value cannot be empty"}) ]).optional().nullable(),
  city: z.union([ z.lazy(() => StringNullableFilterSchema),z.string().min(3, {message: "Value cannot be empty"}) ]).optional().nullable(),
  state: z.union([ z.lazy(() => StringNullableFilterSchema),z.string().min(3, {message: "Value cannot be empty"}) ]).optional().nullable(),
  country: z.union([ z.lazy(() => StringNullableFilterSchema),z.string().min(3, {message: "Value cannot be empty"}) ]).optional().nullable(),
  zipCode: z.union([ z.lazy(() => StringNullableFilterSchema),z.string().min(3, {message: "Value cannot be empty"}) ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const ProfileOrderByWithAggregationInputSchema: z.ZodType<Prisma.ProfileOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  address: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  city: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  state: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  country: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  zipCode: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ProfileCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ProfileMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ProfileMinOrderByAggregateInputSchema).optional()
}).strict();

export const ProfileScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ProfileScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ProfileScalarWhereWithAggregatesInputSchema),z.lazy(() => ProfileScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProfileScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProfileScalarWhereWithAggregatesInputSchema),z.lazy(() => ProfileScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  firstName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  lastName: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  address: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  city: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  state: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  country: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  zipCode: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const JobWhereInputSchema: z.ZodType<Prisma.JobWhereInput> = z.object({
  AND: z.union([ z.lazy(() => JobWhereInputSchema),z.lazy(() => JobWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => JobWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => JobWhereInputSchema),z.lazy(() => JobWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  jobType: z.union([ z.lazy(() => EnumJobTypeNullableFilterSchema),z.lazy(() => JobTypeSchema) ]).optional().nullable(),
  departmentId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  location: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  shiftType: z.union([ z.lazy(() => EnumShiftTypeNullableFilterSchema),z.lazy(() => ShiftTypeSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  createdById: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  udpatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  department: z.union([ z.lazy(() => DepartmentRelationFilterSchema),z.lazy(() => DepartmentWhereInputSchema) ]).optional(),
  createdBy: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  resumes: z.lazy(() => JobsAndResumesListRelationFilterSchema).optional(),
  candidates: z.lazy(() => CandidatesOnJobsListRelationFilterSchema).optional(),
  shortListedCandidates: z.lazy(() => ShortListedListRelationFilterSchema).optional()
}).strict();

export const JobOrderByWithRelationInputSchema: z.ZodType<Prisma.JobOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  jobType: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  departmentId: z.lazy(() => SortOrderSchema).optional(),
  location: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  shiftType: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  expiryDate: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdById: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  udpatedAt: z.lazy(() => SortOrderSchema).optional(),
  department: z.lazy(() => DepartmentOrderByWithRelationInputSchema).optional(),
  createdBy: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  resumes: z.lazy(() => JobsAndResumesOrderByRelationAggregateInputSchema).optional(),
  candidates: z.lazy(() => CandidatesOnJobsOrderByRelationAggregateInputSchema).optional(),
  shortListedCandidates: z.lazy(() => ShortListedOrderByRelationAggregateInputSchema).optional()
}).strict();

export const JobWhereUniqueInputSchema: z.ZodType<Prisma.JobWhereUniqueInput> = z.object({
  id: z.string().uuid()
})
.and(z.object({
  id: z.string().uuid().optional(),
  AND: z.union([ z.lazy(() => JobWhereInputSchema),z.lazy(() => JobWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => JobWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => JobWhereInputSchema),z.lazy(() => JobWhereInputSchema).array() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string().min(1, {message: "Title cannot be empty"}) ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  jobType: z.union([ z.lazy(() => EnumJobTypeNullableFilterSchema),z.lazy(() => JobTypeSchema) ]).optional().nullable(),
  departmentId: z.union([ z.lazy(() => StringFilterSchema),z.string().min(1, {message: "Department is required"}).uuid({message:"User ID is invalid"}) ]).optional(),
  location: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  shiftType: z.union([ z.lazy(() => EnumShiftTypeNullableFilterSchema),z.lazy(() => ShiftTypeSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date({invalid_type_error:"Date is invalid"}) ]).optional().nullable(),
  createdById: z.union([ z.lazy(() => StringFilterSchema),z.string().min(1, {message: "User is required"}).uuid({message:"User ID is invalid"}) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  udpatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  department: z.union([ z.lazy(() => DepartmentRelationFilterSchema),z.lazy(() => DepartmentWhereInputSchema) ]).optional(),
  createdBy: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  resumes: z.lazy(() => JobsAndResumesListRelationFilterSchema).optional(),
  candidates: z.lazy(() => CandidatesOnJobsListRelationFilterSchema).optional(),
  shortListedCandidates: z.lazy(() => ShortListedListRelationFilterSchema).optional()
}).strict());

export const JobOrderByWithAggregationInputSchema: z.ZodType<Prisma.JobOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  jobType: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  departmentId: z.lazy(() => SortOrderSchema).optional(),
  location: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  shiftType: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  expiryDate: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdById: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  udpatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => JobCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => JobMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => JobMinOrderByAggregateInputSchema).optional()
}).strict();

export const JobScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.JobScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => JobScalarWhereWithAggregatesInputSchema),z.lazy(() => JobScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => JobScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => JobScalarWhereWithAggregatesInputSchema),z.lazy(() => JobScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  jobType: z.union([ z.lazy(() => EnumJobTypeNullableWithAggregatesFilterSchema),z.lazy(() => JobTypeSchema) ]).optional().nullable(),
  departmentId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  location: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  shiftType: z.union([ z.lazy(() => EnumShiftTypeNullableWithAggregatesFilterSchema),z.lazy(() => ShiftTypeSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  createdById: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  udpatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const DepartmentWhereInputSchema: z.ZodType<Prisma.DepartmentWhereInput> = z.object({
  AND: z.union([ z.lazy(() => DepartmentWhereInputSchema),z.lazy(() => DepartmentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DepartmentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DepartmentWhereInputSchema),z.lazy(() => DepartmentWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  isDeleted: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  createdById: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  udpatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  job: z.lazy(() => JobListRelationFilterSchema).optional(),
  createdBy: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const DepartmentOrderByWithRelationInputSchema: z.ZodType<Prisma.DepartmentOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  isDeleted: z.lazy(() => SortOrderSchema).optional(),
  createdById: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  udpatedAt: z.lazy(() => SortOrderSchema).optional(),
  job: z.lazy(() => JobOrderByRelationAggregateInputSchema).optional(),
  createdBy: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const DepartmentWhereUniqueInputSchema: z.ZodType<Prisma.DepartmentWhereUniqueInput> = z.object({
  id: z.string().uuid()
})
.and(z.object({
  id: z.string().uuid().optional(),
  AND: z.union([ z.lazy(() => DepartmentWhereInputSchema),z.lazy(() => DepartmentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DepartmentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DepartmentWhereInputSchema),z.lazy(() => DepartmentWhereInputSchema).array() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string().min(1, {message: "Title cannot be empty"}) ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  isDeleted: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  createdById: z.union([ z.lazy(() => StringFilterSchema),z.string().min(1, {message: "User is required"}).uuid({message:"User ID is invalid"}) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  udpatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  job: z.lazy(() => JobListRelationFilterSchema).optional(),
  createdBy: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const DepartmentOrderByWithAggregationInputSchema: z.ZodType<Prisma.DepartmentOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  isDeleted: z.lazy(() => SortOrderSchema).optional(),
  createdById: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  udpatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => DepartmentCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => DepartmentMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => DepartmentMinOrderByAggregateInputSchema).optional()
}).strict();

export const DepartmentScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.DepartmentScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => DepartmentScalarWhereWithAggregatesInputSchema),z.lazy(() => DepartmentScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => DepartmentScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DepartmentScalarWhereWithAggregatesInputSchema),z.lazy(() => DepartmentScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  isDeleted: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  createdById: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  udpatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const CandidateWhereInputSchema: z.ZodType<Prisma.CandidateWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CandidateWhereInputSchema),z.lazy(() => CandidateWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CandidateWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CandidateWhereInputSchema),z.lazy(() => CandidateWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  phone: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  address: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  city: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  state: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  country: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  zipCode: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  age: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  dob: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  gender: z.union([ z.lazy(() => EnumGenderNullableFilterSchema),z.lazy(() => GenderSchema) ]).optional().nullable(),
  jobExperience: z.lazy(() => JsonNullableFilterSchema).optional(),
  totalExperience: z.lazy(() => JsonNullableFilterSchema).optional(),
  relevantExperience: z.lazy(() => JsonNullableFilterSchema).optional(),
  skills: z.lazy(() => JsonNullableFilterSchema).optional(),
  pros: z.lazy(() => JsonNullableFilterSchema).optional(),
  cons: z.lazy(() => JsonNullableFilterSchema).optional(),
  score: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  resumeId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  activeResumeId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  resume: z.lazy(() => ResumeListRelationFilterSchema).optional(),
  jobs: z.lazy(() => CandidatesOnJobsListRelationFilterSchema).optional(),
  shortListedJobs: z.lazy(() => ShortListedListRelationFilterSchema).optional()
}).strict();

export const CandidateOrderByWithRelationInputSchema: z.ZodType<Prisma.CandidateOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  phone: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  address: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  city: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  state: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  country: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  zipCode: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  age: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  dob: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  gender: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  jobExperience: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  totalExperience: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  relevantExperience: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  skills: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  pros: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  cons: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  score: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  resumeId: z.lazy(() => SortOrderSchema).optional(),
  activeResumeId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  resume: z.lazy(() => ResumeOrderByRelationAggregateInputSchema).optional(),
  jobs: z.lazy(() => CandidatesOnJobsOrderByRelationAggregateInputSchema).optional(),
  shortListedJobs: z.lazy(() => ShortListedOrderByRelationAggregateInputSchema).optional()
}).strict();

export const CandidateWhereUniqueInputSchema: z.ZodType<Prisma.CandidateWhereUniqueInput> = z.union([
  z.object({
    id: z.string().uuid(),
    activeResumeId: z.string()
  }),
  z.object({
    id: z.string().uuid(),
  }),
  z.object({
    activeResumeId: z.string(),
  }),
])
.and(z.object({
  id: z.string().uuid().optional(),
  activeResumeId: z.string().optional(),
  AND: z.union([ z.lazy(() => CandidateWhereInputSchema),z.lazy(() => CandidateWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CandidateWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CandidateWhereInputSchema),z.lazy(() => CandidateWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string().min(1, {message:"Name cannot be empty"}) ]).optional(),
  email: z.union([ z.lazy(() => StringNullableFilterSchema),z.string().email({message:"Email is invalid"}) ]).optional().nullable(),
  phone: z.union([ z.lazy(() => StringNullableFilterSchema),z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid") ]).optional().nullable(),
  address: z.union([ z.lazy(() => StringNullableFilterSchema),z.string().min(1, {message: "Address cannot be empty"}) ]).optional().nullable(),
  city: z.union([ z.lazy(() => StringNullableFilterSchema),z.string().min(1, {message: "City cannot be empty"}) ]).optional().nullable(),
  state: z.union([ z.lazy(() => StringNullableFilterSchema),z.string().min(1, {message: "State cannot be empty"}) ]).optional().nullable(),
  country: z.union([ z.lazy(() => StringNullableFilterSchema),z.string().min(1, {message: "Country cannot be empty"}) ]).optional().nullable(),
  zipCode: z.union([ z.lazy(() => StringNullableFilterSchema),z.string().min(1, {message: "Zip code cannot be empty"}) ]).optional().nullable(),
  age: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().positive({message:"Age must be a valid number"}) ]).optional().nullable(),
  dob: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date({invalid_type_error:"Date is invalid"}) ]).optional().nullable(),
  gender: z.union([ z.lazy(() => EnumGenderNullableFilterSchema),z.lazy(() => GenderSchema) ]).optional().nullable(),
  jobExperience: z.lazy(() => JsonNullableFilterSchema).optional(),
  totalExperience: z.lazy(() => JsonNullableFilterSchema).optional(),
  relevantExperience: z.lazy(() => JsonNullableFilterSchema).optional(),
  skills: z.lazy(() => JsonNullableFilterSchema).optional(),
  pros: z.lazy(() => JsonNullableFilterSchema).optional(),
  cons: z.lazy(() => JsonNullableFilterSchema).optional(),
  score: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().positive({message:"Score must be a valid number"}) ]).optional().nullable(),
  resumeId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  resume: z.lazy(() => ResumeListRelationFilterSchema).optional(),
  jobs: z.lazy(() => CandidatesOnJobsListRelationFilterSchema).optional(),
  shortListedJobs: z.lazy(() => ShortListedListRelationFilterSchema).optional()
}).strict());

export const CandidateOrderByWithAggregationInputSchema: z.ZodType<Prisma.CandidateOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  phone: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  address: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  city: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  state: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  country: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  zipCode: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  age: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  dob: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  gender: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  jobExperience: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  totalExperience: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  relevantExperience: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  skills: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  pros: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  cons: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  score: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  resumeId: z.lazy(() => SortOrderSchema).optional(),
  activeResumeId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => CandidateCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => CandidateAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CandidateMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CandidateMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => CandidateSumOrderByAggregateInputSchema).optional()
}).strict();

export const CandidateScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CandidateScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => CandidateScalarWhereWithAggregatesInputSchema),z.lazy(() => CandidateScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CandidateScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CandidateScalarWhereWithAggregatesInputSchema),z.lazy(() => CandidateScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  phone: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  address: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  city: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  state: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  country: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  zipCode: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  age: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  dob: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  gender: z.union([ z.lazy(() => EnumGenderNullableWithAggregatesFilterSchema),z.lazy(() => GenderSchema) ]).optional().nullable(),
  jobExperience: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  totalExperience: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  relevantExperience: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  skills: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  pros: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  cons: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  score: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  resumeId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  activeResumeId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const CandidatesOnJobsWhereInputSchema: z.ZodType<Prisma.CandidatesOnJobsWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CandidatesOnJobsWhereInputSchema),z.lazy(() => CandidatesOnJobsWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CandidatesOnJobsWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CandidatesOnJobsWhereInputSchema),z.lazy(() => CandidatesOnJobsWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  candidateId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  jobId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  candidate: z.union([ z.lazy(() => CandidateRelationFilterSchema),z.lazy(() => CandidateWhereInputSchema) ]).optional(),
  job: z.union([ z.lazy(() => JobRelationFilterSchema),z.lazy(() => JobWhereInputSchema) ]).optional(),
}).strict();

export const CandidatesOnJobsOrderByWithRelationInputSchema: z.ZodType<Prisma.CandidatesOnJobsOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  candidateId: z.lazy(() => SortOrderSchema).optional(),
  jobId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  candidate: z.lazy(() => CandidateOrderByWithRelationInputSchema).optional(),
  job: z.lazy(() => JobOrderByWithRelationInputSchema).optional()
}).strict();

export const CandidatesOnJobsWhereUniqueInputSchema: z.ZodType<Prisma.CandidatesOnJobsWhereUniqueInput> = z.union([
  z.object({
    id: z.string().uuid(),
    candidateId_jobId: z.lazy(() => CandidatesOnJobsCandidateIdJobIdCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.string().uuid(),
  }),
  z.object({
    candidateId_jobId: z.lazy(() => CandidatesOnJobsCandidateIdJobIdCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.string().uuid().optional(),
  candidateId_jobId: z.lazy(() => CandidatesOnJobsCandidateIdJobIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => CandidatesOnJobsWhereInputSchema),z.lazy(() => CandidatesOnJobsWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CandidatesOnJobsWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CandidatesOnJobsWhereInputSchema),z.lazy(() => CandidatesOnJobsWhereInputSchema).array() ]).optional(),
  candidateId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  jobId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  candidate: z.union([ z.lazy(() => CandidateRelationFilterSchema),z.lazy(() => CandidateWhereInputSchema) ]).optional(),
  job: z.union([ z.lazy(() => JobRelationFilterSchema),z.lazy(() => JobWhereInputSchema) ]).optional(),
}).strict());

export const CandidatesOnJobsOrderByWithAggregationInputSchema: z.ZodType<Prisma.CandidatesOnJobsOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  candidateId: z.lazy(() => SortOrderSchema).optional(),
  jobId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => CandidatesOnJobsCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CandidatesOnJobsMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CandidatesOnJobsMinOrderByAggregateInputSchema).optional()
}).strict();

export const CandidatesOnJobsScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CandidatesOnJobsScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => CandidatesOnJobsScalarWhereWithAggregatesInputSchema),z.lazy(() => CandidatesOnJobsScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CandidatesOnJobsScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CandidatesOnJobsScalarWhereWithAggregatesInputSchema),z.lazy(() => CandidatesOnJobsScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  candidateId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  jobId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ShortListedWhereInputSchema: z.ZodType<Prisma.ShortListedWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ShortListedWhereInputSchema),z.lazy(() => ShortListedWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ShortListedWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ShortListedWhereInputSchema),z.lazy(() => ShortListedWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  candidateId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  jobId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  candidate: z.union([ z.lazy(() => CandidateRelationFilterSchema),z.lazy(() => CandidateWhereInputSchema) ]).optional(),
  job: z.union([ z.lazy(() => JobRelationFilterSchema),z.lazy(() => JobWhereInputSchema) ]).optional(),
}).strict();

export const ShortListedOrderByWithRelationInputSchema: z.ZodType<Prisma.ShortListedOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  candidateId: z.lazy(() => SortOrderSchema).optional(),
  jobId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  candidate: z.lazy(() => CandidateOrderByWithRelationInputSchema).optional(),
  job: z.lazy(() => JobOrderByWithRelationInputSchema).optional()
}).strict();

export const ShortListedWhereUniqueInputSchema: z.ZodType<Prisma.ShortListedWhereUniqueInput> = z.union([
  z.object({
    id: z.string().uuid(),
    userId_jobId_candidateId: z.lazy(() => ShortListedUserIdJobIdCandidateIdCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.string().uuid(),
  }),
  z.object({
    userId_jobId_candidateId: z.lazy(() => ShortListedUserIdJobIdCandidateIdCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.string().uuid().optional(),
  userId_jobId_candidateId: z.lazy(() => ShortListedUserIdJobIdCandidateIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => ShortListedWhereInputSchema),z.lazy(() => ShortListedWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ShortListedWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ShortListedWhereInputSchema),z.lazy(() => ShortListedWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  candidateId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  jobId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  candidate: z.union([ z.lazy(() => CandidateRelationFilterSchema),z.lazy(() => CandidateWhereInputSchema) ]).optional(),
  job: z.union([ z.lazy(() => JobRelationFilterSchema),z.lazy(() => JobWhereInputSchema) ]).optional(),
}).strict());

export const ShortListedOrderByWithAggregationInputSchema: z.ZodType<Prisma.ShortListedOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  candidateId: z.lazy(() => SortOrderSchema).optional(),
  jobId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ShortListedCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ShortListedMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ShortListedMinOrderByAggregateInputSchema).optional()
}).strict();

export const ShortListedScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ShortListedScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ShortListedScalarWhereWithAggregatesInputSchema),z.lazy(() => ShortListedScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ShortListedScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ShortListedScalarWhereWithAggregatesInputSchema),z.lazy(() => ShortListedScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  candidateId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  jobId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ResumeWhereInputSchema: z.ZodType<Prisma.ResumeWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ResumeWhereInputSchema),z.lazy(() => ResumeWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ResumeWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ResumeWhereInputSchema),z.lazy(() => ResumeWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  fileKey: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  path: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  fullPath: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  url: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  candidateId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdById: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  candidate: z.union([ z.lazy(() => CandidateNullableRelationFilterSchema),z.lazy(() => CandidateWhereInputSchema) ]).optional().nullable(),
  jobs: z.lazy(() => JobsAndResumesListRelationFilterSchema).optional(),
  createdBy: z.union([ z.lazy(() => UserNullableRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
}).strict();

export const ResumeOrderByWithRelationInputSchema: z.ZodType<Prisma.ResumeOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  fileKey: z.lazy(() => SortOrderSchema).optional(),
  path: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  fullPath: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  candidateId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdById: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  candidate: z.lazy(() => CandidateOrderByWithRelationInputSchema).optional(),
  jobs: z.lazy(() => JobsAndResumesOrderByRelationAggregateInputSchema).optional(),
  createdBy: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const ResumeWhereUniqueInputSchema: z.ZodType<Prisma.ResumeWhereUniqueInput> = z.object({
  id: z.string().uuid()
})
.and(z.object({
  id: z.string().uuid().optional(),
  AND: z.union([ z.lazy(() => ResumeWhereInputSchema),z.lazy(() => ResumeWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ResumeWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ResumeWhereInputSchema),z.lazy(() => ResumeWhereInputSchema).array() ]).optional(),
  fileKey: z.union([ z.lazy(() => StringFilterSchema),z.string().uuid({message:"Key is invalid"}) ]).optional(),
  path: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  fullPath: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  url: z.union([ z.lazy(() => StringFilterSchema),z.string().url({message:"URL is invalid"}) ]).optional(),
  candidateId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdById: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  candidate: z.union([ z.lazy(() => CandidateNullableRelationFilterSchema),z.lazy(() => CandidateWhereInputSchema) ]).optional().nullable(),
  jobs: z.lazy(() => JobsAndResumesListRelationFilterSchema).optional(),
  createdBy: z.union([ z.lazy(() => UserNullableRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
}).strict());

export const ResumeOrderByWithAggregationInputSchema: z.ZodType<Prisma.ResumeOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  fileKey: z.lazy(() => SortOrderSchema).optional(),
  path: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  fullPath: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  candidateId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdById: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ResumeCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ResumeMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ResumeMinOrderByAggregateInputSchema).optional()
}).strict();

export const ResumeScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ResumeScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ResumeScalarWhereWithAggregatesInputSchema),z.lazy(() => ResumeScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ResumeScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ResumeScalarWhereWithAggregatesInputSchema),z.lazy(() => ResumeScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  fileKey: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  path: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  fullPath: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  url: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  candidateId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdById: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const JobsAndResumesWhereInputSchema: z.ZodType<Prisma.JobsAndResumesWhereInput> = z.object({
  AND: z.union([ z.lazy(() => JobsAndResumesWhereInputSchema),z.lazy(() => JobsAndResumesWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => JobsAndResumesWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => JobsAndResumesWhereInputSchema),z.lazy(() => JobsAndResumesWhereInputSchema).array() ]).optional(),
  jobId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  resumeId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  job: z.union([ z.lazy(() => JobRelationFilterSchema),z.lazy(() => JobWhereInputSchema) ]).optional(),
  resume: z.union([ z.lazy(() => ResumeRelationFilterSchema),z.lazy(() => ResumeWhereInputSchema) ]).optional(),
}).strict();

export const JobsAndResumesOrderByWithRelationInputSchema: z.ZodType<Prisma.JobsAndResumesOrderByWithRelationInput> = z.object({
  jobId: z.lazy(() => SortOrderSchema).optional(),
  resumeId: z.lazy(() => SortOrderSchema).optional(),
  job: z.lazy(() => JobOrderByWithRelationInputSchema).optional(),
  resume: z.lazy(() => ResumeOrderByWithRelationInputSchema).optional()
}).strict();

export const JobsAndResumesWhereUniqueInputSchema: z.ZodType<Prisma.JobsAndResumesWhereUniqueInput> = z.object({
  jobId_resumeId: z.lazy(() => JobsAndResumesJobIdResumeIdCompoundUniqueInputSchema)
})
.and(z.object({
  jobId_resumeId: z.lazy(() => JobsAndResumesJobIdResumeIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => JobsAndResumesWhereInputSchema),z.lazy(() => JobsAndResumesWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => JobsAndResumesWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => JobsAndResumesWhereInputSchema),z.lazy(() => JobsAndResumesWhereInputSchema).array() ]).optional(),
  jobId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  resumeId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  job: z.union([ z.lazy(() => JobRelationFilterSchema),z.lazy(() => JobWhereInputSchema) ]).optional(),
  resume: z.union([ z.lazy(() => ResumeRelationFilterSchema),z.lazy(() => ResumeWhereInputSchema) ]).optional(),
}).strict());

export const JobsAndResumesOrderByWithAggregationInputSchema: z.ZodType<Prisma.JobsAndResumesOrderByWithAggregationInput> = z.object({
  jobId: z.lazy(() => SortOrderSchema).optional(),
  resumeId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => JobsAndResumesCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => JobsAndResumesMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => JobsAndResumesMinOrderByAggregateInputSchema).optional()
}).strict();

export const JobsAndResumesScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.JobsAndResumesScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => JobsAndResumesScalarWhereWithAggregatesInputSchema),z.lazy(() => JobsAndResumesScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => JobsAndResumesScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => JobsAndResumesScalarWhereWithAggregatesInputSchema),z.lazy(() => JobsAndResumesScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  jobId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  resumeId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  email: z.string().email({message: "Email is invalid"}),
  phone: z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid"),
  password: z.string().min(6).max(16),
  role: z.lazy(() => RoleSchema).optional().nullable(),
  emailVerified: z.boolean().optional().nullable(),
  phoneVerified: z.boolean().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  profile: z.lazy(() => ProfileCreateNestedOneWithoutUserInputSchema).optional(),
  job: z.lazy(() => JobCreateNestedManyWithoutCreatedByInputSchema).optional(),
  departments: z.lazy(() => DepartmentCreateNestedManyWithoutCreatedByInputSchema).optional(),
  shortListed: z.lazy(() => ShortListedCreateNestedManyWithoutUserInputSchema).optional(),
  ownedResumes: z.lazy(() => ResumeCreateNestedManyWithoutCreatedByInputSchema).optional()
}).strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  email: z.string().email({message: "Email is invalid"}),
  phone: z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid"),
  password: z.string().min(6).max(16),
  role: z.lazy(() => RoleSchema).optional().nullable(),
  emailVerified: z.boolean().optional().nullable(),
  phoneVerified: z.boolean().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  profile: z.lazy(() => ProfileUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  job: z.lazy(() => JobUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional(),
  departments: z.lazy(() => DepartmentUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional(),
  shortListed: z.lazy(() => ShortListedUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  ownedResumes: z.lazy(() => ResumeUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional()
}).strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string().min(1),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email({message: "Email is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid"),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string().min(6).max(16),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NullableEnumRoleFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneVerified: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profile: z.lazy(() => ProfileUpdateOneWithoutUserNestedInputSchema).optional(),
  job: z.lazy(() => JobUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  departments: z.lazy(() => DepartmentUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  shortListed: z.lazy(() => ShortListedUpdateManyWithoutUserNestedInputSchema).optional(),
  ownedResumes: z.lazy(() => ResumeUpdateManyWithoutCreatedByNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string().min(1),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email({message: "Email is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid"),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string().min(6).max(16),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NullableEnumRoleFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneVerified: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profile: z.lazy(() => ProfileUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  job: z.lazy(() => JobUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  departments: z.lazy(() => DepartmentUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  shortListed: z.lazy(() => ShortListedUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  ownedResumes: z.lazy(() => ResumeUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional()
}).strict();

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  email: z.string().email({message: "Email is invalid"}),
  phone: z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid"),
  password: z.string().min(6).max(16),
  role: z.lazy(() => RoleSchema).optional().nullable(),
  emailVerified: z.boolean().optional().nullable(),
  phoneVerified: z.boolean().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string().min(1),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email({message: "Email is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid"),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string().min(6).max(16),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NullableEnumRoleFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneVerified: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string().min(1),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email({message: "Email is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid"),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string().min(6).max(16),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NullableEnumRoleFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneVerified: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProfileCreateInputSchema: z.ZodType<Prisma.ProfileCreateInput> = z.object({
  id: z.string().uuid().optional(),
  firstName: z.string().min(3, {message: "Value cannot be empty"}),
  lastName: z.string().min(3, {message: "Value cannot be empty"}).optional().nullable(),
  address: z.string().min(3, {message: "Value cannot be empty"}).optional().nullable(),
  city: z.string().min(3, {message: "Value cannot be empty"}).optional().nullable(),
  state: z.string().min(3, {message: "Value cannot be empty"}).optional().nullable(),
  country: z.string().min(3, {message: "Value cannot be empty"}).optional().nullable(),
  zipCode: z.string().min(3, {message: "Value cannot be empty"}).optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutProfileInputSchema)
}).strict();

export const ProfileUncheckedCreateInputSchema: z.ZodType<Prisma.ProfileUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  firstName: z.string().min(3, {message: "Value cannot be empty"}),
  lastName: z.string().min(3, {message: "Value cannot be empty"}).optional().nullable(),
  address: z.string().min(3, {message: "Value cannot be empty"}).optional().nullable(),
  city: z.string().min(3, {message: "Value cannot be empty"}).optional().nullable(),
  state: z.string().min(3, {message: "Value cannot be empty"}).optional().nullable(),
  country: z.string().min(3, {message: "Value cannot be empty"}).optional().nullable(),
  zipCode: z.string().min(3, {message: "Value cannot be empty"}).optional().nullable(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProfileUpdateInputSchema: z.ZodType<Prisma.ProfileUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string().min(3, {message: "Value cannot be empty"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string().min(3, {message: "Value cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string().min(3, {message: "Value cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string().min(3, {message: "Value cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  state: z.union([ z.string().min(3, {message: "Value cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  country: z.union([ z.string().min(3, {message: "Value cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  zipCode: z.union([ z.string().min(3, {message: "Value cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutProfileNestedInputSchema).optional()
}).strict();

export const ProfileUncheckedUpdateInputSchema: z.ZodType<Prisma.ProfileUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string().min(3, {message: "Value cannot be empty"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string().min(3, {message: "Value cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string().min(3, {message: "Value cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string().min(3, {message: "Value cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  state: z.union([ z.string().min(3, {message: "Value cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  country: z.union([ z.string().min(3, {message: "Value cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  zipCode: z.union([ z.string().min(3, {message: "Value cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProfileCreateManyInputSchema: z.ZodType<Prisma.ProfileCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  firstName: z.string().min(3, {message: "Value cannot be empty"}),
  lastName: z.string().min(3, {message: "Value cannot be empty"}).optional().nullable(),
  address: z.string().min(3, {message: "Value cannot be empty"}).optional().nullable(),
  city: z.string().min(3, {message: "Value cannot be empty"}).optional().nullable(),
  state: z.string().min(3, {message: "Value cannot be empty"}).optional().nullable(),
  country: z.string().min(3, {message: "Value cannot be empty"}).optional().nullable(),
  zipCode: z.string().min(3, {message: "Value cannot be empty"}).optional().nullable(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProfileUpdateManyMutationInputSchema: z.ZodType<Prisma.ProfileUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string().min(3, {message: "Value cannot be empty"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string().min(3, {message: "Value cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string().min(3, {message: "Value cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string().min(3, {message: "Value cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  state: z.union([ z.string().min(3, {message: "Value cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  country: z.union([ z.string().min(3, {message: "Value cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  zipCode: z.union([ z.string().min(3, {message: "Value cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProfileUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ProfileUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string().min(3, {message: "Value cannot be empty"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string().min(3, {message: "Value cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string().min(3, {message: "Value cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string().min(3, {message: "Value cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  state: z.union([ z.string().min(3, {message: "Value cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  country: z.union([ z.string().min(3, {message: "Value cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  zipCode: z.union([ z.string().min(3, {message: "Value cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const JobCreateInputSchema: z.ZodType<Prisma.JobCreateInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, {message: "Title cannot be empty"}),
  description: z.string().optional().nullable(),
  jobType: z.lazy(() => JobTypeSchema).optional().nullable(),
  location: z.string().optional().nullable(),
  shiftType: z.lazy(() => ShiftTypeSchema).optional().nullable(),
  expiryDate: z.coerce.date({invalid_type_error:"Date is invalid"}).optional().nullable(),
  createdAt: z.coerce.date().optional(),
  udpatedAt: z.coerce.date().optional(),
  department: z.lazy(() => DepartmentCreateNestedOneWithoutJobInputSchema),
  createdBy: z.lazy(() => UserCreateNestedOneWithoutJobInputSchema),
  resumes: z.lazy(() => JobsAndResumesCreateNestedManyWithoutJobInputSchema).optional(),
  candidates: z.lazy(() => CandidatesOnJobsCreateNestedManyWithoutJobInputSchema).optional(),
  shortListedCandidates: z.lazy(() => ShortListedCreateNestedManyWithoutJobInputSchema).optional()
}).strict();

export const JobUncheckedCreateInputSchema: z.ZodType<Prisma.JobUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, {message: "Title cannot be empty"}),
  description: z.string().optional().nullable(),
  jobType: z.lazy(() => JobTypeSchema).optional().nullable(),
  departmentId: z.string().min(1, {message: "Department is required"}).uuid({message:"User ID is invalid"}),
  location: z.string().optional().nullable(),
  shiftType: z.lazy(() => ShiftTypeSchema).optional().nullable(),
  expiryDate: z.coerce.date({invalid_type_error:"Date is invalid"}).optional().nullable(),
  createdById: z.string().min(1, {message: "User is required"}).uuid({message:"User ID is invalid"}),
  createdAt: z.coerce.date().optional(),
  udpatedAt: z.coerce.date().optional(),
  resumes: z.lazy(() => JobsAndResumesUncheckedCreateNestedManyWithoutJobInputSchema).optional(),
  candidates: z.lazy(() => CandidatesOnJobsUncheckedCreateNestedManyWithoutJobInputSchema).optional(),
  shortListedCandidates: z.lazy(() => ShortListedUncheckedCreateNestedManyWithoutJobInputSchema).optional()
}).strict();

export const JobUpdateInputSchema: z.ZodType<Prisma.JobUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string().min(1, {message: "Title cannot be empty"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  jobType: z.union([ z.lazy(() => JobTypeSchema),z.lazy(() => NullableEnumJobTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  location: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shiftType: z.union([ z.lazy(() => ShiftTypeSchema),z.lazy(() => NullableEnumShiftTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date({invalid_type_error:"Date is invalid"}),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  udpatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  department: z.lazy(() => DepartmentUpdateOneRequiredWithoutJobNestedInputSchema).optional(),
  createdBy: z.lazy(() => UserUpdateOneRequiredWithoutJobNestedInputSchema).optional(),
  resumes: z.lazy(() => JobsAndResumesUpdateManyWithoutJobNestedInputSchema).optional(),
  candidates: z.lazy(() => CandidatesOnJobsUpdateManyWithoutJobNestedInputSchema).optional(),
  shortListedCandidates: z.lazy(() => ShortListedUpdateManyWithoutJobNestedInputSchema).optional()
}).strict();

export const JobUncheckedUpdateInputSchema: z.ZodType<Prisma.JobUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string().min(1, {message: "Title cannot be empty"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  jobType: z.union([ z.lazy(() => JobTypeSchema),z.lazy(() => NullableEnumJobTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  departmentId: z.union([ z.string().min(1, {message: "Department is required"}).uuid({message:"User ID is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shiftType: z.union([ z.lazy(() => ShiftTypeSchema),z.lazy(() => NullableEnumShiftTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date({invalid_type_error:"Date is invalid"}),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdById: z.union([ z.string().min(1, {message: "User is required"}).uuid({message:"User ID is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  udpatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  resumes: z.lazy(() => JobsAndResumesUncheckedUpdateManyWithoutJobNestedInputSchema).optional(),
  candidates: z.lazy(() => CandidatesOnJobsUncheckedUpdateManyWithoutJobNestedInputSchema).optional(),
  shortListedCandidates: z.lazy(() => ShortListedUncheckedUpdateManyWithoutJobNestedInputSchema).optional()
}).strict();

export const JobCreateManyInputSchema: z.ZodType<Prisma.JobCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, {message: "Title cannot be empty"}),
  description: z.string().optional().nullable(),
  jobType: z.lazy(() => JobTypeSchema).optional().nullable(),
  departmentId: z.string().min(1, {message: "Department is required"}).uuid({message:"User ID is invalid"}),
  location: z.string().optional().nullable(),
  shiftType: z.lazy(() => ShiftTypeSchema).optional().nullable(),
  expiryDate: z.coerce.date({invalid_type_error:"Date is invalid"}).optional().nullable(),
  createdById: z.string().min(1, {message: "User is required"}).uuid({message:"User ID is invalid"}),
  createdAt: z.coerce.date().optional(),
  udpatedAt: z.coerce.date().optional()
}).strict();

export const JobUpdateManyMutationInputSchema: z.ZodType<Prisma.JobUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string().min(1, {message: "Title cannot be empty"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  jobType: z.union([ z.lazy(() => JobTypeSchema),z.lazy(() => NullableEnumJobTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  location: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shiftType: z.union([ z.lazy(() => ShiftTypeSchema),z.lazy(() => NullableEnumShiftTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date({invalid_type_error:"Date is invalid"}),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  udpatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const JobUncheckedUpdateManyInputSchema: z.ZodType<Prisma.JobUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string().min(1, {message: "Title cannot be empty"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  jobType: z.union([ z.lazy(() => JobTypeSchema),z.lazy(() => NullableEnumJobTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  departmentId: z.union([ z.string().min(1, {message: "Department is required"}).uuid({message:"User ID is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shiftType: z.union([ z.lazy(() => ShiftTypeSchema),z.lazy(() => NullableEnumShiftTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date({invalid_type_error:"Date is invalid"}),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdById: z.union([ z.string().min(1, {message: "User is required"}).uuid({message:"User ID is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  udpatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DepartmentCreateInputSchema: z.ZodType<Prisma.DepartmentCreateInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, {message: "Title cannot be empty"}),
  description: z.string().optional().nullable(),
  isDeleted: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  udpatedAt: z.coerce.date().optional(),
  job: z.lazy(() => JobCreateNestedManyWithoutDepartmentInputSchema).optional(),
  createdBy: z.lazy(() => UserCreateNestedOneWithoutDepartmentsInputSchema)
}).strict();

export const DepartmentUncheckedCreateInputSchema: z.ZodType<Prisma.DepartmentUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, {message: "Title cannot be empty"}),
  description: z.string().optional().nullable(),
  isDeleted: z.boolean().optional(),
  createdById: z.string().min(1, {message: "User is required"}).uuid({message:"User ID is invalid"}),
  createdAt: z.coerce.date().optional(),
  udpatedAt: z.coerce.date().optional(),
  job: z.lazy(() => JobUncheckedCreateNestedManyWithoutDepartmentInputSchema).optional()
}).strict();

export const DepartmentUpdateInputSchema: z.ZodType<Prisma.DepartmentUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string().min(1, {message: "Title cannot be empty"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  udpatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  job: z.lazy(() => JobUpdateManyWithoutDepartmentNestedInputSchema).optional(),
  createdBy: z.lazy(() => UserUpdateOneRequiredWithoutDepartmentsNestedInputSchema).optional()
}).strict();

export const DepartmentUncheckedUpdateInputSchema: z.ZodType<Prisma.DepartmentUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string().min(1, {message: "Title cannot be empty"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdById: z.union([ z.string().min(1, {message: "User is required"}).uuid({message:"User ID is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  udpatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  job: z.lazy(() => JobUncheckedUpdateManyWithoutDepartmentNestedInputSchema).optional()
}).strict();

export const DepartmentCreateManyInputSchema: z.ZodType<Prisma.DepartmentCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, {message: "Title cannot be empty"}),
  description: z.string().optional().nullable(),
  isDeleted: z.boolean().optional(),
  createdById: z.string().min(1, {message: "User is required"}).uuid({message:"User ID is invalid"}),
  createdAt: z.coerce.date().optional(),
  udpatedAt: z.coerce.date().optional()
}).strict();

export const DepartmentUpdateManyMutationInputSchema: z.ZodType<Prisma.DepartmentUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string().min(1, {message: "Title cannot be empty"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  udpatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DepartmentUncheckedUpdateManyInputSchema: z.ZodType<Prisma.DepartmentUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string().min(1, {message: "Title cannot be empty"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdById: z.union([ z.string().min(1, {message: "User is required"}).uuid({message:"User ID is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  udpatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CandidateCreateInputSchema: z.ZodType<Prisma.CandidateCreateInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, {message:"Name cannot be empty"}),
  email: z.string().email({message:"Email is invalid"}).optional().nullable(),
  phone: z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid").optional().nullable(),
  address: z.string().min(1, {message: "Address cannot be empty"}).optional().nullable(),
  city: z.string().min(1, {message: "City cannot be empty"}).optional().nullable(),
  state: z.string().min(1, {message: "State cannot be empty"}).optional().nullable(),
  country: z.string().min(1, {message: "Country cannot be empty"}).optional().nullable(),
  zipCode: z.string().min(1, {message: "Zip code cannot be empty"}).optional().nullable(),
  age: z.number().positive({message:"Age must be a valid number"}).optional().nullable(),
  dob: z.coerce.date({invalid_type_error:"Date is invalid"}).optional().nullable(),
  gender: z.lazy(() => GenderSchema).optional().nullable(),
  jobExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  totalExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  relevantExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  skills: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pros: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  cons: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  score: z.number().positive({message:"Score must be a valid number"}).optional().nullable(),
  resumeId: z.string(),
  activeResumeId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  resume: z.lazy(() => ResumeCreateNestedManyWithoutCandidateInputSchema).optional(),
  jobs: z.lazy(() => CandidatesOnJobsCreateNestedManyWithoutCandidateInputSchema).optional(),
  shortListedJobs: z.lazy(() => ShortListedCreateNestedManyWithoutCandidateInputSchema).optional()
}).strict();

export const CandidateUncheckedCreateInputSchema: z.ZodType<Prisma.CandidateUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, {message:"Name cannot be empty"}),
  email: z.string().email({message:"Email is invalid"}).optional().nullable(),
  phone: z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid").optional().nullable(),
  address: z.string().min(1, {message: "Address cannot be empty"}).optional().nullable(),
  city: z.string().min(1, {message: "City cannot be empty"}).optional().nullable(),
  state: z.string().min(1, {message: "State cannot be empty"}).optional().nullable(),
  country: z.string().min(1, {message: "Country cannot be empty"}).optional().nullable(),
  zipCode: z.string().min(1, {message: "Zip code cannot be empty"}).optional().nullable(),
  age: z.number().positive({message:"Age must be a valid number"}).optional().nullable(),
  dob: z.coerce.date({invalid_type_error:"Date is invalid"}).optional().nullable(),
  gender: z.lazy(() => GenderSchema).optional().nullable(),
  jobExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  totalExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  relevantExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  skills: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pros: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  cons: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  score: z.number().positive({message:"Score must be a valid number"}).optional().nullable(),
  resumeId: z.string(),
  activeResumeId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  resume: z.lazy(() => ResumeUncheckedCreateNestedManyWithoutCandidateInputSchema).optional(),
  jobs: z.lazy(() => CandidatesOnJobsUncheckedCreateNestedManyWithoutCandidateInputSchema).optional(),
  shortListedJobs: z.lazy(() => ShortListedUncheckedCreateNestedManyWithoutCandidateInputSchema).optional()
}).strict();

export const CandidateUpdateInputSchema: z.ZodType<Prisma.CandidateUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string().min(1, {message:"Name cannot be empty"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email({message:"Email is invalid"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid"),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string().min(1, {message: "Address cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string().min(1, {message: "City cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  state: z.union([ z.string().min(1, {message: "State cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  country: z.union([ z.string().min(1, {message: "Country cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  zipCode: z.union([ z.string().min(1, {message: "Zip code cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  age: z.union([ z.number().positive({message:"Age must be a valid number"}),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dob: z.union([ z.coerce.date({invalid_type_error:"Date is invalid"}),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  gender: z.union([ z.lazy(() => GenderSchema),z.lazy(() => NullableEnumGenderFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  jobExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  totalExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  relevantExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  skills: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pros: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  cons: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  score: z.union([ z.number().positive({message:"Score must be a valid number"}),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  resumeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  activeResumeId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  resume: z.lazy(() => ResumeUpdateManyWithoutCandidateNestedInputSchema).optional(),
  jobs: z.lazy(() => CandidatesOnJobsUpdateManyWithoutCandidateNestedInputSchema).optional(),
  shortListedJobs: z.lazy(() => ShortListedUpdateManyWithoutCandidateNestedInputSchema).optional()
}).strict();

export const CandidateUncheckedUpdateInputSchema: z.ZodType<Prisma.CandidateUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string().min(1, {message:"Name cannot be empty"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email({message:"Email is invalid"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid"),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string().min(1, {message: "Address cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string().min(1, {message: "City cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  state: z.union([ z.string().min(1, {message: "State cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  country: z.union([ z.string().min(1, {message: "Country cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  zipCode: z.union([ z.string().min(1, {message: "Zip code cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  age: z.union([ z.number().positive({message:"Age must be a valid number"}),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dob: z.union([ z.coerce.date({invalid_type_error:"Date is invalid"}),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  gender: z.union([ z.lazy(() => GenderSchema),z.lazy(() => NullableEnumGenderFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  jobExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  totalExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  relevantExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  skills: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pros: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  cons: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  score: z.union([ z.number().positive({message:"Score must be a valid number"}),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  resumeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  activeResumeId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  resume: z.lazy(() => ResumeUncheckedUpdateManyWithoutCandidateNestedInputSchema).optional(),
  jobs: z.lazy(() => CandidatesOnJobsUncheckedUpdateManyWithoutCandidateNestedInputSchema).optional(),
  shortListedJobs: z.lazy(() => ShortListedUncheckedUpdateManyWithoutCandidateNestedInputSchema).optional()
}).strict();

export const CandidateCreateManyInputSchema: z.ZodType<Prisma.CandidateCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, {message:"Name cannot be empty"}),
  email: z.string().email({message:"Email is invalid"}).optional().nullable(),
  phone: z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid").optional().nullable(),
  address: z.string().min(1, {message: "Address cannot be empty"}).optional().nullable(),
  city: z.string().min(1, {message: "City cannot be empty"}).optional().nullable(),
  state: z.string().min(1, {message: "State cannot be empty"}).optional().nullable(),
  country: z.string().min(1, {message: "Country cannot be empty"}).optional().nullable(),
  zipCode: z.string().min(1, {message: "Zip code cannot be empty"}).optional().nullable(),
  age: z.number().positive({message:"Age must be a valid number"}).optional().nullable(),
  dob: z.coerce.date({invalid_type_error:"Date is invalid"}).optional().nullable(),
  gender: z.lazy(() => GenderSchema).optional().nullable(),
  jobExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  totalExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  relevantExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  skills: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pros: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  cons: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  score: z.number().positive({message:"Score must be a valid number"}).optional().nullable(),
  resumeId: z.string(),
  activeResumeId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const CandidateUpdateManyMutationInputSchema: z.ZodType<Prisma.CandidateUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string().min(1, {message:"Name cannot be empty"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email({message:"Email is invalid"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid"),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string().min(1, {message: "Address cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string().min(1, {message: "City cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  state: z.union([ z.string().min(1, {message: "State cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  country: z.union([ z.string().min(1, {message: "Country cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  zipCode: z.union([ z.string().min(1, {message: "Zip code cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  age: z.union([ z.number().positive({message:"Age must be a valid number"}),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dob: z.union([ z.coerce.date({invalid_type_error:"Date is invalid"}),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  gender: z.union([ z.lazy(() => GenderSchema),z.lazy(() => NullableEnumGenderFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  jobExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  totalExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  relevantExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  skills: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pros: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  cons: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  score: z.union([ z.number().positive({message:"Score must be a valid number"}),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  resumeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  activeResumeId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CandidateUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CandidateUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string().min(1, {message:"Name cannot be empty"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email({message:"Email is invalid"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid"),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string().min(1, {message: "Address cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string().min(1, {message: "City cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  state: z.union([ z.string().min(1, {message: "State cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  country: z.union([ z.string().min(1, {message: "Country cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  zipCode: z.union([ z.string().min(1, {message: "Zip code cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  age: z.union([ z.number().positive({message:"Age must be a valid number"}),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dob: z.union([ z.coerce.date({invalid_type_error:"Date is invalid"}),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  gender: z.union([ z.lazy(() => GenderSchema),z.lazy(() => NullableEnumGenderFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  jobExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  totalExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  relevantExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  skills: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pros: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  cons: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  score: z.union([ z.number().positive({message:"Score must be a valid number"}),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  resumeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  activeResumeId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CandidatesOnJobsCreateInputSchema: z.ZodType<Prisma.CandidatesOnJobsCreateInput> = z.object({
  id: z.string().uuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  candidate: z.lazy(() => CandidateCreateNestedOneWithoutJobsInputSchema),
  job: z.lazy(() => JobCreateNestedOneWithoutCandidatesInputSchema)
}).strict();

export const CandidatesOnJobsUncheckedCreateInputSchema: z.ZodType<Prisma.CandidatesOnJobsUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  candidateId: z.string(),
  jobId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const CandidatesOnJobsUpdateInputSchema: z.ZodType<Prisma.CandidatesOnJobsUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  candidate: z.lazy(() => CandidateUpdateOneRequiredWithoutJobsNestedInputSchema).optional(),
  job: z.lazy(() => JobUpdateOneRequiredWithoutCandidatesNestedInputSchema).optional()
}).strict();

export const CandidatesOnJobsUncheckedUpdateInputSchema: z.ZodType<Prisma.CandidatesOnJobsUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  candidateId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  jobId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CandidatesOnJobsCreateManyInputSchema: z.ZodType<Prisma.CandidatesOnJobsCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  candidateId: z.string(),
  jobId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const CandidatesOnJobsUpdateManyMutationInputSchema: z.ZodType<Prisma.CandidatesOnJobsUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CandidatesOnJobsUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CandidatesOnJobsUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  candidateId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  jobId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ShortListedCreateInputSchema: z.ZodType<Prisma.ShortListedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutShortListedInputSchema),
  candidate: z.lazy(() => CandidateCreateNestedOneWithoutShortListedJobsInputSchema),
  job: z.lazy(() => JobCreateNestedOneWithoutShortListedCandidatesInputSchema)
}).strict();

export const ShortListedUncheckedCreateInputSchema: z.ZodType<Prisma.ShortListedUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  candidateId: z.string(),
  jobId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ShortListedUpdateInputSchema: z.ZodType<Prisma.ShortListedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutShortListedNestedInputSchema).optional(),
  candidate: z.lazy(() => CandidateUpdateOneRequiredWithoutShortListedJobsNestedInputSchema).optional(),
  job: z.lazy(() => JobUpdateOneRequiredWithoutShortListedCandidatesNestedInputSchema).optional()
}).strict();

export const ShortListedUncheckedUpdateInputSchema: z.ZodType<Prisma.ShortListedUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  candidateId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  jobId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ShortListedCreateManyInputSchema: z.ZodType<Prisma.ShortListedCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  candidateId: z.string(),
  jobId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ShortListedUpdateManyMutationInputSchema: z.ZodType<Prisma.ShortListedUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ShortListedUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ShortListedUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  candidateId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  jobId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ResumeCreateInputSchema: z.ZodType<Prisma.ResumeCreateInput> = z.object({
  id: z.string().uuid().optional(),
  fileKey: z.string().uuid({message:"Key is invalid"}),
  path: z.string().optional().nullable(),
  fullPath: z.string().optional().nullable(),
  url: z.string().url({message:"URL is invalid"}),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  candidate: z.lazy(() => CandidateCreateNestedOneWithoutResumeInputSchema).optional(),
  jobs: z.lazy(() => JobsAndResumesCreateNestedManyWithoutResumeInputSchema).optional(),
  createdBy: z.lazy(() => UserCreateNestedOneWithoutOwnedResumesInputSchema).optional()
}).strict();

export const ResumeUncheckedCreateInputSchema: z.ZodType<Prisma.ResumeUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  fileKey: z.string().uuid({message:"Key is invalid"}),
  path: z.string().optional().nullable(),
  fullPath: z.string().optional().nullable(),
  url: z.string().url({message:"URL is invalid"}),
  candidateId: z.string().optional().nullable(),
  createdById: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  jobs: z.lazy(() => JobsAndResumesUncheckedCreateNestedManyWithoutResumeInputSchema).optional()
}).strict();

export const ResumeUpdateInputSchema: z.ZodType<Prisma.ResumeUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fileKey: z.union([ z.string().uuid({message:"Key is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  path: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fullPath: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  url: z.union([ z.string().url({message:"URL is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  candidate: z.lazy(() => CandidateUpdateOneWithoutResumeNestedInputSchema).optional(),
  jobs: z.lazy(() => JobsAndResumesUpdateManyWithoutResumeNestedInputSchema).optional(),
  createdBy: z.lazy(() => UserUpdateOneWithoutOwnedResumesNestedInputSchema).optional()
}).strict();

export const ResumeUncheckedUpdateInputSchema: z.ZodType<Prisma.ResumeUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fileKey: z.union([ z.string().uuid({message:"Key is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  path: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fullPath: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  url: z.union([ z.string().url({message:"URL is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  candidateId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdById: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  jobs: z.lazy(() => JobsAndResumesUncheckedUpdateManyWithoutResumeNestedInputSchema).optional()
}).strict();

export const ResumeCreateManyInputSchema: z.ZodType<Prisma.ResumeCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  fileKey: z.string().uuid({message:"Key is invalid"}),
  path: z.string().optional().nullable(),
  fullPath: z.string().optional().nullable(),
  url: z.string().url({message:"URL is invalid"}),
  candidateId: z.string().optional().nullable(),
  createdById: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ResumeUpdateManyMutationInputSchema: z.ZodType<Prisma.ResumeUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fileKey: z.union([ z.string().uuid({message:"Key is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  path: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fullPath: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  url: z.union([ z.string().url({message:"URL is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ResumeUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ResumeUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fileKey: z.union([ z.string().uuid({message:"Key is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  path: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fullPath: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  url: z.union([ z.string().url({message:"URL is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  candidateId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdById: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const JobsAndResumesCreateInputSchema: z.ZodType<Prisma.JobsAndResumesCreateInput> = z.object({
  job: z.lazy(() => JobCreateNestedOneWithoutResumesInputSchema),
  resume: z.lazy(() => ResumeCreateNestedOneWithoutJobsInputSchema)
}).strict();

export const JobsAndResumesUncheckedCreateInputSchema: z.ZodType<Prisma.JobsAndResumesUncheckedCreateInput> = z.object({
  jobId: z.string(),
  resumeId: z.string()
}).strict();

export const JobsAndResumesUpdateInputSchema: z.ZodType<Prisma.JobsAndResumesUpdateInput> = z.object({
  job: z.lazy(() => JobUpdateOneRequiredWithoutResumesNestedInputSchema).optional(),
  resume: z.lazy(() => ResumeUpdateOneRequiredWithoutJobsNestedInputSchema).optional()
}).strict();

export const JobsAndResumesUncheckedUpdateInputSchema: z.ZodType<Prisma.JobsAndResumesUncheckedUpdateInput> = z.object({
  jobId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  resumeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const JobsAndResumesCreateManyInputSchema: z.ZodType<Prisma.JobsAndResumesCreateManyInput> = z.object({
  jobId: z.string(),
  resumeId: z.string()
}).strict();

export const JobsAndResumesUpdateManyMutationInputSchema: z.ZodType<Prisma.JobsAndResumesUpdateManyMutationInput> = z.object({
}).strict();

export const JobsAndResumesUncheckedUpdateManyInputSchema: z.ZodType<Prisma.JobsAndResumesUncheckedUpdateManyInput> = z.object({
  jobId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  resumeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const EnumRoleNullableFilterSchema: z.ZodType<Prisma.EnumRoleNullableFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional().nullable(),
  in: z.lazy(() => RoleSchema).array().optional().nullable(),
  notIn: z.lazy(() => RoleSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NestedEnumRoleNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const BoolNullableFilterSchema: z.ZodType<Prisma.BoolNullableFilter> = z.object({
  equals: z.boolean().optional().nullable(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const ProfileNullableRelationFilterSchema: z.ZodType<Prisma.ProfileNullableRelationFilter> = z.object({
  is: z.lazy(() => ProfileWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => ProfileWhereInputSchema).optional().nullable()
}).strict();

export const JobListRelationFilterSchema: z.ZodType<Prisma.JobListRelationFilter> = z.object({
  every: z.lazy(() => JobWhereInputSchema).optional(),
  some: z.lazy(() => JobWhereInputSchema).optional(),
  none: z.lazy(() => JobWhereInputSchema).optional()
}).strict();

export const DepartmentListRelationFilterSchema: z.ZodType<Prisma.DepartmentListRelationFilter> = z.object({
  every: z.lazy(() => DepartmentWhereInputSchema).optional(),
  some: z.lazy(() => DepartmentWhereInputSchema).optional(),
  none: z.lazy(() => DepartmentWhereInputSchema).optional()
}).strict();

export const ShortListedListRelationFilterSchema: z.ZodType<Prisma.ShortListedListRelationFilter> = z.object({
  every: z.lazy(() => ShortListedWhereInputSchema).optional(),
  some: z.lazy(() => ShortListedWhereInputSchema).optional(),
  none: z.lazy(() => ShortListedWhereInputSchema).optional()
}).strict();

export const ResumeListRelationFilterSchema: z.ZodType<Prisma.ResumeListRelationFilter> = z.object({
  every: z.lazy(() => ResumeWhereInputSchema).optional(),
  some: z.lazy(() => ResumeWhereInputSchema).optional(),
  none: z.lazy(() => ResumeWhereInputSchema).optional()
}).strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict();

export const JobOrderByRelationAggregateInputSchema: z.ZodType<Prisma.JobOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DepartmentOrderByRelationAggregateInputSchema: z.ZodType<Prisma.DepartmentOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ShortListedOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ShortListedOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ResumeOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ResumeOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  phoneVerified: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  phoneVerified: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  phoneVerified: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const EnumRoleNullableWithAggregatesFilterSchema: z.ZodType<Prisma.EnumRoleNullableWithAggregatesFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional().nullable(),
  in: z.lazy(() => RoleSchema).array().optional().nullable(),
  notIn: z.lazy(() => RoleSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NestedEnumRoleNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumRoleNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumRoleNullableFilterSchema).optional()
}).strict();

export const BoolNullableWithAggregatesFilterSchema: z.ZodType<Prisma.BoolNullableWithAggregatesFilter> = z.object({
  equals: z.boolean().optional().nullable(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolNullableFilterSchema).optional()
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const UserRelationFilterSchema: z.ZodType<Prisma.UserRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const ProfileCountOrderByAggregateInputSchema: z.ZodType<Prisma.ProfileCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => SortOrderSchema).optional(),
  zipCode: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProfileMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ProfileMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => SortOrderSchema).optional(),
  zipCode: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProfileMinOrderByAggregateInputSchema: z.ZodType<Prisma.ProfileMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => SortOrderSchema).optional(),
  zipCode: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const EnumJobTypeNullableFilterSchema: z.ZodType<Prisma.EnumJobTypeNullableFilter> = z.object({
  equals: z.lazy(() => JobTypeSchema).optional().nullable(),
  in: z.lazy(() => JobTypeSchema).array().optional().nullable(),
  notIn: z.lazy(() => JobTypeSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => JobTypeSchema),z.lazy(() => NestedEnumJobTypeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const EnumShiftTypeNullableFilterSchema: z.ZodType<Prisma.EnumShiftTypeNullableFilter> = z.object({
  equals: z.lazy(() => ShiftTypeSchema).optional().nullable(),
  in: z.lazy(() => ShiftTypeSchema).array().optional().nullable(),
  notIn: z.lazy(() => ShiftTypeSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => ShiftTypeSchema),z.lazy(() => NestedEnumShiftTypeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const DepartmentRelationFilterSchema: z.ZodType<Prisma.DepartmentRelationFilter> = z.object({
  is: z.lazy(() => DepartmentWhereInputSchema).optional(),
  isNot: z.lazy(() => DepartmentWhereInputSchema).optional()
}).strict();

export const JobsAndResumesListRelationFilterSchema: z.ZodType<Prisma.JobsAndResumesListRelationFilter> = z.object({
  every: z.lazy(() => JobsAndResumesWhereInputSchema).optional(),
  some: z.lazy(() => JobsAndResumesWhereInputSchema).optional(),
  none: z.lazy(() => JobsAndResumesWhereInputSchema).optional()
}).strict();

export const CandidatesOnJobsListRelationFilterSchema: z.ZodType<Prisma.CandidatesOnJobsListRelationFilter> = z.object({
  every: z.lazy(() => CandidatesOnJobsWhereInputSchema).optional(),
  some: z.lazy(() => CandidatesOnJobsWhereInputSchema).optional(),
  none: z.lazy(() => CandidatesOnJobsWhereInputSchema).optional()
}).strict();

export const JobsAndResumesOrderByRelationAggregateInputSchema: z.ZodType<Prisma.JobsAndResumesOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CandidatesOnJobsOrderByRelationAggregateInputSchema: z.ZodType<Prisma.CandidatesOnJobsOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const JobCountOrderByAggregateInputSchema: z.ZodType<Prisma.JobCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  jobType: z.lazy(() => SortOrderSchema).optional(),
  departmentId: z.lazy(() => SortOrderSchema).optional(),
  location: z.lazy(() => SortOrderSchema).optional(),
  shiftType: z.lazy(() => SortOrderSchema).optional(),
  expiryDate: z.lazy(() => SortOrderSchema).optional(),
  createdById: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  udpatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const JobMaxOrderByAggregateInputSchema: z.ZodType<Prisma.JobMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  jobType: z.lazy(() => SortOrderSchema).optional(),
  departmentId: z.lazy(() => SortOrderSchema).optional(),
  location: z.lazy(() => SortOrderSchema).optional(),
  shiftType: z.lazy(() => SortOrderSchema).optional(),
  expiryDate: z.lazy(() => SortOrderSchema).optional(),
  createdById: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  udpatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const JobMinOrderByAggregateInputSchema: z.ZodType<Prisma.JobMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  jobType: z.lazy(() => SortOrderSchema).optional(),
  departmentId: z.lazy(() => SortOrderSchema).optional(),
  location: z.lazy(() => SortOrderSchema).optional(),
  shiftType: z.lazy(() => SortOrderSchema).optional(),
  expiryDate: z.lazy(() => SortOrderSchema).optional(),
  createdById: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  udpatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumJobTypeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.EnumJobTypeNullableWithAggregatesFilter> = z.object({
  equals: z.lazy(() => JobTypeSchema).optional().nullable(),
  in: z.lazy(() => JobTypeSchema).array().optional().nullable(),
  notIn: z.lazy(() => JobTypeSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => JobTypeSchema),z.lazy(() => NestedEnumJobTypeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumJobTypeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumJobTypeNullableFilterSchema).optional()
}).strict();

export const EnumShiftTypeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.EnumShiftTypeNullableWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ShiftTypeSchema).optional().nullable(),
  in: z.lazy(() => ShiftTypeSchema).array().optional().nullable(),
  notIn: z.lazy(() => ShiftTypeSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => ShiftTypeSchema),z.lazy(() => NestedEnumShiftTypeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumShiftTypeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumShiftTypeNullableFilterSchema).optional()
}).strict();

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const DepartmentCountOrderByAggregateInputSchema: z.ZodType<Prisma.DepartmentCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  isDeleted: z.lazy(() => SortOrderSchema).optional(),
  createdById: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  udpatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DepartmentMaxOrderByAggregateInputSchema: z.ZodType<Prisma.DepartmentMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  isDeleted: z.lazy(() => SortOrderSchema).optional(),
  createdById: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  udpatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DepartmentMinOrderByAggregateInputSchema: z.ZodType<Prisma.DepartmentMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  isDeleted: z.lazy(() => SortOrderSchema).optional(),
  createdById: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  udpatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const IntNullableFilterSchema: z.ZodType<Prisma.IntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const EnumGenderNullableFilterSchema: z.ZodType<Prisma.EnumGenderNullableFilter> = z.object({
  equals: z.lazy(() => GenderSchema).optional().nullable(),
  in: z.lazy(() => GenderSchema).array().optional().nullable(),
  notIn: z.lazy(() => GenderSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => GenderSchema),z.lazy(() => NestedEnumGenderNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const JsonNullableFilterSchema: z.ZodType<Prisma.JsonNullableFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const CandidateCountOrderByAggregateInputSchema: z.ZodType<Prisma.CandidateCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => SortOrderSchema).optional(),
  zipCode: z.lazy(() => SortOrderSchema).optional(),
  age: z.lazy(() => SortOrderSchema).optional(),
  dob: z.lazy(() => SortOrderSchema).optional(),
  gender: z.lazy(() => SortOrderSchema).optional(),
  jobExperience: z.lazy(() => SortOrderSchema).optional(),
  totalExperience: z.lazy(() => SortOrderSchema).optional(),
  relevantExperience: z.lazy(() => SortOrderSchema).optional(),
  skills: z.lazy(() => SortOrderSchema).optional(),
  pros: z.lazy(() => SortOrderSchema).optional(),
  cons: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional(),
  resumeId: z.lazy(() => SortOrderSchema).optional(),
  activeResumeId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CandidateAvgOrderByAggregateInputSchema: z.ZodType<Prisma.CandidateAvgOrderByAggregateInput> = z.object({
  age: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CandidateMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CandidateMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => SortOrderSchema).optional(),
  zipCode: z.lazy(() => SortOrderSchema).optional(),
  age: z.lazy(() => SortOrderSchema).optional(),
  dob: z.lazy(() => SortOrderSchema).optional(),
  gender: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional(),
  resumeId: z.lazy(() => SortOrderSchema).optional(),
  activeResumeId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CandidateMinOrderByAggregateInputSchema: z.ZodType<Prisma.CandidateMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => SortOrderSchema).optional(),
  zipCode: z.lazy(() => SortOrderSchema).optional(),
  age: z.lazy(() => SortOrderSchema).optional(),
  dob: z.lazy(() => SortOrderSchema).optional(),
  gender: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional(),
  resumeId: z.lazy(() => SortOrderSchema).optional(),
  activeResumeId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CandidateSumOrderByAggregateInputSchema: z.ZodType<Prisma.CandidateSumOrderByAggregateInput> = z.object({
  age: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.IntNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional()
}).strict();

export const EnumGenderNullableWithAggregatesFilterSchema: z.ZodType<Prisma.EnumGenderNullableWithAggregatesFilter> = z.object({
  equals: z.lazy(() => GenderSchema).optional().nullable(),
  in: z.lazy(() => GenderSchema).array().optional().nullable(),
  notIn: z.lazy(() => GenderSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => GenderSchema),z.lazy(() => NestedEnumGenderNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumGenderNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumGenderNullableFilterSchema).optional()
}).strict();

export const JsonNullableWithAggregatesFilterSchema: z.ZodType<Prisma.JsonNullableWithAggregatesFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonNullableFilterSchema).optional()
}).strict();

export const CandidateRelationFilterSchema: z.ZodType<Prisma.CandidateRelationFilter> = z.object({
  is: z.lazy(() => CandidateWhereInputSchema).optional(),
  isNot: z.lazy(() => CandidateWhereInputSchema).optional()
}).strict();

export const JobRelationFilterSchema: z.ZodType<Prisma.JobRelationFilter> = z.object({
  is: z.lazy(() => JobWhereInputSchema).optional(),
  isNot: z.lazy(() => JobWhereInputSchema).optional()
}).strict();

export const CandidatesOnJobsCandidateIdJobIdCompoundUniqueInputSchema: z.ZodType<Prisma.CandidatesOnJobsCandidateIdJobIdCompoundUniqueInput> = z.object({
  candidateId: z.string(),
  jobId: z.string()
}).strict();

export const CandidatesOnJobsCountOrderByAggregateInputSchema: z.ZodType<Prisma.CandidatesOnJobsCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  candidateId: z.lazy(() => SortOrderSchema).optional(),
  jobId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CandidatesOnJobsMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CandidatesOnJobsMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  candidateId: z.lazy(() => SortOrderSchema).optional(),
  jobId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CandidatesOnJobsMinOrderByAggregateInputSchema: z.ZodType<Prisma.CandidatesOnJobsMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  candidateId: z.lazy(() => SortOrderSchema).optional(),
  jobId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ShortListedUserIdJobIdCandidateIdCompoundUniqueInputSchema: z.ZodType<Prisma.ShortListedUserIdJobIdCandidateIdCompoundUniqueInput> = z.object({
  userId: z.string(),
  jobId: z.string(),
  candidateId: z.string()
}).strict();

export const ShortListedCountOrderByAggregateInputSchema: z.ZodType<Prisma.ShortListedCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  candidateId: z.lazy(() => SortOrderSchema).optional(),
  jobId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ShortListedMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ShortListedMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  candidateId: z.lazy(() => SortOrderSchema).optional(),
  jobId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ShortListedMinOrderByAggregateInputSchema: z.ZodType<Prisma.ShortListedMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  candidateId: z.lazy(() => SortOrderSchema).optional(),
  jobId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CandidateNullableRelationFilterSchema: z.ZodType<Prisma.CandidateNullableRelationFilter> = z.object({
  is: z.lazy(() => CandidateWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => CandidateWhereInputSchema).optional().nullable()
}).strict();

export const UserNullableRelationFilterSchema: z.ZodType<Prisma.UserNullableRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => UserWhereInputSchema).optional().nullable()
}).strict();

export const ResumeCountOrderByAggregateInputSchema: z.ZodType<Prisma.ResumeCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  fileKey: z.lazy(() => SortOrderSchema).optional(),
  path: z.lazy(() => SortOrderSchema).optional(),
  fullPath: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  candidateId: z.lazy(() => SortOrderSchema).optional(),
  createdById: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ResumeMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ResumeMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  fileKey: z.lazy(() => SortOrderSchema).optional(),
  path: z.lazy(() => SortOrderSchema).optional(),
  fullPath: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  candidateId: z.lazy(() => SortOrderSchema).optional(),
  createdById: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ResumeMinOrderByAggregateInputSchema: z.ZodType<Prisma.ResumeMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  fileKey: z.lazy(() => SortOrderSchema).optional(),
  path: z.lazy(() => SortOrderSchema).optional(),
  fullPath: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  candidateId: z.lazy(() => SortOrderSchema).optional(),
  createdById: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ResumeRelationFilterSchema: z.ZodType<Prisma.ResumeRelationFilter> = z.object({
  is: z.lazy(() => ResumeWhereInputSchema).optional(),
  isNot: z.lazy(() => ResumeWhereInputSchema).optional()
}).strict();

export const JobsAndResumesJobIdResumeIdCompoundUniqueInputSchema: z.ZodType<Prisma.JobsAndResumesJobIdResumeIdCompoundUniqueInput> = z.object({
  jobId: z.string(),
  resumeId: z.string()
}).strict();

export const JobsAndResumesCountOrderByAggregateInputSchema: z.ZodType<Prisma.JobsAndResumesCountOrderByAggregateInput> = z.object({
  jobId: z.lazy(() => SortOrderSchema).optional(),
  resumeId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const JobsAndResumesMaxOrderByAggregateInputSchema: z.ZodType<Prisma.JobsAndResumesMaxOrderByAggregateInput> = z.object({
  jobId: z.lazy(() => SortOrderSchema).optional(),
  resumeId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const JobsAndResumesMinOrderByAggregateInputSchema: z.ZodType<Prisma.JobsAndResumesMinOrderByAggregateInput> = z.object({
  jobId: z.lazy(() => SortOrderSchema).optional(),
  resumeId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProfileCreateNestedOneWithoutUserInputSchema: z.ZodType<Prisma.ProfileCreateNestedOneWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ProfileCreateWithoutUserInputSchema),z.lazy(() => ProfileUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProfileCreateOrConnectWithoutUserInputSchema).optional(),
  connect: z.lazy(() => ProfileWhereUniqueInputSchema).optional()
}).strict();

export const JobCreateNestedManyWithoutCreatedByInputSchema: z.ZodType<Prisma.JobCreateNestedManyWithoutCreatedByInput> = z.object({
  create: z.union([ z.lazy(() => JobCreateWithoutCreatedByInputSchema),z.lazy(() => JobCreateWithoutCreatedByInputSchema).array(),z.lazy(() => JobUncheckedCreateWithoutCreatedByInputSchema),z.lazy(() => JobUncheckedCreateWithoutCreatedByInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => JobCreateOrConnectWithoutCreatedByInputSchema),z.lazy(() => JobCreateOrConnectWithoutCreatedByInputSchema).array() ]).optional(),
  createMany: z.lazy(() => JobCreateManyCreatedByInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => JobWhereUniqueInputSchema),z.lazy(() => JobWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DepartmentCreateNestedManyWithoutCreatedByInputSchema: z.ZodType<Prisma.DepartmentCreateNestedManyWithoutCreatedByInput> = z.object({
  create: z.union([ z.lazy(() => DepartmentCreateWithoutCreatedByInputSchema),z.lazy(() => DepartmentCreateWithoutCreatedByInputSchema).array(),z.lazy(() => DepartmentUncheckedCreateWithoutCreatedByInputSchema),z.lazy(() => DepartmentUncheckedCreateWithoutCreatedByInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DepartmentCreateOrConnectWithoutCreatedByInputSchema),z.lazy(() => DepartmentCreateOrConnectWithoutCreatedByInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DepartmentCreateManyCreatedByInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DepartmentWhereUniqueInputSchema),z.lazy(() => DepartmentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ShortListedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ShortListedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ShortListedCreateWithoutUserInputSchema),z.lazy(() => ShortListedCreateWithoutUserInputSchema).array(),z.lazy(() => ShortListedUncheckedCreateWithoutUserInputSchema),z.lazy(() => ShortListedUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ShortListedCreateOrConnectWithoutUserInputSchema),z.lazy(() => ShortListedCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ShortListedCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ShortListedWhereUniqueInputSchema),z.lazy(() => ShortListedWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ResumeCreateNestedManyWithoutCreatedByInputSchema: z.ZodType<Prisma.ResumeCreateNestedManyWithoutCreatedByInput> = z.object({
  create: z.union([ z.lazy(() => ResumeCreateWithoutCreatedByInputSchema),z.lazy(() => ResumeCreateWithoutCreatedByInputSchema).array(),z.lazy(() => ResumeUncheckedCreateWithoutCreatedByInputSchema),z.lazy(() => ResumeUncheckedCreateWithoutCreatedByInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResumeCreateOrConnectWithoutCreatedByInputSchema),z.lazy(() => ResumeCreateOrConnectWithoutCreatedByInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResumeCreateManyCreatedByInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ResumeWhereUniqueInputSchema),z.lazy(() => ResumeWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProfileUncheckedCreateNestedOneWithoutUserInputSchema: z.ZodType<Prisma.ProfileUncheckedCreateNestedOneWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ProfileCreateWithoutUserInputSchema),z.lazy(() => ProfileUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProfileCreateOrConnectWithoutUserInputSchema).optional(),
  connect: z.lazy(() => ProfileWhereUniqueInputSchema).optional()
}).strict();

export const JobUncheckedCreateNestedManyWithoutCreatedByInputSchema: z.ZodType<Prisma.JobUncheckedCreateNestedManyWithoutCreatedByInput> = z.object({
  create: z.union([ z.lazy(() => JobCreateWithoutCreatedByInputSchema),z.lazy(() => JobCreateWithoutCreatedByInputSchema).array(),z.lazy(() => JobUncheckedCreateWithoutCreatedByInputSchema),z.lazy(() => JobUncheckedCreateWithoutCreatedByInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => JobCreateOrConnectWithoutCreatedByInputSchema),z.lazy(() => JobCreateOrConnectWithoutCreatedByInputSchema).array() ]).optional(),
  createMany: z.lazy(() => JobCreateManyCreatedByInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => JobWhereUniqueInputSchema),z.lazy(() => JobWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DepartmentUncheckedCreateNestedManyWithoutCreatedByInputSchema: z.ZodType<Prisma.DepartmentUncheckedCreateNestedManyWithoutCreatedByInput> = z.object({
  create: z.union([ z.lazy(() => DepartmentCreateWithoutCreatedByInputSchema),z.lazy(() => DepartmentCreateWithoutCreatedByInputSchema).array(),z.lazy(() => DepartmentUncheckedCreateWithoutCreatedByInputSchema),z.lazy(() => DepartmentUncheckedCreateWithoutCreatedByInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DepartmentCreateOrConnectWithoutCreatedByInputSchema),z.lazy(() => DepartmentCreateOrConnectWithoutCreatedByInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DepartmentCreateManyCreatedByInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DepartmentWhereUniqueInputSchema),z.lazy(() => DepartmentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ShortListedUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ShortListedUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ShortListedCreateWithoutUserInputSchema),z.lazy(() => ShortListedCreateWithoutUserInputSchema).array(),z.lazy(() => ShortListedUncheckedCreateWithoutUserInputSchema),z.lazy(() => ShortListedUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ShortListedCreateOrConnectWithoutUserInputSchema),z.lazy(() => ShortListedCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ShortListedCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ShortListedWhereUniqueInputSchema),z.lazy(() => ShortListedWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ResumeUncheckedCreateNestedManyWithoutCreatedByInputSchema: z.ZodType<Prisma.ResumeUncheckedCreateNestedManyWithoutCreatedByInput> = z.object({
  create: z.union([ z.lazy(() => ResumeCreateWithoutCreatedByInputSchema),z.lazy(() => ResumeCreateWithoutCreatedByInputSchema).array(),z.lazy(() => ResumeUncheckedCreateWithoutCreatedByInputSchema),z.lazy(() => ResumeUncheckedCreateWithoutCreatedByInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResumeCreateOrConnectWithoutCreatedByInputSchema),z.lazy(() => ResumeCreateOrConnectWithoutCreatedByInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResumeCreateManyCreatedByInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ResumeWhereUniqueInputSchema),z.lazy(() => ResumeWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const NullableEnumRoleFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableEnumRoleFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => RoleSchema).optional().nullable()
}).strict();

export const NullableBoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableBoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional().nullable()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const ProfileUpdateOneWithoutUserNestedInputSchema: z.ZodType<Prisma.ProfileUpdateOneWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProfileCreateWithoutUserInputSchema),z.lazy(() => ProfileUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProfileCreateOrConnectWithoutUserInputSchema).optional(),
  upsert: z.lazy(() => ProfileUpsertWithoutUserInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => ProfileWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => ProfileWhereInputSchema) ]).optional(),
  connect: z.lazy(() => ProfileWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProfileUpdateToOneWithWhereWithoutUserInputSchema),z.lazy(() => ProfileUpdateWithoutUserInputSchema),z.lazy(() => ProfileUncheckedUpdateWithoutUserInputSchema) ]).optional(),
}).strict();

export const JobUpdateManyWithoutCreatedByNestedInputSchema: z.ZodType<Prisma.JobUpdateManyWithoutCreatedByNestedInput> = z.object({
  create: z.union([ z.lazy(() => JobCreateWithoutCreatedByInputSchema),z.lazy(() => JobCreateWithoutCreatedByInputSchema).array(),z.lazy(() => JobUncheckedCreateWithoutCreatedByInputSchema),z.lazy(() => JobUncheckedCreateWithoutCreatedByInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => JobCreateOrConnectWithoutCreatedByInputSchema),z.lazy(() => JobCreateOrConnectWithoutCreatedByInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => JobUpsertWithWhereUniqueWithoutCreatedByInputSchema),z.lazy(() => JobUpsertWithWhereUniqueWithoutCreatedByInputSchema).array() ]).optional(),
  createMany: z.lazy(() => JobCreateManyCreatedByInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => JobWhereUniqueInputSchema),z.lazy(() => JobWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => JobWhereUniqueInputSchema),z.lazy(() => JobWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => JobWhereUniqueInputSchema),z.lazy(() => JobWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => JobWhereUniqueInputSchema),z.lazy(() => JobWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => JobUpdateWithWhereUniqueWithoutCreatedByInputSchema),z.lazy(() => JobUpdateWithWhereUniqueWithoutCreatedByInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => JobUpdateManyWithWhereWithoutCreatedByInputSchema),z.lazy(() => JobUpdateManyWithWhereWithoutCreatedByInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => JobScalarWhereInputSchema),z.lazy(() => JobScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const DepartmentUpdateManyWithoutCreatedByNestedInputSchema: z.ZodType<Prisma.DepartmentUpdateManyWithoutCreatedByNestedInput> = z.object({
  create: z.union([ z.lazy(() => DepartmentCreateWithoutCreatedByInputSchema),z.lazy(() => DepartmentCreateWithoutCreatedByInputSchema).array(),z.lazy(() => DepartmentUncheckedCreateWithoutCreatedByInputSchema),z.lazy(() => DepartmentUncheckedCreateWithoutCreatedByInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DepartmentCreateOrConnectWithoutCreatedByInputSchema),z.lazy(() => DepartmentCreateOrConnectWithoutCreatedByInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DepartmentUpsertWithWhereUniqueWithoutCreatedByInputSchema),z.lazy(() => DepartmentUpsertWithWhereUniqueWithoutCreatedByInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DepartmentCreateManyCreatedByInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => DepartmentWhereUniqueInputSchema),z.lazy(() => DepartmentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DepartmentWhereUniqueInputSchema),z.lazy(() => DepartmentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DepartmentWhereUniqueInputSchema),z.lazy(() => DepartmentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DepartmentWhereUniqueInputSchema),z.lazy(() => DepartmentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DepartmentUpdateWithWhereUniqueWithoutCreatedByInputSchema),z.lazy(() => DepartmentUpdateWithWhereUniqueWithoutCreatedByInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DepartmentUpdateManyWithWhereWithoutCreatedByInputSchema),z.lazy(() => DepartmentUpdateManyWithWhereWithoutCreatedByInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DepartmentScalarWhereInputSchema),z.lazy(() => DepartmentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ShortListedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ShortListedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ShortListedCreateWithoutUserInputSchema),z.lazy(() => ShortListedCreateWithoutUserInputSchema).array(),z.lazy(() => ShortListedUncheckedCreateWithoutUserInputSchema),z.lazy(() => ShortListedUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ShortListedCreateOrConnectWithoutUserInputSchema),z.lazy(() => ShortListedCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ShortListedUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ShortListedUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ShortListedCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ShortListedWhereUniqueInputSchema),z.lazy(() => ShortListedWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ShortListedWhereUniqueInputSchema),z.lazy(() => ShortListedWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ShortListedWhereUniqueInputSchema),z.lazy(() => ShortListedWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ShortListedWhereUniqueInputSchema),z.lazy(() => ShortListedWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ShortListedUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ShortListedUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ShortListedUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => ShortListedUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ShortListedScalarWhereInputSchema),z.lazy(() => ShortListedScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ResumeUpdateManyWithoutCreatedByNestedInputSchema: z.ZodType<Prisma.ResumeUpdateManyWithoutCreatedByNestedInput> = z.object({
  create: z.union([ z.lazy(() => ResumeCreateWithoutCreatedByInputSchema),z.lazy(() => ResumeCreateWithoutCreatedByInputSchema).array(),z.lazy(() => ResumeUncheckedCreateWithoutCreatedByInputSchema),z.lazy(() => ResumeUncheckedCreateWithoutCreatedByInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResumeCreateOrConnectWithoutCreatedByInputSchema),z.lazy(() => ResumeCreateOrConnectWithoutCreatedByInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ResumeUpsertWithWhereUniqueWithoutCreatedByInputSchema),z.lazy(() => ResumeUpsertWithWhereUniqueWithoutCreatedByInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResumeCreateManyCreatedByInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ResumeWhereUniqueInputSchema),z.lazy(() => ResumeWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ResumeWhereUniqueInputSchema),z.lazy(() => ResumeWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ResumeWhereUniqueInputSchema),z.lazy(() => ResumeWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ResumeWhereUniqueInputSchema),z.lazy(() => ResumeWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ResumeUpdateWithWhereUniqueWithoutCreatedByInputSchema),z.lazy(() => ResumeUpdateWithWhereUniqueWithoutCreatedByInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ResumeUpdateManyWithWhereWithoutCreatedByInputSchema),z.lazy(() => ResumeUpdateManyWithWhereWithoutCreatedByInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ResumeScalarWhereInputSchema),z.lazy(() => ResumeScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProfileUncheckedUpdateOneWithoutUserNestedInputSchema: z.ZodType<Prisma.ProfileUncheckedUpdateOneWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProfileCreateWithoutUserInputSchema),z.lazy(() => ProfileUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProfileCreateOrConnectWithoutUserInputSchema).optional(),
  upsert: z.lazy(() => ProfileUpsertWithoutUserInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => ProfileWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => ProfileWhereInputSchema) ]).optional(),
  connect: z.lazy(() => ProfileWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProfileUpdateToOneWithWhereWithoutUserInputSchema),z.lazy(() => ProfileUpdateWithoutUserInputSchema),z.lazy(() => ProfileUncheckedUpdateWithoutUserInputSchema) ]).optional(),
}).strict();

export const JobUncheckedUpdateManyWithoutCreatedByNestedInputSchema: z.ZodType<Prisma.JobUncheckedUpdateManyWithoutCreatedByNestedInput> = z.object({
  create: z.union([ z.lazy(() => JobCreateWithoutCreatedByInputSchema),z.lazy(() => JobCreateWithoutCreatedByInputSchema).array(),z.lazy(() => JobUncheckedCreateWithoutCreatedByInputSchema),z.lazy(() => JobUncheckedCreateWithoutCreatedByInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => JobCreateOrConnectWithoutCreatedByInputSchema),z.lazy(() => JobCreateOrConnectWithoutCreatedByInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => JobUpsertWithWhereUniqueWithoutCreatedByInputSchema),z.lazy(() => JobUpsertWithWhereUniqueWithoutCreatedByInputSchema).array() ]).optional(),
  createMany: z.lazy(() => JobCreateManyCreatedByInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => JobWhereUniqueInputSchema),z.lazy(() => JobWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => JobWhereUniqueInputSchema),z.lazy(() => JobWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => JobWhereUniqueInputSchema),z.lazy(() => JobWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => JobWhereUniqueInputSchema),z.lazy(() => JobWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => JobUpdateWithWhereUniqueWithoutCreatedByInputSchema),z.lazy(() => JobUpdateWithWhereUniqueWithoutCreatedByInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => JobUpdateManyWithWhereWithoutCreatedByInputSchema),z.lazy(() => JobUpdateManyWithWhereWithoutCreatedByInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => JobScalarWhereInputSchema),z.lazy(() => JobScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const DepartmentUncheckedUpdateManyWithoutCreatedByNestedInputSchema: z.ZodType<Prisma.DepartmentUncheckedUpdateManyWithoutCreatedByNestedInput> = z.object({
  create: z.union([ z.lazy(() => DepartmentCreateWithoutCreatedByInputSchema),z.lazy(() => DepartmentCreateWithoutCreatedByInputSchema).array(),z.lazy(() => DepartmentUncheckedCreateWithoutCreatedByInputSchema),z.lazy(() => DepartmentUncheckedCreateWithoutCreatedByInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DepartmentCreateOrConnectWithoutCreatedByInputSchema),z.lazy(() => DepartmentCreateOrConnectWithoutCreatedByInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DepartmentUpsertWithWhereUniqueWithoutCreatedByInputSchema),z.lazy(() => DepartmentUpsertWithWhereUniqueWithoutCreatedByInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DepartmentCreateManyCreatedByInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => DepartmentWhereUniqueInputSchema),z.lazy(() => DepartmentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DepartmentWhereUniqueInputSchema),z.lazy(() => DepartmentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DepartmentWhereUniqueInputSchema),z.lazy(() => DepartmentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DepartmentWhereUniqueInputSchema),z.lazy(() => DepartmentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DepartmentUpdateWithWhereUniqueWithoutCreatedByInputSchema),z.lazy(() => DepartmentUpdateWithWhereUniqueWithoutCreatedByInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DepartmentUpdateManyWithWhereWithoutCreatedByInputSchema),z.lazy(() => DepartmentUpdateManyWithWhereWithoutCreatedByInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DepartmentScalarWhereInputSchema),z.lazy(() => DepartmentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ShortListedUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ShortListedUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ShortListedCreateWithoutUserInputSchema),z.lazy(() => ShortListedCreateWithoutUserInputSchema).array(),z.lazy(() => ShortListedUncheckedCreateWithoutUserInputSchema),z.lazy(() => ShortListedUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ShortListedCreateOrConnectWithoutUserInputSchema),z.lazy(() => ShortListedCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ShortListedUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ShortListedUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ShortListedCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ShortListedWhereUniqueInputSchema),z.lazy(() => ShortListedWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ShortListedWhereUniqueInputSchema),z.lazy(() => ShortListedWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ShortListedWhereUniqueInputSchema),z.lazy(() => ShortListedWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ShortListedWhereUniqueInputSchema),z.lazy(() => ShortListedWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ShortListedUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ShortListedUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ShortListedUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => ShortListedUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ShortListedScalarWhereInputSchema),z.lazy(() => ShortListedScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ResumeUncheckedUpdateManyWithoutCreatedByNestedInputSchema: z.ZodType<Prisma.ResumeUncheckedUpdateManyWithoutCreatedByNestedInput> = z.object({
  create: z.union([ z.lazy(() => ResumeCreateWithoutCreatedByInputSchema),z.lazy(() => ResumeCreateWithoutCreatedByInputSchema).array(),z.lazy(() => ResumeUncheckedCreateWithoutCreatedByInputSchema),z.lazy(() => ResumeUncheckedCreateWithoutCreatedByInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResumeCreateOrConnectWithoutCreatedByInputSchema),z.lazy(() => ResumeCreateOrConnectWithoutCreatedByInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ResumeUpsertWithWhereUniqueWithoutCreatedByInputSchema),z.lazy(() => ResumeUpsertWithWhereUniqueWithoutCreatedByInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResumeCreateManyCreatedByInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ResumeWhereUniqueInputSchema),z.lazy(() => ResumeWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ResumeWhereUniqueInputSchema),z.lazy(() => ResumeWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ResumeWhereUniqueInputSchema),z.lazy(() => ResumeWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ResumeWhereUniqueInputSchema),z.lazy(() => ResumeWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ResumeUpdateWithWhereUniqueWithoutCreatedByInputSchema),z.lazy(() => ResumeUpdateWithWhereUniqueWithoutCreatedByInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ResumeUpdateManyWithWhereWithoutCreatedByInputSchema),z.lazy(() => ResumeUpdateManyWithWhereWithoutCreatedByInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ResumeScalarWhereInputSchema),z.lazy(() => ResumeScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutProfileInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutProfileInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutProfileInputSchema),z.lazy(() => UserUncheckedCreateWithoutProfileInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutProfileInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const UserUpdateOneRequiredWithoutProfileNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutProfileNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutProfileInputSchema),z.lazy(() => UserUncheckedCreateWithoutProfileInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutProfileInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutProfileInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutProfileInputSchema),z.lazy(() => UserUpdateWithoutProfileInputSchema),z.lazy(() => UserUncheckedUpdateWithoutProfileInputSchema) ]).optional(),
}).strict();

export const DepartmentCreateNestedOneWithoutJobInputSchema: z.ZodType<Prisma.DepartmentCreateNestedOneWithoutJobInput> = z.object({
  create: z.union([ z.lazy(() => DepartmentCreateWithoutJobInputSchema),z.lazy(() => DepartmentUncheckedCreateWithoutJobInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DepartmentCreateOrConnectWithoutJobInputSchema).optional(),
  connect: z.lazy(() => DepartmentWhereUniqueInputSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutJobInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutJobInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutJobInputSchema),z.lazy(() => UserUncheckedCreateWithoutJobInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutJobInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const JobsAndResumesCreateNestedManyWithoutJobInputSchema: z.ZodType<Prisma.JobsAndResumesCreateNestedManyWithoutJobInput> = z.object({
  create: z.union([ z.lazy(() => JobsAndResumesCreateWithoutJobInputSchema),z.lazy(() => JobsAndResumesCreateWithoutJobInputSchema).array(),z.lazy(() => JobsAndResumesUncheckedCreateWithoutJobInputSchema),z.lazy(() => JobsAndResumesUncheckedCreateWithoutJobInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => JobsAndResumesCreateOrConnectWithoutJobInputSchema),z.lazy(() => JobsAndResumesCreateOrConnectWithoutJobInputSchema).array() ]).optional(),
  createMany: z.lazy(() => JobsAndResumesCreateManyJobInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => JobsAndResumesWhereUniqueInputSchema),z.lazy(() => JobsAndResumesWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CandidatesOnJobsCreateNestedManyWithoutJobInputSchema: z.ZodType<Prisma.CandidatesOnJobsCreateNestedManyWithoutJobInput> = z.object({
  create: z.union([ z.lazy(() => CandidatesOnJobsCreateWithoutJobInputSchema),z.lazy(() => CandidatesOnJobsCreateWithoutJobInputSchema).array(),z.lazy(() => CandidatesOnJobsUncheckedCreateWithoutJobInputSchema),z.lazy(() => CandidatesOnJobsUncheckedCreateWithoutJobInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CandidatesOnJobsCreateOrConnectWithoutJobInputSchema),z.lazy(() => CandidatesOnJobsCreateOrConnectWithoutJobInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CandidatesOnJobsCreateManyJobInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CandidatesOnJobsWhereUniqueInputSchema),z.lazy(() => CandidatesOnJobsWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ShortListedCreateNestedManyWithoutJobInputSchema: z.ZodType<Prisma.ShortListedCreateNestedManyWithoutJobInput> = z.object({
  create: z.union([ z.lazy(() => ShortListedCreateWithoutJobInputSchema),z.lazy(() => ShortListedCreateWithoutJobInputSchema).array(),z.lazy(() => ShortListedUncheckedCreateWithoutJobInputSchema),z.lazy(() => ShortListedUncheckedCreateWithoutJobInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ShortListedCreateOrConnectWithoutJobInputSchema),z.lazy(() => ShortListedCreateOrConnectWithoutJobInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ShortListedCreateManyJobInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ShortListedWhereUniqueInputSchema),z.lazy(() => ShortListedWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const JobsAndResumesUncheckedCreateNestedManyWithoutJobInputSchema: z.ZodType<Prisma.JobsAndResumesUncheckedCreateNestedManyWithoutJobInput> = z.object({
  create: z.union([ z.lazy(() => JobsAndResumesCreateWithoutJobInputSchema),z.lazy(() => JobsAndResumesCreateWithoutJobInputSchema).array(),z.lazy(() => JobsAndResumesUncheckedCreateWithoutJobInputSchema),z.lazy(() => JobsAndResumesUncheckedCreateWithoutJobInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => JobsAndResumesCreateOrConnectWithoutJobInputSchema),z.lazy(() => JobsAndResumesCreateOrConnectWithoutJobInputSchema).array() ]).optional(),
  createMany: z.lazy(() => JobsAndResumesCreateManyJobInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => JobsAndResumesWhereUniqueInputSchema),z.lazy(() => JobsAndResumesWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CandidatesOnJobsUncheckedCreateNestedManyWithoutJobInputSchema: z.ZodType<Prisma.CandidatesOnJobsUncheckedCreateNestedManyWithoutJobInput> = z.object({
  create: z.union([ z.lazy(() => CandidatesOnJobsCreateWithoutJobInputSchema),z.lazy(() => CandidatesOnJobsCreateWithoutJobInputSchema).array(),z.lazy(() => CandidatesOnJobsUncheckedCreateWithoutJobInputSchema),z.lazy(() => CandidatesOnJobsUncheckedCreateWithoutJobInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CandidatesOnJobsCreateOrConnectWithoutJobInputSchema),z.lazy(() => CandidatesOnJobsCreateOrConnectWithoutJobInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CandidatesOnJobsCreateManyJobInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CandidatesOnJobsWhereUniqueInputSchema),z.lazy(() => CandidatesOnJobsWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ShortListedUncheckedCreateNestedManyWithoutJobInputSchema: z.ZodType<Prisma.ShortListedUncheckedCreateNestedManyWithoutJobInput> = z.object({
  create: z.union([ z.lazy(() => ShortListedCreateWithoutJobInputSchema),z.lazy(() => ShortListedCreateWithoutJobInputSchema).array(),z.lazy(() => ShortListedUncheckedCreateWithoutJobInputSchema),z.lazy(() => ShortListedUncheckedCreateWithoutJobInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ShortListedCreateOrConnectWithoutJobInputSchema),z.lazy(() => ShortListedCreateOrConnectWithoutJobInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ShortListedCreateManyJobInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ShortListedWhereUniqueInputSchema),z.lazy(() => ShortListedWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const NullableEnumJobTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableEnumJobTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => JobTypeSchema).optional().nullable()
}).strict();

export const NullableEnumShiftTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableEnumShiftTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => ShiftTypeSchema).optional().nullable()
}).strict();

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional().nullable()
}).strict();

export const DepartmentUpdateOneRequiredWithoutJobNestedInputSchema: z.ZodType<Prisma.DepartmentUpdateOneRequiredWithoutJobNestedInput> = z.object({
  create: z.union([ z.lazy(() => DepartmentCreateWithoutJobInputSchema),z.lazy(() => DepartmentUncheckedCreateWithoutJobInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DepartmentCreateOrConnectWithoutJobInputSchema).optional(),
  upsert: z.lazy(() => DepartmentUpsertWithoutJobInputSchema).optional(),
  connect: z.lazy(() => DepartmentWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => DepartmentUpdateToOneWithWhereWithoutJobInputSchema),z.lazy(() => DepartmentUpdateWithoutJobInputSchema),z.lazy(() => DepartmentUncheckedUpdateWithoutJobInputSchema) ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutJobNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutJobNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutJobInputSchema),z.lazy(() => UserUncheckedCreateWithoutJobInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutJobInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutJobInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutJobInputSchema),z.lazy(() => UserUpdateWithoutJobInputSchema),z.lazy(() => UserUncheckedUpdateWithoutJobInputSchema) ]).optional(),
}).strict();

export const JobsAndResumesUpdateManyWithoutJobNestedInputSchema: z.ZodType<Prisma.JobsAndResumesUpdateManyWithoutJobNestedInput> = z.object({
  create: z.union([ z.lazy(() => JobsAndResumesCreateWithoutJobInputSchema),z.lazy(() => JobsAndResumesCreateWithoutJobInputSchema).array(),z.lazy(() => JobsAndResumesUncheckedCreateWithoutJobInputSchema),z.lazy(() => JobsAndResumesUncheckedCreateWithoutJobInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => JobsAndResumesCreateOrConnectWithoutJobInputSchema),z.lazy(() => JobsAndResumesCreateOrConnectWithoutJobInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => JobsAndResumesUpsertWithWhereUniqueWithoutJobInputSchema),z.lazy(() => JobsAndResumesUpsertWithWhereUniqueWithoutJobInputSchema).array() ]).optional(),
  createMany: z.lazy(() => JobsAndResumesCreateManyJobInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => JobsAndResumesWhereUniqueInputSchema),z.lazy(() => JobsAndResumesWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => JobsAndResumesWhereUniqueInputSchema),z.lazy(() => JobsAndResumesWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => JobsAndResumesWhereUniqueInputSchema),z.lazy(() => JobsAndResumesWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => JobsAndResumesWhereUniqueInputSchema),z.lazy(() => JobsAndResumesWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => JobsAndResumesUpdateWithWhereUniqueWithoutJobInputSchema),z.lazy(() => JobsAndResumesUpdateWithWhereUniqueWithoutJobInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => JobsAndResumesUpdateManyWithWhereWithoutJobInputSchema),z.lazy(() => JobsAndResumesUpdateManyWithWhereWithoutJobInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => JobsAndResumesScalarWhereInputSchema),z.lazy(() => JobsAndResumesScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CandidatesOnJobsUpdateManyWithoutJobNestedInputSchema: z.ZodType<Prisma.CandidatesOnJobsUpdateManyWithoutJobNestedInput> = z.object({
  create: z.union([ z.lazy(() => CandidatesOnJobsCreateWithoutJobInputSchema),z.lazy(() => CandidatesOnJobsCreateWithoutJobInputSchema).array(),z.lazy(() => CandidatesOnJobsUncheckedCreateWithoutJobInputSchema),z.lazy(() => CandidatesOnJobsUncheckedCreateWithoutJobInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CandidatesOnJobsCreateOrConnectWithoutJobInputSchema),z.lazy(() => CandidatesOnJobsCreateOrConnectWithoutJobInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CandidatesOnJobsUpsertWithWhereUniqueWithoutJobInputSchema),z.lazy(() => CandidatesOnJobsUpsertWithWhereUniqueWithoutJobInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CandidatesOnJobsCreateManyJobInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CandidatesOnJobsWhereUniqueInputSchema),z.lazy(() => CandidatesOnJobsWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CandidatesOnJobsWhereUniqueInputSchema),z.lazy(() => CandidatesOnJobsWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CandidatesOnJobsWhereUniqueInputSchema),z.lazy(() => CandidatesOnJobsWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CandidatesOnJobsWhereUniqueInputSchema),z.lazy(() => CandidatesOnJobsWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CandidatesOnJobsUpdateWithWhereUniqueWithoutJobInputSchema),z.lazy(() => CandidatesOnJobsUpdateWithWhereUniqueWithoutJobInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CandidatesOnJobsUpdateManyWithWhereWithoutJobInputSchema),z.lazy(() => CandidatesOnJobsUpdateManyWithWhereWithoutJobInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CandidatesOnJobsScalarWhereInputSchema),z.lazy(() => CandidatesOnJobsScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ShortListedUpdateManyWithoutJobNestedInputSchema: z.ZodType<Prisma.ShortListedUpdateManyWithoutJobNestedInput> = z.object({
  create: z.union([ z.lazy(() => ShortListedCreateWithoutJobInputSchema),z.lazy(() => ShortListedCreateWithoutJobInputSchema).array(),z.lazy(() => ShortListedUncheckedCreateWithoutJobInputSchema),z.lazy(() => ShortListedUncheckedCreateWithoutJobInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ShortListedCreateOrConnectWithoutJobInputSchema),z.lazy(() => ShortListedCreateOrConnectWithoutJobInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ShortListedUpsertWithWhereUniqueWithoutJobInputSchema),z.lazy(() => ShortListedUpsertWithWhereUniqueWithoutJobInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ShortListedCreateManyJobInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ShortListedWhereUniqueInputSchema),z.lazy(() => ShortListedWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ShortListedWhereUniqueInputSchema),z.lazy(() => ShortListedWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ShortListedWhereUniqueInputSchema),z.lazy(() => ShortListedWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ShortListedWhereUniqueInputSchema),z.lazy(() => ShortListedWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ShortListedUpdateWithWhereUniqueWithoutJobInputSchema),z.lazy(() => ShortListedUpdateWithWhereUniqueWithoutJobInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ShortListedUpdateManyWithWhereWithoutJobInputSchema),z.lazy(() => ShortListedUpdateManyWithWhereWithoutJobInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ShortListedScalarWhereInputSchema),z.lazy(() => ShortListedScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const JobsAndResumesUncheckedUpdateManyWithoutJobNestedInputSchema: z.ZodType<Prisma.JobsAndResumesUncheckedUpdateManyWithoutJobNestedInput> = z.object({
  create: z.union([ z.lazy(() => JobsAndResumesCreateWithoutJobInputSchema),z.lazy(() => JobsAndResumesCreateWithoutJobInputSchema).array(),z.lazy(() => JobsAndResumesUncheckedCreateWithoutJobInputSchema),z.lazy(() => JobsAndResumesUncheckedCreateWithoutJobInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => JobsAndResumesCreateOrConnectWithoutJobInputSchema),z.lazy(() => JobsAndResumesCreateOrConnectWithoutJobInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => JobsAndResumesUpsertWithWhereUniqueWithoutJobInputSchema),z.lazy(() => JobsAndResumesUpsertWithWhereUniqueWithoutJobInputSchema).array() ]).optional(),
  createMany: z.lazy(() => JobsAndResumesCreateManyJobInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => JobsAndResumesWhereUniqueInputSchema),z.lazy(() => JobsAndResumesWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => JobsAndResumesWhereUniqueInputSchema),z.lazy(() => JobsAndResumesWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => JobsAndResumesWhereUniqueInputSchema),z.lazy(() => JobsAndResumesWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => JobsAndResumesWhereUniqueInputSchema),z.lazy(() => JobsAndResumesWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => JobsAndResumesUpdateWithWhereUniqueWithoutJobInputSchema),z.lazy(() => JobsAndResumesUpdateWithWhereUniqueWithoutJobInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => JobsAndResumesUpdateManyWithWhereWithoutJobInputSchema),z.lazy(() => JobsAndResumesUpdateManyWithWhereWithoutJobInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => JobsAndResumesScalarWhereInputSchema),z.lazy(() => JobsAndResumesScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CandidatesOnJobsUncheckedUpdateManyWithoutJobNestedInputSchema: z.ZodType<Prisma.CandidatesOnJobsUncheckedUpdateManyWithoutJobNestedInput> = z.object({
  create: z.union([ z.lazy(() => CandidatesOnJobsCreateWithoutJobInputSchema),z.lazy(() => CandidatesOnJobsCreateWithoutJobInputSchema).array(),z.lazy(() => CandidatesOnJobsUncheckedCreateWithoutJobInputSchema),z.lazy(() => CandidatesOnJobsUncheckedCreateWithoutJobInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CandidatesOnJobsCreateOrConnectWithoutJobInputSchema),z.lazy(() => CandidatesOnJobsCreateOrConnectWithoutJobInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CandidatesOnJobsUpsertWithWhereUniqueWithoutJobInputSchema),z.lazy(() => CandidatesOnJobsUpsertWithWhereUniqueWithoutJobInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CandidatesOnJobsCreateManyJobInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CandidatesOnJobsWhereUniqueInputSchema),z.lazy(() => CandidatesOnJobsWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CandidatesOnJobsWhereUniqueInputSchema),z.lazy(() => CandidatesOnJobsWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CandidatesOnJobsWhereUniqueInputSchema),z.lazy(() => CandidatesOnJobsWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CandidatesOnJobsWhereUniqueInputSchema),z.lazy(() => CandidatesOnJobsWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CandidatesOnJobsUpdateWithWhereUniqueWithoutJobInputSchema),z.lazy(() => CandidatesOnJobsUpdateWithWhereUniqueWithoutJobInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CandidatesOnJobsUpdateManyWithWhereWithoutJobInputSchema),z.lazy(() => CandidatesOnJobsUpdateManyWithWhereWithoutJobInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CandidatesOnJobsScalarWhereInputSchema),z.lazy(() => CandidatesOnJobsScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ShortListedUncheckedUpdateManyWithoutJobNestedInputSchema: z.ZodType<Prisma.ShortListedUncheckedUpdateManyWithoutJobNestedInput> = z.object({
  create: z.union([ z.lazy(() => ShortListedCreateWithoutJobInputSchema),z.lazy(() => ShortListedCreateWithoutJobInputSchema).array(),z.lazy(() => ShortListedUncheckedCreateWithoutJobInputSchema),z.lazy(() => ShortListedUncheckedCreateWithoutJobInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ShortListedCreateOrConnectWithoutJobInputSchema),z.lazy(() => ShortListedCreateOrConnectWithoutJobInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ShortListedUpsertWithWhereUniqueWithoutJobInputSchema),z.lazy(() => ShortListedUpsertWithWhereUniqueWithoutJobInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ShortListedCreateManyJobInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ShortListedWhereUniqueInputSchema),z.lazy(() => ShortListedWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ShortListedWhereUniqueInputSchema),z.lazy(() => ShortListedWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ShortListedWhereUniqueInputSchema),z.lazy(() => ShortListedWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ShortListedWhereUniqueInputSchema),z.lazy(() => ShortListedWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ShortListedUpdateWithWhereUniqueWithoutJobInputSchema),z.lazy(() => ShortListedUpdateWithWhereUniqueWithoutJobInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ShortListedUpdateManyWithWhereWithoutJobInputSchema),z.lazy(() => ShortListedUpdateManyWithWhereWithoutJobInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ShortListedScalarWhereInputSchema),z.lazy(() => ShortListedScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const JobCreateNestedManyWithoutDepartmentInputSchema: z.ZodType<Prisma.JobCreateNestedManyWithoutDepartmentInput> = z.object({
  create: z.union([ z.lazy(() => JobCreateWithoutDepartmentInputSchema),z.lazy(() => JobCreateWithoutDepartmentInputSchema).array(),z.lazy(() => JobUncheckedCreateWithoutDepartmentInputSchema),z.lazy(() => JobUncheckedCreateWithoutDepartmentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => JobCreateOrConnectWithoutDepartmentInputSchema),z.lazy(() => JobCreateOrConnectWithoutDepartmentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => JobCreateManyDepartmentInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => JobWhereUniqueInputSchema),z.lazy(() => JobWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutDepartmentsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutDepartmentsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutDepartmentsInputSchema),z.lazy(() => UserUncheckedCreateWithoutDepartmentsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutDepartmentsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const JobUncheckedCreateNestedManyWithoutDepartmentInputSchema: z.ZodType<Prisma.JobUncheckedCreateNestedManyWithoutDepartmentInput> = z.object({
  create: z.union([ z.lazy(() => JobCreateWithoutDepartmentInputSchema),z.lazy(() => JobCreateWithoutDepartmentInputSchema).array(),z.lazy(() => JobUncheckedCreateWithoutDepartmentInputSchema),z.lazy(() => JobUncheckedCreateWithoutDepartmentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => JobCreateOrConnectWithoutDepartmentInputSchema),z.lazy(() => JobCreateOrConnectWithoutDepartmentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => JobCreateManyDepartmentInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => JobWhereUniqueInputSchema),z.lazy(() => JobWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional()
}).strict();

export const JobUpdateManyWithoutDepartmentNestedInputSchema: z.ZodType<Prisma.JobUpdateManyWithoutDepartmentNestedInput> = z.object({
  create: z.union([ z.lazy(() => JobCreateWithoutDepartmentInputSchema),z.lazy(() => JobCreateWithoutDepartmentInputSchema).array(),z.lazy(() => JobUncheckedCreateWithoutDepartmentInputSchema),z.lazy(() => JobUncheckedCreateWithoutDepartmentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => JobCreateOrConnectWithoutDepartmentInputSchema),z.lazy(() => JobCreateOrConnectWithoutDepartmentInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => JobUpsertWithWhereUniqueWithoutDepartmentInputSchema),z.lazy(() => JobUpsertWithWhereUniqueWithoutDepartmentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => JobCreateManyDepartmentInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => JobWhereUniqueInputSchema),z.lazy(() => JobWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => JobWhereUniqueInputSchema),z.lazy(() => JobWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => JobWhereUniqueInputSchema),z.lazy(() => JobWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => JobWhereUniqueInputSchema),z.lazy(() => JobWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => JobUpdateWithWhereUniqueWithoutDepartmentInputSchema),z.lazy(() => JobUpdateWithWhereUniqueWithoutDepartmentInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => JobUpdateManyWithWhereWithoutDepartmentInputSchema),z.lazy(() => JobUpdateManyWithWhereWithoutDepartmentInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => JobScalarWhereInputSchema),z.lazy(() => JobScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutDepartmentsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutDepartmentsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutDepartmentsInputSchema),z.lazy(() => UserUncheckedCreateWithoutDepartmentsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutDepartmentsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutDepartmentsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutDepartmentsInputSchema),z.lazy(() => UserUpdateWithoutDepartmentsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutDepartmentsInputSchema) ]).optional(),
}).strict();

export const JobUncheckedUpdateManyWithoutDepartmentNestedInputSchema: z.ZodType<Prisma.JobUncheckedUpdateManyWithoutDepartmentNestedInput> = z.object({
  create: z.union([ z.lazy(() => JobCreateWithoutDepartmentInputSchema),z.lazy(() => JobCreateWithoutDepartmentInputSchema).array(),z.lazy(() => JobUncheckedCreateWithoutDepartmentInputSchema),z.lazy(() => JobUncheckedCreateWithoutDepartmentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => JobCreateOrConnectWithoutDepartmentInputSchema),z.lazy(() => JobCreateOrConnectWithoutDepartmentInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => JobUpsertWithWhereUniqueWithoutDepartmentInputSchema),z.lazy(() => JobUpsertWithWhereUniqueWithoutDepartmentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => JobCreateManyDepartmentInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => JobWhereUniqueInputSchema),z.lazy(() => JobWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => JobWhereUniqueInputSchema),z.lazy(() => JobWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => JobWhereUniqueInputSchema),z.lazy(() => JobWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => JobWhereUniqueInputSchema),z.lazy(() => JobWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => JobUpdateWithWhereUniqueWithoutDepartmentInputSchema),z.lazy(() => JobUpdateWithWhereUniqueWithoutDepartmentInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => JobUpdateManyWithWhereWithoutDepartmentInputSchema),z.lazy(() => JobUpdateManyWithWhereWithoutDepartmentInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => JobScalarWhereInputSchema),z.lazy(() => JobScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ResumeCreateNestedManyWithoutCandidateInputSchema: z.ZodType<Prisma.ResumeCreateNestedManyWithoutCandidateInput> = z.object({
  create: z.union([ z.lazy(() => ResumeCreateWithoutCandidateInputSchema),z.lazy(() => ResumeCreateWithoutCandidateInputSchema).array(),z.lazy(() => ResumeUncheckedCreateWithoutCandidateInputSchema),z.lazy(() => ResumeUncheckedCreateWithoutCandidateInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResumeCreateOrConnectWithoutCandidateInputSchema),z.lazy(() => ResumeCreateOrConnectWithoutCandidateInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResumeCreateManyCandidateInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ResumeWhereUniqueInputSchema),z.lazy(() => ResumeWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CandidatesOnJobsCreateNestedManyWithoutCandidateInputSchema: z.ZodType<Prisma.CandidatesOnJobsCreateNestedManyWithoutCandidateInput> = z.object({
  create: z.union([ z.lazy(() => CandidatesOnJobsCreateWithoutCandidateInputSchema),z.lazy(() => CandidatesOnJobsCreateWithoutCandidateInputSchema).array(),z.lazy(() => CandidatesOnJobsUncheckedCreateWithoutCandidateInputSchema),z.lazy(() => CandidatesOnJobsUncheckedCreateWithoutCandidateInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CandidatesOnJobsCreateOrConnectWithoutCandidateInputSchema),z.lazy(() => CandidatesOnJobsCreateOrConnectWithoutCandidateInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CandidatesOnJobsCreateManyCandidateInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CandidatesOnJobsWhereUniqueInputSchema),z.lazy(() => CandidatesOnJobsWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ShortListedCreateNestedManyWithoutCandidateInputSchema: z.ZodType<Prisma.ShortListedCreateNestedManyWithoutCandidateInput> = z.object({
  create: z.union([ z.lazy(() => ShortListedCreateWithoutCandidateInputSchema),z.lazy(() => ShortListedCreateWithoutCandidateInputSchema).array(),z.lazy(() => ShortListedUncheckedCreateWithoutCandidateInputSchema),z.lazy(() => ShortListedUncheckedCreateWithoutCandidateInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ShortListedCreateOrConnectWithoutCandidateInputSchema),z.lazy(() => ShortListedCreateOrConnectWithoutCandidateInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ShortListedCreateManyCandidateInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ShortListedWhereUniqueInputSchema),z.lazy(() => ShortListedWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ResumeUncheckedCreateNestedManyWithoutCandidateInputSchema: z.ZodType<Prisma.ResumeUncheckedCreateNestedManyWithoutCandidateInput> = z.object({
  create: z.union([ z.lazy(() => ResumeCreateWithoutCandidateInputSchema),z.lazy(() => ResumeCreateWithoutCandidateInputSchema).array(),z.lazy(() => ResumeUncheckedCreateWithoutCandidateInputSchema),z.lazy(() => ResumeUncheckedCreateWithoutCandidateInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResumeCreateOrConnectWithoutCandidateInputSchema),z.lazy(() => ResumeCreateOrConnectWithoutCandidateInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResumeCreateManyCandidateInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ResumeWhereUniqueInputSchema),z.lazy(() => ResumeWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CandidatesOnJobsUncheckedCreateNestedManyWithoutCandidateInputSchema: z.ZodType<Prisma.CandidatesOnJobsUncheckedCreateNestedManyWithoutCandidateInput> = z.object({
  create: z.union([ z.lazy(() => CandidatesOnJobsCreateWithoutCandidateInputSchema),z.lazy(() => CandidatesOnJobsCreateWithoutCandidateInputSchema).array(),z.lazy(() => CandidatesOnJobsUncheckedCreateWithoutCandidateInputSchema),z.lazy(() => CandidatesOnJobsUncheckedCreateWithoutCandidateInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CandidatesOnJobsCreateOrConnectWithoutCandidateInputSchema),z.lazy(() => CandidatesOnJobsCreateOrConnectWithoutCandidateInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CandidatesOnJobsCreateManyCandidateInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CandidatesOnJobsWhereUniqueInputSchema),z.lazy(() => CandidatesOnJobsWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ShortListedUncheckedCreateNestedManyWithoutCandidateInputSchema: z.ZodType<Prisma.ShortListedUncheckedCreateNestedManyWithoutCandidateInput> = z.object({
  create: z.union([ z.lazy(() => ShortListedCreateWithoutCandidateInputSchema),z.lazy(() => ShortListedCreateWithoutCandidateInputSchema).array(),z.lazy(() => ShortListedUncheckedCreateWithoutCandidateInputSchema),z.lazy(() => ShortListedUncheckedCreateWithoutCandidateInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ShortListedCreateOrConnectWithoutCandidateInputSchema),z.lazy(() => ShortListedCreateOrConnectWithoutCandidateInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ShortListedCreateManyCandidateInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ShortListedWhereUniqueInputSchema),z.lazy(() => ShortListedWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const NullableIntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableIntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const NullableEnumGenderFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableEnumGenderFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => GenderSchema).optional().nullable()
}).strict();

export const ResumeUpdateManyWithoutCandidateNestedInputSchema: z.ZodType<Prisma.ResumeUpdateManyWithoutCandidateNestedInput> = z.object({
  create: z.union([ z.lazy(() => ResumeCreateWithoutCandidateInputSchema),z.lazy(() => ResumeCreateWithoutCandidateInputSchema).array(),z.lazy(() => ResumeUncheckedCreateWithoutCandidateInputSchema),z.lazy(() => ResumeUncheckedCreateWithoutCandidateInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResumeCreateOrConnectWithoutCandidateInputSchema),z.lazy(() => ResumeCreateOrConnectWithoutCandidateInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ResumeUpsertWithWhereUniqueWithoutCandidateInputSchema),z.lazy(() => ResumeUpsertWithWhereUniqueWithoutCandidateInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResumeCreateManyCandidateInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ResumeWhereUniqueInputSchema),z.lazy(() => ResumeWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ResumeWhereUniqueInputSchema),z.lazy(() => ResumeWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ResumeWhereUniqueInputSchema),z.lazy(() => ResumeWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ResumeWhereUniqueInputSchema),z.lazy(() => ResumeWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ResumeUpdateWithWhereUniqueWithoutCandidateInputSchema),z.lazy(() => ResumeUpdateWithWhereUniqueWithoutCandidateInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ResumeUpdateManyWithWhereWithoutCandidateInputSchema),z.lazy(() => ResumeUpdateManyWithWhereWithoutCandidateInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ResumeScalarWhereInputSchema),z.lazy(() => ResumeScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CandidatesOnJobsUpdateManyWithoutCandidateNestedInputSchema: z.ZodType<Prisma.CandidatesOnJobsUpdateManyWithoutCandidateNestedInput> = z.object({
  create: z.union([ z.lazy(() => CandidatesOnJobsCreateWithoutCandidateInputSchema),z.lazy(() => CandidatesOnJobsCreateWithoutCandidateInputSchema).array(),z.lazy(() => CandidatesOnJobsUncheckedCreateWithoutCandidateInputSchema),z.lazy(() => CandidatesOnJobsUncheckedCreateWithoutCandidateInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CandidatesOnJobsCreateOrConnectWithoutCandidateInputSchema),z.lazy(() => CandidatesOnJobsCreateOrConnectWithoutCandidateInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CandidatesOnJobsUpsertWithWhereUniqueWithoutCandidateInputSchema),z.lazy(() => CandidatesOnJobsUpsertWithWhereUniqueWithoutCandidateInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CandidatesOnJobsCreateManyCandidateInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CandidatesOnJobsWhereUniqueInputSchema),z.lazy(() => CandidatesOnJobsWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CandidatesOnJobsWhereUniqueInputSchema),z.lazy(() => CandidatesOnJobsWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CandidatesOnJobsWhereUniqueInputSchema),z.lazy(() => CandidatesOnJobsWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CandidatesOnJobsWhereUniqueInputSchema),z.lazy(() => CandidatesOnJobsWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CandidatesOnJobsUpdateWithWhereUniqueWithoutCandidateInputSchema),z.lazy(() => CandidatesOnJobsUpdateWithWhereUniqueWithoutCandidateInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CandidatesOnJobsUpdateManyWithWhereWithoutCandidateInputSchema),z.lazy(() => CandidatesOnJobsUpdateManyWithWhereWithoutCandidateInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CandidatesOnJobsScalarWhereInputSchema),z.lazy(() => CandidatesOnJobsScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ShortListedUpdateManyWithoutCandidateNestedInputSchema: z.ZodType<Prisma.ShortListedUpdateManyWithoutCandidateNestedInput> = z.object({
  create: z.union([ z.lazy(() => ShortListedCreateWithoutCandidateInputSchema),z.lazy(() => ShortListedCreateWithoutCandidateInputSchema).array(),z.lazy(() => ShortListedUncheckedCreateWithoutCandidateInputSchema),z.lazy(() => ShortListedUncheckedCreateWithoutCandidateInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ShortListedCreateOrConnectWithoutCandidateInputSchema),z.lazy(() => ShortListedCreateOrConnectWithoutCandidateInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ShortListedUpsertWithWhereUniqueWithoutCandidateInputSchema),z.lazy(() => ShortListedUpsertWithWhereUniqueWithoutCandidateInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ShortListedCreateManyCandidateInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ShortListedWhereUniqueInputSchema),z.lazy(() => ShortListedWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ShortListedWhereUniqueInputSchema),z.lazy(() => ShortListedWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ShortListedWhereUniqueInputSchema),z.lazy(() => ShortListedWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ShortListedWhereUniqueInputSchema),z.lazy(() => ShortListedWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ShortListedUpdateWithWhereUniqueWithoutCandidateInputSchema),z.lazy(() => ShortListedUpdateWithWhereUniqueWithoutCandidateInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ShortListedUpdateManyWithWhereWithoutCandidateInputSchema),z.lazy(() => ShortListedUpdateManyWithWhereWithoutCandidateInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ShortListedScalarWhereInputSchema),z.lazy(() => ShortListedScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ResumeUncheckedUpdateManyWithoutCandidateNestedInputSchema: z.ZodType<Prisma.ResumeUncheckedUpdateManyWithoutCandidateNestedInput> = z.object({
  create: z.union([ z.lazy(() => ResumeCreateWithoutCandidateInputSchema),z.lazy(() => ResumeCreateWithoutCandidateInputSchema).array(),z.lazy(() => ResumeUncheckedCreateWithoutCandidateInputSchema),z.lazy(() => ResumeUncheckedCreateWithoutCandidateInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResumeCreateOrConnectWithoutCandidateInputSchema),z.lazy(() => ResumeCreateOrConnectWithoutCandidateInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ResumeUpsertWithWhereUniqueWithoutCandidateInputSchema),z.lazy(() => ResumeUpsertWithWhereUniqueWithoutCandidateInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResumeCreateManyCandidateInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ResumeWhereUniqueInputSchema),z.lazy(() => ResumeWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ResumeWhereUniqueInputSchema),z.lazy(() => ResumeWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ResumeWhereUniqueInputSchema),z.lazy(() => ResumeWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ResumeWhereUniqueInputSchema),z.lazy(() => ResumeWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ResumeUpdateWithWhereUniqueWithoutCandidateInputSchema),z.lazy(() => ResumeUpdateWithWhereUniqueWithoutCandidateInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ResumeUpdateManyWithWhereWithoutCandidateInputSchema),z.lazy(() => ResumeUpdateManyWithWhereWithoutCandidateInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ResumeScalarWhereInputSchema),z.lazy(() => ResumeScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CandidatesOnJobsUncheckedUpdateManyWithoutCandidateNestedInputSchema: z.ZodType<Prisma.CandidatesOnJobsUncheckedUpdateManyWithoutCandidateNestedInput> = z.object({
  create: z.union([ z.lazy(() => CandidatesOnJobsCreateWithoutCandidateInputSchema),z.lazy(() => CandidatesOnJobsCreateWithoutCandidateInputSchema).array(),z.lazy(() => CandidatesOnJobsUncheckedCreateWithoutCandidateInputSchema),z.lazy(() => CandidatesOnJobsUncheckedCreateWithoutCandidateInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CandidatesOnJobsCreateOrConnectWithoutCandidateInputSchema),z.lazy(() => CandidatesOnJobsCreateOrConnectWithoutCandidateInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CandidatesOnJobsUpsertWithWhereUniqueWithoutCandidateInputSchema),z.lazy(() => CandidatesOnJobsUpsertWithWhereUniqueWithoutCandidateInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CandidatesOnJobsCreateManyCandidateInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CandidatesOnJobsWhereUniqueInputSchema),z.lazy(() => CandidatesOnJobsWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CandidatesOnJobsWhereUniqueInputSchema),z.lazy(() => CandidatesOnJobsWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CandidatesOnJobsWhereUniqueInputSchema),z.lazy(() => CandidatesOnJobsWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CandidatesOnJobsWhereUniqueInputSchema),z.lazy(() => CandidatesOnJobsWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CandidatesOnJobsUpdateWithWhereUniqueWithoutCandidateInputSchema),z.lazy(() => CandidatesOnJobsUpdateWithWhereUniqueWithoutCandidateInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CandidatesOnJobsUpdateManyWithWhereWithoutCandidateInputSchema),z.lazy(() => CandidatesOnJobsUpdateManyWithWhereWithoutCandidateInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CandidatesOnJobsScalarWhereInputSchema),z.lazy(() => CandidatesOnJobsScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ShortListedUncheckedUpdateManyWithoutCandidateNestedInputSchema: z.ZodType<Prisma.ShortListedUncheckedUpdateManyWithoutCandidateNestedInput> = z.object({
  create: z.union([ z.lazy(() => ShortListedCreateWithoutCandidateInputSchema),z.lazy(() => ShortListedCreateWithoutCandidateInputSchema).array(),z.lazy(() => ShortListedUncheckedCreateWithoutCandidateInputSchema),z.lazy(() => ShortListedUncheckedCreateWithoutCandidateInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ShortListedCreateOrConnectWithoutCandidateInputSchema),z.lazy(() => ShortListedCreateOrConnectWithoutCandidateInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ShortListedUpsertWithWhereUniqueWithoutCandidateInputSchema),z.lazy(() => ShortListedUpsertWithWhereUniqueWithoutCandidateInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ShortListedCreateManyCandidateInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ShortListedWhereUniqueInputSchema),z.lazy(() => ShortListedWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ShortListedWhereUniqueInputSchema),z.lazy(() => ShortListedWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ShortListedWhereUniqueInputSchema),z.lazy(() => ShortListedWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ShortListedWhereUniqueInputSchema),z.lazy(() => ShortListedWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ShortListedUpdateWithWhereUniqueWithoutCandidateInputSchema),z.lazy(() => ShortListedUpdateWithWhereUniqueWithoutCandidateInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ShortListedUpdateManyWithWhereWithoutCandidateInputSchema),z.lazy(() => ShortListedUpdateManyWithWhereWithoutCandidateInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ShortListedScalarWhereInputSchema),z.lazy(() => ShortListedScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CandidateCreateNestedOneWithoutJobsInputSchema: z.ZodType<Prisma.CandidateCreateNestedOneWithoutJobsInput> = z.object({
  create: z.union([ z.lazy(() => CandidateCreateWithoutJobsInputSchema),z.lazy(() => CandidateUncheckedCreateWithoutJobsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CandidateCreateOrConnectWithoutJobsInputSchema).optional(),
  connect: z.lazy(() => CandidateWhereUniqueInputSchema).optional()
}).strict();

export const JobCreateNestedOneWithoutCandidatesInputSchema: z.ZodType<Prisma.JobCreateNestedOneWithoutCandidatesInput> = z.object({
  create: z.union([ z.lazy(() => JobCreateWithoutCandidatesInputSchema),z.lazy(() => JobUncheckedCreateWithoutCandidatesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => JobCreateOrConnectWithoutCandidatesInputSchema).optional(),
  connect: z.lazy(() => JobWhereUniqueInputSchema).optional()
}).strict();

export const CandidateUpdateOneRequiredWithoutJobsNestedInputSchema: z.ZodType<Prisma.CandidateUpdateOneRequiredWithoutJobsNestedInput> = z.object({
  create: z.union([ z.lazy(() => CandidateCreateWithoutJobsInputSchema),z.lazy(() => CandidateUncheckedCreateWithoutJobsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CandidateCreateOrConnectWithoutJobsInputSchema).optional(),
  upsert: z.lazy(() => CandidateUpsertWithoutJobsInputSchema).optional(),
  connect: z.lazy(() => CandidateWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CandidateUpdateToOneWithWhereWithoutJobsInputSchema),z.lazy(() => CandidateUpdateWithoutJobsInputSchema),z.lazy(() => CandidateUncheckedUpdateWithoutJobsInputSchema) ]).optional(),
}).strict();

export const JobUpdateOneRequiredWithoutCandidatesNestedInputSchema: z.ZodType<Prisma.JobUpdateOneRequiredWithoutCandidatesNestedInput> = z.object({
  create: z.union([ z.lazy(() => JobCreateWithoutCandidatesInputSchema),z.lazy(() => JobUncheckedCreateWithoutCandidatesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => JobCreateOrConnectWithoutCandidatesInputSchema).optional(),
  upsert: z.lazy(() => JobUpsertWithoutCandidatesInputSchema).optional(),
  connect: z.lazy(() => JobWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => JobUpdateToOneWithWhereWithoutCandidatesInputSchema),z.lazy(() => JobUpdateWithoutCandidatesInputSchema),z.lazy(() => JobUncheckedUpdateWithoutCandidatesInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutShortListedInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutShortListedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutShortListedInputSchema),z.lazy(() => UserUncheckedCreateWithoutShortListedInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutShortListedInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const CandidateCreateNestedOneWithoutShortListedJobsInputSchema: z.ZodType<Prisma.CandidateCreateNestedOneWithoutShortListedJobsInput> = z.object({
  create: z.union([ z.lazy(() => CandidateCreateWithoutShortListedJobsInputSchema),z.lazy(() => CandidateUncheckedCreateWithoutShortListedJobsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CandidateCreateOrConnectWithoutShortListedJobsInputSchema).optional(),
  connect: z.lazy(() => CandidateWhereUniqueInputSchema).optional()
}).strict();

export const JobCreateNestedOneWithoutShortListedCandidatesInputSchema: z.ZodType<Prisma.JobCreateNestedOneWithoutShortListedCandidatesInput> = z.object({
  create: z.union([ z.lazy(() => JobCreateWithoutShortListedCandidatesInputSchema),z.lazy(() => JobUncheckedCreateWithoutShortListedCandidatesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => JobCreateOrConnectWithoutShortListedCandidatesInputSchema).optional(),
  connect: z.lazy(() => JobWhereUniqueInputSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutShortListedNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutShortListedNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutShortListedInputSchema),z.lazy(() => UserUncheckedCreateWithoutShortListedInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutShortListedInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutShortListedInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutShortListedInputSchema),z.lazy(() => UserUpdateWithoutShortListedInputSchema),z.lazy(() => UserUncheckedUpdateWithoutShortListedInputSchema) ]).optional(),
}).strict();

export const CandidateUpdateOneRequiredWithoutShortListedJobsNestedInputSchema: z.ZodType<Prisma.CandidateUpdateOneRequiredWithoutShortListedJobsNestedInput> = z.object({
  create: z.union([ z.lazy(() => CandidateCreateWithoutShortListedJobsInputSchema),z.lazy(() => CandidateUncheckedCreateWithoutShortListedJobsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CandidateCreateOrConnectWithoutShortListedJobsInputSchema).optional(),
  upsert: z.lazy(() => CandidateUpsertWithoutShortListedJobsInputSchema).optional(),
  connect: z.lazy(() => CandidateWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CandidateUpdateToOneWithWhereWithoutShortListedJobsInputSchema),z.lazy(() => CandidateUpdateWithoutShortListedJobsInputSchema),z.lazy(() => CandidateUncheckedUpdateWithoutShortListedJobsInputSchema) ]).optional(),
}).strict();

export const JobUpdateOneRequiredWithoutShortListedCandidatesNestedInputSchema: z.ZodType<Prisma.JobUpdateOneRequiredWithoutShortListedCandidatesNestedInput> = z.object({
  create: z.union([ z.lazy(() => JobCreateWithoutShortListedCandidatesInputSchema),z.lazy(() => JobUncheckedCreateWithoutShortListedCandidatesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => JobCreateOrConnectWithoutShortListedCandidatesInputSchema).optional(),
  upsert: z.lazy(() => JobUpsertWithoutShortListedCandidatesInputSchema).optional(),
  connect: z.lazy(() => JobWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => JobUpdateToOneWithWhereWithoutShortListedCandidatesInputSchema),z.lazy(() => JobUpdateWithoutShortListedCandidatesInputSchema),z.lazy(() => JobUncheckedUpdateWithoutShortListedCandidatesInputSchema) ]).optional(),
}).strict();

export const CandidateCreateNestedOneWithoutResumeInputSchema: z.ZodType<Prisma.CandidateCreateNestedOneWithoutResumeInput> = z.object({
  create: z.union([ z.lazy(() => CandidateCreateWithoutResumeInputSchema),z.lazy(() => CandidateUncheckedCreateWithoutResumeInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CandidateCreateOrConnectWithoutResumeInputSchema).optional(),
  connect: z.lazy(() => CandidateWhereUniqueInputSchema).optional()
}).strict();

export const JobsAndResumesCreateNestedManyWithoutResumeInputSchema: z.ZodType<Prisma.JobsAndResumesCreateNestedManyWithoutResumeInput> = z.object({
  create: z.union([ z.lazy(() => JobsAndResumesCreateWithoutResumeInputSchema),z.lazy(() => JobsAndResumesCreateWithoutResumeInputSchema).array(),z.lazy(() => JobsAndResumesUncheckedCreateWithoutResumeInputSchema),z.lazy(() => JobsAndResumesUncheckedCreateWithoutResumeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => JobsAndResumesCreateOrConnectWithoutResumeInputSchema),z.lazy(() => JobsAndResumesCreateOrConnectWithoutResumeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => JobsAndResumesCreateManyResumeInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => JobsAndResumesWhereUniqueInputSchema),z.lazy(() => JobsAndResumesWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutOwnedResumesInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutOwnedResumesInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutOwnedResumesInputSchema),z.lazy(() => UserUncheckedCreateWithoutOwnedResumesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutOwnedResumesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const JobsAndResumesUncheckedCreateNestedManyWithoutResumeInputSchema: z.ZodType<Prisma.JobsAndResumesUncheckedCreateNestedManyWithoutResumeInput> = z.object({
  create: z.union([ z.lazy(() => JobsAndResumesCreateWithoutResumeInputSchema),z.lazy(() => JobsAndResumesCreateWithoutResumeInputSchema).array(),z.lazy(() => JobsAndResumesUncheckedCreateWithoutResumeInputSchema),z.lazy(() => JobsAndResumesUncheckedCreateWithoutResumeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => JobsAndResumesCreateOrConnectWithoutResumeInputSchema),z.lazy(() => JobsAndResumesCreateOrConnectWithoutResumeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => JobsAndResumesCreateManyResumeInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => JobsAndResumesWhereUniqueInputSchema),z.lazy(() => JobsAndResumesWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CandidateUpdateOneWithoutResumeNestedInputSchema: z.ZodType<Prisma.CandidateUpdateOneWithoutResumeNestedInput> = z.object({
  create: z.union([ z.lazy(() => CandidateCreateWithoutResumeInputSchema),z.lazy(() => CandidateUncheckedCreateWithoutResumeInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CandidateCreateOrConnectWithoutResumeInputSchema).optional(),
  upsert: z.lazy(() => CandidateUpsertWithoutResumeInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => CandidateWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => CandidateWhereInputSchema) ]).optional(),
  connect: z.lazy(() => CandidateWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CandidateUpdateToOneWithWhereWithoutResumeInputSchema),z.lazy(() => CandidateUpdateWithoutResumeInputSchema),z.lazy(() => CandidateUncheckedUpdateWithoutResumeInputSchema) ]).optional(),
}).strict();

export const JobsAndResumesUpdateManyWithoutResumeNestedInputSchema: z.ZodType<Prisma.JobsAndResumesUpdateManyWithoutResumeNestedInput> = z.object({
  create: z.union([ z.lazy(() => JobsAndResumesCreateWithoutResumeInputSchema),z.lazy(() => JobsAndResumesCreateWithoutResumeInputSchema).array(),z.lazy(() => JobsAndResumesUncheckedCreateWithoutResumeInputSchema),z.lazy(() => JobsAndResumesUncheckedCreateWithoutResumeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => JobsAndResumesCreateOrConnectWithoutResumeInputSchema),z.lazy(() => JobsAndResumesCreateOrConnectWithoutResumeInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => JobsAndResumesUpsertWithWhereUniqueWithoutResumeInputSchema),z.lazy(() => JobsAndResumesUpsertWithWhereUniqueWithoutResumeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => JobsAndResumesCreateManyResumeInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => JobsAndResumesWhereUniqueInputSchema),z.lazy(() => JobsAndResumesWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => JobsAndResumesWhereUniqueInputSchema),z.lazy(() => JobsAndResumesWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => JobsAndResumesWhereUniqueInputSchema),z.lazy(() => JobsAndResumesWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => JobsAndResumesWhereUniqueInputSchema),z.lazy(() => JobsAndResumesWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => JobsAndResumesUpdateWithWhereUniqueWithoutResumeInputSchema),z.lazy(() => JobsAndResumesUpdateWithWhereUniqueWithoutResumeInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => JobsAndResumesUpdateManyWithWhereWithoutResumeInputSchema),z.lazy(() => JobsAndResumesUpdateManyWithWhereWithoutResumeInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => JobsAndResumesScalarWhereInputSchema),z.lazy(() => JobsAndResumesScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserUpdateOneWithoutOwnedResumesNestedInputSchema: z.ZodType<Prisma.UserUpdateOneWithoutOwnedResumesNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutOwnedResumesInputSchema),z.lazy(() => UserUncheckedCreateWithoutOwnedResumesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutOwnedResumesInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutOwnedResumesInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutOwnedResumesInputSchema),z.lazy(() => UserUpdateWithoutOwnedResumesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutOwnedResumesInputSchema) ]).optional(),
}).strict();

export const JobsAndResumesUncheckedUpdateManyWithoutResumeNestedInputSchema: z.ZodType<Prisma.JobsAndResumesUncheckedUpdateManyWithoutResumeNestedInput> = z.object({
  create: z.union([ z.lazy(() => JobsAndResumesCreateWithoutResumeInputSchema),z.lazy(() => JobsAndResumesCreateWithoutResumeInputSchema).array(),z.lazy(() => JobsAndResumesUncheckedCreateWithoutResumeInputSchema),z.lazy(() => JobsAndResumesUncheckedCreateWithoutResumeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => JobsAndResumesCreateOrConnectWithoutResumeInputSchema),z.lazy(() => JobsAndResumesCreateOrConnectWithoutResumeInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => JobsAndResumesUpsertWithWhereUniqueWithoutResumeInputSchema),z.lazy(() => JobsAndResumesUpsertWithWhereUniqueWithoutResumeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => JobsAndResumesCreateManyResumeInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => JobsAndResumesWhereUniqueInputSchema),z.lazy(() => JobsAndResumesWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => JobsAndResumesWhereUniqueInputSchema),z.lazy(() => JobsAndResumesWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => JobsAndResumesWhereUniqueInputSchema),z.lazy(() => JobsAndResumesWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => JobsAndResumesWhereUniqueInputSchema),z.lazy(() => JobsAndResumesWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => JobsAndResumesUpdateWithWhereUniqueWithoutResumeInputSchema),z.lazy(() => JobsAndResumesUpdateWithWhereUniqueWithoutResumeInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => JobsAndResumesUpdateManyWithWhereWithoutResumeInputSchema),z.lazy(() => JobsAndResumesUpdateManyWithWhereWithoutResumeInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => JobsAndResumesScalarWhereInputSchema),z.lazy(() => JobsAndResumesScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const JobCreateNestedOneWithoutResumesInputSchema: z.ZodType<Prisma.JobCreateNestedOneWithoutResumesInput> = z.object({
  create: z.union([ z.lazy(() => JobCreateWithoutResumesInputSchema),z.lazy(() => JobUncheckedCreateWithoutResumesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => JobCreateOrConnectWithoutResumesInputSchema).optional(),
  connect: z.lazy(() => JobWhereUniqueInputSchema).optional()
}).strict();

export const ResumeCreateNestedOneWithoutJobsInputSchema: z.ZodType<Prisma.ResumeCreateNestedOneWithoutJobsInput> = z.object({
  create: z.union([ z.lazy(() => ResumeCreateWithoutJobsInputSchema),z.lazy(() => ResumeUncheckedCreateWithoutJobsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ResumeCreateOrConnectWithoutJobsInputSchema).optional(),
  connect: z.lazy(() => ResumeWhereUniqueInputSchema).optional()
}).strict();

export const JobUpdateOneRequiredWithoutResumesNestedInputSchema: z.ZodType<Prisma.JobUpdateOneRequiredWithoutResumesNestedInput> = z.object({
  create: z.union([ z.lazy(() => JobCreateWithoutResumesInputSchema),z.lazy(() => JobUncheckedCreateWithoutResumesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => JobCreateOrConnectWithoutResumesInputSchema).optional(),
  upsert: z.lazy(() => JobUpsertWithoutResumesInputSchema).optional(),
  connect: z.lazy(() => JobWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => JobUpdateToOneWithWhereWithoutResumesInputSchema),z.lazy(() => JobUpdateWithoutResumesInputSchema),z.lazy(() => JobUncheckedUpdateWithoutResumesInputSchema) ]).optional(),
}).strict();

export const ResumeUpdateOneRequiredWithoutJobsNestedInputSchema: z.ZodType<Prisma.ResumeUpdateOneRequiredWithoutJobsNestedInput> = z.object({
  create: z.union([ z.lazy(() => ResumeCreateWithoutJobsInputSchema),z.lazy(() => ResumeUncheckedCreateWithoutJobsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ResumeCreateOrConnectWithoutJobsInputSchema).optional(),
  upsert: z.lazy(() => ResumeUpsertWithoutJobsInputSchema).optional(),
  connect: z.lazy(() => ResumeWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ResumeUpdateToOneWithWhereWithoutJobsInputSchema),z.lazy(() => ResumeUpdateWithoutJobsInputSchema),z.lazy(() => ResumeUncheckedUpdateWithoutJobsInputSchema) ]).optional(),
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedEnumRoleNullableFilterSchema: z.ZodType<Prisma.NestedEnumRoleNullableFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional().nullable(),
  in: z.lazy(() => RoleSchema).array().optional().nullable(),
  notIn: z.lazy(() => RoleSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NestedEnumRoleNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedBoolNullableFilterSchema: z.ZodType<Prisma.NestedBoolNullableFilter> = z.object({
  equals: z.boolean().optional().nullable(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedEnumRoleNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumRoleNullableWithAggregatesFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional().nullable(),
  in: z.lazy(() => RoleSchema).array().optional().nullable(),
  notIn: z.lazy(() => RoleSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NestedEnumRoleNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumRoleNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumRoleNullableFilterSchema).optional()
}).strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedBoolNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolNullableWithAggregatesFilter> = z.object({
  equals: z.boolean().optional().nullable(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolNullableFilterSchema).optional()
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const NestedEnumJobTypeNullableFilterSchema: z.ZodType<Prisma.NestedEnumJobTypeNullableFilter> = z.object({
  equals: z.lazy(() => JobTypeSchema).optional().nullable(),
  in: z.lazy(() => JobTypeSchema).array().optional().nullable(),
  notIn: z.lazy(() => JobTypeSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => JobTypeSchema),z.lazy(() => NestedEnumJobTypeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedEnumShiftTypeNullableFilterSchema: z.ZodType<Prisma.NestedEnumShiftTypeNullableFilter> = z.object({
  equals: z.lazy(() => ShiftTypeSchema).optional().nullable(),
  in: z.lazy(() => ShiftTypeSchema).array().optional().nullable(),
  notIn: z.lazy(() => ShiftTypeSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => ShiftTypeSchema),z.lazy(() => NestedEnumShiftTypeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedEnumJobTypeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumJobTypeNullableWithAggregatesFilter> = z.object({
  equals: z.lazy(() => JobTypeSchema).optional().nullable(),
  in: z.lazy(() => JobTypeSchema).array().optional().nullable(),
  notIn: z.lazy(() => JobTypeSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => JobTypeSchema),z.lazy(() => NestedEnumJobTypeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumJobTypeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumJobTypeNullableFilterSchema).optional()
}).strict();

export const NestedEnumShiftTypeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumShiftTypeNullableWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ShiftTypeSchema).optional().nullable(),
  in: z.lazy(() => ShiftTypeSchema).array().optional().nullable(),
  notIn: z.lazy(() => ShiftTypeSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => ShiftTypeSchema),z.lazy(() => NestedEnumShiftTypeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumShiftTypeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumShiftTypeNullableFilterSchema).optional()
}).strict();

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const NestedEnumGenderNullableFilterSchema: z.ZodType<Prisma.NestedEnumGenderNullableFilter> = z.object({
  equals: z.lazy(() => GenderSchema).optional().nullable(),
  in: z.lazy(() => GenderSchema).array().optional().nullable(),
  notIn: z.lazy(() => GenderSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => GenderSchema),z.lazy(() => NestedEnumGenderNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedIntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional()
}).strict();

export const NestedFloatNullableFilterSchema: z.ZodType<Prisma.NestedFloatNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedEnumGenderNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumGenderNullableWithAggregatesFilter> = z.object({
  equals: z.lazy(() => GenderSchema).optional().nullable(),
  in: z.lazy(() => GenderSchema).array().optional().nullable(),
  notIn: z.lazy(() => GenderSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => GenderSchema),z.lazy(() => NestedEnumGenderNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumGenderNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumGenderNullableFilterSchema).optional()
}).strict();

export const NestedJsonNullableFilterSchema: z.ZodType<Prisma.NestedJsonNullableFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const ProfileCreateWithoutUserInputSchema: z.ZodType<Prisma.ProfileCreateWithoutUserInput> = z.object({
  id: z.string().uuid().optional(),
  firstName: z.string().min(3, {message: "Value cannot be empty"}),
  lastName: z.string().min(3, {message: "Value cannot be empty"}).optional().nullable(),
  address: z.string().min(3, {message: "Value cannot be empty"}).optional().nullable(),
  city: z.string().min(3, {message: "Value cannot be empty"}).optional().nullable(),
  state: z.string().min(3, {message: "Value cannot be empty"}).optional().nullable(),
  country: z.string().min(3, {message: "Value cannot be empty"}).optional().nullable(),
  zipCode: z.string().min(3, {message: "Value cannot be empty"}).optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProfileUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.ProfileUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().uuid().optional(),
  firstName: z.string().min(3, {message: "Value cannot be empty"}),
  lastName: z.string().min(3, {message: "Value cannot be empty"}).optional().nullable(),
  address: z.string().min(3, {message: "Value cannot be empty"}).optional().nullable(),
  city: z.string().min(3, {message: "Value cannot be empty"}).optional().nullable(),
  state: z.string().min(3, {message: "Value cannot be empty"}).optional().nullable(),
  country: z.string().min(3, {message: "Value cannot be empty"}).optional().nullable(),
  zipCode: z.string().min(3, {message: "Value cannot be empty"}).optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ProfileCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.ProfileCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => ProfileWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProfileCreateWithoutUserInputSchema),z.lazy(() => ProfileUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const JobCreateWithoutCreatedByInputSchema: z.ZodType<Prisma.JobCreateWithoutCreatedByInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, {message: "Title cannot be empty"}),
  description: z.string().optional().nullable(),
  jobType: z.lazy(() => JobTypeSchema).optional().nullable(),
  location: z.string().optional().nullable(),
  shiftType: z.lazy(() => ShiftTypeSchema).optional().nullable(),
  expiryDate: z.coerce.date({invalid_type_error:"Date is invalid"}).optional().nullable(),
  createdAt: z.coerce.date().optional(),
  udpatedAt: z.coerce.date().optional(),
  department: z.lazy(() => DepartmentCreateNestedOneWithoutJobInputSchema),
  resumes: z.lazy(() => JobsAndResumesCreateNestedManyWithoutJobInputSchema).optional(),
  candidates: z.lazy(() => CandidatesOnJobsCreateNestedManyWithoutJobInputSchema).optional(),
  shortListedCandidates: z.lazy(() => ShortListedCreateNestedManyWithoutJobInputSchema).optional()
}).strict();

export const JobUncheckedCreateWithoutCreatedByInputSchema: z.ZodType<Prisma.JobUncheckedCreateWithoutCreatedByInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, {message: "Title cannot be empty"}),
  description: z.string().optional().nullable(),
  jobType: z.lazy(() => JobTypeSchema).optional().nullable(),
  departmentId: z.string().min(1, {message: "Department is required"}).uuid({message:"User ID is invalid"}),
  location: z.string().optional().nullable(),
  shiftType: z.lazy(() => ShiftTypeSchema).optional().nullable(),
  expiryDate: z.coerce.date({invalid_type_error:"Date is invalid"}).optional().nullable(),
  createdAt: z.coerce.date().optional(),
  udpatedAt: z.coerce.date().optional(),
  resumes: z.lazy(() => JobsAndResumesUncheckedCreateNestedManyWithoutJobInputSchema).optional(),
  candidates: z.lazy(() => CandidatesOnJobsUncheckedCreateNestedManyWithoutJobInputSchema).optional(),
  shortListedCandidates: z.lazy(() => ShortListedUncheckedCreateNestedManyWithoutJobInputSchema).optional()
}).strict();

export const JobCreateOrConnectWithoutCreatedByInputSchema: z.ZodType<Prisma.JobCreateOrConnectWithoutCreatedByInput> = z.object({
  where: z.lazy(() => JobWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => JobCreateWithoutCreatedByInputSchema),z.lazy(() => JobUncheckedCreateWithoutCreatedByInputSchema) ]),
}).strict();

export const JobCreateManyCreatedByInputEnvelopeSchema: z.ZodType<Prisma.JobCreateManyCreatedByInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => JobCreateManyCreatedByInputSchema),z.lazy(() => JobCreateManyCreatedByInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const DepartmentCreateWithoutCreatedByInputSchema: z.ZodType<Prisma.DepartmentCreateWithoutCreatedByInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, {message: "Title cannot be empty"}),
  description: z.string().optional().nullable(),
  isDeleted: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  udpatedAt: z.coerce.date().optional(),
  job: z.lazy(() => JobCreateNestedManyWithoutDepartmentInputSchema).optional()
}).strict();

export const DepartmentUncheckedCreateWithoutCreatedByInputSchema: z.ZodType<Prisma.DepartmentUncheckedCreateWithoutCreatedByInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, {message: "Title cannot be empty"}),
  description: z.string().optional().nullable(),
  isDeleted: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  udpatedAt: z.coerce.date().optional(),
  job: z.lazy(() => JobUncheckedCreateNestedManyWithoutDepartmentInputSchema).optional()
}).strict();

export const DepartmentCreateOrConnectWithoutCreatedByInputSchema: z.ZodType<Prisma.DepartmentCreateOrConnectWithoutCreatedByInput> = z.object({
  where: z.lazy(() => DepartmentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DepartmentCreateWithoutCreatedByInputSchema),z.lazy(() => DepartmentUncheckedCreateWithoutCreatedByInputSchema) ]),
}).strict();

export const DepartmentCreateManyCreatedByInputEnvelopeSchema: z.ZodType<Prisma.DepartmentCreateManyCreatedByInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => DepartmentCreateManyCreatedByInputSchema),z.lazy(() => DepartmentCreateManyCreatedByInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ShortListedCreateWithoutUserInputSchema: z.ZodType<Prisma.ShortListedCreateWithoutUserInput> = z.object({
  id: z.string().uuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  candidate: z.lazy(() => CandidateCreateNestedOneWithoutShortListedJobsInputSchema),
  job: z.lazy(() => JobCreateNestedOneWithoutShortListedCandidatesInputSchema)
}).strict();

export const ShortListedUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.ShortListedUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().uuid().optional(),
  candidateId: z.string(),
  jobId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ShortListedCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.ShortListedCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => ShortListedWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ShortListedCreateWithoutUserInputSchema),z.lazy(() => ShortListedUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const ShortListedCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.ShortListedCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ShortListedCreateManyUserInputSchema),z.lazy(() => ShortListedCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ResumeCreateWithoutCreatedByInputSchema: z.ZodType<Prisma.ResumeCreateWithoutCreatedByInput> = z.object({
  id: z.string().uuid().optional(),
  fileKey: z.string().uuid({message:"Key is invalid"}),
  path: z.string().optional().nullable(),
  fullPath: z.string().optional().nullable(),
  url: z.string().url({message:"URL is invalid"}),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  candidate: z.lazy(() => CandidateCreateNestedOneWithoutResumeInputSchema).optional(),
  jobs: z.lazy(() => JobsAndResumesCreateNestedManyWithoutResumeInputSchema).optional()
}).strict();

export const ResumeUncheckedCreateWithoutCreatedByInputSchema: z.ZodType<Prisma.ResumeUncheckedCreateWithoutCreatedByInput> = z.object({
  id: z.string().uuid().optional(),
  fileKey: z.string().uuid({message:"Key is invalid"}),
  path: z.string().optional().nullable(),
  fullPath: z.string().optional().nullable(),
  url: z.string().url({message:"URL is invalid"}),
  candidateId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  jobs: z.lazy(() => JobsAndResumesUncheckedCreateNestedManyWithoutResumeInputSchema).optional()
}).strict();

export const ResumeCreateOrConnectWithoutCreatedByInputSchema: z.ZodType<Prisma.ResumeCreateOrConnectWithoutCreatedByInput> = z.object({
  where: z.lazy(() => ResumeWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ResumeCreateWithoutCreatedByInputSchema),z.lazy(() => ResumeUncheckedCreateWithoutCreatedByInputSchema) ]),
}).strict();

export const ResumeCreateManyCreatedByInputEnvelopeSchema: z.ZodType<Prisma.ResumeCreateManyCreatedByInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ResumeCreateManyCreatedByInputSchema),z.lazy(() => ResumeCreateManyCreatedByInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ProfileUpsertWithoutUserInputSchema: z.ZodType<Prisma.ProfileUpsertWithoutUserInput> = z.object({
  update: z.union([ z.lazy(() => ProfileUpdateWithoutUserInputSchema),z.lazy(() => ProfileUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => ProfileCreateWithoutUserInputSchema),z.lazy(() => ProfileUncheckedCreateWithoutUserInputSchema) ]),
  where: z.lazy(() => ProfileWhereInputSchema).optional()
}).strict();

export const ProfileUpdateToOneWithWhereWithoutUserInputSchema: z.ZodType<Prisma.ProfileUpdateToOneWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => ProfileWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ProfileUpdateWithoutUserInputSchema),z.lazy(() => ProfileUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const ProfileUpdateWithoutUserInputSchema: z.ZodType<Prisma.ProfileUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string().min(3, {message: "Value cannot be empty"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string().min(3, {message: "Value cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string().min(3, {message: "Value cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string().min(3, {message: "Value cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  state: z.union([ z.string().min(3, {message: "Value cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  country: z.union([ z.string().min(3, {message: "Value cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  zipCode: z.union([ z.string().min(3, {message: "Value cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProfileUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.ProfileUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string().min(3, {message: "Value cannot be empty"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string().min(3, {message: "Value cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string().min(3, {message: "Value cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string().min(3, {message: "Value cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  state: z.union([ z.string().min(3, {message: "Value cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  country: z.union([ z.string().min(3, {message: "Value cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  zipCode: z.union([ z.string().min(3, {message: "Value cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const JobUpsertWithWhereUniqueWithoutCreatedByInputSchema: z.ZodType<Prisma.JobUpsertWithWhereUniqueWithoutCreatedByInput> = z.object({
  where: z.lazy(() => JobWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => JobUpdateWithoutCreatedByInputSchema),z.lazy(() => JobUncheckedUpdateWithoutCreatedByInputSchema) ]),
  create: z.union([ z.lazy(() => JobCreateWithoutCreatedByInputSchema),z.lazy(() => JobUncheckedCreateWithoutCreatedByInputSchema) ]),
}).strict();

export const JobUpdateWithWhereUniqueWithoutCreatedByInputSchema: z.ZodType<Prisma.JobUpdateWithWhereUniqueWithoutCreatedByInput> = z.object({
  where: z.lazy(() => JobWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => JobUpdateWithoutCreatedByInputSchema),z.lazy(() => JobUncheckedUpdateWithoutCreatedByInputSchema) ]),
}).strict();

export const JobUpdateManyWithWhereWithoutCreatedByInputSchema: z.ZodType<Prisma.JobUpdateManyWithWhereWithoutCreatedByInput> = z.object({
  where: z.lazy(() => JobScalarWhereInputSchema),
  data: z.union([ z.lazy(() => JobUpdateManyMutationInputSchema),z.lazy(() => JobUncheckedUpdateManyWithoutCreatedByInputSchema) ]),
}).strict();

export const JobScalarWhereInputSchema: z.ZodType<Prisma.JobScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => JobScalarWhereInputSchema),z.lazy(() => JobScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => JobScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => JobScalarWhereInputSchema),z.lazy(() => JobScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  jobType: z.union([ z.lazy(() => EnumJobTypeNullableFilterSchema),z.lazy(() => JobTypeSchema) ]).optional().nullable(),
  departmentId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  location: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  shiftType: z.union([ z.lazy(() => EnumShiftTypeNullableFilterSchema),z.lazy(() => ShiftTypeSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  createdById: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  udpatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const DepartmentUpsertWithWhereUniqueWithoutCreatedByInputSchema: z.ZodType<Prisma.DepartmentUpsertWithWhereUniqueWithoutCreatedByInput> = z.object({
  where: z.lazy(() => DepartmentWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => DepartmentUpdateWithoutCreatedByInputSchema),z.lazy(() => DepartmentUncheckedUpdateWithoutCreatedByInputSchema) ]),
  create: z.union([ z.lazy(() => DepartmentCreateWithoutCreatedByInputSchema),z.lazy(() => DepartmentUncheckedCreateWithoutCreatedByInputSchema) ]),
}).strict();

export const DepartmentUpdateWithWhereUniqueWithoutCreatedByInputSchema: z.ZodType<Prisma.DepartmentUpdateWithWhereUniqueWithoutCreatedByInput> = z.object({
  where: z.lazy(() => DepartmentWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => DepartmentUpdateWithoutCreatedByInputSchema),z.lazy(() => DepartmentUncheckedUpdateWithoutCreatedByInputSchema) ]),
}).strict();

export const DepartmentUpdateManyWithWhereWithoutCreatedByInputSchema: z.ZodType<Prisma.DepartmentUpdateManyWithWhereWithoutCreatedByInput> = z.object({
  where: z.lazy(() => DepartmentScalarWhereInputSchema),
  data: z.union([ z.lazy(() => DepartmentUpdateManyMutationInputSchema),z.lazy(() => DepartmentUncheckedUpdateManyWithoutCreatedByInputSchema) ]),
}).strict();

export const DepartmentScalarWhereInputSchema: z.ZodType<Prisma.DepartmentScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => DepartmentScalarWhereInputSchema),z.lazy(() => DepartmentScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DepartmentScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DepartmentScalarWhereInputSchema),z.lazy(() => DepartmentScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  isDeleted: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  createdById: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  udpatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ShortListedUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ShortListedUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => ShortListedWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ShortListedUpdateWithoutUserInputSchema),z.lazy(() => ShortListedUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => ShortListedCreateWithoutUserInputSchema),z.lazy(() => ShortListedUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const ShortListedUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ShortListedUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => ShortListedWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ShortListedUpdateWithoutUserInputSchema),z.lazy(() => ShortListedUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const ShortListedUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.ShortListedUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => ShortListedScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ShortListedUpdateManyMutationInputSchema),z.lazy(() => ShortListedUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const ShortListedScalarWhereInputSchema: z.ZodType<Prisma.ShortListedScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ShortListedScalarWhereInputSchema),z.lazy(() => ShortListedScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ShortListedScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ShortListedScalarWhereInputSchema),z.lazy(() => ShortListedScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  candidateId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  jobId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ResumeUpsertWithWhereUniqueWithoutCreatedByInputSchema: z.ZodType<Prisma.ResumeUpsertWithWhereUniqueWithoutCreatedByInput> = z.object({
  where: z.lazy(() => ResumeWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ResumeUpdateWithoutCreatedByInputSchema),z.lazy(() => ResumeUncheckedUpdateWithoutCreatedByInputSchema) ]),
  create: z.union([ z.lazy(() => ResumeCreateWithoutCreatedByInputSchema),z.lazy(() => ResumeUncheckedCreateWithoutCreatedByInputSchema) ]),
}).strict();

export const ResumeUpdateWithWhereUniqueWithoutCreatedByInputSchema: z.ZodType<Prisma.ResumeUpdateWithWhereUniqueWithoutCreatedByInput> = z.object({
  where: z.lazy(() => ResumeWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ResumeUpdateWithoutCreatedByInputSchema),z.lazy(() => ResumeUncheckedUpdateWithoutCreatedByInputSchema) ]),
}).strict();

export const ResumeUpdateManyWithWhereWithoutCreatedByInputSchema: z.ZodType<Prisma.ResumeUpdateManyWithWhereWithoutCreatedByInput> = z.object({
  where: z.lazy(() => ResumeScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ResumeUpdateManyMutationInputSchema),z.lazy(() => ResumeUncheckedUpdateManyWithoutCreatedByInputSchema) ]),
}).strict();

export const ResumeScalarWhereInputSchema: z.ZodType<Prisma.ResumeScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ResumeScalarWhereInputSchema),z.lazy(() => ResumeScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ResumeScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ResumeScalarWhereInputSchema),z.lazy(() => ResumeScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  fileKey: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  path: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  fullPath: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  url: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  candidateId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdById: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserCreateWithoutProfileInputSchema: z.ZodType<Prisma.UserCreateWithoutProfileInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  email: z.string().email({message: "Email is invalid"}),
  phone: z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid"),
  password: z.string().min(6).max(16),
  role: z.lazy(() => RoleSchema).optional().nullable(),
  emailVerified: z.boolean().optional().nullable(),
  phoneVerified: z.boolean().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  job: z.lazy(() => JobCreateNestedManyWithoutCreatedByInputSchema).optional(),
  departments: z.lazy(() => DepartmentCreateNestedManyWithoutCreatedByInputSchema).optional(),
  shortListed: z.lazy(() => ShortListedCreateNestedManyWithoutUserInputSchema).optional(),
  ownedResumes: z.lazy(() => ResumeCreateNestedManyWithoutCreatedByInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutProfileInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutProfileInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  email: z.string().email({message: "Email is invalid"}),
  phone: z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid"),
  password: z.string().min(6).max(16),
  role: z.lazy(() => RoleSchema).optional().nullable(),
  emailVerified: z.boolean().optional().nullable(),
  phoneVerified: z.boolean().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  job: z.lazy(() => JobUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional(),
  departments: z.lazy(() => DepartmentUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional(),
  shortListed: z.lazy(() => ShortListedUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  ownedResumes: z.lazy(() => ResumeUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutProfileInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutProfileInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutProfileInputSchema),z.lazy(() => UserUncheckedCreateWithoutProfileInputSchema) ]),
}).strict();

export const UserUpsertWithoutProfileInputSchema: z.ZodType<Prisma.UserUpsertWithoutProfileInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutProfileInputSchema),z.lazy(() => UserUncheckedUpdateWithoutProfileInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutProfileInputSchema),z.lazy(() => UserUncheckedCreateWithoutProfileInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutProfileInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutProfileInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutProfileInputSchema),z.lazy(() => UserUncheckedUpdateWithoutProfileInputSchema) ]),
}).strict();

export const UserUpdateWithoutProfileInputSchema: z.ZodType<Prisma.UserUpdateWithoutProfileInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string().min(1),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email({message: "Email is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid"),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string().min(6).max(16),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NullableEnumRoleFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneVerified: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  job: z.lazy(() => JobUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  departments: z.lazy(() => DepartmentUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  shortListed: z.lazy(() => ShortListedUpdateManyWithoutUserNestedInputSchema).optional(),
  ownedResumes: z.lazy(() => ResumeUpdateManyWithoutCreatedByNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutProfileInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutProfileInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string().min(1),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email({message: "Email is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid"),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string().min(6).max(16),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NullableEnumRoleFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneVerified: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  job: z.lazy(() => JobUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  departments: z.lazy(() => DepartmentUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  shortListed: z.lazy(() => ShortListedUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  ownedResumes: z.lazy(() => ResumeUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional()
}).strict();

export const DepartmentCreateWithoutJobInputSchema: z.ZodType<Prisma.DepartmentCreateWithoutJobInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, {message: "Title cannot be empty"}),
  description: z.string().optional().nullable(),
  isDeleted: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  udpatedAt: z.coerce.date().optional(),
  createdBy: z.lazy(() => UserCreateNestedOneWithoutDepartmentsInputSchema)
}).strict();

export const DepartmentUncheckedCreateWithoutJobInputSchema: z.ZodType<Prisma.DepartmentUncheckedCreateWithoutJobInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, {message: "Title cannot be empty"}),
  description: z.string().optional().nullable(),
  isDeleted: z.boolean().optional(),
  createdById: z.string().min(1, {message: "User is required"}).uuid({message:"User ID is invalid"}),
  createdAt: z.coerce.date().optional(),
  udpatedAt: z.coerce.date().optional()
}).strict();

export const DepartmentCreateOrConnectWithoutJobInputSchema: z.ZodType<Prisma.DepartmentCreateOrConnectWithoutJobInput> = z.object({
  where: z.lazy(() => DepartmentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DepartmentCreateWithoutJobInputSchema),z.lazy(() => DepartmentUncheckedCreateWithoutJobInputSchema) ]),
}).strict();

export const UserCreateWithoutJobInputSchema: z.ZodType<Prisma.UserCreateWithoutJobInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  email: z.string().email({message: "Email is invalid"}),
  phone: z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid"),
  password: z.string().min(6).max(16),
  role: z.lazy(() => RoleSchema).optional().nullable(),
  emailVerified: z.boolean().optional().nullable(),
  phoneVerified: z.boolean().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  profile: z.lazy(() => ProfileCreateNestedOneWithoutUserInputSchema).optional(),
  departments: z.lazy(() => DepartmentCreateNestedManyWithoutCreatedByInputSchema).optional(),
  shortListed: z.lazy(() => ShortListedCreateNestedManyWithoutUserInputSchema).optional(),
  ownedResumes: z.lazy(() => ResumeCreateNestedManyWithoutCreatedByInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutJobInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutJobInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  email: z.string().email({message: "Email is invalid"}),
  phone: z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid"),
  password: z.string().min(6).max(16),
  role: z.lazy(() => RoleSchema).optional().nullable(),
  emailVerified: z.boolean().optional().nullable(),
  phoneVerified: z.boolean().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  profile: z.lazy(() => ProfileUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  departments: z.lazy(() => DepartmentUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional(),
  shortListed: z.lazy(() => ShortListedUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  ownedResumes: z.lazy(() => ResumeUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutJobInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutJobInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutJobInputSchema),z.lazy(() => UserUncheckedCreateWithoutJobInputSchema) ]),
}).strict();

export const JobsAndResumesCreateWithoutJobInputSchema: z.ZodType<Prisma.JobsAndResumesCreateWithoutJobInput> = z.object({
  resume: z.lazy(() => ResumeCreateNestedOneWithoutJobsInputSchema)
}).strict();

export const JobsAndResumesUncheckedCreateWithoutJobInputSchema: z.ZodType<Prisma.JobsAndResumesUncheckedCreateWithoutJobInput> = z.object({
  resumeId: z.string()
}).strict();

export const JobsAndResumesCreateOrConnectWithoutJobInputSchema: z.ZodType<Prisma.JobsAndResumesCreateOrConnectWithoutJobInput> = z.object({
  where: z.lazy(() => JobsAndResumesWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => JobsAndResumesCreateWithoutJobInputSchema),z.lazy(() => JobsAndResumesUncheckedCreateWithoutJobInputSchema) ]),
}).strict();

export const JobsAndResumesCreateManyJobInputEnvelopeSchema: z.ZodType<Prisma.JobsAndResumesCreateManyJobInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => JobsAndResumesCreateManyJobInputSchema),z.lazy(() => JobsAndResumesCreateManyJobInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const CandidatesOnJobsCreateWithoutJobInputSchema: z.ZodType<Prisma.CandidatesOnJobsCreateWithoutJobInput> = z.object({
  id: z.string().uuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  candidate: z.lazy(() => CandidateCreateNestedOneWithoutJobsInputSchema)
}).strict();

export const CandidatesOnJobsUncheckedCreateWithoutJobInputSchema: z.ZodType<Prisma.CandidatesOnJobsUncheckedCreateWithoutJobInput> = z.object({
  id: z.string().uuid().optional(),
  candidateId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const CandidatesOnJobsCreateOrConnectWithoutJobInputSchema: z.ZodType<Prisma.CandidatesOnJobsCreateOrConnectWithoutJobInput> = z.object({
  where: z.lazy(() => CandidatesOnJobsWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CandidatesOnJobsCreateWithoutJobInputSchema),z.lazy(() => CandidatesOnJobsUncheckedCreateWithoutJobInputSchema) ]),
}).strict();

export const CandidatesOnJobsCreateManyJobInputEnvelopeSchema: z.ZodType<Prisma.CandidatesOnJobsCreateManyJobInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => CandidatesOnJobsCreateManyJobInputSchema),z.lazy(() => CandidatesOnJobsCreateManyJobInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ShortListedCreateWithoutJobInputSchema: z.ZodType<Prisma.ShortListedCreateWithoutJobInput> = z.object({
  id: z.string().uuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutShortListedInputSchema),
  candidate: z.lazy(() => CandidateCreateNestedOneWithoutShortListedJobsInputSchema)
}).strict();

export const ShortListedUncheckedCreateWithoutJobInputSchema: z.ZodType<Prisma.ShortListedUncheckedCreateWithoutJobInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  candidateId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ShortListedCreateOrConnectWithoutJobInputSchema: z.ZodType<Prisma.ShortListedCreateOrConnectWithoutJobInput> = z.object({
  where: z.lazy(() => ShortListedWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ShortListedCreateWithoutJobInputSchema),z.lazy(() => ShortListedUncheckedCreateWithoutJobInputSchema) ]),
}).strict();

export const ShortListedCreateManyJobInputEnvelopeSchema: z.ZodType<Prisma.ShortListedCreateManyJobInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ShortListedCreateManyJobInputSchema),z.lazy(() => ShortListedCreateManyJobInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const DepartmentUpsertWithoutJobInputSchema: z.ZodType<Prisma.DepartmentUpsertWithoutJobInput> = z.object({
  update: z.union([ z.lazy(() => DepartmentUpdateWithoutJobInputSchema),z.lazy(() => DepartmentUncheckedUpdateWithoutJobInputSchema) ]),
  create: z.union([ z.lazy(() => DepartmentCreateWithoutJobInputSchema),z.lazy(() => DepartmentUncheckedCreateWithoutJobInputSchema) ]),
  where: z.lazy(() => DepartmentWhereInputSchema).optional()
}).strict();

export const DepartmentUpdateToOneWithWhereWithoutJobInputSchema: z.ZodType<Prisma.DepartmentUpdateToOneWithWhereWithoutJobInput> = z.object({
  where: z.lazy(() => DepartmentWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => DepartmentUpdateWithoutJobInputSchema),z.lazy(() => DepartmentUncheckedUpdateWithoutJobInputSchema) ]),
}).strict();

export const DepartmentUpdateWithoutJobInputSchema: z.ZodType<Prisma.DepartmentUpdateWithoutJobInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string().min(1, {message: "Title cannot be empty"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  udpatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdBy: z.lazy(() => UserUpdateOneRequiredWithoutDepartmentsNestedInputSchema).optional()
}).strict();

export const DepartmentUncheckedUpdateWithoutJobInputSchema: z.ZodType<Prisma.DepartmentUncheckedUpdateWithoutJobInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string().min(1, {message: "Title cannot be empty"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdById: z.union([ z.string().min(1, {message: "User is required"}).uuid({message:"User ID is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  udpatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUpsertWithoutJobInputSchema: z.ZodType<Prisma.UserUpsertWithoutJobInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutJobInputSchema),z.lazy(() => UserUncheckedUpdateWithoutJobInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutJobInputSchema),z.lazy(() => UserUncheckedCreateWithoutJobInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutJobInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutJobInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutJobInputSchema),z.lazy(() => UserUncheckedUpdateWithoutJobInputSchema) ]),
}).strict();

export const UserUpdateWithoutJobInputSchema: z.ZodType<Prisma.UserUpdateWithoutJobInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string().min(1),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email({message: "Email is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid"),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string().min(6).max(16),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NullableEnumRoleFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneVerified: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profile: z.lazy(() => ProfileUpdateOneWithoutUserNestedInputSchema).optional(),
  departments: z.lazy(() => DepartmentUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  shortListed: z.lazy(() => ShortListedUpdateManyWithoutUserNestedInputSchema).optional(),
  ownedResumes: z.lazy(() => ResumeUpdateManyWithoutCreatedByNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutJobInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutJobInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string().min(1),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email({message: "Email is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid"),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string().min(6).max(16),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NullableEnumRoleFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneVerified: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profile: z.lazy(() => ProfileUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  departments: z.lazy(() => DepartmentUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  shortListed: z.lazy(() => ShortListedUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  ownedResumes: z.lazy(() => ResumeUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional()
}).strict();

export const JobsAndResumesUpsertWithWhereUniqueWithoutJobInputSchema: z.ZodType<Prisma.JobsAndResumesUpsertWithWhereUniqueWithoutJobInput> = z.object({
  where: z.lazy(() => JobsAndResumesWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => JobsAndResumesUpdateWithoutJobInputSchema),z.lazy(() => JobsAndResumesUncheckedUpdateWithoutJobInputSchema) ]),
  create: z.union([ z.lazy(() => JobsAndResumesCreateWithoutJobInputSchema),z.lazy(() => JobsAndResumesUncheckedCreateWithoutJobInputSchema) ]),
}).strict();

export const JobsAndResumesUpdateWithWhereUniqueWithoutJobInputSchema: z.ZodType<Prisma.JobsAndResumesUpdateWithWhereUniqueWithoutJobInput> = z.object({
  where: z.lazy(() => JobsAndResumesWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => JobsAndResumesUpdateWithoutJobInputSchema),z.lazy(() => JobsAndResumesUncheckedUpdateWithoutJobInputSchema) ]),
}).strict();

export const JobsAndResumesUpdateManyWithWhereWithoutJobInputSchema: z.ZodType<Prisma.JobsAndResumesUpdateManyWithWhereWithoutJobInput> = z.object({
  where: z.lazy(() => JobsAndResumesScalarWhereInputSchema),
  data: z.union([ z.lazy(() => JobsAndResumesUpdateManyMutationInputSchema),z.lazy(() => JobsAndResumesUncheckedUpdateManyWithoutJobInputSchema) ]),
}).strict();

export const JobsAndResumesScalarWhereInputSchema: z.ZodType<Prisma.JobsAndResumesScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => JobsAndResumesScalarWhereInputSchema),z.lazy(() => JobsAndResumesScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => JobsAndResumesScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => JobsAndResumesScalarWhereInputSchema),z.lazy(() => JobsAndResumesScalarWhereInputSchema).array() ]).optional(),
  jobId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  resumeId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const CandidatesOnJobsUpsertWithWhereUniqueWithoutJobInputSchema: z.ZodType<Prisma.CandidatesOnJobsUpsertWithWhereUniqueWithoutJobInput> = z.object({
  where: z.lazy(() => CandidatesOnJobsWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CandidatesOnJobsUpdateWithoutJobInputSchema),z.lazy(() => CandidatesOnJobsUncheckedUpdateWithoutJobInputSchema) ]),
  create: z.union([ z.lazy(() => CandidatesOnJobsCreateWithoutJobInputSchema),z.lazy(() => CandidatesOnJobsUncheckedCreateWithoutJobInputSchema) ]),
}).strict();

export const CandidatesOnJobsUpdateWithWhereUniqueWithoutJobInputSchema: z.ZodType<Prisma.CandidatesOnJobsUpdateWithWhereUniqueWithoutJobInput> = z.object({
  where: z.lazy(() => CandidatesOnJobsWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CandidatesOnJobsUpdateWithoutJobInputSchema),z.lazy(() => CandidatesOnJobsUncheckedUpdateWithoutJobInputSchema) ]),
}).strict();

export const CandidatesOnJobsUpdateManyWithWhereWithoutJobInputSchema: z.ZodType<Prisma.CandidatesOnJobsUpdateManyWithWhereWithoutJobInput> = z.object({
  where: z.lazy(() => CandidatesOnJobsScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CandidatesOnJobsUpdateManyMutationInputSchema),z.lazy(() => CandidatesOnJobsUncheckedUpdateManyWithoutJobInputSchema) ]),
}).strict();

export const CandidatesOnJobsScalarWhereInputSchema: z.ZodType<Prisma.CandidatesOnJobsScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CandidatesOnJobsScalarWhereInputSchema),z.lazy(() => CandidatesOnJobsScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CandidatesOnJobsScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CandidatesOnJobsScalarWhereInputSchema),z.lazy(() => CandidatesOnJobsScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  candidateId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  jobId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ShortListedUpsertWithWhereUniqueWithoutJobInputSchema: z.ZodType<Prisma.ShortListedUpsertWithWhereUniqueWithoutJobInput> = z.object({
  where: z.lazy(() => ShortListedWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ShortListedUpdateWithoutJobInputSchema),z.lazy(() => ShortListedUncheckedUpdateWithoutJobInputSchema) ]),
  create: z.union([ z.lazy(() => ShortListedCreateWithoutJobInputSchema),z.lazy(() => ShortListedUncheckedCreateWithoutJobInputSchema) ]),
}).strict();

export const ShortListedUpdateWithWhereUniqueWithoutJobInputSchema: z.ZodType<Prisma.ShortListedUpdateWithWhereUniqueWithoutJobInput> = z.object({
  where: z.lazy(() => ShortListedWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ShortListedUpdateWithoutJobInputSchema),z.lazy(() => ShortListedUncheckedUpdateWithoutJobInputSchema) ]),
}).strict();

export const ShortListedUpdateManyWithWhereWithoutJobInputSchema: z.ZodType<Prisma.ShortListedUpdateManyWithWhereWithoutJobInput> = z.object({
  where: z.lazy(() => ShortListedScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ShortListedUpdateManyMutationInputSchema),z.lazy(() => ShortListedUncheckedUpdateManyWithoutJobInputSchema) ]),
}).strict();

export const JobCreateWithoutDepartmentInputSchema: z.ZodType<Prisma.JobCreateWithoutDepartmentInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, {message: "Title cannot be empty"}),
  description: z.string().optional().nullable(),
  jobType: z.lazy(() => JobTypeSchema).optional().nullable(),
  location: z.string().optional().nullable(),
  shiftType: z.lazy(() => ShiftTypeSchema).optional().nullable(),
  expiryDate: z.coerce.date({invalid_type_error:"Date is invalid"}).optional().nullable(),
  createdAt: z.coerce.date().optional(),
  udpatedAt: z.coerce.date().optional(),
  createdBy: z.lazy(() => UserCreateNestedOneWithoutJobInputSchema),
  resumes: z.lazy(() => JobsAndResumesCreateNestedManyWithoutJobInputSchema).optional(),
  candidates: z.lazy(() => CandidatesOnJobsCreateNestedManyWithoutJobInputSchema).optional(),
  shortListedCandidates: z.lazy(() => ShortListedCreateNestedManyWithoutJobInputSchema).optional()
}).strict();

export const JobUncheckedCreateWithoutDepartmentInputSchema: z.ZodType<Prisma.JobUncheckedCreateWithoutDepartmentInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, {message: "Title cannot be empty"}),
  description: z.string().optional().nullable(),
  jobType: z.lazy(() => JobTypeSchema).optional().nullable(),
  location: z.string().optional().nullable(),
  shiftType: z.lazy(() => ShiftTypeSchema).optional().nullable(),
  expiryDate: z.coerce.date({invalid_type_error:"Date is invalid"}).optional().nullable(),
  createdById: z.string().min(1, {message: "User is required"}).uuid({message:"User ID is invalid"}),
  createdAt: z.coerce.date().optional(),
  udpatedAt: z.coerce.date().optional(),
  resumes: z.lazy(() => JobsAndResumesUncheckedCreateNestedManyWithoutJobInputSchema).optional(),
  candidates: z.lazy(() => CandidatesOnJobsUncheckedCreateNestedManyWithoutJobInputSchema).optional(),
  shortListedCandidates: z.lazy(() => ShortListedUncheckedCreateNestedManyWithoutJobInputSchema).optional()
}).strict();

export const JobCreateOrConnectWithoutDepartmentInputSchema: z.ZodType<Prisma.JobCreateOrConnectWithoutDepartmentInput> = z.object({
  where: z.lazy(() => JobWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => JobCreateWithoutDepartmentInputSchema),z.lazy(() => JobUncheckedCreateWithoutDepartmentInputSchema) ]),
}).strict();

export const JobCreateManyDepartmentInputEnvelopeSchema: z.ZodType<Prisma.JobCreateManyDepartmentInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => JobCreateManyDepartmentInputSchema),z.lazy(() => JobCreateManyDepartmentInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserCreateWithoutDepartmentsInputSchema: z.ZodType<Prisma.UserCreateWithoutDepartmentsInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  email: z.string().email({message: "Email is invalid"}),
  phone: z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid"),
  password: z.string().min(6).max(16),
  role: z.lazy(() => RoleSchema).optional().nullable(),
  emailVerified: z.boolean().optional().nullable(),
  phoneVerified: z.boolean().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  profile: z.lazy(() => ProfileCreateNestedOneWithoutUserInputSchema).optional(),
  job: z.lazy(() => JobCreateNestedManyWithoutCreatedByInputSchema).optional(),
  shortListed: z.lazy(() => ShortListedCreateNestedManyWithoutUserInputSchema).optional(),
  ownedResumes: z.lazy(() => ResumeCreateNestedManyWithoutCreatedByInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutDepartmentsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutDepartmentsInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  email: z.string().email({message: "Email is invalid"}),
  phone: z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid"),
  password: z.string().min(6).max(16),
  role: z.lazy(() => RoleSchema).optional().nullable(),
  emailVerified: z.boolean().optional().nullable(),
  phoneVerified: z.boolean().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  profile: z.lazy(() => ProfileUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  job: z.lazy(() => JobUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional(),
  shortListed: z.lazy(() => ShortListedUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  ownedResumes: z.lazy(() => ResumeUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutDepartmentsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutDepartmentsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutDepartmentsInputSchema),z.lazy(() => UserUncheckedCreateWithoutDepartmentsInputSchema) ]),
}).strict();

export const JobUpsertWithWhereUniqueWithoutDepartmentInputSchema: z.ZodType<Prisma.JobUpsertWithWhereUniqueWithoutDepartmentInput> = z.object({
  where: z.lazy(() => JobWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => JobUpdateWithoutDepartmentInputSchema),z.lazy(() => JobUncheckedUpdateWithoutDepartmentInputSchema) ]),
  create: z.union([ z.lazy(() => JobCreateWithoutDepartmentInputSchema),z.lazy(() => JobUncheckedCreateWithoutDepartmentInputSchema) ]),
}).strict();

export const JobUpdateWithWhereUniqueWithoutDepartmentInputSchema: z.ZodType<Prisma.JobUpdateWithWhereUniqueWithoutDepartmentInput> = z.object({
  where: z.lazy(() => JobWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => JobUpdateWithoutDepartmentInputSchema),z.lazy(() => JobUncheckedUpdateWithoutDepartmentInputSchema) ]),
}).strict();

export const JobUpdateManyWithWhereWithoutDepartmentInputSchema: z.ZodType<Prisma.JobUpdateManyWithWhereWithoutDepartmentInput> = z.object({
  where: z.lazy(() => JobScalarWhereInputSchema),
  data: z.union([ z.lazy(() => JobUpdateManyMutationInputSchema),z.lazy(() => JobUncheckedUpdateManyWithoutDepartmentInputSchema) ]),
}).strict();

export const UserUpsertWithoutDepartmentsInputSchema: z.ZodType<Prisma.UserUpsertWithoutDepartmentsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutDepartmentsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutDepartmentsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutDepartmentsInputSchema),z.lazy(() => UserUncheckedCreateWithoutDepartmentsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutDepartmentsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutDepartmentsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutDepartmentsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutDepartmentsInputSchema) ]),
}).strict();

export const UserUpdateWithoutDepartmentsInputSchema: z.ZodType<Prisma.UserUpdateWithoutDepartmentsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string().min(1),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email({message: "Email is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid"),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string().min(6).max(16),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NullableEnumRoleFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneVerified: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profile: z.lazy(() => ProfileUpdateOneWithoutUserNestedInputSchema).optional(),
  job: z.lazy(() => JobUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  shortListed: z.lazy(() => ShortListedUpdateManyWithoutUserNestedInputSchema).optional(),
  ownedResumes: z.lazy(() => ResumeUpdateManyWithoutCreatedByNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutDepartmentsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutDepartmentsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string().min(1),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email({message: "Email is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid"),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string().min(6).max(16),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NullableEnumRoleFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneVerified: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profile: z.lazy(() => ProfileUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  job: z.lazy(() => JobUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  shortListed: z.lazy(() => ShortListedUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  ownedResumes: z.lazy(() => ResumeUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional()
}).strict();

export const ResumeCreateWithoutCandidateInputSchema: z.ZodType<Prisma.ResumeCreateWithoutCandidateInput> = z.object({
  id: z.string().uuid().optional(),
  fileKey: z.string().uuid({message:"Key is invalid"}),
  path: z.string().optional().nullable(),
  fullPath: z.string().optional().nullable(),
  url: z.string().url({message:"URL is invalid"}),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  jobs: z.lazy(() => JobsAndResumesCreateNestedManyWithoutResumeInputSchema).optional(),
  createdBy: z.lazy(() => UserCreateNestedOneWithoutOwnedResumesInputSchema).optional()
}).strict();

export const ResumeUncheckedCreateWithoutCandidateInputSchema: z.ZodType<Prisma.ResumeUncheckedCreateWithoutCandidateInput> = z.object({
  id: z.string().uuid().optional(),
  fileKey: z.string().uuid({message:"Key is invalid"}),
  path: z.string().optional().nullable(),
  fullPath: z.string().optional().nullable(),
  url: z.string().url({message:"URL is invalid"}),
  createdById: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  jobs: z.lazy(() => JobsAndResumesUncheckedCreateNestedManyWithoutResumeInputSchema).optional()
}).strict();

export const ResumeCreateOrConnectWithoutCandidateInputSchema: z.ZodType<Prisma.ResumeCreateOrConnectWithoutCandidateInput> = z.object({
  where: z.lazy(() => ResumeWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ResumeCreateWithoutCandidateInputSchema),z.lazy(() => ResumeUncheckedCreateWithoutCandidateInputSchema) ]),
}).strict();

export const ResumeCreateManyCandidateInputEnvelopeSchema: z.ZodType<Prisma.ResumeCreateManyCandidateInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ResumeCreateManyCandidateInputSchema),z.lazy(() => ResumeCreateManyCandidateInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const CandidatesOnJobsCreateWithoutCandidateInputSchema: z.ZodType<Prisma.CandidatesOnJobsCreateWithoutCandidateInput> = z.object({
  id: z.string().uuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  job: z.lazy(() => JobCreateNestedOneWithoutCandidatesInputSchema)
}).strict();

export const CandidatesOnJobsUncheckedCreateWithoutCandidateInputSchema: z.ZodType<Prisma.CandidatesOnJobsUncheckedCreateWithoutCandidateInput> = z.object({
  id: z.string().uuid().optional(),
  jobId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const CandidatesOnJobsCreateOrConnectWithoutCandidateInputSchema: z.ZodType<Prisma.CandidatesOnJobsCreateOrConnectWithoutCandidateInput> = z.object({
  where: z.lazy(() => CandidatesOnJobsWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CandidatesOnJobsCreateWithoutCandidateInputSchema),z.lazy(() => CandidatesOnJobsUncheckedCreateWithoutCandidateInputSchema) ]),
}).strict();

export const CandidatesOnJobsCreateManyCandidateInputEnvelopeSchema: z.ZodType<Prisma.CandidatesOnJobsCreateManyCandidateInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => CandidatesOnJobsCreateManyCandidateInputSchema),z.lazy(() => CandidatesOnJobsCreateManyCandidateInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ShortListedCreateWithoutCandidateInputSchema: z.ZodType<Prisma.ShortListedCreateWithoutCandidateInput> = z.object({
  id: z.string().uuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutShortListedInputSchema),
  job: z.lazy(() => JobCreateNestedOneWithoutShortListedCandidatesInputSchema)
}).strict();

export const ShortListedUncheckedCreateWithoutCandidateInputSchema: z.ZodType<Prisma.ShortListedUncheckedCreateWithoutCandidateInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  jobId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ShortListedCreateOrConnectWithoutCandidateInputSchema: z.ZodType<Prisma.ShortListedCreateOrConnectWithoutCandidateInput> = z.object({
  where: z.lazy(() => ShortListedWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ShortListedCreateWithoutCandidateInputSchema),z.lazy(() => ShortListedUncheckedCreateWithoutCandidateInputSchema) ]),
}).strict();

export const ShortListedCreateManyCandidateInputEnvelopeSchema: z.ZodType<Prisma.ShortListedCreateManyCandidateInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ShortListedCreateManyCandidateInputSchema),z.lazy(() => ShortListedCreateManyCandidateInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ResumeUpsertWithWhereUniqueWithoutCandidateInputSchema: z.ZodType<Prisma.ResumeUpsertWithWhereUniqueWithoutCandidateInput> = z.object({
  where: z.lazy(() => ResumeWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ResumeUpdateWithoutCandidateInputSchema),z.lazy(() => ResumeUncheckedUpdateWithoutCandidateInputSchema) ]),
  create: z.union([ z.lazy(() => ResumeCreateWithoutCandidateInputSchema),z.lazy(() => ResumeUncheckedCreateWithoutCandidateInputSchema) ]),
}).strict();

export const ResumeUpdateWithWhereUniqueWithoutCandidateInputSchema: z.ZodType<Prisma.ResumeUpdateWithWhereUniqueWithoutCandidateInput> = z.object({
  where: z.lazy(() => ResumeWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ResumeUpdateWithoutCandidateInputSchema),z.lazy(() => ResumeUncheckedUpdateWithoutCandidateInputSchema) ]),
}).strict();

export const ResumeUpdateManyWithWhereWithoutCandidateInputSchema: z.ZodType<Prisma.ResumeUpdateManyWithWhereWithoutCandidateInput> = z.object({
  where: z.lazy(() => ResumeScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ResumeUpdateManyMutationInputSchema),z.lazy(() => ResumeUncheckedUpdateManyWithoutCandidateInputSchema) ]),
}).strict();

export const CandidatesOnJobsUpsertWithWhereUniqueWithoutCandidateInputSchema: z.ZodType<Prisma.CandidatesOnJobsUpsertWithWhereUniqueWithoutCandidateInput> = z.object({
  where: z.lazy(() => CandidatesOnJobsWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CandidatesOnJobsUpdateWithoutCandidateInputSchema),z.lazy(() => CandidatesOnJobsUncheckedUpdateWithoutCandidateInputSchema) ]),
  create: z.union([ z.lazy(() => CandidatesOnJobsCreateWithoutCandidateInputSchema),z.lazy(() => CandidatesOnJobsUncheckedCreateWithoutCandidateInputSchema) ]),
}).strict();

export const CandidatesOnJobsUpdateWithWhereUniqueWithoutCandidateInputSchema: z.ZodType<Prisma.CandidatesOnJobsUpdateWithWhereUniqueWithoutCandidateInput> = z.object({
  where: z.lazy(() => CandidatesOnJobsWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CandidatesOnJobsUpdateWithoutCandidateInputSchema),z.lazy(() => CandidatesOnJobsUncheckedUpdateWithoutCandidateInputSchema) ]),
}).strict();

export const CandidatesOnJobsUpdateManyWithWhereWithoutCandidateInputSchema: z.ZodType<Prisma.CandidatesOnJobsUpdateManyWithWhereWithoutCandidateInput> = z.object({
  where: z.lazy(() => CandidatesOnJobsScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CandidatesOnJobsUpdateManyMutationInputSchema),z.lazy(() => CandidatesOnJobsUncheckedUpdateManyWithoutCandidateInputSchema) ]),
}).strict();

export const ShortListedUpsertWithWhereUniqueWithoutCandidateInputSchema: z.ZodType<Prisma.ShortListedUpsertWithWhereUniqueWithoutCandidateInput> = z.object({
  where: z.lazy(() => ShortListedWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ShortListedUpdateWithoutCandidateInputSchema),z.lazy(() => ShortListedUncheckedUpdateWithoutCandidateInputSchema) ]),
  create: z.union([ z.lazy(() => ShortListedCreateWithoutCandidateInputSchema),z.lazy(() => ShortListedUncheckedCreateWithoutCandidateInputSchema) ]),
}).strict();

export const ShortListedUpdateWithWhereUniqueWithoutCandidateInputSchema: z.ZodType<Prisma.ShortListedUpdateWithWhereUniqueWithoutCandidateInput> = z.object({
  where: z.lazy(() => ShortListedWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ShortListedUpdateWithoutCandidateInputSchema),z.lazy(() => ShortListedUncheckedUpdateWithoutCandidateInputSchema) ]),
}).strict();

export const ShortListedUpdateManyWithWhereWithoutCandidateInputSchema: z.ZodType<Prisma.ShortListedUpdateManyWithWhereWithoutCandidateInput> = z.object({
  where: z.lazy(() => ShortListedScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ShortListedUpdateManyMutationInputSchema),z.lazy(() => ShortListedUncheckedUpdateManyWithoutCandidateInputSchema) ]),
}).strict();

export const CandidateCreateWithoutJobsInputSchema: z.ZodType<Prisma.CandidateCreateWithoutJobsInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, {message:"Name cannot be empty"}),
  email: z.string().email({message:"Email is invalid"}).optional().nullable(),
  phone: z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid").optional().nullable(),
  address: z.string().min(1, {message: "Address cannot be empty"}).optional().nullable(),
  city: z.string().min(1, {message: "City cannot be empty"}).optional().nullable(),
  state: z.string().min(1, {message: "State cannot be empty"}).optional().nullable(),
  country: z.string().min(1, {message: "Country cannot be empty"}).optional().nullable(),
  zipCode: z.string().min(1, {message: "Zip code cannot be empty"}).optional().nullable(),
  age: z.number().positive({message:"Age must be a valid number"}).optional().nullable(),
  dob: z.coerce.date({invalid_type_error:"Date is invalid"}).optional().nullable(),
  gender: z.lazy(() => GenderSchema).optional().nullable(),
  jobExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  totalExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  relevantExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  skills: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pros: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  cons: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  score: z.number().positive({message:"Score must be a valid number"}).optional().nullable(),
  resumeId: z.string(),
  activeResumeId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  resume: z.lazy(() => ResumeCreateNestedManyWithoutCandidateInputSchema).optional(),
  shortListedJobs: z.lazy(() => ShortListedCreateNestedManyWithoutCandidateInputSchema).optional()
}).strict();

export const CandidateUncheckedCreateWithoutJobsInputSchema: z.ZodType<Prisma.CandidateUncheckedCreateWithoutJobsInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, {message:"Name cannot be empty"}),
  email: z.string().email({message:"Email is invalid"}).optional().nullable(),
  phone: z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid").optional().nullable(),
  address: z.string().min(1, {message: "Address cannot be empty"}).optional().nullable(),
  city: z.string().min(1, {message: "City cannot be empty"}).optional().nullable(),
  state: z.string().min(1, {message: "State cannot be empty"}).optional().nullable(),
  country: z.string().min(1, {message: "Country cannot be empty"}).optional().nullable(),
  zipCode: z.string().min(1, {message: "Zip code cannot be empty"}).optional().nullable(),
  age: z.number().positive({message:"Age must be a valid number"}).optional().nullable(),
  dob: z.coerce.date({invalid_type_error:"Date is invalid"}).optional().nullable(),
  gender: z.lazy(() => GenderSchema).optional().nullable(),
  jobExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  totalExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  relevantExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  skills: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pros: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  cons: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  score: z.number().positive({message:"Score must be a valid number"}).optional().nullable(),
  resumeId: z.string(),
  activeResumeId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  resume: z.lazy(() => ResumeUncheckedCreateNestedManyWithoutCandidateInputSchema).optional(),
  shortListedJobs: z.lazy(() => ShortListedUncheckedCreateNestedManyWithoutCandidateInputSchema).optional()
}).strict();

export const CandidateCreateOrConnectWithoutJobsInputSchema: z.ZodType<Prisma.CandidateCreateOrConnectWithoutJobsInput> = z.object({
  where: z.lazy(() => CandidateWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CandidateCreateWithoutJobsInputSchema),z.lazy(() => CandidateUncheckedCreateWithoutJobsInputSchema) ]),
}).strict();

export const JobCreateWithoutCandidatesInputSchema: z.ZodType<Prisma.JobCreateWithoutCandidatesInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, {message: "Title cannot be empty"}),
  description: z.string().optional().nullable(),
  jobType: z.lazy(() => JobTypeSchema).optional().nullable(),
  location: z.string().optional().nullable(),
  shiftType: z.lazy(() => ShiftTypeSchema).optional().nullable(),
  expiryDate: z.coerce.date({invalid_type_error:"Date is invalid"}).optional().nullable(),
  createdAt: z.coerce.date().optional(),
  udpatedAt: z.coerce.date().optional(),
  department: z.lazy(() => DepartmentCreateNestedOneWithoutJobInputSchema),
  createdBy: z.lazy(() => UserCreateNestedOneWithoutJobInputSchema),
  resumes: z.lazy(() => JobsAndResumesCreateNestedManyWithoutJobInputSchema).optional(),
  shortListedCandidates: z.lazy(() => ShortListedCreateNestedManyWithoutJobInputSchema).optional()
}).strict();

export const JobUncheckedCreateWithoutCandidatesInputSchema: z.ZodType<Prisma.JobUncheckedCreateWithoutCandidatesInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, {message: "Title cannot be empty"}),
  description: z.string().optional().nullable(),
  jobType: z.lazy(() => JobTypeSchema).optional().nullable(),
  departmentId: z.string().min(1, {message: "Department is required"}).uuid({message:"User ID is invalid"}),
  location: z.string().optional().nullable(),
  shiftType: z.lazy(() => ShiftTypeSchema).optional().nullable(),
  expiryDate: z.coerce.date({invalid_type_error:"Date is invalid"}).optional().nullable(),
  createdById: z.string().min(1, {message: "User is required"}).uuid({message:"User ID is invalid"}),
  createdAt: z.coerce.date().optional(),
  udpatedAt: z.coerce.date().optional(),
  resumes: z.lazy(() => JobsAndResumesUncheckedCreateNestedManyWithoutJobInputSchema).optional(),
  shortListedCandidates: z.lazy(() => ShortListedUncheckedCreateNestedManyWithoutJobInputSchema).optional()
}).strict();

export const JobCreateOrConnectWithoutCandidatesInputSchema: z.ZodType<Prisma.JobCreateOrConnectWithoutCandidatesInput> = z.object({
  where: z.lazy(() => JobWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => JobCreateWithoutCandidatesInputSchema),z.lazy(() => JobUncheckedCreateWithoutCandidatesInputSchema) ]),
}).strict();

export const CandidateUpsertWithoutJobsInputSchema: z.ZodType<Prisma.CandidateUpsertWithoutJobsInput> = z.object({
  update: z.union([ z.lazy(() => CandidateUpdateWithoutJobsInputSchema),z.lazy(() => CandidateUncheckedUpdateWithoutJobsInputSchema) ]),
  create: z.union([ z.lazy(() => CandidateCreateWithoutJobsInputSchema),z.lazy(() => CandidateUncheckedCreateWithoutJobsInputSchema) ]),
  where: z.lazy(() => CandidateWhereInputSchema).optional()
}).strict();

export const CandidateUpdateToOneWithWhereWithoutJobsInputSchema: z.ZodType<Prisma.CandidateUpdateToOneWithWhereWithoutJobsInput> = z.object({
  where: z.lazy(() => CandidateWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CandidateUpdateWithoutJobsInputSchema),z.lazy(() => CandidateUncheckedUpdateWithoutJobsInputSchema) ]),
}).strict();

export const CandidateUpdateWithoutJobsInputSchema: z.ZodType<Prisma.CandidateUpdateWithoutJobsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string().min(1, {message:"Name cannot be empty"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email({message:"Email is invalid"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid"),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string().min(1, {message: "Address cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string().min(1, {message: "City cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  state: z.union([ z.string().min(1, {message: "State cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  country: z.union([ z.string().min(1, {message: "Country cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  zipCode: z.union([ z.string().min(1, {message: "Zip code cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  age: z.union([ z.number().positive({message:"Age must be a valid number"}),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dob: z.union([ z.coerce.date({invalid_type_error:"Date is invalid"}),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  gender: z.union([ z.lazy(() => GenderSchema),z.lazy(() => NullableEnumGenderFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  jobExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  totalExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  relevantExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  skills: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pros: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  cons: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  score: z.union([ z.number().positive({message:"Score must be a valid number"}),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  resumeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  activeResumeId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  resume: z.lazy(() => ResumeUpdateManyWithoutCandidateNestedInputSchema).optional(),
  shortListedJobs: z.lazy(() => ShortListedUpdateManyWithoutCandidateNestedInputSchema).optional()
}).strict();

export const CandidateUncheckedUpdateWithoutJobsInputSchema: z.ZodType<Prisma.CandidateUncheckedUpdateWithoutJobsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string().min(1, {message:"Name cannot be empty"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email({message:"Email is invalid"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid"),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string().min(1, {message: "Address cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string().min(1, {message: "City cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  state: z.union([ z.string().min(1, {message: "State cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  country: z.union([ z.string().min(1, {message: "Country cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  zipCode: z.union([ z.string().min(1, {message: "Zip code cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  age: z.union([ z.number().positive({message:"Age must be a valid number"}),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dob: z.union([ z.coerce.date({invalid_type_error:"Date is invalid"}),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  gender: z.union([ z.lazy(() => GenderSchema),z.lazy(() => NullableEnumGenderFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  jobExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  totalExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  relevantExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  skills: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pros: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  cons: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  score: z.union([ z.number().positive({message:"Score must be a valid number"}),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  resumeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  activeResumeId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  resume: z.lazy(() => ResumeUncheckedUpdateManyWithoutCandidateNestedInputSchema).optional(),
  shortListedJobs: z.lazy(() => ShortListedUncheckedUpdateManyWithoutCandidateNestedInputSchema).optional()
}).strict();

export const JobUpsertWithoutCandidatesInputSchema: z.ZodType<Prisma.JobUpsertWithoutCandidatesInput> = z.object({
  update: z.union([ z.lazy(() => JobUpdateWithoutCandidatesInputSchema),z.lazy(() => JobUncheckedUpdateWithoutCandidatesInputSchema) ]),
  create: z.union([ z.lazy(() => JobCreateWithoutCandidatesInputSchema),z.lazy(() => JobUncheckedCreateWithoutCandidatesInputSchema) ]),
  where: z.lazy(() => JobWhereInputSchema).optional()
}).strict();

export const JobUpdateToOneWithWhereWithoutCandidatesInputSchema: z.ZodType<Prisma.JobUpdateToOneWithWhereWithoutCandidatesInput> = z.object({
  where: z.lazy(() => JobWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => JobUpdateWithoutCandidatesInputSchema),z.lazy(() => JobUncheckedUpdateWithoutCandidatesInputSchema) ]),
}).strict();

export const JobUpdateWithoutCandidatesInputSchema: z.ZodType<Prisma.JobUpdateWithoutCandidatesInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string().min(1, {message: "Title cannot be empty"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  jobType: z.union([ z.lazy(() => JobTypeSchema),z.lazy(() => NullableEnumJobTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  location: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shiftType: z.union([ z.lazy(() => ShiftTypeSchema),z.lazy(() => NullableEnumShiftTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date({invalid_type_error:"Date is invalid"}),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  udpatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  department: z.lazy(() => DepartmentUpdateOneRequiredWithoutJobNestedInputSchema).optional(),
  createdBy: z.lazy(() => UserUpdateOneRequiredWithoutJobNestedInputSchema).optional(),
  resumes: z.lazy(() => JobsAndResumesUpdateManyWithoutJobNestedInputSchema).optional(),
  shortListedCandidates: z.lazy(() => ShortListedUpdateManyWithoutJobNestedInputSchema).optional()
}).strict();

export const JobUncheckedUpdateWithoutCandidatesInputSchema: z.ZodType<Prisma.JobUncheckedUpdateWithoutCandidatesInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string().min(1, {message: "Title cannot be empty"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  jobType: z.union([ z.lazy(() => JobTypeSchema),z.lazy(() => NullableEnumJobTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  departmentId: z.union([ z.string().min(1, {message: "Department is required"}).uuid({message:"User ID is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shiftType: z.union([ z.lazy(() => ShiftTypeSchema),z.lazy(() => NullableEnumShiftTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date({invalid_type_error:"Date is invalid"}),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdById: z.union([ z.string().min(1, {message: "User is required"}).uuid({message:"User ID is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  udpatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  resumes: z.lazy(() => JobsAndResumesUncheckedUpdateManyWithoutJobNestedInputSchema).optional(),
  shortListedCandidates: z.lazy(() => ShortListedUncheckedUpdateManyWithoutJobNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutShortListedInputSchema: z.ZodType<Prisma.UserCreateWithoutShortListedInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  email: z.string().email({message: "Email is invalid"}),
  phone: z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid"),
  password: z.string().min(6).max(16),
  role: z.lazy(() => RoleSchema).optional().nullable(),
  emailVerified: z.boolean().optional().nullable(),
  phoneVerified: z.boolean().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  profile: z.lazy(() => ProfileCreateNestedOneWithoutUserInputSchema).optional(),
  job: z.lazy(() => JobCreateNestedManyWithoutCreatedByInputSchema).optional(),
  departments: z.lazy(() => DepartmentCreateNestedManyWithoutCreatedByInputSchema).optional(),
  ownedResumes: z.lazy(() => ResumeCreateNestedManyWithoutCreatedByInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutShortListedInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutShortListedInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  email: z.string().email({message: "Email is invalid"}),
  phone: z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid"),
  password: z.string().min(6).max(16),
  role: z.lazy(() => RoleSchema).optional().nullable(),
  emailVerified: z.boolean().optional().nullable(),
  phoneVerified: z.boolean().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  profile: z.lazy(() => ProfileUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  job: z.lazy(() => JobUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional(),
  departments: z.lazy(() => DepartmentUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional(),
  ownedResumes: z.lazy(() => ResumeUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutShortListedInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutShortListedInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutShortListedInputSchema),z.lazy(() => UserUncheckedCreateWithoutShortListedInputSchema) ]),
}).strict();

export const CandidateCreateWithoutShortListedJobsInputSchema: z.ZodType<Prisma.CandidateCreateWithoutShortListedJobsInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, {message:"Name cannot be empty"}),
  email: z.string().email({message:"Email is invalid"}).optional().nullable(),
  phone: z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid").optional().nullable(),
  address: z.string().min(1, {message: "Address cannot be empty"}).optional().nullable(),
  city: z.string().min(1, {message: "City cannot be empty"}).optional().nullable(),
  state: z.string().min(1, {message: "State cannot be empty"}).optional().nullable(),
  country: z.string().min(1, {message: "Country cannot be empty"}).optional().nullable(),
  zipCode: z.string().min(1, {message: "Zip code cannot be empty"}).optional().nullable(),
  age: z.number().positive({message:"Age must be a valid number"}).optional().nullable(),
  dob: z.coerce.date({invalid_type_error:"Date is invalid"}).optional().nullable(),
  gender: z.lazy(() => GenderSchema).optional().nullable(),
  jobExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  totalExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  relevantExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  skills: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pros: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  cons: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  score: z.number().positive({message:"Score must be a valid number"}).optional().nullable(),
  resumeId: z.string(),
  activeResumeId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  resume: z.lazy(() => ResumeCreateNestedManyWithoutCandidateInputSchema).optional(),
  jobs: z.lazy(() => CandidatesOnJobsCreateNestedManyWithoutCandidateInputSchema).optional()
}).strict();

export const CandidateUncheckedCreateWithoutShortListedJobsInputSchema: z.ZodType<Prisma.CandidateUncheckedCreateWithoutShortListedJobsInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, {message:"Name cannot be empty"}),
  email: z.string().email({message:"Email is invalid"}).optional().nullable(),
  phone: z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid").optional().nullable(),
  address: z.string().min(1, {message: "Address cannot be empty"}).optional().nullable(),
  city: z.string().min(1, {message: "City cannot be empty"}).optional().nullable(),
  state: z.string().min(1, {message: "State cannot be empty"}).optional().nullable(),
  country: z.string().min(1, {message: "Country cannot be empty"}).optional().nullable(),
  zipCode: z.string().min(1, {message: "Zip code cannot be empty"}).optional().nullable(),
  age: z.number().positive({message:"Age must be a valid number"}).optional().nullable(),
  dob: z.coerce.date({invalid_type_error:"Date is invalid"}).optional().nullable(),
  gender: z.lazy(() => GenderSchema).optional().nullable(),
  jobExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  totalExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  relevantExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  skills: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pros: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  cons: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  score: z.number().positive({message:"Score must be a valid number"}).optional().nullable(),
  resumeId: z.string(),
  activeResumeId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  resume: z.lazy(() => ResumeUncheckedCreateNestedManyWithoutCandidateInputSchema).optional(),
  jobs: z.lazy(() => CandidatesOnJobsUncheckedCreateNestedManyWithoutCandidateInputSchema).optional()
}).strict();

export const CandidateCreateOrConnectWithoutShortListedJobsInputSchema: z.ZodType<Prisma.CandidateCreateOrConnectWithoutShortListedJobsInput> = z.object({
  where: z.lazy(() => CandidateWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CandidateCreateWithoutShortListedJobsInputSchema),z.lazy(() => CandidateUncheckedCreateWithoutShortListedJobsInputSchema) ]),
}).strict();

export const JobCreateWithoutShortListedCandidatesInputSchema: z.ZodType<Prisma.JobCreateWithoutShortListedCandidatesInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, {message: "Title cannot be empty"}),
  description: z.string().optional().nullable(),
  jobType: z.lazy(() => JobTypeSchema).optional().nullable(),
  location: z.string().optional().nullable(),
  shiftType: z.lazy(() => ShiftTypeSchema).optional().nullable(),
  expiryDate: z.coerce.date({invalid_type_error:"Date is invalid"}).optional().nullable(),
  createdAt: z.coerce.date().optional(),
  udpatedAt: z.coerce.date().optional(),
  department: z.lazy(() => DepartmentCreateNestedOneWithoutJobInputSchema),
  createdBy: z.lazy(() => UserCreateNestedOneWithoutJobInputSchema),
  resumes: z.lazy(() => JobsAndResumesCreateNestedManyWithoutJobInputSchema).optional(),
  candidates: z.lazy(() => CandidatesOnJobsCreateNestedManyWithoutJobInputSchema).optional()
}).strict();

export const JobUncheckedCreateWithoutShortListedCandidatesInputSchema: z.ZodType<Prisma.JobUncheckedCreateWithoutShortListedCandidatesInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, {message: "Title cannot be empty"}),
  description: z.string().optional().nullable(),
  jobType: z.lazy(() => JobTypeSchema).optional().nullable(),
  departmentId: z.string().min(1, {message: "Department is required"}).uuid({message:"User ID is invalid"}),
  location: z.string().optional().nullable(),
  shiftType: z.lazy(() => ShiftTypeSchema).optional().nullable(),
  expiryDate: z.coerce.date({invalid_type_error:"Date is invalid"}).optional().nullable(),
  createdById: z.string().min(1, {message: "User is required"}).uuid({message:"User ID is invalid"}),
  createdAt: z.coerce.date().optional(),
  udpatedAt: z.coerce.date().optional(),
  resumes: z.lazy(() => JobsAndResumesUncheckedCreateNestedManyWithoutJobInputSchema).optional(),
  candidates: z.lazy(() => CandidatesOnJobsUncheckedCreateNestedManyWithoutJobInputSchema).optional()
}).strict();

export const JobCreateOrConnectWithoutShortListedCandidatesInputSchema: z.ZodType<Prisma.JobCreateOrConnectWithoutShortListedCandidatesInput> = z.object({
  where: z.lazy(() => JobWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => JobCreateWithoutShortListedCandidatesInputSchema),z.lazy(() => JobUncheckedCreateWithoutShortListedCandidatesInputSchema) ]),
}).strict();

export const UserUpsertWithoutShortListedInputSchema: z.ZodType<Prisma.UserUpsertWithoutShortListedInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutShortListedInputSchema),z.lazy(() => UserUncheckedUpdateWithoutShortListedInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutShortListedInputSchema),z.lazy(() => UserUncheckedCreateWithoutShortListedInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutShortListedInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutShortListedInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutShortListedInputSchema),z.lazy(() => UserUncheckedUpdateWithoutShortListedInputSchema) ]),
}).strict();

export const UserUpdateWithoutShortListedInputSchema: z.ZodType<Prisma.UserUpdateWithoutShortListedInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string().min(1),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email({message: "Email is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid"),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string().min(6).max(16),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NullableEnumRoleFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneVerified: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profile: z.lazy(() => ProfileUpdateOneWithoutUserNestedInputSchema).optional(),
  job: z.lazy(() => JobUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  departments: z.lazy(() => DepartmentUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  ownedResumes: z.lazy(() => ResumeUpdateManyWithoutCreatedByNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutShortListedInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutShortListedInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string().min(1),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email({message: "Email is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid"),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string().min(6).max(16),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NullableEnumRoleFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneVerified: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profile: z.lazy(() => ProfileUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  job: z.lazy(() => JobUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  departments: z.lazy(() => DepartmentUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  ownedResumes: z.lazy(() => ResumeUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional()
}).strict();

export const CandidateUpsertWithoutShortListedJobsInputSchema: z.ZodType<Prisma.CandidateUpsertWithoutShortListedJobsInput> = z.object({
  update: z.union([ z.lazy(() => CandidateUpdateWithoutShortListedJobsInputSchema),z.lazy(() => CandidateUncheckedUpdateWithoutShortListedJobsInputSchema) ]),
  create: z.union([ z.lazy(() => CandidateCreateWithoutShortListedJobsInputSchema),z.lazy(() => CandidateUncheckedCreateWithoutShortListedJobsInputSchema) ]),
  where: z.lazy(() => CandidateWhereInputSchema).optional()
}).strict();

export const CandidateUpdateToOneWithWhereWithoutShortListedJobsInputSchema: z.ZodType<Prisma.CandidateUpdateToOneWithWhereWithoutShortListedJobsInput> = z.object({
  where: z.lazy(() => CandidateWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CandidateUpdateWithoutShortListedJobsInputSchema),z.lazy(() => CandidateUncheckedUpdateWithoutShortListedJobsInputSchema) ]),
}).strict();

export const CandidateUpdateWithoutShortListedJobsInputSchema: z.ZodType<Prisma.CandidateUpdateWithoutShortListedJobsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string().min(1, {message:"Name cannot be empty"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email({message:"Email is invalid"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid"),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string().min(1, {message: "Address cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string().min(1, {message: "City cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  state: z.union([ z.string().min(1, {message: "State cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  country: z.union([ z.string().min(1, {message: "Country cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  zipCode: z.union([ z.string().min(1, {message: "Zip code cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  age: z.union([ z.number().positive({message:"Age must be a valid number"}),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dob: z.union([ z.coerce.date({invalid_type_error:"Date is invalid"}),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  gender: z.union([ z.lazy(() => GenderSchema),z.lazy(() => NullableEnumGenderFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  jobExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  totalExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  relevantExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  skills: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pros: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  cons: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  score: z.union([ z.number().positive({message:"Score must be a valid number"}),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  resumeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  activeResumeId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  resume: z.lazy(() => ResumeUpdateManyWithoutCandidateNestedInputSchema).optional(),
  jobs: z.lazy(() => CandidatesOnJobsUpdateManyWithoutCandidateNestedInputSchema).optional()
}).strict();

export const CandidateUncheckedUpdateWithoutShortListedJobsInputSchema: z.ZodType<Prisma.CandidateUncheckedUpdateWithoutShortListedJobsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string().min(1, {message:"Name cannot be empty"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email({message:"Email is invalid"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid"),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string().min(1, {message: "Address cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string().min(1, {message: "City cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  state: z.union([ z.string().min(1, {message: "State cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  country: z.union([ z.string().min(1, {message: "Country cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  zipCode: z.union([ z.string().min(1, {message: "Zip code cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  age: z.union([ z.number().positive({message:"Age must be a valid number"}),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dob: z.union([ z.coerce.date({invalid_type_error:"Date is invalid"}),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  gender: z.union([ z.lazy(() => GenderSchema),z.lazy(() => NullableEnumGenderFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  jobExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  totalExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  relevantExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  skills: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pros: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  cons: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  score: z.union([ z.number().positive({message:"Score must be a valid number"}),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  resumeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  activeResumeId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  resume: z.lazy(() => ResumeUncheckedUpdateManyWithoutCandidateNestedInputSchema).optional(),
  jobs: z.lazy(() => CandidatesOnJobsUncheckedUpdateManyWithoutCandidateNestedInputSchema).optional()
}).strict();

export const JobUpsertWithoutShortListedCandidatesInputSchema: z.ZodType<Prisma.JobUpsertWithoutShortListedCandidatesInput> = z.object({
  update: z.union([ z.lazy(() => JobUpdateWithoutShortListedCandidatesInputSchema),z.lazy(() => JobUncheckedUpdateWithoutShortListedCandidatesInputSchema) ]),
  create: z.union([ z.lazy(() => JobCreateWithoutShortListedCandidatesInputSchema),z.lazy(() => JobUncheckedCreateWithoutShortListedCandidatesInputSchema) ]),
  where: z.lazy(() => JobWhereInputSchema).optional()
}).strict();

export const JobUpdateToOneWithWhereWithoutShortListedCandidatesInputSchema: z.ZodType<Prisma.JobUpdateToOneWithWhereWithoutShortListedCandidatesInput> = z.object({
  where: z.lazy(() => JobWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => JobUpdateWithoutShortListedCandidatesInputSchema),z.lazy(() => JobUncheckedUpdateWithoutShortListedCandidatesInputSchema) ]),
}).strict();

export const JobUpdateWithoutShortListedCandidatesInputSchema: z.ZodType<Prisma.JobUpdateWithoutShortListedCandidatesInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string().min(1, {message: "Title cannot be empty"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  jobType: z.union([ z.lazy(() => JobTypeSchema),z.lazy(() => NullableEnumJobTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  location: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shiftType: z.union([ z.lazy(() => ShiftTypeSchema),z.lazy(() => NullableEnumShiftTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date({invalid_type_error:"Date is invalid"}),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  udpatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  department: z.lazy(() => DepartmentUpdateOneRequiredWithoutJobNestedInputSchema).optional(),
  createdBy: z.lazy(() => UserUpdateOneRequiredWithoutJobNestedInputSchema).optional(),
  resumes: z.lazy(() => JobsAndResumesUpdateManyWithoutJobNestedInputSchema).optional(),
  candidates: z.lazy(() => CandidatesOnJobsUpdateManyWithoutJobNestedInputSchema).optional()
}).strict();

export const JobUncheckedUpdateWithoutShortListedCandidatesInputSchema: z.ZodType<Prisma.JobUncheckedUpdateWithoutShortListedCandidatesInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string().min(1, {message: "Title cannot be empty"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  jobType: z.union([ z.lazy(() => JobTypeSchema),z.lazy(() => NullableEnumJobTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  departmentId: z.union([ z.string().min(1, {message: "Department is required"}).uuid({message:"User ID is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shiftType: z.union([ z.lazy(() => ShiftTypeSchema),z.lazy(() => NullableEnumShiftTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date({invalid_type_error:"Date is invalid"}),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdById: z.union([ z.string().min(1, {message: "User is required"}).uuid({message:"User ID is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  udpatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  resumes: z.lazy(() => JobsAndResumesUncheckedUpdateManyWithoutJobNestedInputSchema).optional(),
  candidates: z.lazy(() => CandidatesOnJobsUncheckedUpdateManyWithoutJobNestedInputSchema).optional()
}).strict();

export const CandidateCreateWithoutResumeInputSchema: z.ZodType<Prisma.CandidateCreateWithoutResumeInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, {message:"Name cannot be empty"}),
  email: z.string().email({message:"Email is invalid"}).optional().nullable(),
  phone: z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid").optional().nullable(),
  address: z.string().min(1, {message: "Address cannot be empty"}).optional().nullable(),
  city: z.string().min(1, {message: "City cannot be empty"}).optional().nullable(),
  state: z.string().min(1, {message: "State cannot be empty"}).optional().nullable(),
  country: z.string().min(1, {message: "Country cannot be empty"}).optional().nullable(),
  zipCode: z.string().min(1, {message: "Zip code cannot be empty"}).optional().nullable(),
  age: z.number().positive({message:"Age must be a valid number"}).optional().nullable(),
  dob: z.coerce.date({invalid_type_error:"Date is invalid"}).optional().nullable(),
  gender: z.lazy(() => GenderSchema).optional().nullable(),
  jobExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  totalExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  relevantExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  skills: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pros: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  cons: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  score: z.number().positive({message:"Score must be a valid number"}).optional().nullable(),
  resumeId: z.string(),
  activeResumeId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  jobs: z.lazy(() => CandidatesOnJobsCreateNestedManyWithoutCandidateInputSchema).optional(),
  shortListedJobs: z.lazy(() => ShortListedCreateNestedManyWithoutCandidateInputSchema).optional()
}).strict();

export const CandidateUncheckedCreateWithoutResumeInputSchema: z.ZodType<Prisma.CandidateUncheckedCreateWithoutResumeInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, {message:"Name cannot be empty"}),
  email: z.string().email({message:"Email is invalid"}).optional().nullable(),
  phone: z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid").optional().nullable(),
  address: z.string().min(1, {message: "Address cannot be empty"}).optional().nullable(),
  city: z.string().min(1, {message: "City cannot be empty"}).optional().nullable(),
  state: z.string().min(1, {message: "State cannot be empty"}).optional().nullable(),
  country: z.string().min(1, {message: "Country cannot be empty"}).optional().nullable(),
  zipCode: z.string().min(1, {message: "Zip code cannot be empty"}).optional().nullable(),
  age: z.number().positive({message:"Age must be a valid number"}).optional().nullable(),
  dob: z.coerce.date({invalid_type_error:"Date is invalid"}).optional().nullable(),
  gender: z.lazy(() => GenderSchema).optional().nullable(),
  jobExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  totalExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  relevantExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  skills: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pros: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  cons: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  score: z.number().positive({message:"Score must be a valid number"}).optional().nullable(),
  resumeId: z.string(),
  activeResumeId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  jobs: z.lazy(() => CandidatesOnJobsUncheckedCreateNestedManyWithoutCandidateInputSchema).optional(),
  shortListedJobs: z.lazy(() => ShortListedUncheckedCreateNestedManyWithoutCandidateInputSchema).optional()
}).strict();

export const CandidateCreateOrConnectWithoutResumeInputSchema: z.ZodType<Prisma.CandidateCreateOrConnectWithoutResumeInput> = z.object({
  where: z.lazy(() => CandidateWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CandidateCreateWithoutResumeInputSchema),z.lazy(() => CandidateUncheckedCreateWithoutResumeInputSchema) ]),
}).strict();

export const JobsAndResumesCreateWithoutResumeInputSchema: z.ZodType<Prisma.JobsAndResumesCreateWithoutResumeInput> = z.object({
  job: z.lazy(() => JobCreateNestedOneWithoutResumesInputSchema)
}).strict();

export const JobsAndResumesUncheckedCreateWithoutResumeInputSchema: z.ZodType<Prisma.JobsAndResumesUncheckedCreateWithoutResumeInput> = z.object({
  jobId: z.string()
}).strict();

export const JobsAndResumesCreateOrConnectWithoutResumeInputSchema: z.ZodType<Prisma.JobsAndResumesCreateOrConnectWithoutResumeInput> = z.object({
  where: z.lazy(() => JobsAndResumesWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => JobsAndResumesCreateWithoutResumeInputSchema),z.lazy(() => JobsAndResumesUncheckedCreateWithoutResumeInputSchema) ]),
}).strict();

export const JobsAndResumesCreateManyResumeInputEnvelopeSchema: z.ZodType<Prisma.JobsAndResumesCreateManyResumeInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => JobsAndResumesCreateManyResumeInputSchema),z.lazy(() => JobsAndResumesCreateManyResumeInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserCreateWithoutOwnedResumesInputSchema: z.ZodType<Prisma.UserCreateWithoutOwnedResumesInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  email: z.string().email({message: "Email is invalid"}),
  phone: z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid"),
  password: z.string().min(6).max(16),
  role: z.lazy(() => RoleSchema).optional().nullable(),
  emailVerified: z.boolean().optional().nullable(),
  phoneVerified: z.boolean().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  profile: z.lazy(() => ProfileCreateNestedOneWithoutUserInputSchema).optional(),
  job: z.lazy(() => JobCreateNestedManyWithoutCreatedByInputSchema).optional(),
  departments: z.lazy(() => DepartmentCreateNestedManyWithoutCreatedByInputSchema).optional(),
  shortListed: z.lazy(() => ShortListedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutOwnedResumesInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutOwnedResumesInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  email: z.string().email({message: "Email is invalid"}),
  phone: z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid"),
  password: z.string().min(6).max(16),
  role: z.lazy(() => RoleSchema).optional().nullable(),
  emailVerified: z.boolean().optional().nullable(),
  phoneVerified: z.boolean().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  profile: z.lazy(() => ProfileUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  job: z.lazy(() => JobUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional(),
  departments: z.lazy(() => DepartmentUncheckedCreateNestedManyWithoutCreatedByInputSchema).optional(),
  shortListed: z.lazy(() => ShortListedUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutOwnedResumesInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutOwnedResumesInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutOwnedResumesInputSchema),z.lazy(() => UserUncheckedCreateWithoutOwnedResumesInputSchema) ]),
}).strict();

export const CandidateUpsertWithoutResumeInputSchema: z.ZodType<Prisma.CandidateUpsertWithoutResumeInput> = z.object({
  update: z.union([ z.lazy(() => CandidateUpdateWithoutResumeInputSchema),z.lazy(() => CandidateUncheckedUpdateWithoutResumeInputSchema) ]),
  create: z.union([ z.lazy(() => CandidateCreateWithoutResumeInputSchema),z.lazy(() => CandidateUncheckedCreateWithoutResumeInputSchema) ]),
  where: z.lazy(() => CandidateWhereInputSchema).optional()
}).strict();

export const CandidateUpdateToOneWithWhereWithoutResumeInputSchema: z.ZodType<Prisma.CandidateUpdateToOneWithWhereWithoutResumeInput> = z.object({
  where: z.lazy(() => CandidateWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CandidateUpdateWithoutResumeInputSchema),z.lazy(() => CandidateUncheckedUpdateWithoutResumeInputSchema) ]),
}).strict();

export const CandidateUpdateWithoutResumeInputSchema: z.ZodType<Prisma.CandidateUpdateWithoutResumeInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string().min(1, {message:"Name cannot be empty"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email({message:"Email is invalid"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid"),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string().min(1, {message: "Address cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string().min(1, {message: "City cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  state: z.union([ z.string().min(1, {message: "State cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  country: z.union([ z.string().min(1, {message: "Country cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  zipCode: z.union([ z.string().min(1, {message: "Zip code cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  age: z.union([ z.number().positive({message:"Age must be a valid number"}),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dob: z.union([ z.coerce.date({invalid_type_error:"Date is invalid"}),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  gender: z.union([ z.lazy(() => GenderSchema),z.lazy(() => NullableEnumGenderFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  jobExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  totalExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  relevantExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  skills: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pros: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  cons: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  score: z.union([ z.number().positive({message:"Score must be a valid number"}),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  resumeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  activeResumeId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  jobs: z.lazy(() => CandidatesOnJobsUpdateManyWithoutCandidateNestedInputSchema).optional(),
  shortListedJobs: z.lazy(() => ShortListedUpdateManyWithoutCandidateNestedInputSchema).optional()
}).strict();

export const CandidateUncheckedUpdateWithoutResumeInputSchema: z.ZodType<Prisma.CandidateUncheckedUpdateWithoutResumeInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string().min(1, {message:"Name cannot be empty"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email({message:"Email is invalid"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid"),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string().min(1, {message: "Address cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string().min(1, {message: "City cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  state: z.union([ z.string().min(1, {message: "State cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  country: z.union([ z.string().min(1, {message: "Country cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  zipCode: z.union([ z.string().min(1, {message: "Zip code cannot be empty"}),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  age: z.union([ z.number().positive({message:"Age must be a valid number"}),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dob: z.union([ z.coerce.date({invalid_type_error:"Date is invalid"}),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  gender: z.union([ z.lazy(() => GenderSchema),z.lazy(() => NullableEnumGenderFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  jobExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  totalExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  relevantExperience: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  skills: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  pros: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  cons: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  score: z.union([ z.number().positive({message:"Score must be a valid number"}),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  resumeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  activeResumeId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  jobs: z.lazy(() => CandidatesOnJobsUncheckedUpdateManyWithoutCandidateNestedInputSchema).optional(),
  shortListedJobs: z.lazy(() => ShortListedUncheckedUpdateManyWithoutCandidateNestedInputSchema).optional()
}).strict();

export const JobsAndResumesUpsertWithWhereUniqueWithoutResumeInputSchema: z.ZodType<Prisma.JobsAndResumesUpsertWithWhereUniqueWithoutResumeInput> = z.object({
  where: z.lazy(() => JobsAndResumesWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => JobsAndResumesUpdateWithoutResumeInputSchema),z.lazy(() => JobsAndResumesUncheckedUpdateWithoutResumeInputSchema) ]),
  create: z.union([ z.lazy(() => JobsAndResumesCreateWithoutResumeInputSchema),z.lazy(() => JobsAndResumesUncheckedCreateWithoutResumeInputSchema) ]),
}).strict();

export const JobsAndResumesUpdateWithWhereUniqueWithoutResumeInputSchema: z.ZodType<Prisma.JobsAndResumesUpdateWithWhereUniqueWithoutResumeInput> = z.object({
  where: z.lazy(() => JobsAndResumesWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => JobsAndResumesUpdateWithoutResumeInputSchema),z.lazy(() => JobsAndResumesUncheckedUpdateWithoutResumeInputSchema) ]),
}).strict();

export const JobsAndResumesUpdateManyWithWhereWithoutResumeInputSchema: z.ZodType<Prisma.JobsAndResumesUpdateManyWithWhereWithoutResumeInput> = z.object({
  where: z.lazy(() => JobsAndResumesScalarWhereInputSchema),
  data: z.union([ z.lazy(() => JobsAndResumesUpdateManyMutationInputSchema),z.lazy(() => JobsAndResumesUncheckedUpdateManyWithoutResumeInputSchema) ]),
}).strict();

export const UserUpsertWithoutOwnedResumesInputSchema: z.ZodType<Prisma.UserUpsertWithoutOwnedResumesInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutOwnedResumesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutOwnedResumesInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutOwnedResumesInputSchema),z.lazy(() => UserUncheckedCreateWithoutOwnedResumesInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutOwnedResumesInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutOwnedResumesInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutOwnedResumesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutOwnedResumesInputSchema) ]),
}).strict();

export const UserUpdateWithoutOwnedResumesInputSchema: z.ZodType<Prisma.UserUpdateWithoutOwnedResumesInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string().min(1),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email({message: "Email is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid"),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string().min(6).max(16),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NullableEnumRoleFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneVerified: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profile: z.lazy(() => ProfileUpdateOneWithoutUserNestedInputSchema).optional(),
  job: z.lazy(() => JobUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  departments: z.lazy(() => DepartmentUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  shortListed: z.lazy(() => ShortListedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutOwnedResumesInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutOwnedResumesInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string().min(1),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().email({message: "Email is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid"),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string().min(6).max(16),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NullableEnumRoleFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneVerified: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profile: z.lazy(() => ProfileUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  job: z.lazy(() => JobUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  departments: z.lazy(() => DepartmentUncheckedUpdateManyWithoutCreatedByNestedInputSchema).optional(),
  shortListed: z.lazy(() => ShortListedUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const JobCreateWithoutResumesInputSchema: z.ZodType<Prisma.JobCreateWithoutResumesInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, {message: "Title cannot be empty"}),
  description: z.string().optional().nullable(),
  jobType: z.lazy(() => JobTypeSchema).optional().nullable(),
  location: z.string().optional().nullable(),
  shiftType: z.lazy(() => ShiftTypeSchema).optional().nullable(),
  expiryDate: z.coerce.date({invalid_type_error:"Date is invalid"}).optional().nullable(),
  createdAt: z.coerce.date().optional(),
  udpatedAt: z.coerce.date().optional(),
  department: z.lazy(() => DepartmentCreateNestedOneWithoutJobInputSchema),
  createdBy: z.lazy(() => UserCreateNestedOneWithoutJobInputSchema),
  candidates: z.lazy(() => CandidatesOnJobsCreateNestedManyWithoutJobInputSchema).optional(),
  shortListedCandidates: z.lazy(() => ShortListedCreateNestedManyWithoutJobInputSchema).optional()
}).strict();

export const JobUncheckedCreateWithoutResumesInputSchema: z.ZodType<Prisma.JobUncheckedCreateWithoutResumesInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, {message: "Title cannot be empty"}),
  description: z.string().optional().nullable(),
  jobType: z.lazy(() => JobTypeSchema).optional().nullable(),
  departmentId: z.string().min(1, {message: "Department is required"}).uuid({message:"User ID is invalid"}),
  location: z.string().optional().nullable(),
  shiftType: z.lazy(() => ShiftTypeSchema).optional().nullable(),
  expiryDate: z.coerce.date({invalid_type_error:"Date is invalid"}).optional().nullable(),
  createdById: z.string().min(1, {message: "User is required"}).uuid({message:"User ID is invalid"}),
  createdAt: z.coerce.date().optional(),
  udpatedAt: z.coerce.date().optional(),
  candidates: z.lazy(() => CandidatesOnJobsUncheckedCreateNestedManyWithoutJobInputSchema).optional(),
  shortListedCandidates: z.lazy(() => ShortListedUncheckedCreateNestedManyWithoutJobInputSchema).optional()
}).strict();

export const JobCreateOrConnectWithoutResumesInputSchema: z.ZodType<Prisma.JobCreateOrConnectWithoutResumesInput> = z.object({
  where: z.lazy(() => JobWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => JobCreateWithoutResumesInputSchema),z.lazy(() => JobUncheckedCreateWithoutResumesInputSchema) ]),
}).strict();

export const ResumeCreateWithoutJobsInputSchema: z.ZodType<Prisma.ResumeCreateWithoutJobsInput> = z.object({
  id: z.string().uuid().optional(),
  fileKey: z.string().uuid({message:"Key is invalid"}),
  path: z.string().optional().nullable(),
  fullPath: z.string().optional().nullable(),
  url: z.string().url({message:"URL is invalid"}),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  candidate: z.lazy(() => CandidateCreateNestedOneWithoutResumeInputSchema).optional(),
  createdBy: z.lazy(() => UserCreateNestedOneWithoutOwnedResumesInputSchema).optional()
}).strict();

export const ResumeUncheckedCreateWithoutJobsInputSchema: z.ZodType<Prisma.ResumeUncheckedCreateWithoutJobsInput> = z.object({
  id: z.string().uuid().optional(),
  fileKey: z.string().uuid({message:"Key is invalid"}),
  path: z.string().optional().nullable(),
  fullPath: z.string().optional().nullable(),
  url: z.string().url({message:"URL is invalid"}),
  candidateId: z.string().optional().nullable(),
  createdById: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ResumeCreateOrConnectWithoutJobsInputSchema: z.ZodType<Prisma.ResumeCreateOrConnectWithoutJobsInput> = z.object({
  where: z.lazy(() => ResumeWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ResumeCreateWithoutJobsInputSchema),z.lazy(() => ResumeUncheckedCreateWithoutJobsInputSchema) ]),
}).strict();

export const JobUpsertWithoutResumesInputSchema: z.ZodType<Prisma.JobUpsertWithoutResumesInput> = z.object({
  update: z.union([ z.lazy(() => JobUpdateWithoutResumesInputSchema),z.lazy(() => JobUncheckedUpdateWithoutResumesInputSchema) ]),
  create: z.union([ z.lazy(() => JobCreateWithoutResumesInputSchema),z.lazy(() => JobUncheckedCreateWithoutResumesInputSchema) ]),
  where: z.lazy(() => JobWhereInputSchema).optional()
}).strict();

export const JobUpdateToOneWithWhereWithoutResumesInputSchema: z.ZodType<Prisma.JobUpdateToOneWithWhereWithoutResumesInput> = z.object({
  where: z.lazy(() => JobWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => JobUpdateWithoutResumesInputSchema),z.lazy(() => JobUncheckedUpdateWithoutResumesInputSchema) ]),
}).strict();

export const JobUpdateWithoutResumesInputSchema: z.ZodType<Prisma.JobUpdateWithoutResumesInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string().min(1, {message: "Title cannot be empty"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  jobType: z.union([ z.lazy(() => JobTypeSchema),z.lazy(() => NullableEnumJobTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  location: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shiftType: z.union([ z.lazy(() => ShiftTypeSchema),z.lazy(() => NullableEnumShiftTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date({invalid_type_error:"Date is invalid"}),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  udpatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  department: z.lazy(() => DepartmentUpdateOneRequiredWithoutJobNestedInputSchema).optional(),
  createdBy: z.lazy(() => UserUpdateOneRequiredWithoutJobNestedInputSchema).optional(),
  candidates: z.lazy(() => CandidatesOnJobsUpdateManyWithoutJobNestedInputSchema).optional(),
  shortListedCandidates: z.lazy(() => ShortListedUpdateManyWithoutJobNestedInputSchema).optional()
}).strict();

export const JobUncheckedUpdateWithoutResumesInputSchema: z.ZodType<Prisma.JobUncheckedUpdateWithoutResumesInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string().min(1, {message: "Title cannot be empty"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  jobType: z.union([ z.lazy(() => JobTypeSchema),z.lazy(() => NullableEnumJobTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  departmentId: z.union([ z.string().min(1, {message: "Department is required"}).uuid({message:"User ID is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shiftType: z.union([ z.lazy(() => ShiftTypeSchema),z.lazy(() => NullableEnumShiftTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date({invalid_type_error:"Date is invalid"}),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdById: z.union([ z.string().min(1, {message: "User is required"}).uuid({message:"User ID is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  udpatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  candidates: z.lazy(() => CandidatesOnJobsUncheckedUpdateManyWithoutJobNestedInputSchema).optional(),
  shortListedCandidates: z.lazy(() => ShortListedUncheckedUpdateManyWithoutJobNestedInputSchema).optional()
}).strict();

export const ResumeUpsertWithoutJobsInputSchema: z.ZodType<Prisma.ResumeUpsertWithoutJobsInput> = z.object({
  update: z.union([ z.lazy(() => ResumeUpdateWithoutJobsInputSchema),z.lazy(() => ResumeUncheckedUpdateWithoutJobsInputSchema) ]),
  create: z.union([ z.lazy(() => ResumeCreateWithoutJobsInputSchema),z.lazy(() => ResumeUncheckedCreateWithoutJobsInputSchema) ]),
  where: z.lazy(() => ResumeWhereInputSchema).optional()
}).strict();

export const ResumeUpdateToOneWithWhereWithoutJobsInputSchema: z.ZodType<Prisma.ResumeUpdateToOneWithWhereWithoutJobsInput> = z.object({
  where: z.lazy(() => ResumeWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ResumeUpdateWithoutJobsInputSchema),z.lazy(() => ResumeUncheckedUpdateWithoutJobsInputSchema) ]),
}).strict();

export const ResumeUpdateWithoutJobsInputSchema: z.ZodType<Prisma.ResumeUpdateWithoutJobsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fileKey: z.union([ z.string().uuid({message:"Key is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  path: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fullPath: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  url: z.union([ z.string().url({message:"URL is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  candidate: z.lazy(() => CandidateUpdateOneWithoutResumeNestedInputSchema).optional(),
  createdBy: z.lazy(() => UserUpdateOneWithoutOwnedResumesNestedInputSchema).optional()
}).strict();

export const ResumeUncheckedUpdateWithoutJobsInputSchema: z.ZodType<Prisma.ResumeUncheckedUpdateWithoutJobsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fileKey: z.union([ z.string().uuid({message:"Key is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  path: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fullPath: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  url: z.union([ z.string().url({message:"URL is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  candidateId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdById: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const JobCreateManyCreatedByInputSchema: z.ZodType<Prisma.JobCreateManyCreatedByInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, {message: "Title cannot be empty"}),
  description: z.string().optional().nullable(),
  jobType: z.lazy(() => JobTypeSchema).optional().nullable(),
  departmentId: z.string().min(1, {message: "Department is required"}).uuid({message:"User ID is invalid"}),
  location: z.string().optional().nullable(),
  shiftType: z.lazy(() => ShiftTypeSchema).optional().nullable(),
  expiryDate: z.coerce.date({invalid_type_error:"Date is invalid"}).optional().nullable(),
  createdAt: z.coerce.date().optional(),
  udpatedAt: z.coerce.date().optional()
}).strict();

export const DepartmentCreateManyCreatedByInputSchema: z.ZodType<Prisma.DepartmentCreateManyCreatedByInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, {message: "Title cannot be empty"}),
  description: z.string().optional().nullable(),
  isDeleted: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  udpatedAt: z.coerce.date().optional()
}).strict();

export const ShortListedCreateManyUserInputSchema: z.ZodType<Prisma.ShortListedCreateManyUserInput> = z.object({
  id: z.string().uuid().optional(),
  candidateId: z.string(),
  jobId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ResumeCreateManyCreatedByInputSchema: z.ZodType<Prisma.ResumeCreateManyCreatedByInput> = z.object({
  id: z.string().uuid().optional(),
  fileKey: z.string().uuid({message:"Key is invalid"}),
  path: z.string().optional().nullable(),
  fullPath: z.string().optional().nullable(),
  url: z.string().url({message:"URL is invalid"}),
  candidateId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const JobUpdateWithoutCreatedByInputSchema: z.ZodType<Prisma.JobUpdateWithoutCreatedByInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string().min(1, {message: "Title cannot be empty"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  jobType: z.union([ z.lazy(() => JobTypeSchema),z.lazy(() => NullableEnumJobTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  location: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shiftType: z.union([ z.lazy(() => ShiftTypeSchema),z.lazy(() => NullableEnumShiftTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date({invalid_type_error:"Date is invalid"}),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  udpatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  department: z.lazy(() => DepartmentUpdateOneRequiredWithoutJobNestedInputSchema).optional(),
  resumes: z.lazy(() => JobsAndResumesUpdateManyWithoutJobNestedInputSchema).optional(),
  candidates: z.lazy(() => CandidatesOnJobsUpdateManyWithoutJobNestedInputSchema).optional(),
  shortListedCandidates: z.lazy(() => ShortListedUpdateManyWithoutJobNestedInputSchema).optional()
}).strict();

export const JobUncheckedUpdateWithoutCreatedByInputSchema: z.ZodType<Prisma.JobUncheckedUpdateWithoutCreatedByInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string().min(1, {message: "Title cannot be empty"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  jobType: z.union([ z.lazy(() => JobTypeSchema),z.lazy(() => NullableEnumJobTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  departmentId: z.union([ z.string().min(1, {message: "Department is required"}).uuid({message:"User ID is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shiftType: z.union([ z.lazy(() => ShiftTypeSchema),z.lazy(() => NullableEnumShiftTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date({invalid_type_error:"Date is invalid"}),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  udpatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  resumes: z.lazy(() => JobsAndResumesUncheckedUpdateManyWithoutJobNestedInputSchema).optional(),
  candidates: z.lazy(() => CandidatesOnJobsUncheckedUpdateManyWithoutJobNestedInputSchema).optional(),
  shortListedCandidates: z.lazy(() => ShortListedUncheckedUpdateManyWithoutJobNestedInputSchema).optional()
}).strict();

export const JobUncheckedUpdateManyWithoutCreatedByInputSchema: z.ZodType<Prisma.JobUncheckedUpdateManyWithoutCreatedByInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string().min(1, {message: "Title cannot be empty"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  jobType: z.union([ z.lazy(() => JobTypeSchema),z.lazy(() => NullableEnumJobTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  departmentId: z.union([ z.string().min(1, {message: "Department is required"}).uuid({message:"User ID is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shiftType: z.union([ z.lazy(() => ShiftTypeSchema),z.lazy(() => NullableEnumShiftTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date({invalid_type_error:"Date is invalid"}),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  udpatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DepartmentUpdateWithoutCreatedByInputSchema: z.ZodType<Prisma.DepartmentUpdateWithoutCreatedByInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string().min(1, {message: "Title cannot be empty"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  udpatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  job: z.lazy(() => JobUpdateManyWithoutDepartmentNestedInputSchema).optional()
}).strict();

export const DepartmentUncheckedUpdateWithoutCreatedByInputSchema: z.ZodType<Prisma.DepartmentUncheckedUpdateWithoutCreatedByInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string().min(1, {message: "Title cannot be empty"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  udpatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  job: z.lazy(() => JobUncheckedUpdateManyWithoutDepartmentNestedInputSchema).optional()
}).strict();

export const DepartmentUncheckedUpdateManyWithoutCreatedByInputSchema: z.ZodType<Prisma.DepartmentUncheckedUpdateManyWithoutCreatedByInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string().min(1, {message: "Title cannot be empty"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isDeleted: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  udpatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ShortListedUpdateWithoutUserInputSchema: z.ZodType<Prisma.ShortListedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  candidate: z.lazy(() => CandidateUpdateOneRequiredWithoutShortListedJobsNestedInputSchema).optional(),
  job: z.lazy(() => JobUpdateOneRequiredWithoutShortListedCandidatesNestedInputSchema).optional()
}).strict();

export const ShortListedUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.ShortListedUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  candidateId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  jobId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ShortListedUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.ShortListedUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  candidateId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  jobId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ResumeUpdateWithoutCreatedByInputSchema: z.ZodType<Prisma.ResumeUpdateWithoutCreatedByInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fileKey: z.union([ z.string().uuid({message:"Key is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  path: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fullPath: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  url: z.union([ z.string().url({message:"URL is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  candidate: z.lazy(() => CandidateUpdateOneWithoutResumeNestedInputSchema).optional(),
  jobs: z.lazy(() => JobsAndResumesUpdateManyWithoutResumeNestedInputSchema).optional()
}).strict();

export const ResumeUncheckedUpdateWithoutCreatedByInputSchema: z.ZodType<Prisma.ResumeUncheckedUpdateWithoutCreatedByInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fileKey: z.union([ z.string().uuid({message:"Key is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  path: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fullPath: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  url: z.union([ z.string().url({message:"URL is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  candidateId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  jobs: z.lazy(() => JobsAndResumesUncheckedUpdateManyWithoutResumeNestedInputSchema).optional()
}).strict();

export const ResumeUncheckedUpdateManyWithoutCreatedByInputSchema: z.ZodType<Prisma.ResumeUncheckedUpdateManyWithoutCreatedByInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fileKey: z.union([ z.string().uuid({message:"Key is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  path: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fullPath: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  url: z.union([ z.string().url({message:"URL is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  candidateId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const JobsAndResumesCreateManyJobInputSchema: z.ZodType<Prisma.JobsAndResumesCreateManyJobInput> = z.object({
  resumeId: z.string()
}).strict();

export const CandidatesOnJobsCreateManyJobInputSchema: z.ZodType<Prisma.CandidatesOnJobsCreateManyJobInput> = z.object({
  id: z.string().uuid().optional(),
  candidateId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ShortListedCreateManyJobInputSchema: z.ZodType<Prisma.ShortListedCreateManyJobInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  candidateId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const JobsAndResumesUpdateWithoutJobInputSchema: z.ZodType<Prisma.JobsAndResumesUpdateWithoutJobInput> = z.object({
  resume: z.lazy(() => ResumeUpdateOneRequiredWithoutJobsNestedInputSchema).optional()
}).strict();

export const JobsAndResumesUncheckedUpdateWithoutJobInputSchema: z.ZodType<Prisma.JobsAndResumesUncheckedUpdateWithoutJobInput> = z.object({
  resumeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const JobsAndResumesUncheckedUpdateManyWithoutJobInputSchema: z.ZodType<Prisma.JobsAndResumesUncheckedUpdateManyWithoutJobInput> = z.object({
  resumeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CandidatesOnJobsUpdateWithoutJobInputSchema: z.ZodType<Prisma.CandidatesOnJobsUpdateWithoutJobInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  candidate: z.lazy(() => CandidateUpdateOneRequiredWithoutJobsNestedInputSchema).optional()
}).strict();

export const CandidatesOnJobsUncheckedUpdateWithoutJobInputSchema: z.ZodType<Prisma.CandidatesOnJobsUncheckedUpdateWithoutJobInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  candidateId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CandidatesOnJobsUncheckedUpdateManyWithoutJobInputSchema: z.ZodType<Prisma.CandidatesOnJobsUncheckedUpdateManyWithoutJobInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  candidateId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ShortListedUpdateWithoutJobInputSchema: z.ZodType<Prisma.ShortListedUpdateWithoutJobInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutShortListedNestedInputSchema).optional(),
  candidate: z.lazy(() => CandidateUpdateOneRequiredWithoutShortListedJobsNestedInputSchema).optional()
}).strict();

export const ShortListedUncheckedUpdateWithoutJobInputSchema: z.ZodType<Prisma.ShortListedUncheckedUpdateWithoutJobInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  candidateId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ShortListedUncheckedUpdateManyWithoutJobInputSchema: z.ZodType<Prisma.ShortListedUncheckedUpdateManyWithoutJobInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  candidateId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const JobCreateManyDepartmentInputSchema: z.ZodType<Prisma.JobCreateManyDepartmentInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, {message: "Title cannot be empty"}),
  description: z.string().optional().nullable(),
  jobType: z.lazy(() => JobTypeSchema).optional().nullable(),
  location: z.string().optional().nullable(),
  shiftType: z.lazy(() => ShiftTypeSchema).optional().nullable(),
  expiryDate: z.coerce.date({invalid_type_error:"Date is invalid"}).optional().nullable(),
  createdById: z.string().min(1, {message: "User is required"}).uuid({message:"User ID is invalid"}),
  createdAt: z.coerce.date().optional(),
  udpatedAt: z.coerce.date().optional()
}).strict();

export const JobUpdateWithoutDepartmentInputSchema: z.ZodType<Prisma.JobUpdateWithoutDepartmentInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string().min(1, {message: "Title cannot be empty"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  jobType: z.union([ z.lazy(() => JobTypeSchema),z.lazy(() => NullableEnumJobTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  location: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shiftType: z.union([ z.lazy(() => ShiftTypeSchema),z.lazy(() => NullableEnumShiftTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date({invalid_type_error:"Date is invalid"}),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  udpatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdBy: z.lazy(() => UserUpdateOneRequiredWithoutJobNestedInputSchema).optional(),
  resumes: z.lazy(() => JobsAndResumesUpdateManyWithoutJobNestedInputSchema).optional(),
  candidates: z.lazy(() => CandidatesOnJobsUpdateManyWithoutJobNestedInputSchema).optional(),
  shortListedCandidates: z.lazy(() => ShortListedUpdateManyWithoutJobNestedInputSchema).optional()
}).strict();

export const JobUncheckedUpdateWithoutDepartmentInputSchema: z.ZodType<Prisma.JobUncheckedUpdateWithoutDepartmentInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string().min(1, {message: "Title cannot be empty"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  jobType: z.union([ z.lazy(() => JobTypeSchema),z.lazy(() => NullableEnumJobTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  location: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shiftType: z.union([ z.lazy(() => ShiftTypeSchema),z.lazy(() => NullableEnumShiftTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date({invalid_type_error:"Date is invalid"}),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdById: z.union([ z.string().min(1, {message: "User is required"}).uuid({message:"User ID is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  udpatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  resumes: z.lazy(() => JobsAndResumesUncheckedUpdateManyWithoutJobNestedInputSchema).optional(),
  candidates: z.lazy(() => CandidatesOnJobsUncheckedUpdateManyWithoutJobNestedInputSchema).optional(),
  shortListedCandidates: z.lazy(() => ShortListedUncheckedUpdateManyWithoutJobNestedInputSchema).optional()
}).strict();

export const JobUncheckedUpdateManyWithoutDepartmentInputSchema: z.ZodType<Prisma.JobUncheckedUpdateManyWithoutDepartmentInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string().min(1, {message: "Title cannot be empty"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  jobType: z.union([ z.lazy(() => JobTypeSchema),z.lazy(() => NullableEnumJobTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  location: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shiftType: z.union([ z.lazy(() => ShiftTypeSchema),z.lazy(() => NullableEnumShiftTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date({invalid_type_error:"Date is invalid"}),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdById: z.union([ z.string().min(1, {message: "User is required"}).uuid({message:"User ID is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  udpatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ResumeCreateManyCandidateInputSchema: z.ZodType<Prisma.ResumeCreateManyCandidateInput> = z.object({
  id: z.string().uuid().optional(),
  fileKey: z.string().uuid({message:"Key is invalid"}),
  path: z.string().optional().nullable(),
  fullPath: z.string().optional().nullable(),
  url: z.string().url({message:"URL is invalid"}),
  createdById: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const CandidatesOnJobsCreateManyCandidateInputSchema: z.ZodType<Prisma.CandidatesOnJobsCreateManyCandidateInput> = z.object({
  id: z.string().uuid().optional(),
  jobId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ShortListedCreateManyCandidateInputSchema: z.ZodType<Prisma.ShortListedCreateManyCandidateInput> = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  jobId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ResumeUpdateWithoutCandidateInputSchema: z.ZodType<Prisma.ResumeUpdateWithoutCandidateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fileKey: z.union([ z.string().uuid({message:"Key is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  path: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fullPath: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  url: z.union([ z.string().url({message:"URL is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  jobs: z.lazy(() => JobsAndResumesUpdateManyWithoutResumeNestedInputSchema).optional(),
  createdBy: z.lazy(() => UserUpdateOneWithoutOwnedResumesNestedInputSchema).optional()
}).strict();

export const ResumeUncheckedUpdateWithoutCandidateInputSchema: z.ZodType<Prisma.ResumeUncheckedUpdateWithoutCandidateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fileKey: z.union([ z.string().uuid({message:"Key is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  path: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fullPath: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  url: z.union([ z.string().url({message:"URL is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdById: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  jobs: z.lazy(() => JobsAndResumesUncheckedUpdateManyWithoutResumeNestedInputSchema).optional()
}).strict();

export const ResumeUncheckedUpdateManyWithoutCandidateInputSchema: z.ZodType<Prisma.ResumeUncheckedUpdateManyWithoutCandidateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fileKey: z.union([ z.string().uuid({message:"Key is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  path: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fullPath: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  url: z.union([ z.string().url({message:"URL is invalid"}),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdById: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CandidatesOnJobsUpdateWithoutCandidateInputSchema: z.ZodType<Prisma.CandidatesOnJobsUpdateWithoutCandidateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  job: z.lazy(() => JobUpdateOneRequiredWithoutCandidatesNestedInputSchema).optional()
}).strict();

export const CandidatesOnJobsUncheckedUpdateWithoutCandidateInputSchema: z.ZodType<Prisma.CandidatesOnJobsUncheckedUpdateWithoutCandidateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  jobId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CandidatesOnJobsUncheckedUpdateManyWithoutCandidateInputSchema: z.ZodType<Prisma.CandidatesOnJobsUncheckedUpdateManyWithoutCandidateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  jobId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ShortListedUpdateWithoutCandidateInputSchema: z.ZodType<Prisma.ShortListedUpdateWithoutCandidateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutShortListedNestedInputSchema).optional(),
  job: z.lazy(() => JobUpdateOneRequiredWithoutShortListedCandidatesNestedInputSchema).optional()
}).strict();

export const ShortListedUncheckedUpdateWithoutCandidateInputSchema: z.ZodType<Prisma.ShortListedUncheckedUpdateWithoutCandidateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  jobId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ShortListedUncheckedUpdateManyWithoutCandidateInputSchema: z.ZodType<Prisma.ShortListedUncheckedUpdateManyWithoutCandidateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  jobId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const JobsAndResumesCreateManyResumeInputSchema: z.ZodType<Prisma.JobsAndResumesCreateManyResumeInput> = z.object({
  jobId: z.string()
}).strict();

export const JobsAndResumesUpdateWithoutResumeInputSchema: z.ZodType<Prisma.JobsAndResumesUpdateWithoutResumeInput> = z.object({
  job: z.lazy(() => JobUpdateOneRequiredWithoutResumesNestedInputSchema).optional()
}).strict();

export const JobsAndResumesUncheckedUpdateWithoutResumeInputSchema: z.ZodType<Prisma.JobsAndResumesUncheckedUpdateWithoutResumeInput> = z.object({
  jobId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const JobsAndResumesUncheckedUpdateManyWithoutResumeInputSchema: z.ZodType<Prisma.JobsAndResumesUncheckedUpdateManyWithoutResumeInput> = z.object({
  jobId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(),UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(),
  having: UserScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const ProfileFindFirstArgsSchema: z.ZodType<Prisma.ProfileFindFirstArgs> = z.object({
  select: ProfileSelectSchema.optional(),
  include: ProfileIncludeSchema.optional(),
  where: ProfileWhereInputSchema.optional(),
  orderBy: z.union([ ProfileOrderByWithRelationInputSchema.array(),ProfileOrderByWithRelationInputSchema ]).optional(),
  cursor: ProfileWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProfileScalarFieldEnumSchema,ProfileScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProfileFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ProfileFindFirstOrThrowArgs> = z.object({
  select: ProfileSelectSchema.optional(),
  include: ProfileIncludeSchema.optional(),
  where: ProfileWhereInputSchema.optional(),
  orderBy: z.union([ ProfileOrderByWithRelationInputSchema.array(),ProfileOrderByWithRelationInputSchema ]).optional(),
  cursor: ProfileWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProfileScalarFieldEnumSchema,ProfileScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProfileFindManyArgsSchema: z.ZodType<Prisma.ProfileFindManyArgs> = z.object({
  select: ProfileSelectSchema.optional(),
  include: ProfileIncludeSchema.optional(),
  where: ProfileWhereInputSchema.optional(),
  orderBy: z.union([ ProfileOrderByWithRelationInputSchema.array(),ProfileOrderByWithRelationInputSchema ]).optional(),
  cursor: ProfileWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProfileScalarFieldEnumSchema,ProfileScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProfileAggregateArgsSchema: z.ZodType<Prisma.ProfileAggregateArgs> = z.object({
  where: ProfileWhereInputSchema.optional(),
  orderBy: z.union([ ProfileOrderByWithRelationInputSchema.array(),ProfileOrderByWithRelationInputSchema ]).optional(),
  cursor: ProfileWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ProfileGroupByArgsSchema: z.ZodType<Prisma.ProfileGroupByArgs> = z.object({
  where: ProfileWhereInputSchema.optional(),
  orderBy: z.union([ ProfileOrderByWithAggregationInputSchema.array(),ProfileOrderByWithAggregationInputSchema ]).optional(),
  by: ProfileScalarFieldEnumSchema.array(),
  having: ProfileScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ProfileFindUniqueArgsSchema: z.ZodType<Prisma.ProfileFindUniqueArgs> = z.object({
  select: ProfileSelectSchema.optional(),
  include: ProfileIncludeSchema.optional(),
  where: ProfileWhereUniqueInputSchema,
}).strict() ;

export const ProfileFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ProfileFindUniqueOrThrowArgs> = z.object({
  select: ProfileSelectSchema.optional(),
  include: ProfileIncludeSchema.optional(),
  where: ProfileWhereUniqueInputSchema,
}).strict() ;

export const JobFindFirstArgsSchema: z.ZodType<Prisma.JobFindFirstArgs> = z.object({
  select: JobSelectSchema.optional(),
  include: JobIncludeSchema.optional(),
  where: JobWhereInputSchema.optional(),
  orderBy: z.union([ JobOrderByWithRelationInputSchema.array(),JobOrderByWithRelationInputSchema ]).optional(),
  cursor: JobWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ JobScalarFieldEnumSchema,JobScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const JobFindFirstOrThrowArgsSchema: z.ZodType<Prisma.JobFindFirstOrThrowArgs> = z.object({
  select: JobSelectSchema.optional(),
  include: JobIncludeSchema.optional(),
  where: JobWhereInputSchema.optional(),
  orderBy: z.union([ JobOrderByWithRelationInputSchema.array(),JobOrderByWithRelationInputSchema ]).optional(),
  cursor: JobWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ JobScalarFieldEnumSchema,JobScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const JobFindManyArgsSchema: z.ZodType<Prisma.JobFindManyArgs> = z.object({
  select: JobSelectSchema.optional(),
  include: JobIncludeSchema.optional(),
  where: JobWhereInputSchema.optional(),
  orderBy: z.union([ JobOrderByWithRelationInputSchema.array(),JobOrderByWithRelationInputSchema ]).optional(),
  cursor: JobWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ JobScalarFieldEnumSchema,JobScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const JobAggregateArgsSchema: z.ZodType<Prisma.JobAggregateArgs> = z.object({
  where: JobWhereInputSchema.optional(),
  orderBy: z.union([ JobOrderByWithRelationInputSchema.array(),JobOrderByWithRelationInputSchema ]).optional(),
  cursor: JobWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const JobGroupByArgsSchema: z.ZodType<Prisma.JobGroupByArgs> = z.object({
  where: JobWhereInputSchema.optional(),
  orderBy: z.union([ JobOrderByWithAggregationInputSchema.array(),JobOrderByWithAggregationInputSchema ]).optional(),
  by: JobScalarFieldEnumSchema.array(),
  having: JobScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const JobFindUniqueArgsSchema: z.ZodType<Prisma.JobFindUniqueArgs> = z.object({
  select: JobSelectSchema.optional(),
  include: JobIncludeSchema.optional(),
  where: JobWhereUniqueInputSchema,
}).strict() ;

export const JobFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.JobFindUniqueOrThrowArgs> = z.object({
  select: JobSelectSchema.optional(),
  include: JobIncludeSchema.optional(),
  where: JobWhereUniqueInputSchema,
}).strict() ;

export const DepartmentFindFirstArgsSchema: z.ZodType<Prisma.DepartmentFindFirstArgs> = z.object({
  select: DepartmentSelectSchema.optional(),
  include: DepartmentIncludeSchema.optional(),
  where: DepartmentWhereInputSchema.optional(),
  orderBy: z.union([ DepartmentOrderByWithRelationInputSchema.array(),DepartmentOrderByWithRelationInputSchema ]).optional(),
  cursor: DepartmentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DepartmentScalarFieldEnumSchema,DepartmentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DepartmentFindFirstOrThrowArgsSchema: z.ZodType<Prisma.DepartmentFindFirstOrThrowArgs> = z.object({
  select: DepartmentSelectSchema.optional(),
  include: DepartmentIncludeSchema.optional(),
  where: DepartmentWhereInputSchema.optional(),
  orderBy: z.union([ DepartmentOrderByWithRelationInputSchema.array(),DepartmentOrderByWithRelationInputSchema ]).optional(),
  cursor: DepartmentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DepartmentScalarFieldEnumSchema,DepartmentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DepartmentFindManyArgsSchema: z.ZodType<Prisma.DepartmentFindManyArgs> = z.object({
  select: DepartmentSelectSchema.optional(),
  include: DepartmentIncludeSchema.optional(),
  where: DepartmentWhereInputSchema.optional(),
  orderBy: z.union([ DepartmentOrderByWithRelationInputSchema.array(),DepartmentOrderByWithRelationInputSchema ]).optional(),
  cursor: DepartmentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DepartmentScalarFieldEnumSchema,DepartmentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DepartmentAggregateArgsSchema: z.ZodType<Prisma.DepartmentAggregateArgs> = z.object({
  where: DepartmentWhereInputSchema.optional(),
  orderBy: z.union([ DepartmentOrderByWithRelationInputSchema.array(),DepartmentOrderByWithRelationInputSchema ]).optional(),
  cursor: DepartmentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const DepartmentGroupByArgsSchema: z.ZodType<Prisma.DepartmentGroupByArgs> = z.object({
  where: DepartmentWhereInputSchema.optional(),
  orderBy: z.union([ DepartmentOrderByWithAggregationInputSchema.array(),DepartmentOrderByWithAggregationInputSchema ]).optional(),
  by: DepartmentScalarFieldEnumSchema.array(),
  having: DepartmentScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const DepartmentFindUniqueArgsSchema: z.ZodType<Prisma.DepartmentFindUniqueArgs> = z.object({
  select: DepartmentSelectSchema.optional(),
  include: DepartmentIncludeSchema.optional(),
  where: DepartmentWhereUniqueInputSchema,
}).strict() ;

export const DepartmentFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.DepartmentFindUniqueOrThrowArgs> = z.object({
  select: DepartmentSelectSchema.optional(),
  include: DepartmentIncludeSchema.optional(),
  where: DepartmentWhereUniqueInputSchema,
}).strict() ;

export const CandidateFindFirstArgsSchema: z.ZodType<Prisma.CandidateFindFirstArgs> = z.object({
  select: CandidateSelectSchema.optional(),
  include: CandidateIncludeSchema.optional(),
  where: CandidateWhereInputSchema.optional(),
  orderBy: z.union([ CandidateOrderByWithRelationInputSchema.array(),CandidateOrderByWithRelationInputSchema ]).optional(),
  cursor: CandidateWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CandidateScalarFieldEnumSchema,CandidateScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CandidateFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CandidateFindFirstOrThrowArgs> = z.object({
  select: CandidateSelectSchema.optional(),
  include: CandidateIncludeSchema.optional(),
  where: CandidateWhereInputSchema.optional(),
  orderBy: z.union([ CandidateOrderByWithRelationInputSchema.array(),CandidateOrderByWithRelationInputSchema ]).optional(),
  cursor: CandidateWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CandidateScalarFieldEnumSchema,CandidateScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CandidateFindManyArgsSchema: z.ZodType<Prisma.CandidateFindManyArgs> = z.object({
  select: CandidateSelectSchema.optional(),
  include: CandidateIncludeSchema.optional(),
  where: CandidateWhereInputSchema.optional(),
  orderBy: z.union([ CandidateOrderByWithRelationInputSchema.array(),CandidateOrderByWithRelationInputSchema ]).optional(),
  cursor: CandidateWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CandidateScalarFieldEnumSchema,CandidateScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CandidateAggregateArgsSchema: z.ZodType<Prisma.CandidateAggregateArgs> = z.object({
  where: CandidateWhereInputSchema.optional(),
  orderBy: z.union([ CandidateOrderByWithRelationInputSchema.array(),CandidateOrderByWithRelationInputSchema ]).optional(),
  cursor: CandidateWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CandidateGroupByArgsSchema: z.ZodType<Prisma.CandidateGroupByArgs> = z.object({
  where: CandidateWhereInputSchema.optional(),
  orderBy: z.union([ CandidateOrderByWithAggregationInputSchema.array(),CandidateOrderByWithAggregationInputSchema ]).optional(),
  by: CandidateScalarFieldEnumSchema.array(),
  having: CandidateScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CandidateFindUniqueArgsSchema: z.ZodType<Prisma.CandidateFindUniqueArgs> = z.object({
  select: CandidateSelectSchema.optional(),
  include: CandidateIncludeSchema.optional(),
  where: CandidateWhereUniqueInputSchema,
}).strict() ;

export const CandidateFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CandidateFindUniqueOrThrowArgs> = z.object({
  select: CandidateSelectSchema.optional(),
  include: CandidateIncludeSchema.optional(),
  where: CandidateWhereUniqueInputSchema,
}).strict() ;

export const CandidatesOnJobsFindFirstArgsSchema: z.ZodType<Prisma.CandidatesOnJobsFindFirstArgs> = z.object({
  select: CandidatesOnJobsSelectSchema.optional(),
  include: CandidatesOnJobsIncludeSchema.optional(),
  where: CandidatesOnJobsWhereInputSchema.optional(),
  orderBy: z.union([ CandidatesOnJobsOrderByWithRelationInputSchema.array(),CandidatesOnJobsOrderByWithRelationInputSchema ]).optional(),
  cursor: CandidatesOnJobsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CandidatesOnJobsScalarFieldEnumSchema,CandidatesOnJobsScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CandidatesOnJobsFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CandidatesOnJobsFindFirstOrThrowArgs> = z.object({
  select: CandidatesOnJobsSelectSchema.optional(),
  include: CandidatesOnJobsIncludeSchema.optional(),
  where: CandidatesOnJobsWhereInputSchema.optional(),
  orderBy: z.union([ CandidatesOnJobsOrderByWithRelationInputSchema.array(),CandidatesOnJobsOrderByWithRelationInputSchema ]).optional(),
  cursor: CandidatesOnJobsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CandidatesOnJobsScalarFieldEnumSchema,CandidatesOnJobsScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CandidatesOnJobsFindManyArgsSchema: z.ZodType<Prisma.CandidatesOnJobsFindManyArgs> = z.object({
  select: CandidatesOnJobsSelectSchema.optional(),
  include: CandidatesOnJobsIncludeSchema.optional(),
  where: CandidatesOnJobsWhereInputSchema.optional(),
  orderBy: z.union([ CandidatesOnJobsOrderByWithRelationInputSchema.array(),CandidatesOnJobsOrderByWithRelationInputSchema ]).optional(),
  cursor: CandidatesOnJobsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CandidatesOnJobsScalarFieldEnumSchema,CandidatesOnJobsScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CandidatesOnJobsAggregateArgsSchema: z.ZodType<Prisma.CandidatesOnJobsAggregateArgs> = z.object({
  where: CandidatesOnJobsWhereInputSchema.optional(),
  orderBy: z.union([ CandidatesOnJobsOrderByWithRelationInputSchema.array(),CandidatesOnJobsOrderByWithRelationInputSchema ]).optional(),
  cursor: CandidatesOnJobsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CandidatesOnJobsGroupByArgsSchema: z.ZodType<Prisma.CandidatesOnJobsGroupByArgs> = z.object({
  where: CandidatesOnJobsWhereInputSchema.optional(),
  orderBy: z.union([ CandidatesOnJobsOrderByWithAggregationInputSchema.array(),CandidatesOnJobsOrderByWithAggregationInputSchema ]).optional(),
  by: CandidatesOnJobsScalarFieldEnumSchema.array(),
  having: CandidatesOnJobsScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CandidatesOnJobsFindUniqueArgsSchema: z.ZodType<Prisma.CandidatesOnJobsFindUniqueArgs> = z.object({
  select: CandidatesOnJobsSelectSchema.optional(),
  include: CandidatesOnJobsIncludeSchema.optional(),
  where: CandidatesOnJobsWhereUniqueInputSchema,
}).strict() ;

export const CandidatesOnJobsFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CandidatesOnJobsFindUniqueOrThrowArgs> = z.object({
  select: CandidatesOnJobsSelectSchema.optional(),
  include: CandidatesOnJobsIncludeSchema.optional(),
  where: CandidatesOnJobsWhereUniqueInputSchema,
}).strict() ;

export const ShortListedFindFirstArgsSchema: z.ZodType<Prisma.ShortListedFindFirstArgs> = z.object({
  select: ShortListedSelectSchema.optional(),
  include: ShortListedIncludeSchema.optional(),
  where: ShortListedWhereInputSchema.optional(),
  orderBy: z.union([ ShortListedOrderByWithRelationInputSchema.array(),ShortListedOrderByWithRelationInputSchema ]).optional(),
  cursor: ShortListedWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ShortListedScalarFieldEnumSchema,ShortListedScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ShortListedFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ShortListedFindFirstOrThrowArgs> = z.object({
  select: ShortListedSelectSchema.optional(),
  include: ShortListedIncludeSchema.optional(),
  where: ShortListedWhereInputSchema.optional(),
  orderBy: z.union([ ShortListedOrderByWithRelationInputSchema.array(),ShortListedOrderByWithRelationInputSchema ]).optional(),
  cursor: ShortListedWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ShortListedScalarFieldEnumSchema,ShortListedScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ShortListedFindManyArgsSchema: z.ZodType<Prisma.ShortListedFindManyArgs> = z.object({
  select: ShortListedSelectSchema.optional(),
  include: ShortListedIncludeSchema.optional(),
  where: ShortListedWhereInputSchema.optional(),
  orderBy: z.union([ ShortListedOrderByWithRelationInputSchema.array(),ShortListedOrderByWithRelationInputSchema ]).optional(),
  cursor: ShortListedWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ShortListedScalarFieldEnumSchema,ShortListedScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ShortListedAggregateArgsSchema: z.ZodType<Prisma.ShortListedAggregateArgs> = z.object({
  where: ShortListedWhereInputSchema.optional(),
  orderBy: z.union([ ShortListedOrderByWithRelationInputSchema.array(),ShortListedOrderByWithRelationInputSchema ]).optional(),
  cursor: ShortListedWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ShortListedGroupByArgsSchema: z.ZodType<Prisma.ShortListedGroupByArgs> = z.object({
  where: ShortListedWhereInputSchema.optional(),
  orderBy: z.union([ ShortListedOrderByWithAggregationInputSchema.array(),ShortListedOrderByWithAggregationInputSchema ]).optional(),
  by: ShortListedScalarFieldEnumSchema.array(),
  having: ShortListedScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ShortListedFindUniqueArgsSchema: z.ZodType<Prisma.ShortListedFindUniqueArgs> = z.object({
  select: ShortListedSelectSchema.optional(),
  include: ShortListedIncludeSchema.optional(),
  where: ShortListedWhereUniqueInputSchema,
}).strict() ;

export const ShortListedFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ShortListedFindUniqueOrThrowArgs> = z.object({
  select: ShortListedSelectSchema.optional(),
  include: ShortListedIncludeSchema.optional(),
  where: ShortListedWhereUniqueInputSchema,
}).strict() ;

export const ResumeFindFirstArgsSchema: z.ZodType<Prisma.ResumeFindFirstArgs> = z.object({
  select: ResumeSelectSchema.optional(),
  include: ResumeIncludeSchema.optional(),
  where: ResumeWhereInputSchema.optional(),
  orderBy: z.union([ ResumeOrderByWithRelationInputSchema.array(),ResumeOrderByWithRelationInputSchema ]).optional(),
  cursor: ResumeWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ResumeScalarFieldEnumSchema,ResumeScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ResumeFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ResumeFindFirstOrThrowArgs> = z.object({
  select: ResumeSelectSchema.optional(),
  include: ResumeIncludeSchema.optional(),
  where: ResumeWhereInputSchema.optional(),
  orderBy: z.union([ ResumeOrderByWithRelationInputSchema.array(),ResumeOrderByWithRelationInputSchema ]).optional(),
  cursor: ResumeWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ResumeScalarFieldEnumSchema,ResumeScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ResumeFindManyArgsSchema: z.ZodType<Prisma.ResumeFindManyArgs> = z.object({
  select: ResumeSelectSchema.optional(),
  include: ResumeIncludeSchema.optional(),
  where: ResumeWhereInputSchema.optional(),
  orderBy: z.union([ ResumeOrderByWithRelationInputSchema.array(),ResumeOrderByWithRelationInputSchema ]).optional(),
  cursor: ResumeWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ResumeScalarFieldEnumSchema,ResumeScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ResumeAggregateArgsSchema: z.ZodType<Prisma.ResumeAggregateArgs> = z.object({
  where: ResumeWhereInputSchema.optional(),
  orderBy: z.union([ ResumeOrderByWithRelationInputSchema.array(),ResumeOrderByWithRelationInputSchema ]).optional(),
  cursor: ResumeWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ResumeGroupByArgsSchema: z.ZodType<Prisma.ResumeGroupByArgs> = z.object({
  where: ResumeWhereInputSchema.optional(),
  orderBy: z.union([ ResumeOrderByWithAggregationInputSchema.array(),ResumeOrderByWithAggregationInputSchema ]).optional(),
  by: ResumeScalarFieldEnumSchema.array(),
  having: ResumeScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ResumeFindUniqueArgsSchema: z.ZodType<Prisma.ResumeFindUniqueArgs> = z.object({
  select: ResumeSelectSchema.optional(),
  include: ResumeIncludeSchema.optional(),
  where: ResumeWhereUniqueInputSchema,
}).strict() ;

export const ResumeFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ResumeFindUniqueOrThrowArgs> = z.object({
  select: ResumeSelectSchema.optional(),
  include: ResumeIncludeSchema.optional(),
  where: ResumeWhereUniqueInputSchema,
}).strict() ;

export const JobsAndResumesFindFirstArgsSchema: z.ZodType<Prisma.JobsAndResumesFindFirstArgs> = z.object({
  select: JobsAndResumesSelectSchema.optional(),
  include: JobsAndResumesIncludeSchema.optional(),
  where: JobsAndResumesWhereInputSchema.optional(),
  orderBy: z.union([ JobsAndResumesOrderByWithRelationInputSchema.array(),JobsAndResumesOrderByWithRelationInputSchema ]).optional(),
  cursor: JobsAndResumesWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ JobsAndResumesScalarFieldEnumSchema,JobsAndResumesScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const JobsAndResumesFindFirstOrThrowArgsSchema: z.ZodType<Prisma.JobsAndResumesFindFirstOrThrowArgs> = z.object({
  select: JobsAndResumesSelectSchema.optional(),
  include: JobsAndResumesIncludeSchema.optional(),
  where: JobsAndResumesWhereInputSchema.optional(),
  orderBy: z.union([ JobsAndResumesOrderByWithRelationInputSchema.array(),JobsAndResumesOrderByWithRelationInputSchema ]).optional(),
  cursor: JobsAndResumesWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ JobsAndResumesScalarFieldEnumSchema,JobsAndResumesScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const JobsAndResumesFindManyArgsSchema: z.ZodType<Prisma.JobsAndResumesFindManyArgs> = z.object({
  select: JobsAndResumesSelectSchema.optional(),
  include: JobsAndResumesIncludeSchema.optional(),
  where: JobsAndResumesWhereInputSchema.optional(),
  orderBy: z.union([ JobsAndResumesOrderByWithRelationInputSchema.array(),JobsAndResumesOrderByWithRelationInputSchema ]).optional(),
  cursor: JobsAndResumesWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ JobsAndResumesScalarFieldEnumSchema,JobsAndResumesScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const JobsAndResumesAggregateArgsSchema: z.ZodType<Prisma.JobsAndResumesAggregateArgs> = z.object({
  where: JobsAndResumesWhereInputSchema.optional(),
  orderBy: z.union([ JobsAndResumesOrderByWithRelationInputSchema.array(),JobsAndResumesOrderByWithRelationInputSchema ]).optional(),
  cursor: JobsAndResumesWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const JobsAndResumesGroupByArgsSchema: z.ZodType<Prisma.JobsAndResumesGroupByArgs> = z.object({
  where: JobsAndResumesWhereInputSchema.optional(),
  orderBy: z.union([ JobsAndResumesOrderByWithAggregationInputSchema.array(),JobsAndResumesOrderByWithAggregationInputSchema ]).optional(),
  by: JobsAndResumesScalarFieldEnumSchema.array(),
  having: JobsAndResumesScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const JobsAndResumesFindUniqueArgsSchema: z.ZodType<Prisma.JobsAndResumesFindUniqueArgs> = z.object({
  select: JobsAndResumesSelectSchema.optional(),
  include: JobsAndResumesIncludeSchema.optional(),
  where: JobsAndResumesWhereUniqueInputSchema,
}).strict() ;

export const JobsAndResumesFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.JobsAndResumesFindUniqueOrThrowArgs> = z.object({
  select: JobsAndResumesSelectSchema.optional(),
  include: JobsAndResumesIncludeSchema.optional(),
  where: JobsAndResumesWhereUniqueInputSchema,
}).strict() ;

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
}).strict() ;

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
  create: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
}).strict() ;

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
}).strict() ;

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(),
}).strict() ;

export const ProfileCreateArgsSchema: z.ZodType<Prisma.ProfileCreateArgs> = z.object({
  select: ProfileSelectSchema.optional(),
  include: ProfileIncludeSchema.optional(),
  data: z.union([ ProfileCreateInputSchema,ProfileUncheckedCreateInputSchema ]),
}).strict() ;

export const ProfileUpsertArgsSchema: z.ZodType<Prisma.ProfileUpsertArgs> = z.object({
  select: ProfileSelectSchema.optional(),
  include: ProfileIncludeSchema.optional(),
  where: ProfileWhereUniqueInputSchema,
  create: z.union([ ProfileCreateInputSchema,ProfileUncheckedCreateInputSchema ]),
  update: z.union([ ProfileUpdateInputSchema,ProfileUncheckedUpdateInputSchema ]),
}).strict() ;

export const ProfileCreateManyArgsSchema: z.ZodType<Prisma.ProfileCreateManyArgs> = z.object({
  data: z.union([ ProfileCreateManyInputSchema,ProfileCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ProfileDeleteArgsSchema: z.ZodType<Prisma.ProfileDeleteArgs> = z.object({
  select: ProfileSelectSchema.optional(),
  include: ProfileIncludeSchema.optional(),
  where: ProfileWhereUniqueInputSchema,
}).strict() ;

export const ProfileUpdateArgsSchema: z.ZodType<Prisma.ProfileUpdateArgs> = z.object({
  select: ProfileSelectSchema.optional(),
  include: ProfileIncludeSchema.optional(),
  data: z.union([ ProfileUpdateInputSchema,ProfileUncheckedUpdateInputSchema ]),
  where: ProfileWhereUniqueInputSchema,
}).strict() ;

export const ProfileUpdateManyArgsSchema: z.ZodType<Prisma.ProfileUpdateManyArgs> = z.object({
  data: z.union([ ProfileUpdateManyMutationInputSchema,ProfileUncheckedUpdateManyInputSchema ]),
  where: ProfileWhereInputSchema.optional(),
}).strict() ;

export const ProfileDeleteManyArgsSchema: z.ZodType<Prisma.ProfileDeleteManyArgs> = z.object({
  where: ProfileWhereInputSchema.optional(),
}).strict() ;

export const JobCreateArgsSchema: z.ZodType<Prisma.JobCreateArgs> = z.object({
  select: JobSelectSchema.optional(),
  include: JobIncludeSchema.optional(),
  data: z.union([ JobCreateInputSchema,JobUncheckedCreateInputSchema ]),
}).strict() ;

export const JobUpsertArgsSchema: z.ZodType<Prisma.JobUpsertArgs> = z.object({
  select: JobSelectSchema.optional(),
  include: JobIncludeSchema.optional(),
  where: JobWhereUniqueInputSchema,
  create: z.union([ JobCreateInputSchema,JobUncheckedCreateInputSchema ]),
  update: z.union([ JobUpdateInputSchema,JobUncheckedUpdateInputSchema ]),
}).strict() ;

export const JobCreateManyArgsSchema: z.ZodType<Prisma.JobCreateManyArgs> = z.object({
  data: z.union([ JobCreateManyInputSchema,JobCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const JobDeleteArgsSchema: z.ZodType<Prisma.JobDeleteArgs> = z.object({
  select: JobSelectSchema.optional(),
  include: JobIncludeSchema.optional(),
  where: JobWhereUniqueInputSchema,
}).strict() ;

export const JobUpdateArgsSchema: z.ZodType<Prisma.JobUpdateArgs> = z.object({
  select: JobSelectSchema.optional(),
  include: JobIncludeSchema.optional(),
  data: z.union([ JobUpdateInputSchema,JobUncheckedUpdateInputSchema ]),
  where: JobWhereUniqueInputSchema,
}).strict() ;

export const JobUpdateManyArgsSchema: z.ZodType<Prisma.JobUpdateManyArgs> = z.object({
  data: z.union([ JobUpdateManyMutationInputSchema,JobUncheckedUpdateManyInputSchema ]),
  where: JobWhereInputSchema.optional(),
}).strict() ;

export const JobDeleteManyArgsSchema: z.ZodType<Prisma.JobDeleteManyArgs> = z.object({
  where: JobWhereInputSchema.optional(),
}).strict() ;

export const DepartmentCreateArgsSchema: z.ZodType<Prisma.DepartmentCreateArgs> = z.object({
  select: DepartmentSelectSchema.optional(),
  include: DepartmentIncludeSchema.optional(),
  data: z.union([ DepartmentCreateInputSchema,DepartmentUncheckedCreateInputSchema ]),
}).strict() ;

export const DepartmentUpsertArgsSchema: z.ZodType<Prisma.DepartmentUpsertArgs> = z.object({
  select: DepartmentSelectSchema.optional(),
  include: DepartmentIncludeSchema.optional(),
  where: DepartmentWhereUniqueInputSchema,
  create: z.union([ DepartmentCreateInputSchema,DepartmentUncheckedCreateInputSchema ]),
  update: z.union([ DepartmentUpdateInputSchema,DepartmentUncheckedUpdateInputSchema ]),
}).strict() ;

export const DepartmentCreateManyArgsSchema: z.ZodType<Prisma.DepartmentCreateManyArgs> = z.object({
  data: z.union([ DepartmentCreateManyInputSchema,DepartmentCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const DepartmentDeleteArgsSchema: z.ZodType<Prisma.DepartmentDeleteArgs> = z.object({
  select: DepartmentSelectSchema.optional(),
  include: DepartmentIncludeSchema.optional(),
  where: DepartmentWhereUniqueInputSchema,
}).strict() ;

export const DepartmentUpdateArgsSchema: z.ZodType<Prisma.DepartmentUpdateArgs> = z.object({
  select: DepartmentSelectSchema.optional(),
  include: DepartmentIncludeSchema.optional(),
  data: z.union([ DepartmentUpdateInputSchema,DepartmentUncheckedUpdateInputSchema ]),
  where: DepartmentWhereUniqueInputSchema,
}).strict() ;

export const DepartmentUpdateManyArgsSchema: z.ZodType<Prisma.DepartmentUpdateManyArgs> = z.object({
  data: z.union([ DepartmentUpdateManyMutationInputSchema,DepartmentUncheckedUpdateManyInputSchema ]),
  where: DepartmentWhereInputSchema.optional(),
}).strict() ;

export const DepartmentDeleteManyArgsSchema: z.ZodType<Prisma.DepartmentDeleteManyArgs> = z.object({
  where: DepartmentWhereInputSchema.optional(),
}).strict() ;

export const CandidateCreateArgsSchema: z.ZodType<Prisma.CandidateCreateArgs> = z.object({
  select: CandidateSelectSchema.optional(),
  include: CandidateIncludeSchema.optional(),
  data: z.union([ CandidateCreateInputSchema,CandidateUncheckedCreateInputSchema ]),
}).strict() ;

export const CandidateUpsertArgsSchema: z.ZodType<Prisma.CandidateUpsertArgs> = z.object({
  select: CandidateSelectSchema.optional(),
  include: CandidateIncludeSchema.optional(),
  where: CandidateWhereUniqueInputSchema,
  create: z.union([ CandidateCreateInputSchema,CandidateUncheckedCreateInputSchema ]),
  update: z.union([ CandidateUpdateInputSchema,CandidateUncheckedUpdateInputSchema ]),
}).strict() ;

export const CandidateCreateManyArgsSchema: z.ZodType<Prisma.CandidateCreateManyArgs> = z.object({
  data: z.union([ CandidateCreateManyInputSchema,CandidateCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CandidateDeleteArgsSchema: z.ZodType<Prisma.CandidateDeleteArgs> = z.object({
  select: CandidateSelectSchema.optional(),
  include: CandidateIncludeSchema.optional(),
  where: CandidateWhereUniqueInputSchema,
}).strict() ;

export const CandidateUpdateArgsSchema: z.ZodType<Prisma.CandidateUpdateArgs> = z.object({
  select: CandidateSelectSchema.optional(),
  include: CandidateIncludeSchema.optional(),
  data: z.union([ CandidateUpdateInputSchema,CandidateUncheckedUpdateInputSchema ]),
  where: CandidateWhereUniqueInputSchema,
}).strict() ;

export const CandidateUpdateManyArgsSchema: z.ZodType<Prisma.CandidateUpdateManyArgs> = z.object({
  data: z.union([ CandidateUpdateManyMutationInputSchema,CandidateUncheckedUpdateManyInputSchema ]),
  where: CandidateWhereInputSchema.optional(),
}).strict() ;

export const CandidateDeleteManyArgsSchema: z.ZodType<Prisma.CandidateDeleteManyArgs> = z.object({
  where: CandidateWhereInputSchema.optional(),
}).strict() ;

export const CandidatesOnJobsCreateArgsSchema: z.ZodType<Prisma.CandidatesOnJobsCreateArgs> = z.object({
  select: CandidatesOnJobsSelectSchema.optional(),
  include: CandidatesOnJobsIncludeSchema.optional(),
  data: z.union([ CandidatesOnJobsCreateInputSchema,CandidatesOnJobsUncheckedCreateInputSchema ]),
}).strict() ;

export const CandidatesOnJobsUpsertArgsSchema: z.ZodType<Prisma.CandidatesOnJobsUpsertArgs> = z.object({
  select: CandidatesOnJobsSelectSchema.optional(),
  include: CandidatesOnJobsIncludeSchema.optional(),
  where: CandidatesOnJobsWhereUniqueInputSchema,
  create: z.union([ CandidatesOnJobsCreateInputSchema,CandidatesOnJobsUncheckedCreateInputSchema ]),
  update: z.union([ CandidatesOnJobsUpdateInputSchema,CandidatesOnJobsUncheckedUpdateInputSchema ]),
}).strict() ;

export const CandidatesOnJobsCreateManyArgsSchema: z.ZodType<Prisma.CandidatesOnJobsCreateManyArgs> = z.object({
  data: z.union([ CandidatesOnJobsCreateManyInputSchema,CandidatesOnJobsCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CandidatesOnJobsDeleteArgsSchema: z.ZodType<Prisma.CandidatesOnJobsDeleteArgs> = z.object({
  select: CandidatesOnJobsSelectSchema.optional(),
  include: CandidatesOnJobsIncludeSchema.optional(),
  where: CandidatesOnJobsWhereUniqueInputSchema,
}).strict() ;

export const CandidatesOnJobsUpdateArgsSchema: z.ZodType<Prisma.CandidatesOnJobsUpdateArgs> = z.object({
  select: CandidatesOnJobsSelectSchema.optional(),
  include: CandidatesOnJobsIncludeSchema.optional(),
  data: z.union([ CandidatesOnJobsUpdateInputSchema,CandidatesOnJobsUncheckedUpdateInputSchema ]),
  where: CandidatesOnJobsWhereUniqueInputSchema,
}).strict() ;

export const CandidatesOnJobsUpdateManyArgsSchema: z.ZodType<Prisma.CandidatesOnJobsUpdateManyArgs> = z.object({
  data: z.union([ CandidatesOnJobsUpdateManyMutationInputSchema,CandidatesOnJobsUncheckedUpdateManyInputSchema ]),
  where: CandidatesOnJobsWhereInputSchema.optional(),
}).strict() ;

export const CandidatesOnJobsDeleteManyArgsSchema: z.ZodType<Prisma.CandidatesOnJobsDeleteManyArgs> = z.object({
  where: CandidatesOnJobsWhereInputSchema.optional(),
}).strict() ;

export const ShortListedCreateArgsSchema: z.ZodType<Prisma.ShortListedCreateArgs> = z.object({
  select: ShortListedSelectSchema.optional(),
  include: ShortListedIncludeSchema.optional(),
  data: z.union([ ShortListedCreateInputSchema,ShortListedUncheckedCreateInputSchema ]),
}).strict() ;

export const ShortListedUpsertArgsSchema: z.ZodType<Prisma.ShortListedUpsertArgs> = z.object({
  select: ShortListedSelectSchema.optional(),
  include: ShortListedIncludeSchema.optional(),
  where: ShortListedWhereUniqueInputSchema,
  create: z.union([ ShortListedCreateInputSchema,ShortListedUncheckedCreateInputSchema ]),
  update: z.union([ ShortListedUpdateInputSchema,ShortListedUncheckedUpdateInputSchema ]),
}).strict() ;

export const ShortListedCreateManyArgsSchema: z.ZodType<Prisma.ShortListedCreateManyArgs> = z.object({
  data: z.union([ ShortListedCreateManyInputSchema,ShortListedCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ShortListedDeleteArgsSchema: z.ZodType<Prisma.ShortListedDeleteArgs> = z.object({
  select: ShortListedSelectSchema.optional(),
  include: ShortListedIncludeSchema.optional(),
  where: ShortListedWhereUniqueInputSchema,
}).strict() ;

export const ShortListedUpdateArgsSchema: z.ZodType<Prisma.ShortListedUpdateArgs> = z.object({
  select: ShortListedSelectSchema.optional(),
  include: ShortListedIncludeSchema.optional(),
  data: z.union([ ShortListedUpdateInputSchema,ShortListedUncheckedUpdateInputSchema ]),
  where: ShortListedWhereUniqueInputSchema,
}).strict() ;

export const ShortListedUpdateManyArgsSchema: z.ZodType<Prisma.ShortListedUpdateManyArgs> = z.object({
  data: z.union([ ShortListedUpdateManyMutationInputSchema,ShortListedUncheckedUpdateManyInputSchema ]),
  where: ShortListedWhereInputSchema.optional(),
}).strict() ;

export const ShortListedDeleteManyArgsSchema: z.ZodType<Prisma.ShortListedDeleteManyArgs> = z.object({
  where: ShortListedWhereInputSchema.optional(),
}).strict() ;

export const ResumeCreateArgsSchema: z.ZodType<Prisma.ResumeCreateArgs> = z.object({
  select: ResumeSelectSchema.optional(),
  include: ResumeIncludeSchema.optional(),
  data: z.union([ ResumeCreateInputSchema,ResumeUncheckedCreateInputSchema ]),
}).strict() ;

export const ResumeUpsertArgsSchema: z.ZodType<Prisma.ResumeUpsertArgs> = z.object({
  select: ResumeSelectSchema.optional(),
  include: ResumeIncludeSchema.optional(),
  where: ResumeWhereUniqueInputSchema,
  create: z.union([ ResumeCreateInputSchema,ResumeUncheckedCreateInputSchema ]),
  update: z.union([ ResumeUpdateInputSchema,ResumeUncheckedUpdateInputSchema ]),
}).strict() ;

export const ResumeCreateManyArgsSchema: z.ZodType<Prisma.ResumeCreateManyArgs> = z.object({
  data: z.union([ ResumeCreateManyInputSchema,ResumeCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ResumeDeleteArgsSchema: z.ZodType<Prisma.ResumeDeleteArgs> = z.object({
  select: ResumeSelectSchema.optional(),
  include: ResumeIncludeSchema.optional(),
  where: ResumeWhereUniqueInputSchema,
}).strict() ;

export const ResumeUpdateArgsSchema: z.ZodType<Prisma.ResumeUpdateArgs> = z.object({
  select: ResumeSelectSchema.optional(),
  include: ResumeIncludeSchema.optional(),
  data: z.union([ ResumeUpdateInputSchema,ResumeUncheckedUpdateInputSchema ]),
  where: ResumeWhereUniqueInputSchema,
}).strict() ;

export const ResumeUpdateManyArgsSchema: z.ZodType<Prisma.ResumeUpdateManyArgs> = z.object({
  data: z.union([ ResumeUpdateManyMutationInputSchema,ResumeUncheckedUpdateManyInputSchema ]),
  where: ResumeWhereInputSchema.optional(),
}).strict() ;

export const ResumeDeleteManyArgsSchema: z.ZodType<Prisma.ResumeDeleteManyArgs> = z.object({
  where: ResumeWhereInputSchema.optional(),
}).strict() ;

export const JobsAndResumesCreateArgsSchema: z.ZodType<Prisma.JobsAndResumesCreateArgs> = z.object({
  select: JobsAndResumesSelectSchema.optional(),
  include: JobsAndResumesIncludeSchema.optional(),
  data: z.union([ JobsAndResumesCreateInputSchema,JobsAndResumesUncheckedCreateInputSchema ]),
}).strict() ;

export const JobsAndResumesUpsertArgsSchema: z.ZodType<Prisma.JobsAndResumesUpsertArgs> = z.object({
  select: JobsAndResumesSelectSchema.optional(),
  include: JobsAndResumesIncludeSchema.optional(),
  where: JobsAndResumesWhereUniqueInputSchema,
  create: z.union([ JobsAndResumesCreateInputSchema,JobsAndResumesUncheckedCreateInputSchema ]),
  update: z.union([ JobsAndResumesUpdateInputSchema,JobsAndResumesUncheckedUpdateInputSchema ]),
}).strict() ;

export const JobsAndResumesCreateManyArgsSchema: z.ZodType<Prisma.JobsAndResumesCreateManyArgs> = z.object({
  data: z.union([ JobsAndResumesCreateManyInputSchema,JobsAndResumesCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const JobsAndResumesDeleteArgsSchema: z.ZodType<Prisma.JobsAndResumesDeleteArgs> = z.object({
  select: JobsAndResumesSelectSchema.optional(),
  include: JobsAndResumesIncludeSchema.optional(),
  where: JobsAndResumesWhereUniqueInputSchema,
}).strict() ;

export const JobsAndResumesUpdateArgsSchema: z.ZodType<Prisma.JobsAndResumesUpdateArgs> = z.object({
  select: JobsAndResumesSelectSchema.optional(),
  include: JobsAndResumesIncludeSchema.optional(),
  data: z.union([ JobsAndResumesUpdateInputSchema,JobsAndResumesUncheckedUpdateInputSchema ]),
  where: JobsAndResumesWhereUniqueInputSchema,
}).strict() ;

export const JobsAndResumesUpdateManyArgsSchema: z.ZodType<Prisma.JobsAndResumesUpdateManyArgs> = z.object({
  data: z.union([ JobsAndResumesUpdateManyMutationInputSchema,JobsAndResumesUncheckedUpdateManyInputSchema ]),
  where: JobsAndResumesWhereInputSchema.optional(),
}).strict() ;

export const JobsAndResumesDeleteManyArgsSchema: z.ZodType<Prisma.JobsAndResumesDeleteManyArgs> = z.object({
  where: JobsAndResumesWhereInputSchema.optional(),
}).strict() ;