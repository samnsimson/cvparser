import { ListJobs } from "@/components/dashboard";
import { ListResumes } from "@/components/resumes";
import { UploadForm } from "@/components/upload/upload-form";
import { NextPageProps } from "@/lib/types";
import { NextPage } from "next";

const Page: NextPage<NextPageProps> = ({ searchParams: { jobid } }) => {
    return (
        <div className="grid h-full grid-cols-12">
            <div className="col-span-3">
                <ListJobs />
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
