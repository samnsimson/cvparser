import { UserSchema } from "@/zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { compareSync, genSaltSync, hashSync } from "bcrypt";
import { omit, pick } from "lodash";

const SignUpSchema = UserSchema.pick({ name: true, email: true, phone: true, password: true });
const SignInSchema = UserSchema.pick({ email: true, password: true });

export const userRouter = createTRPCRouter({
    signin: publicProcedure.input(SignInSchema).query(async ({ ctx, input }) => {
        const { email, password } = input;
        const user = await ctx.db.user.findFirstOrThrow({ where: { email } });
        const passwordMatch = compareSync(password, user.password);
        if (!passwordMatch) throw new Error("Wrong password");
        return pick(user, ["id", "email", "name", "role"]);
    }),
    signup: publicProcedure.input(SignUpSchema).mutation(async ({ ctx, input }) => {
        const { password } = input;
        const hashedPassword = hashSync(password, genSaltSync(10));
        const user = await ctx.db.user.create({ data: { ...input, password: hashedPassword } });
        return omit(user, ["password"]);
    }),
});
