import { getServerSession } from "next-auth";

export default async function Home() {
    const session = await getServerSession();
    console.log("🚀 ~ Home ~ session:", session);

    return <main className=""></main>;
}
