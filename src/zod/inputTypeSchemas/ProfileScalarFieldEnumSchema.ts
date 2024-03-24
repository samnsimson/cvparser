import { z } from 'zod';

export const ProfileScalarFieldEnumSchema = z.enum(['id','firstName','lastName','address','city','state','country','zipCode','userId','createdAt','updatedAt']);

export default ProfileScalarFieldEnumSchema;
