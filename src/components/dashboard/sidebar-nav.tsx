import { BriefcaseBusiness, Home } from "lucide-react";
import Link from "next/link";
import { FC, HTMLAttributes, ReactNode } from "react";

interface SidebarNavProps extends HTMLAttributes<HTMLDivElement> {
    [x: string]: any;
}

type LinkType = {
    name: string;
    link: string;
    icon: ReactNode;
};

const NavList: Array<LinkType> = [
    {
        name: "Home",
        link: "/dashboard/",
        icon: <Home />,
    },
    {
        name: "Jobs",
        link: "/dashboard/jobs",
        icon: <BriefcaseBusiness />,
    },
];

export const SidebarNav: FC<SidebarNavProps> = ({ ...props }) => {
    return (
        <div {...props}>
            <ul className="flex flex-col items-center">
                {NavList.map((list, key) => (
                    <Link href={list.link} key={key} className="py-4 w-full flex items-center justify-center min-h-16 border-b group hover:bg-sky-700">
                        <span className="group-hover:text-white">{list.icon}</span>
                    </Link>
                ))}
            </ul>
        </div>
    );
};
