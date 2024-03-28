"use client";
import { api } from "@/trpc/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FC, FormEvent, HTMLAttributes, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { ArrowRight, Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface ListJobProps extends HTMLAttributes<HTMLDivElement> {
    [x: string]: any;
}

const LoadingSkeleton: FC = () => {
    return Array.from({ length: 8 }, (_, key) => <Skeleton key={key} className="w-full min-h-16 border rounded-none" />);
};

export const ListJobs: FC<ListJobProps> = ({ ...props }) => {
    const params = useSearchParams();
    const jobId = params.get("jobid");
    const { data: jobs, isFetching, isRefetching } = api.job.getJobs.useQuery();
    const [query, setQuery] = useState<string | null>(null);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.target as HTMLFormElement);
        const searchQuery = data.get("search");
        setQuery(typeof searchQuery === "string" ? searchQuery : null);
    };

    if (isFetching && !isRefetching) return <LoadingSkeleton />;

    return (
        <div {...props}>
            <form className="flex p-6 border-b" onSubmit={handleSubmit}>
                <Input name="search" type="text" placeholder="Search jobs..." />
                <Button type="submit">
                    <Search />
                </Button>
            </form>
            {jobs
                ?.filter((x) => (query ? x.title.toLowerCase().includes(query.toLowerCase()) : x))
                .map((job) => (
                    <Link
                        href={{ query: { jobid: job.id } }}
                        key={job.id}
                        data-active={jobId === job.id}
                        className="w-full px-6 py-4 border-b flex items-center justify-between min-h-16 hover:bg-stone-50 data-[active=true]:border data-[active=true]:bg-sky-100  data-[active=true]:border-y-sky-700 data-[active=true]:text-sky-700"
                    >
                        <span className="font-normal tracking-wide">{job.title}</span> {jobId === job.id && <ArrowRight />}
                    </Link>
                ))}
        </div>
    );
};
