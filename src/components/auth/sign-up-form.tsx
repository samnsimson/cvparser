"use client";
import { UserSchema } from "@/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, HTMLAttributes } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { api } from "@/trpc/react";

interface SignUpFormProps extends HTMLAttributes<HTMLDivElement> {
    [x: string]: unknown;
}

const SignUpSchema = UserSchema.pick({ name: true, email: true, phone: true, password: true });
type SingUpType = z.infer<typeof SignUpSchema>;

export const SignUpForm: FC<SignUpFormProps> = ({}) => {
    const form = useForm<SingUpType>({ resolver: zodResolver(SignUpSchema), defaultValues: { name: "", email: "", phone: "", password: "" } });
    const user = api.user.signup.useMutation();

    const onSubmit = async (data: SingUpType) => {
        user.mutate(data, {
            onSuccess: (data) => {
                console.log("CREATED DATA", data);
                form.reset();
            },
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex flex-col w-full max-w-lg">
                <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input type="text" placeholder="Your name" {...field} />
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
                            <FormControl>
                                <Input type="email" placeholder="Your email" {...field} />
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
                            <FormControl>
                                <Input type="tel" placeholder="Your phone" {...field} />
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
                            <FormControl>
                                <Input type="password" placeholder="Your password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">
                    Sign up
                </Button>
                <div className="flex items-center justify-center">
                    <Button variant="link" className="px-0">
                        <Link href="/sign-in">Already have an account?</Link>
                    </Button>
                </div>
            </form>
        </Form>
    );
};
