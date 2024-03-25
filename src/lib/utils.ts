import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const defaultFormValues = (keys: Array<string>) => {
    return keys.reduce((acc: Record<string, string>, curr) => {
        acc[curr] = "";
        return acc;
    }, {});
};
