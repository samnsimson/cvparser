import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { DepartmentOptionalDefaultsSchema } from "@/zod";

export const departmentRouter = createTRPCRouter({
    getDepartments: protectedProcedure.input(z.object({ take: z.number().optional() })).query(async ({ ctx, input: { take } }) => {
        return await ctx.db.department.findMany({ ...(take && { take }) });
    }),
    createDepartment: protectedProcedure.input(DepartmentOptionalDefaultsSchema.omit({ createdById: true })).mutation(async ({ ctx, input }) => {
        return await ctx.db.department.create({ data: { ...input, createdById: ctx.session.user.id } });
    }),
});
