import { z } from 'zod';

export const CandidatesOnJobsScalarFieldEnumSchema = z.enum(['id','candidateId','jobId','createdAt','updatedAt']);

export default CandidatesOnJobsScalarFieldEnumSchema;
