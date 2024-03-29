import { z } from "zod";
import type { JobWithRelations } from "./JobSchema";
import type { JobPartialWithRelations } from "./JobSchema";
import type { JobOptionalDefaultsWithRelations } from "./JobSchema";
import type { UserWithRelations } from "./UserSchema";
import type { UserPartialWithRelations } from "./UserSchema";
import type { UserOptionalDefaultsWithRelations } from "./UserSchema";
import { JobWithRelationsSchema } from "./JobSchema";
import { JobPartialWithRelationsSchema } from "./JobSchema";
import { JobOptionalDefaultsWithRelationsSchema } from "./JobSchema";
import { UserWithRelationsSchema } from "./UserSchema";
import { UserPartialWithRelationsSchema } from "./UserSchema";
import { UserOptionalDefaultsWithRelationsSchema } from "./UserSchema";

/////////////////////////////////////////
// DEPARTMENT SCHEMA
/////////////////////////////////////////

export const DepartmentSchema = z.object({
    id: z.string().uuid(),
    title: z.string().min(1, { message: "Title cannot be empty" }),
    description: z.string().nullish(),
    isDeleted: z.boolean(),
    createdById: z.string().min(1, { message: "User is required" }).uuid({ message: "User ID is invalid" }),
    createdAt: z.coerce.date(),
    udpatedAt: z.coerce.date(),
});

export type Department = z.infer<typeof DepartmentSchema>;

/////////////////////////////////////////
// DEPARTMENT PARTIAL SCHEMA
/////////////////////////////////////////

export const DepartmentPartialSchema = DepartmentSchema.partial();

export type DepartmentPartial = z.infer<typeof DepartmentPartialSchema>;

/////////////////////////////////////////
// DEPARTMENT OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const DepartmentOptionalDefaultsSchema = DepartmentSchema.merge(
    z.object({
        id: z.string().uuid().optional(),
        isDeleted: z.boolean().optional(),
        createdAt: z.coerce.date().optional(),
        udpatedAt: z.coerce.date().optional(),
    }),
);

export type DepartmentOptionalDefaults = z.infer<typeof DepartmentOptionalDefaultsSchema>;

/////////////////////////////////////////
// DEPARTMENT RELATION SCHEMA
/////////////////////////////////////////

export type DepartmentRelations = {
    job: JobWithRelations[];
    createdBy: UserWithRelations;
};

export type DepartmentWithRelations = z.infer<typeof DepartmentSchema> & DepartmentRelations;

export const DepartmentWithRelationsSchema: z.ZodType<DepartmentWithRelations> = DepartmentSchema.merge(
    z.object({
        job: z.lazy(() => JobWithRelationsSchema).array(),
        createdBy: z.lazy(() => UserWithRelationsSchema),
    }),
);

/////////////////////////////////////////
// DEPARTMENT OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type DepartmentOptionalDefaultsRelations = {
    job: JobOptionalDefaultsWithRelations[];
    createdBy: UserOptionalDefaultsWithRelations;
};

export type DepartmentOptionalDefaultsWithRelations = z.infer<typeof DepartmentOptionalDefaultsSchema> & DepartmentOptionalDefaultsRelations;

export const DepartmentOptionalDefaultsWithRelationsSchema: z.ZodType<DepartmentOptionalDefaultsWithRelations> = DepartmentOptionalDefaultsSchema.merge(
    z.object({
        job: z.lazy(() => JobOptionalDefaultsWithRelationsSchema).array(),
        createdBy: z.lazy(() => UserOptionalDefaultsWithRelationsSchema),
    }),
);

/////////////////////////////////////////
// DEPARTMENT PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type DepartmentPartialRelations = {
    job?: JobPartialWithRelations[];
    createdBy?: UserPartialWithRelations;
};

export type DepartmentPartialWithRelations = z.infer<typeof DepartmentPartialSchema> & DepartmentPartialRelations;

export const DepartmentPartialWithRelationsSchema: z.ZodType<DepartmentPartialWithRelations> = DepartmentPartialSchema.merge(
    z.object({
        job: z.lazy(() => JobPartialWithRelationsSchema).array(),
        createdBy: z.lazy(() => UserPartialWithRelationsSchema),
    }),
).partial();

export type DepartmentOptionalDefaultsWithPartialRelations = z.infer<typeof DepartmentOptionalDefaultsSchema> & DepartmentPartialRelations;

export const DepartmentOptionalDefaultsWithPartialRelationsSchema: z.ZodType<DepartmentOptionalDefaultsWithPartialRelations> =
    DepartmentOptionalDefaultsSchema.merge(
        z
            .object({
                job: z.lazy(() => JobPartialWithRelationsSchema).array(),
                createdBy: z.lazy(() => UserPartialWithRelationsSchema),
            })
            .partial(),
    );

export type DepartmentWithPartialRelations = z.infer<typeof DepartmentSchema> & DepartmentPartialRelations;

export const DepartmentWithPartialRelationsSchema: z.ZodType<DepartmentWithPartialRelations> = DepartmentSchema.merge(
    z
        .object({
            job: z.lazy(() => JobPartialWithRelationsSchema).array(),
            createdBy: z.lazy(() => UserPartialWithRelationsSchema),
        })
        .partial(),
);

export default DepartmentSchema;
