import { ProfileOptionalDefaultsSchema } from "@/zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { compareSync, genSaltSync, hashSync } from "bcrypt";
import { TRPCError } from "@trpc/server";
import { omit } from "lodash";

const PasswordSchema = z
    .object({
        oldPassword: z.string().min(6).max(16),
        newPassword: z.string().min(6).max(16),
    })
    .superRefine(({ oldPassword, newPassword }, ctx) => {
        if (oldPassword === newPassword) {
            ctx.addIssue({ code: "custom", message: "New password cannot be same as old password" });
        }
    });

export const profileRouter = createTRPCRouter({
    getProfile: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db.profile.findFirst({
            where: { user: { id: ctx.session.user.id } },
            include: { user: { select: { name: true, email: true, phone: true, role: true } } },
        });
    }),
    updateProfile: protectedProcedure.input(ProfileOptionalDefaultsSchema.omit({ userId: true })).mutation(async ({ ctx, input }) => {
        const profile = await ctx.db.profile.findFirst({ where: { user: { id: ctx.session.user.id } } });
        const result = profile
            ? await ctx.db.profile.update({ where: { id: profile.id }, data: input })
            : await ctx.db.profile.create({ data: { ...input, user: { connect: { id: ctx.session.user.id } } } });
        return result;
    }),
    updatePassword: protectedProcedure.input(PasswordSchema).mutation(async ({ ctx, input }) => {
        const { oldPassword, newPassword } = input;
        const user = await ctx.db.user.findFirst({ where: { id: ctx.session.user.id }, select: { password: true } });
        if (!user) throw new TRPCError({ message: "UNAUTHORIZED", code: "UNAUTHORIZED" });
        if (!compareSync(oldPassword, user.password)) throw new TRPCError({ message: "Your current password is incorrect", code: "UNPROCESSABLE_CONTENT" });
        const hashedNewPassword = hashSync(newPassword, genSaltSync(10));
        const newUser = await ctx.db.user.update({ where: { id: ctx.session.user.id }, data: { password: hashedNewPassword } });
        return omit(newUser, ["password"]);
    }),
});
