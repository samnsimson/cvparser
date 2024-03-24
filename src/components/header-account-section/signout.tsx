"use client";
import { FC, HTMLAttributes } from "react";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

interface SignOutProps extends HTMLAttributes<HTMLButtonElement> {
    [x: string]: unknown;
}

export const SignOut: FC<SignOutProps> = ({ ...props }) => {
    return (
        <Button variant="outline" size="icon" className="rounded-full text-red-500" {...props} onClick={() => signOut()}>
            <LogOut />
        </Button>
    );
};
