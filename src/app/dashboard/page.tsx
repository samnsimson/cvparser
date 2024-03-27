import { ListJobs } from "@/components/dashboard";
import { UploadForm } from "@/components/upload/upload-form";
import { NextPageProps } from "@/lib/types";
import { NextPage } from "next";

const Page: NextPage<NextPageProps> = ({}) => {
    return (
        <div className="grid grid-cols-12 h-full">
            <div className="col-span-3">
                <ListJobs />
            </div>
            <div className="col-span-6 border-x">
                <UploadForm />
            </div>
            <div className="col-span-3"></div>
        </div>
    );
};
export default Page;
