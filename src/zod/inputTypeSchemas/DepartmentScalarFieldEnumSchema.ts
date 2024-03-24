import { z } from 'zod';

export const DepartmentScalarFieldEnumSchema = z.enum(['id','title','description','isDeleted','createdAt','udpatedAt']);

export default DepartmentScalarFieldEnumSchema;
