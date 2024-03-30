import { ListJobs } from "@/components/dashboard";
import { ListResumes } from "@/components/resumes";
import { UploadForm } from "@/components/upload/upload-form";
import { NextPageProps } from "@/lib/types";
import { api } from "@/trpc/server";
import { NextPage } from "next";

const Page: NextPage<NextPageProps> = async ({ searchParams: { jobid } }) => {
    const jobs = await api.job.getJobs();
    return (
        <div className="grid h-full grid-cols-12">
            <div className="col-span-3">
                <ListJobs initialJobs={jobs} />
            </div>
            <div className="col-span-6 border-x">
                <UploadForm />
                {jobid && <ListResumes jobId={jobid} />}
            </div>
            <div className="col-span-3"></div>
        </div>
    );
};
export default Page;
