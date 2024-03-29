import { BriefcaseBusiness, Home, ListTree } from "lucide-react";
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
    {
        name: "Departments",
        link: "/dashboard/departments",
        icon: <ListTree />,
    },
];

export const SidebarNav: FC<SidebarNavProps> = ({ ...props }) => {
    return (
        <div className="" {...props}>
            <ul className="flex flex-col items-center">
                {NavList.map((list, key) => (
                    <Link
                        href={list.link}
                        key={key}
                        className="group flex min-h-16 w-full items-center justify-center border-b border-b-neutral-900 py-4 hover:bg-[#41B9BD]"
                    >
                        <span className="text-white group-hover:text-white">{list.icon}</span>
                    </Link>
                ))}
            </ul>
        </div>
    );
};
