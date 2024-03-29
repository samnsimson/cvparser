import { SidebarNav } from "@/components/dashboard";
import { HeaderAccountsSection } from "@/components/header-account-section";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import { FC, ReactNode } from "react";

const layout: FC<{ children: ReactNode }> = async ({ children }) => {
    const session = await getServerAuthSession();
    if (!session || !session.user) redirect("/sign-in");

    return (
        <div className="flex h-screen flex-col">
            <div className="sticky top-0 flex min-h-20 items-center justify-between border-b px-4 shadow">
                <div>
                    <h1>Dashboard</h1>
                </div>
                <HeaderAccountsSection />
            </div>
            <div className="flex h-full">
                <div className="w-[90px] border-r bg-[#494D56]">
                    <SidebarNav />
                </div>
                <div className="flex-1">{children}</div>
            </div>
        </div>
    );
};
export default layout;
