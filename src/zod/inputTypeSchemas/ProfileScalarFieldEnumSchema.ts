import { z } from "zod";

export const ProfileScalarFieldEnumSchema = z.enum(["id", "firstName", "lastName", "address", "city", "state", "country", "zipCode", "createdAt", "updatedAt"]);

export default ProfileScalarFieldEnumSchema;
