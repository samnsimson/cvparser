"use client";
import { DepartmentOptionalDefaultsSchema } from "@/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, HTMLAttributes, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { LoaderIcon } from "lucide-react";
import { api } from "@/trpc/react";
import { toast } from "sonner";

interface CreteDepartmentFormProps extends HTMLAttributes<HTMLDivElement> {
    [x: string]: any;
}

const Schema = DepartmentOptionalDefaultsSchema.omit({ createdById: true });
type SchemaType = z.infer<typeof Schema>;

export const CreteDepartmentForm: FC<CreteDepartmentFormProps> = ({ ...props }) => {
    const departmentMutation = api.department.createDepartment.useMutation();
    const [defaultValues] = useState<SchemaType>({ title: "", description: "" });
    const form = useForm<SchemaType>({ resolver: zodResolver(Schema), defaultValues });
    const onSubmit = async (data: SchemaType) => {
        try {
            await departmentMutation.mutateAsync(data);
            form.reset();
            toast.success("Success!", { description: "Department created successfully" });
        } catch (error) {
            console.log("🚀 ~ onSubmit ~ error:", error);
        }
    };

    return (
        <div className="p-6" {...props}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        name="title"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Department Title</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Departent title" {...field} />
                                </FormControl>
                                <FormDescription>Enter the name for the department</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="description"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Department Description</FormLabel>
                                <FormControl>
                                    <Textarea rows={6} placeholder="Department Description" {...(field as any)} />
                                </FormControl>
                                <FormDescription>Provide a description for the department</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full space-x-2" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting && <LoaderIcon className="animate-spin" />} <span>Create Department</span>
                    </Button>
                </form>
            </Form>
        </div>
    );
};
