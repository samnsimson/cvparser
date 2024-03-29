import { CreteDepartmentForm } from "@/components/department";
import { Title } from "@/components/section";

const DepartmentsPage = () => {
    return (
        <div className="grid h-full grid-cols-6">
            <div className="col-span-2">
                <Title text="Create New Department" className="border-b" />
                <CreteDepartmentForm />
            </div>
            <div className="col-span-4 border-l">
                <Title text="Departments" className="border-b" />
            </div>
        </div>
    );
};
export default DepartmentsPage;
