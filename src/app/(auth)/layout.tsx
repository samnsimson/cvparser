import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { FC, ReactNode } from "react";

const AuthLayout: FC<{ children: ReactNode }> = async ({ children }) => {
    const session = await getServerSession();
    if (session && session.user) redirect("/dashboard");
    return (
        <div className="grid h-screen grid-cols-5">
            <div className="hidden h-full border-r sm:col-span-3 sm:block"></div>
            <div className="col-span-1 flex h-full items-center justify-center p-6 sm:col-span-2">{children}</div>
        </div>
    );
};
export default AuthLayout;
