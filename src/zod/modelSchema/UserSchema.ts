import { z } from "zod";
import { RoleSchema } from "../inputTypeSchemas/RoleSchema";

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
    role: RoleSchema.nullish(),
    id: z.string().uuid(),
    name: z.string().min(1),
    email: z.string().email({ message: "Email is invalid" }),
    phone: z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), "Phone number is invalid"),
    password: z.string().min(6).max(16),
    emailVerified: z.boolean().nullish(),
    phoneVerified: z.boolean().nullish(),
    profileId: z.string().nullish(),
    clientId: z.string().nullish(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export type User = z.infer<typeof UserSchema>;

/////////////////////////////////////////
// USER PARTIAL SCHEMA
/////////////////////////////////////////

export const UserPartialSchema = UserSchema.partial();

export type UserPartial = z.infer<typeof UserPartialSchema>;

export default UserSchema;
