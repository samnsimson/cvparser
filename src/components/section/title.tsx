import { cn } from "@/lib/utils";
import { FC, HTMLAttributes } from "react";

interface TitleProps extends HTMLAttributes<HTMLDivElement> {
    text: string;
    description?: string;
}

export const Title: FC<TitleProps> = ({ text, className, ...props }) => {
    return (
        <div className={cn("w-full min-h-16 bg-stone-100 flex items-center px-4", className)} {...props}>
            <span className="font-bold text-lg text-gray-500">{text}</span>
        </div>
    );
};
