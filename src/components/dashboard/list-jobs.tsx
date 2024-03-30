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
    initialJobs: any;
}

const LoadingSkeleton: FC = () => {
    return Array.from({ length: 8 }, (_, key) => <Skeleton key={key} className="min-h-16 w-full rounded-none border" />);
};

export const ListJobs: FC<ListJobProps> = ({ initialJobs: initialData, ...props }) => {
    const params = useSearchParams();
    const jobId = params.get("jobid");
    const { data: jobs, isFetching, isRefetching } = api.job.getJobs.useQuery(undefined, { initialData });
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
            <form className="flex border-b p-6" onSubmit={handleSubmit}>
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
                        className="flex min-h-16 w-full items-center justify-between border-b px-6 py-4 hover:bg-stone-50 data-[active=true]:border data-[active=true]:border-y-sky-700  data-[active=true]:bg-sky-100 data-[active=true]:text-sky-700"
                    >
                        <span className="font-normal tracking-wide">{job.title}</span> {jobId === job.id && <ArrowRight />}
                    </Link>
                ))}
        </div>
    );
};
