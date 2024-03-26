import { ProfileForm, UpdatePasswordForm } from "@/components/profile";
import { Title } from "@/components/section";

const ProfilePage = async () => {
    return (
        <div className="grid grid-cols-6 h-full">
            <div className="col-span-2 border-r space-y-6 flex flex-col">
                <div className="min-h-40 bg-zinc-200 px-6 flex items-center justify-start">
                    <div className="bg-zinc-300 h-28 w-28"></div>
                </div>
                <div className="px-6">
                    <ProfileForm />
                </div>
                <Title text="Change Password" />
                <div className="px-6">
                    <UpdatePasswordForm />
                </div>
            </div>
        </div>
    );
};
export default ProfilePage;
