import { SettingsIcon } from "lucide-react";
import { FC, HTMLAttributes } from "react";
import { Button } from "../ui/button";
import Link from "next/link";

interface SettingsSectionProps extends HTMLAttributes<HTMLButtonElement> {
    [x: string]: unknown;
}

export const SettingsSection: FC<SettingsSectionProps> = async ({ ...props }) => {
    return (
        <Link href={`/dashboard/profile/`}>
            <Button variant="outline" size="icon" className="rounded-full" {...props}>
                <SettingsIcon />
            </Button>
        </Link>
    );
};
