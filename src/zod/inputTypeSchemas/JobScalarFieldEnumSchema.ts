import { z } from "zod";

export const JobScalarFieldEnumSchema = z.enum(["id", "title", "description", "type", "departmentId", "location", "shiftType", "createdAt", "udpatedAt"]);

export default JobScalarFieldEnumSchema;
