import { api } from "@/trpc/server";
import { FC, HTMLAttributes } from "react";
import { AspectRatio } from "../ui/aspect-ratio";
import Image from "next/image";

interface ListResumesProps extends HTMLAttributes<HTMLDivElement> {
    jobId: string;
}

export const ListResumes: FC<ListResumesProps> = async ({ jobId, ...props }) => {
    const resumes = await api.resume.getResumesForJobs({ jobId });

    return (
        <div {...props}>
            <div className="grid grid-cols-4">
                {resumes.map((resume) => (
                    <AspectRatio ratio={1 / 1} key={resume.id} className="flex flex-col">
                        <div className="flex flex-1 items-center justify-center">
                            <Image src="/images/pdf-icon.svg" alt="pdf icon" width={100} height={100} />
                        </div>
                    </AspectRatio>
                ))}
            </div>
        </div>
    );
};
