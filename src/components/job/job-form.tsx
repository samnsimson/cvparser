"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, HTMLAttributes, useState } from "react";
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
import { CalendarIcon, FolderTree, LoaderIcon } from "lucide-react";
import { JobOptionalDefaultsSchema } from "@/zod";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import moment from "moment";
import { Label } from "../form";

interface JobFormProps extends HTMLAttributes<HTMLDivElement> {
    [x: string]: any;
}

const Schema = JobOptionalDefaultsSchema.omit({ createdById: true });
type SchemaType = z.infer<typeof Schema>;

export const JobForm: FC<JobFormProps> = ({ className, ...props }) => {
    const jobMutation = api.job.createJob.useMutation();
    const { data: departments } = api.department.getDepartments.useQuery({});
    const [defaultValues] = useState<SchemaType>({
        title: "",
        description: "",
        jobType: "FULL_TIME",
        shiftType: "DAY",
        departmentId: "",
        location: "",
        expiryDate: new Date(),
    });
    const form = useForm<SchemaType>({ resolver: zodResolver(Schema), defaultValues });

    const createJob = async (data: SchemaType) => {
        try {
            await jobMutation.mutateAsync(data);
            form.reset(defaultValues);
            toast.success("Job created", { description: "New job has been created successfully" });
        } catch (error) {
            console.log("🚀 ~ createJob ~ error:", error);
        }
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
                                <Label text="Job Title" />
                                <FormControl>
                                    <Input type="text" placeholder="Eg: Software Developer" {...field} />
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
                                <Label text="Job Department" />
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
                                                <div className="flex flex-col items-center justify-center space-y-4 p-6 text-gray-400">
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
                                <Label text="Job Description" />
                                <FormControl>
                                    <Textarea rows={6} placeholder="Eg: Looking for a Software Developer to join our team" {...(field as any)} />
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
                                <Label text="Job Location" />
                                <FormControl>
                                    <Input type="text" placeholder="Eg: United States of America" {...(field as any)} />
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
                                <Label text="Job Type" />
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
                                <Label text="Shift Type" />
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
                    <FormField
                        name="expiryDate"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <Label text="Job valid through" />
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                type="button"
                                                variant={"outline"}
                                                className={cn("w-full border-neutral-700 pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                                            >
                                                {field.value ? moment(field.value).format("YYYY-MM-DD") : <span>Job expires on</span>}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value as any}
                                            onSelect={field.onChange}
                                            disabled={(date) => date < new Date()}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full space-x-2" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting && <LoaderIcon className="animate-spin" />} <span>Create Job</span>
                    </Button>
                </form>
            </Form>
        </div>
    );
};
