import { z } from 'zod';

export const ShiftTypeSchema = z.enum(['DAY','NIGHT','MIXED']);

export type ShiftTypeType = `${z.infer<typeof ShiftTypeSchema>}`

export default ShiftTypeSchema;
