/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";
import { api } from "@/trpc/react";
import { FC, HTMLAttributes, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { upperCase } from "lodash";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { JobType, ShiftType } from "@prisma/client";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import { LoaderIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import moment from "moment";

interface ListJobsProps extends HTMLAttributes<HTMLDivElement> {
    [x: string]: any;
}

interface BadgifyProps {
    type: JobType | ShiftType | null;
}

const expiryBadge = (date: Date | null) => {
    const valid = date && moment().isBefore(moment(date));
    return <Badge variant={valid ? "accent" : "destructive"}>{valid ? moment(date).format("YYYY-MM-DD") : "Expired"}</Badge>;
};

const Badgify: FC<BadgifyProps> = ({ type }) => {
    if (!type) return null;
    const value = upperCase(type.split("_").join(" "));
    return (
        <Badge
            variant="outline"
            className={cn({
                "border-sky-500 bg-sky-100 text-sky-500": type === "FULL_TIME",
                "border-stone-500 bg-stone-100 text-stone-500": type === "PART_TIME",
                "border-amber-500 bg-amber-100 text-amber-500": type === "HYBRID",
                "border-rose-500 bg-rose-100 text-rose-500": type === "REMOTE",
                "border-emerald-500 bg-emerald-100 text-emerald-500": type === "DAY",
                "border-zinc-500 bg-zinc-100 text-zinc-500": type === "NIGHT",
                "border-indigo-500 bg-indigo-100 text-indigo-500": type === "MIXED",
            })}
        >
            {value}
        </Badge>
    );
};

const LoadingState: FC = () => {
    const skeleton = <Skeleton className="min-h-[51px] rounded-none border" />;
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="p-0">{skeleton}</TableHead>
                    <TableHead className="p-0">{skeleton}</TableHead>
                    <TableHead className="p-0">{skeleton}</TableHead>
                    <TableHead className="p-0">{skeleton}</TableHead>
                    <TableHead className="p-0">{skeleton}</TableHead>
                    <TableHead className="p-0">{skeleton}</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({ length: 10 }, (_, key) => (
                    <TableRow key={key}>
                        <TableCell className="p-0">{skeleton}</TableCell>
                        <TableCell className="p-0">{skeleton}</TableCell>
                        <TableCell className="p-0">{skeleton}</TableCell>
                        <TableCell className="p-0">{skeleton}</TableCell>
                        <TableCell className="p-0">{skeleton}</TableCell>
                        <TableCell className="p-0">{skeleton}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export const ListJobs: FC<ListJobsProps> = ({ ...props }) => {
    const [isDeleting, setIsDeleting] = useState<boolean | string>(false);
    const { data: jobs, isFetching, isRefetching, refetch } = api.job.getJobs.useQuery();
    const deleteJobMutation = api.job.deleteJob.useMutation();

    const deleteJob = async (id: string) => {
        setIsDeleting(id);
        deleteJobMutation.mutate(
            { id },
            {
                onSuccess: async () => {
                    await refetch();
                    setIsDeleting(false);
                    toast.success("Deleted", { description: "Job is deleted successfully!" });
                },
            },
        );
    };

    if (isFetching && !isRefetching) return <LoadingState />;
    return (
        <div {...props}>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="bg-sky-700 uppercase text-white">Title</TableHead>
                        <TableHead className="bg-sky-700 uppercase text-white">Department</TableHead>
                        <TableHead className="bg-sky-700 uppercase text-white">Location</TableHead>
                        <TableHead className="min-w-32 bg-sky-700 uppercase text-white">Job Type</TableHead>
                        <TableHead className="min-w-32 bg-sky-700 uppercase text-white">Shift Type</TableHead>
                        <TableHead className="bg-sky-700 uppercase text-white">Valid Through</TableHead>
                        <TableHead className="bg-sky-700 uppercase text-white"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {jobs?.map((job) => (
                        <TableRow key={job.id}>
                            <TableCell className="text-sky-700 hover:underline">
                                <Link href={`job/${job.id}`}>{job.title}</Link>
                            </TableCell>
                            <TableCell>{job.department.title}</TableCell>
                            <TableCell>{job.location}</TableCell>
                            <TableCell>
                                <Badgify type={job.jobType} />
                            </TableCell>
                            <TableCell>
                                <Badgify type={job.shiftType} />
                            </TableCell>
                            <TableCell>{expiryBadge(job.expiryDate)}</TableCell>
                            <TableCell>
                                {isDeleting === job.id ? (
                                    <LoaderIcon strokeWidth={1} size={20} className="animate-spin" />
                                ) : (
                                    <Trash2Icon strokeWidth={1} size={20} className="cursor-pointer text-red-500" onClick={() => deleteJob(job.id)} />
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
