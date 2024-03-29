import { JobForm, ListJobs } from "@/components/job";
import { Title } from "@/components/section";

const JobsPage = () => {
    return (
        <div className="grid h-full grid-cols-6">
            <div className="col-span-2">
                <Title text="Create New Job" className="border-b" />
                <JobForm />
            </div>
            <div className="col-span-4 border-l">
                <Title text="Jobs" className="border-b" />
                <ListJobs />
            </div>
        </div>
    );
};
export default JobsPage;
