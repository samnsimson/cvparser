import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { FC, ReactNode } from "react";

const AuthLayout: FC<{ children: ReactNode }> = async ({ children }) => {
    const session = await getServerSession();
    if (session && session.user) redirect("/dashboard");
    return (
        <div className="h-screen grid grid-cols-5">
            <div className="hidden sm:block sm:col-span-3 h-full border-r"></div>
            <div className="col-span-1 sm:col-span-2 h-full flex items-center justify-center p-6">{children}</div>
        </div>
    );
};
export default AuthLayout;
