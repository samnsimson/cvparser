"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, HTMLAttributes, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { supabase } from "@/lib/supabase";
import { omit } from "lodash";
import { env } from "@/env";
import moment from "moment";
import { LoaderIcon, UploadCloud } from "lucide-react";
import { Button } from "../ui/button";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { v4 as uuid } from "uuid";

interface UploadFormProps extends HTMLAttributes<HTMLDivElement> {
    [x: string]: any;
}

const MAX_UPLOAD_SIZE = 1024 * 1024 * 5; // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf"];

const formSchema = z.object({
    jobId: z
        .string({ required_error: "Please select a job from the sidebar to upload the resume" })
        .uuid({ message: "Please select a job from the sidebar to upload the resume" }),
    resume: z
        .instanceof(File)
        .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), "File must be a PDF")
        .refine((file) => file.size <= MAX_UPLOAD_SIZE, "File size must be less than 5MB"),
});

export const UploadForm: FC<UploadFormProps> = ({ ...props }) => {
    const params = useSearchParams();
    const resumeMutation = api.resume.createEntry.useMutation();
    const [fileKey, setFileKey] = useState(uuid());
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { resume: undefined, jobId: params.get("jobid") ?? "" },
    });

    const upload = async ({ resume, jobId }: z.infer<typeof formSchema>) => {
        const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_RESUME_FILE_PATH, NEXT_PUBLIC_RESUME_BUCKET } = env;
        const fileId = moment().format("YYYYMMDDTHHmmss");
        const filePath = `${NEXT_PUBLIC_RESUME_FILE_PATH}/${fileId}.pdf`;
        try {
            const { data, error } = await supabase.storage.from(NEXT_PUBLIC_RESUME_BUCKET).upload(filePath, resume);
            if (error) throw error;
            const { id: key, path, fullPath } = data as unknown as { id: string; path: string; fullPath: string };
            await resumeMutation.mutateAsync({ data: { key, path, fullPath, url: `${NEXT_PUBLIC_SUPABASE_URL}/${fullPath}` }, jobId });
            toast.success("Success!", { description: "Resume uploaded successfully" });
        } catch (error) {
            console.log("🚀 ~ upload ~ error:", error);
            toast.error("Something went wrong!", { description: "Unable to upload file at the moment" });
            supabase.storage.from(NEXT_PUBLIC_RESUME_BUCKET).remove([filePath]).catch(console.log);
        } finally {
            form.reset({ jobId: params.get("jobid") ?? "", resume: undefined });
            setFileKey(uuid());
        }
    };

    useEffect(() => form.setValue("jobId", params.get("jobid") ?? ""), [params, form]);

    return (
        <div {...props} className="p-6 border-b">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(upload)}>
                    <FormField
                        name="resume"
                        control={form.control}
                        render={({ field: { onChange, ...field } }) => {
                            return (
                                <FormItem>
                                    <FormControl>
                                        <FormLabel
                                            htmlFor="dropzone-file"
                                            className={cn(
                                                "flex flex-col items-center justify-center w-full h-32 border-2 border-sky-300/50 border-dashed rounded-none cursor-pointer bg-sky-50/50",
                                            )}
                                        >
                                            {!!!field.value ? (
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <UploadCloud />
                                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">PDF (MAX. 5MB)</p>
                                                </div>
                                            ) : (
                                                <Button type="submit" disabled={form.formState.isSubmitting} className="space-x-2">
                                                    {form.formState.isSubmitting && <LoaderIcon className="animate-spin" />} <span>UPLOAD</span>
                                                </Button>
                                            )}
                                            <Input
                                                id="dropzone-file"
                                                type="file"
                                                accept="application/pdf"
                                                key={fileKey}
                                                onChange={(e) => onChange(e.target.files?.[0] ?? undefined)}
                                                {...omit(field, ["value"])}
                                                className="hidden"
                                            />
                                        </FormLabel>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />
                    <FormField
                        name="jobId"
                        control={form.control}
                        render={({ field: { onChange, ...field } }) => (
                            <FormItem>
                                <FormControl className="hidden">
                                    <Input onChange={(e) => onChange(e.target.value)} value={params.get("jobid") ?? ""} {...omit(field, ["value"])} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
        </div>
    );
};
