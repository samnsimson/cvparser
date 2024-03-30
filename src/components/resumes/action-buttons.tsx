import { FC, HTMLAttributes } from "react";
import { Button } from "../ui/button";
import { Download, EyeIcon, Info } from "lucide-react";

interface ResuemActionButtonProps extends HTMLAttributes<HTMLDivElement> {
    layout: "grid" | "list";
}

interface ButtonsLayout extends HTMLAttributes<HTMLDivElement> {
    [x: string]: any;
}

const GridButtons: FC<ButtonsLayout> = ({ ...props }) => {
    return (
        <div className="flex w-full justify-evenly border-t group-hover:border-sky-700" {...props}>
            <Button variant="ghost" className="w-full border-0 border-gray-300 text-stone-400 hover:text-sky-700 group-hover:border-sky-700">
                <Download />
            </Button>
            <Button variant="ghost" className="w-full border-x border-gray-300 text-stone-400 hover:text-sky-700 group-hover:border-sky-700">
                <EyeIcon />
            </Button>
            <Button variant="ghost" className="w-full border-0 text-stone-400 hover:text-sky-700">
                <Info />
            </Button>
        </div>
    );
};

const ListButtons: FC<ButtonsLayout> = ({ ...props }) => {
    return <div {...props}></div>;
};

export const ResuemActionButtons: FC<ResuemActionButtonProps> = ({ layout, ...props }) => {
    switch (layout) {
        case "grid":
            return <GridButtons {...props} />;
        case "grid":
            return <ListButtons {...props} />;
        default:
            break;
    }
};
