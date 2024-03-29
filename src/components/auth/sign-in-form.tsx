"use client";
import { FC, HTMLAttributes, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserSchema } from "@/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AlertError } from ".";
import Link from "next/link";

interface SignInFormProps extends HTMLAttributes<HTMLDivElement> {
    [x: string]: unknown;
}

const SignInSchema = UserSchema.pick({ email: true, password: true });
type SignInType = z.infer<typeof SignInSchema>;

export const SignInForm: FC<SignInFormProps> = ({}) => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const form = useForm<SignInType>({ resolver: zodResolver(SignInSchema), defaultValues: { email: "", password: "" } });
    const { isSubmitting } = form.formState;
    const onSubmit = async ({ email, password }: SignInType) => {
        const res = await signIn("credentials", { redirect: false, email, password });
        if (res && res.status === 200) router.push("/dashboard");
        else setError("Unable to sign you in. Please try again");
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full max-w-lg flex-col space-y-6">
                {error && <AlertError error={error} />}
                <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input type="email" placeholder="someone@example.com" {...field} />
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
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    Submit
                </Button>
                <div className="flex items-center justify-between">
                    <Button variant="link" className="border-none px-0 text-sm" type="button">
                        <Link href="/sign-up">Create an account</Link>
                    </Button>
                    <Button variant="link" className="border-none px-0 text-sm" type="button">
                        Forgot password?
                    </Button>
                </div>
            </form>
        </Form>
    );
};
