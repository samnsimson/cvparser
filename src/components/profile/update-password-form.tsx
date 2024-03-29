"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { InfoIcon } from "lucide-react";
import { api } from "@/trpc/react";
import { toast } from "sonner";

const PasswordUpdateSchema = z
    .object({
        oldPassword: z.string().min(6).max(16),
        newPassword: z.string().min(6).max(16),
    })
    .superRefine(({ oldPassword, newPassword }, ctx) => {
        if (oldPassword === newPassword) {
            ctx.addIssue({ code: "custom", message: "New password cannot be same as old password" });
        }
    });

export const UpdatePasswordForm = () => {
    const updatePasswordMutation = api.profile.updatePassword.useMutation();
    const [formErrors, setFormErrors] = useState<Array<string>>([]);
    const form = useForm<z.infer<typeof PasswordUpdateSchema>>({
        resolver: zodResolver(PasswordUpdateSchema),
        defaultValues: { oldPassword: "", newPassword: "" },
    });

    const onSubmit = async (data: z.infer<typeof PasswordUpdateSchema>) => {
        try {
            await updatePasswordMutation.mutateAsync(data);
            toast.success("Success!", { description: "Your password is updated successfully" });
            form.reset();
        } catch (error: any) {
            console.log("🚀 ~ onSubmit ~ error:", error);
            setFormErrors((state) => [...state, error.message]);
        }
    };

    const { errors } = form.formState;

    useEffect(() => {
        setFormErrors(
            Object.values(errors)
                .filter((error) => error.type === "custom")
                .map((error) => error.message ?? "")
                .filter(Boolean),
        );
    }, [errors]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {formErrors.length > 0 && (
                    <Alert className="space-x-3 rounded-none bg-red-50" variant="destructive">
                        <InfoIcon />
                        <AlertTitle>Error!</AlertTitle>
                        {formErrors.map((error, key) => (
                            <AlertDescription key={key}>{error}</AlertDescription>
                        ))}
                    </Alert>
                )}
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
