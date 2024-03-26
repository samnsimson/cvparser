import { UploadForm } from "@/components/upload/upload-form";

const Page = () => {
    return (
        <div className="grid grid-cols-12 h-full">
            <div className="col-span-3"></div>
            <div className="col-span-6 border-x">
                <UploadForm />
            </div>
            <div className="col-span-3"></div>
        </div>
    );
};
export default Page;
