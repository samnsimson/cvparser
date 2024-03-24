import { z } from "zod";

/////////////////////////////////////////
// PROFILE SCHEMA
/////////////////////////////////////////

export const ProfileSchema = z.object({
    id: z.string().uuid(),
    firstName: z.string(),
    lastName: z.string().nullish(),
    address: z.string().nullish(),
    city: z.string().nullish(),
    state: z.string().nullish(),
    country: z.string().nullish(),
    zipCode: z.string().nullish(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export type Profile = z.infer<typeof ProfileSchema>;

/////////////////////////////////////////
// PROFILE PARTIAL SCHEMA
/////////////////////////////////////////

export const ProfilePartialSchema = ProfileSchema.partial();

export type ProfilePartial = z.infer<typeof ProfilePartialSchema>;

export default ProfileSchema;
