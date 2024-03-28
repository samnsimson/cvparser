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
                "text-sky-500 border-sky-500 bg-sky-100": type === "FULL_TIME",
                "text-stone-500 border-stone-500 bg-stone-100": type === "PART_TIME",
                "text-amber-500 border-amber-500 bg-amber-100": type === "HYBRID",
                "text-rose-500 border-rose-500 bg-rose-100": type === "REMOTE",
                "text-emerald-500 border-emerald-500 bg-emerald-100": type === "DAY",
                "text-zinc-500 border-zinc-500 bg-zinc-100": type === "NIGHT",
                "text-indigo-500 border-indigo-500 bg-indigo-100": type === "MIXED",
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
                        <TableHead className="uppercase bg-sky-700 text-white">Title</TableHead>
                        <TableHead className="uppercase bg-sky-700 text-white">Department</TableHead>
                        <TableHead className="uppercase bg-sky-700 text-white">Location</TableHead>
                        <TableHead className="uppercase bg-sky-700 text-white min-w-32">Job Type</TableHead>
                        <TableHead className="uppercase bg-sky-700 text-white min-w-32">Shift Type</TableHead>
                        <TableHead className="uppercase bg-sky-700 text-white">Valid Through</TableHead>
                        <TableHead className="uppercase bg-sky-700 text-white"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {jobs?.map((job) => (
                        <TableRow key={job.id}>
                            <TableCell className="hover:underline text-sky-700">
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
