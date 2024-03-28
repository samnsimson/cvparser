import { FC } from "react";
import { FormLabel } from "../ui/form";

export const Label: FC<{ text: string }> = ({ text }) => <FormLabel className="uppercase text-stone-500">{text}</FormLabel>;
