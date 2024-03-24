import { HeaderAccountsSection } from "@/components/header-account-section";
import { FC, ReactNode } from "react";

const layout: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <div className="h-screen flex flex-col">
            <div className="min-h-20 border-b shadow sticky top-0 flex justify-between items-center px-4">
                <div>
                    <h1>Dashboard</h1>
                </div>
                <HeaderAccountsSection />
            </div>
            <div className="flex h-full">
                <div className="w-[90px] border-r"></div>
                <div className="flex-1">{children}</div>
            </div>
        </div>
    );
};
export default layout;
