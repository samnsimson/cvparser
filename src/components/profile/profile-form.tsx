/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { ProfilePartialSchema } from "@/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { api } from "@/trpc/react";
import { FC, useEffect } from "react";
import { Profile, User } from "@prisma/client";
import { defaultFormValues } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { Skeleton } from "../ui/skeleton";
import { toast } from "sonner";

const defaultValueKeys = ["firstName", "lastName", "address", "city", "state", "country", "zipCode", "name", "email", "phone"] as const;
type ProfileProps = (Profile & { user: Partial<User> | null }) | null;
type FormData = { [K in (typeof defaultValueKeys)[number]]: string };

const buildDefaultValues = (profile: ProfileProps | null | undefined, session: Session | null) => {
    const requiredKeys: string[] = [...defaultValueKeys];
    if (!profile) return { ...defaultFormValues(requiredKeys), ...(session && { name: session.user.name, email: session.user.email }) };
    const { user, ...rest } = profile;
    const combinedObj: Record<string, any> = { ...rest, ...(user && user) };
    return requiredKeys.reduce((acc: Record<string, any>, curr) => {
        acc[curr] = combinedObj[curr] || "";
        return acc;
    }, {});
};

const LoadingState: FC = () => {
    return (
        <div className="grid gric-cols-2 gap-6">
            <Skeleton className="rounded-none h-12 bg-zinc-200 col-span-2" />
            <Skeleton className="rounded-none h-12 bg-zinc-200 col-span-1" />
            <Skeleton className="rounded-none h-12 bg-zinc-200 col-span-1" />
            <Skeleton className="rounded-none h-12 bg-zinc-200 col-span-1" />
            <Skeleton className="rounded-none h-12 bg-zinc-200 col-span-1" />
            <Skeleton className="rounded-none h-12 bg-zinc-200 col-span-2" />
            <Skeleton className="rounded-none h-12 bg-zinc-200 col-span-1" />
            <Skeleton className="rounded-none h-12 bg-zinc-200 col-span-1" />
            <Skeleton className="rounded-none h-12 bg-zinc-200 col-span-1" />
            <Skeleton className="rounded-none h-12 bg-zinc-200 col-span-1" />
            <Skeleton className="rounded-none h-12 bg-zinc-200 col-span-2" />
        </div>
    );
};

export const ProfileForm: FC = ({}) => {
    const getProfile = api.profile.getProfile.useQuery();
    const mutation = api.profile.updateProfile.useMutation();
    const { data: profile, isLoading, isFetched } = getProfile;
    const { data: session } = useSession();
    const form = useForm<FormData>({ resolver: zodResolver(ProfilePartialSchema), defaultValues: defaultFormValues([...defaultValueKeys]) });
    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (data: FormData) =>
        await mutation.mutateAsync(data, {
            onSuccess: async () => {
                await getProfile.refetch();
                toast.success("Success", { description: "Profile updated successfully!" });
            },
            onError: () => toast.error("Oops! Something went wrong", { description: "Error updating your profile" }),
        });

    useEffect(() => {
        if (isFetched) {
            const defaultValues = buildDefaultValues(profile, session);
            form.reset(defaultValues);
        }
    }, [profile, session, isFetched]);

    if (isLoading) return <LoadingState />;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6">
                <FormField
                    name="name"
                    disabled
                    render={({ field }) => (
                        <FormItem className="col-span-2">
                            <FormControl>
                                <Input type="text" placeholder="Name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="email"
                    disabled
                    render={({ field }) => (
                        <FormItem className="col-span-1">
                            <FormControl>
                                <Input type="text" placeholder="Email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="phone"
                    disabled
                    render={({ field }) => (
                        <FormItem className="col-span-1">
                            <FormControl>
                                <Input type="text" placeholder="Phone" {...field} />
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
                <Button type="submit" className="w-full col-span-2" disabled={isSubmitting || !isValid}>
                    UPDATE PROFILE
                </Button>
            </form>
        </Form>
    );
};
