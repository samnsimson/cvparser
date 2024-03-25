"use client";
import { ProfileOptionalDefaultsWithPartialRelationsSchema } from "@/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { api } from "@/trpc/react";
import { FC } from "react";
import { Profile, User } from "@prisma/client";
import { defaultFormValues } from "@/lib/utils";

const defaultValueKeys = ["firstName", "lastName", "address", "city", "state", "country", "zipCode", "name", "email", "phone"] as const;
type ProfileProps = { profile: (Profile & { user: Partial<User> | null }) | null };
type FormData = { [K in (typeof defaultValueKeys)[number]]: string };

const buildDefaultValues = (profile: ProfileProps["profile"]) => {
    const requiredKeys: string[] = [...defaultValueKeys];
    if (!profile) return defaultFormValues(requiredKeys);
    const { user, ...rest } = profile;
    const combinedObj: Record<string, any> = { ...rest, ...(user && user) };
    return requiredKeys.reduce((acc: Record<string, any>, curr) => {
        acc[curr] = combinedObj[curr] || "";
        return acc;
    }, {});
};

const ProfileForm: FC<ProfileProps> = ({ profile }) => {
    const defaultValues = buildDefaultValues(profile);
    const mutation = api.profile.createProfile.useMutation();
    const form = useForm<FormData>({ resolver: zodResolver(ProfileOptionalDefaultsWithPartialRelationsSchema), defaultValues });
    const onSubmit = async (data: FormData) => mutation.mutate(data, { onSuccess: () => form.reset(), onError: console.log });
    const { isSubmitting } = form.formState;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6">
                <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem className="col-span-2">
                            <FormControl>
                                <Input type="text" placeholder="Name" {...field} disabled />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem className="col-span-1">
                            <FormControl>
                                <Input type="text" placeholder="Email" {...field} disabled />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="phone"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem className="col-span-1">
                            <FormControl>
                                <Input type="text" placeholder="Phone" {...field} disabled />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="firstName"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem className="col-span-1">
                            <FormControl>
                                <Input type="text" placeholder="First Name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="lastName"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem className="col-span-1">
                            <FormControl>
                                <Input type="text" placeholder="Last Name" {...(field as any)} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="address"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem className="col-span-2">
                            <FormControl>
                                <Input type="text" placeholder="Address" {...(field as any)} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="city"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem className="col-span-1">
                            <FormControl>
                                <Input type="text" placeholder="City" {...(field as any)} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="state"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem className="col-span-1">
                            <FormControl>
                                <Input type="text" placeholder="State" {...(field as any)} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="country"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem className="col-span-1">
                            <FormControl>
                                <Input type="text" placeholder="Country" {...(field as any)} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="zipCode"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem className="col-span-1">
                            <FormControl>
                                <Input type="text" placeholder="Zipcode" {...(field as any)} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full col-span-2" disabled={isSubmitting}>
                    UPDATE PROFILE
                </Button>
            </form>
        </Form>
    );
};
export default ProfileForm;
