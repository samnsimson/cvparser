"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const PasswordUpdateSchema = z.object({
    oldPassword: z.string().min(6).max(16),
    newPassword: z.string().min(6).max(16),
});

export const UpdatePasswordForm = () => {
    const form = useForm<z.infer<typeof PasswordUpdateSchema>>({
        resolver: zodResolver(PasswordUpdateSchema),
        defaultValues: { oldPassword: "", newPassword: "" },
    });

    const onSubmit = (data: z.infer<typeof PasswordUpdateSchema>) => {
        console.log(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    name="oldPassword"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input type="password" placeholder="Old Password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="newPassword"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input type="password" placeholder="New Password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={form.formState.isLoading}>
                    Update Password
                </Button>
            </form>
        </Form>
    );
};
