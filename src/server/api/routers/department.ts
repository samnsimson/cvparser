import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const departmentRouter = createTRPCRouter({
    getDepartments: protectedProcedure.input(z.object({ take: z.number().optional() })).query(async ({ ctx, input: { take } }) => {
        return await ctx.db.department.findMany({ ...(take && { take }) });
    }),
});
