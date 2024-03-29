import { z } from "zod";

export const JobScalarFieldEnumSchema = z.enum([
    "id",
    "title",
    "description",
    "jobType",
    "departmentId",
    "location",
    "shiftType",
    "expiryDate",
    "createdById",
    "createdAt",
    "udpatedAt",
]);

export default JobScalarFieldEnumSchema;
