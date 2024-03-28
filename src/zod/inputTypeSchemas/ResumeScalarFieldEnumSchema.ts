import { z } from 'zod';

export const ResumeScalarFieldEnumSchema = z.enum(['id','url','candidateId','createdAt','updatedAt']);

export default ResumeScalarFieldEnumSchema;
