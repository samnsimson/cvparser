import ProfileForm from "@/components/profile/profile-form";
import { api } from "@/trpc/server";

const ProfilePage = async () => {
    const profile = await api.profile.getProfile();
    console.log("🚀 ~ ProfilePage ~ profile:", profile);
    return (
        <div className="p-6">
            <ProfileForm profile={profile} />
        </div>
    );
};
export default ProfilePage;
