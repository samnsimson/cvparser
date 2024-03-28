import { z } from 'zod';

export const ShortListedScalarFieldEnumSchema = z.enum(['id','userId','candidateId','jobId','createdAt','updatedAt']);

export default ShortListedScalarFieldEnumSchema;
