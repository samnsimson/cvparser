import { z } from "zod";
import type { UserWithRelations } from "./UserSchema";
import type { UserPartialWithRelations } from "./UserSchema";
import type { UserOptionalDefaultsWithRelations } from "./UserSchema";
import { UserWithRelationsSchema } from "./UserSchema";
import { UserPartialWithRelationsSchema } from "./UserSchema";
import { UserOptionalDefaultsWithRelationsSchema } from "./UserSchema";

/////////////////////////////////////////
// PROFILE SCHEMA
/////////////////////////////////////////

export const ProfileSchema = z.object({
    id: z.string().uuid(),
    firstName: z.string().min(3, { message: "Value cannot be empty" }),
    lastName: z.string().min(3, { message: "Value cannot be empty" }).nullish(),
    address: z.string().min(3, { message: "Value cannot be empty" }).nullish(),
    city: z.string().min(3, { message: "Value cannot be empty" }).nullish(),
    state: z.string().min(3, { message: "Value cannot be empty" }).nullish(),
    country: z.string().min(3, { message: "Value cannot be empty" }).nullish(),
    zipCode: z.string().min(3, { message: "Value cannot be empty" }).nullish(),
    userId: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export type Profile = z.infer<typeof ProfileSchema>;

/////////////////////////////////////////
// PROFILE PARTIAL SCHEMA
/////////////////////////////////////////

export const ProfilePartialSchema = ProfileSchema.partial();

export type ProfilePartial = z.infer<typeof ProfilePartialSchema>;

/////////////////////////////////////////
// PROFILE OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const ProfileOptionalDefaultsSchema = ProfileSchema.merge(
    z.object({
        id: z.string().uuid().optional(),
        createdAt: z.coerce.date().optional(),
        updatedAt: z.coerce.date().optional(),
    }),
);

export type ProfileOptionalDefaults = z.infer<typeof ProfileOptionalDefaultsSchema>;

/////////////////////////////////////////
// PROFILE RELATION SCHEMA
/////////////////////////////////////////

export type ProfileRelations = {
    user: UserWithRelations;
};

export type ProfileWithRelations = z.infer<typeof ProfileSchema> & ProfileRelations;

export const ProfileWithRelationsSchema: z.ZodType<ProfileWithRelations> = ProfileSchema.merge(
    z.object({
        user: z.lazy(() => UserWithRelationsSchema),
    }),
);

/////////////////////////////////////////
// PROFILE OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type ProfileOptionalDefaultsRelations = {
    user: UserOptionalDefaultsWithRelations;
};

export type ProfileOptionalDefaultsWithRelations = z.infer<typeof ProfileOptionalDefaultsSchema> & ProfileOptionalDefaultsRelations;

export const ProfileOptionalDefaultsWithRelationsSchema: z.ZodType<ProfileOptionalDefaultsWithRelations> = ProfileOptionalDefaultsSchema.merge(
    z.object({
        user: z.lazy(() => UserOptionalDefaultsWithRelationsSchema),
    }),
);

/////////////////////////////////////////
// PROFILE PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type ProfilePartialRelations = {
    user?: UserPartialWithRelations;
};

export type ProfilePartialWithRelations = z.infer<typeof ProfilePartialSchema> & ProfilePartialRelations;

export const ProfilePartialWithRelationsSchema: z.ZodType<ProfilePartialWithRelations> = ProfilePartialSchema.merge(
    z.object({
        user: z.lazy(() => UserPartialWithRelationsSchema),
    }),
).partial();

export type ProfileOptionalDefaultsWithPartialRelations = z.infer<typeof ProfileOptionalDefaultsSchema> & ProfilePartialRelations;

export const ProfileOptionalDefaultsWithPartialRelationsSchema: z.ZodType<ProfileOptionalDefaultsWithPartialRelations> = ProfileOptionalDefaultsSchema.merge(
    z
        .object({
            user: z.lazy(() => UserPartialWithRelationsSchema),
        })
        .partial(),
);

export type ProfileWithPartialRelations = z.infer<typeof ProfileSchema> & ProfilePartialRelations;

export const ProfileWithPartialRelationsSchema: z.ZodType<ProfileWithPartialRelations> = ProfileSchema.merge(
    z
        .object({
            user: z.lazy(() => UserPartialWithRelationsSchema),
        })
        .partial(),
);

export default ProfileSchema;
