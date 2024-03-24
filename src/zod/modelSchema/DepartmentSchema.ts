import { z } from "zod";

/////////////////////////////////////////
// DEPARTMENT SCHEMA
/////////////////////////////////////////

export const DepartmentSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    description: z.string().nullish(),
    isDeleted: z.boolean(),
    createdAt: z.coerce.date(),
    udpatedAt: z.coerce.date(),
});

export type Department = z.infer<typeof DepartmentSchema>;

/////////////////////////////////////////
// DEPARTMENT PARTIAL SCHEMA
/////////////////////////////////////////

export const DepartmentPartialSchema = DepartmentSchema.partial();

export type DepartmentPartial = z.infer<typeof DepartmentPartialSchema>;

export default DepartmentSchema;
