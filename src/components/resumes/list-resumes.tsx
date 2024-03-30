"use client";
import { FC, HTMLAttributes } from "react";
import { AspectRatio } from "../ui/aspect-ratio";
import Image from "next/image";
import { Title } from "../section";
import { ResuemActionButtons } from ".";
import { api } from "@/trpc/react";
import { Skeleton } from "../ui/skeleton";
import { Loader } from "lucide-react";

interface ListResumesProps extends HTMLAttributes<HTMLDivElement> {
    jobId: string;
}

export const ListResumes: FC<ListResumesProps> = ({ jobId, ...props }) => {
    const { data: resumes, isFetching, isRefetching } = api.resume.getResumesForJobs.useQuery({ jobId });

    return (
        <div {...props}>
            <Title text="Resumes" />
            <div className="grid grid-cols-3 gap-0">
                {isFetching && !isRefetching
                    ? Array.from({ length: 6 }, (_, key) => (
                          <AspectRatio ratio={1 / 1} key={key}>
                              <Skeleton className="flex h-full w-full flex-col rounded-none border border-neutral-200 bg-white">
                                  <Skeleton className="flex flex-1 items-center justify-center">
                                      <Loader className="animate-spin text-stone-500" />
                                  </Skeleton>
                                  <div className="flex justify-evenly border-y">
                                      <Skeleton className="h-12 w-full rounded-none" />
                                      <Skeleton className="h-12 w-full rounded-none border-x-[1px] border-neutral-300" />
                                      <Skeleton className="h-12 w-full rounded-none" />
                                  </div>
                                  <Skeleton className="border-x-none min-h-12 rounded-none bg-stone-200" />
                              </Skeleton>
                          </AspectRatio>
                      ))
                    : resumes?.map((resume) => (
                          <AspectRatio key={resume.id} className="flex border-neutral-500/20 p-0 hover:bg-white">
                              <div className="group relative flex h-full w-full flex-col border hover:border-sky-700">
                                  <div className="flex w-full flex-1 items-center justify-center">
                                      <Image src="/images/pdf-icon.svg" alt="pdf icon" width={80} height={80} />
                                  </div>
                                  <ResuemActionButtons layout="grid" />
                                  <div className="line-clamp-1 flex min-h-12 w-full items-center border-t bg-neutral-100 px-2 group-hover:bg-sky-700">
                                      <span className="font-normal uppercase tracking-wide text-neutral-500 group-hover:text-white">
                                          {resume.path?.split("/").pop()}
                                      </span>
                                  </div>
                              </div>
                          </AspectRatio>
                      ))}
            </div>
        </div>
    );
};
