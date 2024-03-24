import { z } from "zod";

export const UserScalarFieldEnumSchema = z.enum([
    "id",
    "name",
    "email",
    "phone",
    "password",
    "role",
    "emailVerified",
    "phoneVerified",
    "profileId",
    "clientId",
    "createdAt",
    "updatedAt",
]);

export default UserScalarFieldEnumSchema;
