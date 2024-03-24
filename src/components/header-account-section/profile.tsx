import { FC, HTMLAttributes } from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

interface ProfileProps extends HTMLAttributes<HTMLButtonElement> {
    image: string;
}

export const Profile: FC<ProfileProps> = ({ image, ...props }) => {
    return (
        <Button variant="default" size="lg" className="flex items-center space-x-4 rounded-full" {...props}>
            {image && (
                <Avatar>
                    <AvatarImage src={image} />
                </Avatar>
            )}
            <div className="prose">
                <h3>Sam Simson</h3>
            </div>
        </Button>
    );
};
