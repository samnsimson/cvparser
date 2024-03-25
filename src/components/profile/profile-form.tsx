"use client";
import { Profile, ProfileOptionalDefaultsSchema, User } from "@/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { api } from "@/trpc/react";
import { FC } from "react";
import { pick } from "lodash";
import { defaultFormValues } from "@/lib/utils";

type ProfileProps = {
    profile: (Omit<Profile, "userId"> & { user: Pick<User, "name" | "email" | "phone"> | null }) | null;
};

type FormData = Pick<Profile, "firstName" | "lastName" | "address" | "city" | "state" | "country" | "zipCode"> & Pick<User, "name" | "email" | "phone">;

const ProfileForm: FC<ProfileProps> = ({ profile }) => {
    const mutation = api.profile.createProfile.useMutation();
    const defaultValueKeys = ["firstName", "lastName", "address", "city", "state", "country", "zipCode", "name", "email", "phone"];
    const form = useForm<FormData>({
        resolver: zodResolver(ProfileOptionalDefaultsSchema.omit({ userId: true })),
        defaultValues: profile ? { ...pick(profile, defaultValueKeys), ...profile.user } : defaultFormValues(defaultValueKeys),
    });

    const onSubmit = async (data: FormData) => {
        mutation.mutate(data, { onSuccess: () => form.reset(), onError: (error) => console.log(error) });
    };

    const { isSubmitting } = form.formState;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6">
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
