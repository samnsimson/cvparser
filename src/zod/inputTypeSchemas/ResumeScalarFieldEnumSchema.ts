import { z } from 'zod';

export const ResumeScalarFieldEnumSchema = z.enum(['id','fileKey','path','fullPath','url','candidateId','createdAt','updatedAt']);

export default ResumeScalarFieldEnumSchema;
