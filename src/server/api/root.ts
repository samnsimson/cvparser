import { postRouter } from "@/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
import { profileRouter } from "./routers/profile";
import { departmentRouter } from "./routers/department";
import { jobRouter } from "./routers/job";

export const appRouter = createTRPCRouter({
    post: postRouter,
    user: userRouter,
    profile: profileRouter,
    department: departmentRouter,
    job: jobRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
