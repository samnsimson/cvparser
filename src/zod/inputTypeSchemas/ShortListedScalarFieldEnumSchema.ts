import { z } from 'zod';

export const ShortListedScalarFieldEnumSchema = z.enum(['userId','candidateId','jobId','createdAt','updatedAt']);

export default ShortListedScalarFieldEnumSchema;
