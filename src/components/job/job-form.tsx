"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, HTMLAttributes } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { z } from "zod";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { api } from "@/trpc/react";
import { capitalize } from "lodash";
import { FolderTree } from "lucide-react";
import { JobOptionalDefaultsSchema } from "@/zod";
import { toast } from "sonner";

interface JobFormProps extends HTMLAttributes<HTMLDivElement> {
    [x: string]: any;
}

const Schema = JobOptionalDefaultsSchema.omit({ createdById: true });
type SchemaType = z.infer<typeof Schema>;

export const JobForm: FC<JobFormProps> = ({ className, ...props }) => {
    const jobMutation = api.job.createJob.useMutation();
    const { data: departments } = api.department.getDepartments.useQuery({});
    const form = useForm<SchemaType>({
        resolver: zodResolver(Schema),
        defaultValues: { title: "", description: "", jobType: "FULL_TIME", shiftType: "DAY", departmentId: "", location: "" },
    });

    const createJob = async (data: SchemaType) => {
        await jobMutation.mutateAsync(data, {
            onSuccess: () => {
                form.reset();
                toast.success("Job created", { description: "New job has been created successfully" });
            },
            onError: (error) => console.log(error),
        });
    };

    return (
        <div className={cn("p-6", className)} {...props}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(createJob)} className="space-y-6">
                    <FormField
                        name="title"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input type="text" placeholder="Job title" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="departmentId"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a department for the job" />
                                        </SelectTrigger>
                                    </FormControl>
                                    {departments && (
                                        <SelectContent className="rounded-none">
                                            {departments.length > 0 ? (
                                                departments.map((department) => (
                                                    <SelectItem key={department.id} value={department.id}>
                                                        {capitalize(department.title)}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <div className="p-6 flex flex-col items-center justify-center text-gray-400 space-y-4">
                                                    <FolderTree />
                                                    <p className="font-semibold">Nothing to select</p>
                                                    <Button type="button">Create Department</Button>
                                                </div>
                                            )}
                                        </SelectContent>
                                    )}
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="description"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea rows={6} placeholder="Job Description" {...(field as any)} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="location"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input type="text" placeholder="Job Location" {...(field as any)} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="jobType"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <ToggleGroup type="single" onValueChange={field.onChange} defaultValue={field.value} className="justify-evenly">
                                        <ToggleGroupItem className="w-full" value="FULL_TIME">
                                            Full Time
                                        </ToggleGroupItem>
                                        <ToggleGroupItem className="w-full" value="PART_TIME">
                                            Part Time
                                        </ToggleGroupItem>
                                        <ToggleGroupItem className="w-full" value="HYBRID">
                                            Hybrid
                                        </ToggleGroupItem>
                                        <ToggleGroupItem className="w-full" value="REMOTE">
                                            Remote
                                        </ToggleGroupItem>
                                    </ToggleGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="shiftType"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <ToggleGroup type="single" onValueChange={field.onChange} defaultValue={field.value} className="justify-evenly">
                                        <ToggleGroupItem className="w-full" value="DAY">
                                            Day Shift
                                        </ToggleGroupItem>
                                        <ToggleGroupItem className="w-full" value="NIGHT">
                                            Night Shift
                                        </ToggleGroupItem>
                                        <ToggleGroupItem className="w-full" value="MIXED">
                                            Mixed
                                        </ToggleGroupItem>
                                    </ToggleGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full">
                        Create Job
                    </Button>
                </form>
            </Form>
        </div>
    );
};
