import { SettingsIcon } from "lucide-react";
import { FC, HTMLAttributes } from "react";
import { Button } from "../ui/button";

interface SettingsSectionProps extends HTMLAttributes<HTMLButtonElement> {
    [x: string]: unknown;
}

export const SettingsSection: FC<SettingsSectionProps> = ({ ...props }) => {
    return (
        <Button variant="outline" size="icon" className="rounded-full" {...props}>
            <SettingsIcon />
        </Button>
    );
};
