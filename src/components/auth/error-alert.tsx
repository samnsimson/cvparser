import { FC, HTMLAttributes } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { InfoIcon } from "lucide-react";

interface AlertErrorProps extends HTMLAttributes<HTMLDivElement> {
    error: string;
}

export const AlertError: FC<AlertErrorProps> = ({ error, ...props }) => {
    return (
        <Alert variant="destructive" className="space-x-3 rounded-none bg-red-50" {...props}>
            <InfoIcon />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
    );
};
