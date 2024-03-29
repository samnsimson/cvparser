"use client";
import { FC, ReactNode } from "react";
import { BellIcon, LogOut, SettingsIcon, User } from "lucide-react";
import { Menubar, MenubarContent, MenubarGroup, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface HeaderAccountsSectionProps {
    [x: string]: any;
}

type DropDownType = {
    name: string;
    icon: ReactNode;
    link?: string;
    action?: () => void;
    menu?: Array<{
        label: string;
        item: Array<{
            name: string;
            icon: ReactNode;
            variant?: "destructive" | "default";
            link?: string;
            action?: () => void | any;
        }>;
    }>;
};

const NavLinks: Array<DropDownType> = [
    { name: "Notification", icon: <BellIcon /> },
    { name: "Settings", icon: <SettingsIcon /> },
    {
        name: "Profile",
        icon: <User />,
        menu: [
            {
                label: "Profile",
                item: [{ name: "Profile", link: "/dashboard/profile", icon: <User /> }],
            },
            {
                label: "Auth",
                item: [
                    {
                        name: "Logout",
                        variant: "destructive",
                        action: async () => await signOut({ redirect: true, callbackUrl: "/sign-in" }),
                        icon: <LogOut />,
                    },
                ],
            },
        ],
    },
];

const MenuBarItem: FC<{ icon: ReactNode; name: string; variant?: string; action?: () => any }> = ({ icon, name, variant, action }) => {
    return (
        <MenubarItem
            onClick={() => (action ? action() : null)}
            className={cn("group cursor-pointer space-x-3 rounded-none text-gray-600 hover:text-gray-800", {
                "text-red-600": variant === "destructive",
            })}
        >
            {icon} <span className="text-base group-hover:text-gray-800">{name}</span>
        </MenubarItem>
    );
};

export const HeaderAccountsSection: FC<HeaderAccountsSectionProps> = ({ ...props }) => {
    return (
        <Menubar className="h-full space-x-0 rounded-none border-none py-0" {...props}>
            {NavLinks.map((list, key) => (
                <MenubarMenu key={key}>
                    <MenubarTrigger className="flex h-full cursor-pointer items-center justify-center rounded-none border-l px-4 ring-0 focus-visible:outline-none data-[state=open]:bg-neutral-200">
                        {list.icon}
                    </MenubarTrigger>
                    {list.menu && list.menu.length > 0 && (
                        <MenubarContent className="-top-[3px] rounded-none p-0">
                            {list.menu.map((menu, key) => (
                                <MenubarGroup key={key} className="border-b p-2 last:border-b-0">
                                    {menu.item.map((item, key) =>
                                        item.link ? (
                                            <Link key={key} href={item.link}>
                                                <MenuBarItem {...item} />
                                            </Link>
                                        ) : (
                                            <MenuBarItem key={key} {...item} />
                                        ),
                                    )}
                                </MenubarGroup>
                            ))}
                        </MenubarContent>
                    )}
                </MenubarMenu>
            ))}
        </Menubar>
    );
};
