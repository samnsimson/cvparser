import { cn } from "@/lib/utils";
import { FC, HTMLAttributes } from "react";

interface TitleProps extends HTMLAttributes<HTMLDivElement> {
    text: string;
    description?: string;
}

export const Title: FC<TitleProps> = ({ text, className, ...props }) => {
    return (
        <div className={cn("flex min-h-16 w-full items-center bg-stone-100 px-4", className)} {...props}>
            <span className="text-lg font-bold text-gray-500">{text}</span>
        </div>
    );
};
