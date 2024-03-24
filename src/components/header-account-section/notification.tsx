import { BellIcon } from "lucide-react";
import { FC, HTMLAttributes } from "react";
import { Button } from "../ui/button";

interface NotificationProps extends HTMLAttributes<HTMLButtonElement> {
    [x: string]: unknown;
}

export const Notification: FC<NotificationProps> = ({ ...props }) => {
    return (
        <Button variant="outline" size="icon" className="rounded-full" {...props}>
            <BellIcon />
        </Button>
    );
};
