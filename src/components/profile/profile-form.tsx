"use client";
import { ProfileOptionalDefaults, ProfileOptionalDefaultsSchema } from "@/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { api } from "@/trpc/react";
import { FC } from "react";

const ProfileForm: FC = () => {
    const mutation = api.profile.createProfile.useMutation();
    const form = useForm<ProfileOptionalDefaults>({
        resolver: zodResolver(ProfileOptionalDefaultsSchema),
        defaultValues: { firstName: "", lastName: "", address: "", city: "", state: "", country: "", zipCode: "" },
    });

    const onSubmit = async (data: ProfileOptionalDefaults) => {
        console.log("🚀 ~ onSubmit ~ data:", data);
        mutation.mutate(data, { onSuccess: (profile) => console.log(profile), onError: (error) => console.log(error) });
    };

    const { isSubmitting } = form.formState;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <FormField
                        name="firstName"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
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
                            <FormItem>
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
                </div>
            </form>
        </Form>
    );
};
export default ProfileForm;
