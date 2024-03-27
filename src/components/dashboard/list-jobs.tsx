"use client";
import { api } from "@/trpc/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FC, HTMLAttributes } from "react";
import { Skeleton } from "../ui/skeleton";
import { ArrowRight } from "lucide-react";

interface ListJobProps extends HTMLAttributes<HTMLDivElement> {
    [x: string]: any;
}

const LoadingSkeleton: FC = () => {
    return Array.from({ length: 8 }, (_, key) => <Skeleton key={key} className="w-full min-h-16 border rounded-none" />);
};

export const ListJobs: FC<ListJobProps> = ({ ...props }) => {
    const params = useSearchParams();
    const jobId = params.get("jobid");
    const { data: jobs, isFetching } = api.job.getJobs.useQuery();

    if (isFetching) return <LoadingSkeleton />;

    return (
        <div {...props}>
            {jobs?.map((job) => (
                <Link
                    href={{ query: { jobid: job.id } }}
                    key={job.id}
                    data-active={jobId === job.id}
                    className="w-full px-6 py-4 border-b flex items-center justify-between min-h-16 hover:bg-stone-50 data-[active=true]:border data-[active=true]:bg-sky-100  data-[active=true]:border-sky-700 data-[active=true]:text-sky-700"
                >
                    <span className="font-semibold tracking-wide">{job.title}</span> {jobId === job.id && <ArrowRight />}
                </Link>
            ))}
        </div>
    );
};
