import { ProfileForm, UpdatePasswordForm } from "@/components/profile";
import { Title } from "@/components/section";

const ProfilePage = async () => {
    return (
        <div className="grid h-full grid-cols-6">
            <div className="col-span-2 flex flex-col space-y-6 border-r">
                <div className="flex min-h-40 items-center justify-start bg-zinc-200 px-6">
                    <div className="h-28 w-28 bg-zinc-300"></div>
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
