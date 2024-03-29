"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, HTMLAttributes } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { omit } from "lodash";
import { Label } from "../form";
import { LoaderIcon } from "lucide-react";

interface SignUpFormProps extends HTMLAttributes<HTMLDivElement> {
    [x: string]: unknown;
}

const minPassErr = "Password must have at least 6 characters";
const maxPassErr = "Password can have atmost 16 characters";
const SignUpSchemaBase = z.object({
    name: z.string().regex(new RegExp(/^[a-zA-Z0-9_-]{3,16}$/), { message: 'Invalid username format. Only letters, numbers, "-" and "_" is allowed.' }),
    email: z.string().email({ message: "Email is invalid" }),
    phone: z.string().regex(new RegExp(/^\+?[1-9]\d{9,14}$/), { message: "Phone number is invalid" }),
    password: z.string({ required_error: "Password is required" }).min(6, { message: minPassErr }).max(16, { message: maxPassErr }),
    confirm: z.string({ required_error: "Confirm Password is required" }),
});
const SignUpSchema = SignUpSchemaBase.refine((data) => data.confirm === data.password, { message: "Password does not match", path: ["confirm"] });
type SingUpType = z.infer<typeof SignUpSchema>;

export const SignUpForm: FC<SignUpFormProps> = ({}) => {
    const form = useForm<SingUpType>({ resolver: zodResolver(SignUpSchema), defaultValues: { name: "", email: "", phone: "", password: "" } });
    const user = api.user.signup.useMutation();

    const onSubmit = async (data: SingUpType) => {
        try {
            await user.mutateAsync(omit(data, ["confirm"]));
            form.reset();
        } catch (error) {
            toast.error("Error! Something went wrong", { description: "Unable to create an account!" });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full max-w-lg flex-col space-y-6">
                <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <Label text="Username" />
                            <FormControl>
                                <Input type="text" placeholder="Eg: username" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <Label text="Email" />
                            <FormControl>
                                <Input type="email" placeholder="Eg: someone@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="phone"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <Label text="Phone" />
                            <FormControl>
                                <Input type="tel" placeholder="Eg: 1231231230" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <Label text="Password" />
                            <FormControl>
                                <Input type="password" placeholder="Password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="confirm"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <Label text="Comfirm Password" />
                            <FormControl>
                                <Input type="password" placeholder="Confirm password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full space-x-2" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <LoaderIcon className="animate-spin" />} <span>Sign up</span>
                </Button>
                <div className="flex items-center justify-center">
                    <Button variant="link" className="border-none px-0" type="button">
                        <Link href="/sign-in">Already have an account?</Link>
                    </Button>
                </div>
            </form>
        </Form>
    );
};
