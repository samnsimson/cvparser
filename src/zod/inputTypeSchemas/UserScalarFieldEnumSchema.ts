import { z } from 'zod';

export const UserScalarFieldEnumSchema = z.enum(['id','name','email','phone','password','role','emailVerified','phoneVerified','createdAt','updatedAt']);

export default UserScalarFieldEnumSchema;
