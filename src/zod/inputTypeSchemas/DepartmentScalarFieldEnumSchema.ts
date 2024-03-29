import { z } from "zod";

export const DepartmentScalarFieldEnumSchema = z.enum(["id", "title", "description", "isDeleted", "createdById", "createdAt", "udpatedAt"]);

export default DepartmentScalarFieldEnumSchema;
