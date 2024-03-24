import { getServerAuthSession } from "@/server/auth";

export default async function Home() {
    const session = await getServerAuthSession();
    console.log("🚀 ~ Home ~ session:", session);

    return <main className=""></main>;
}
