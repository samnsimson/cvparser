import { z } from 'zod';

export const CandidateScalarFieldEnumSchema = z.enum(['id','name','email','phone','address','city','state','country','zipCode','age','dob','gender','jobExperience','totalExperience','relevantExperience','skills','pros','cons','score','activeResumeId','createdAt','updatedAt','resumeId']);

export default CandidateScalarFieldEnumSchema;
