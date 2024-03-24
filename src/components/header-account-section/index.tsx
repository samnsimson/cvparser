import { FC, HTMLAttributes } from "react";
import { Notification } from "./notification";
import { SettingsSection } from "./settings";
import { Profile } from "./profile";

interface HeaderAccountsSectionProps extends HTMLAttributes<HTMLDivElement> {
    [x: string]: unknown;
}

export const HeaderAccountsSection: FC<HeaderAccountsSectionProps> = ({ ...props }) => {
    return (
        <div {...props} className="flex items-center space-x-4">
            <Notification />
            <SettingsSection />
            <Profile image="" />
        </div>
    );
};
