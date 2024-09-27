import Navbar from "@/app/components/Navbar";
import Contents from "./Contents";
import { getServerSession } from 'next-auth/next';
import { options } from '../api/auth/[...nextauth]/options';
import { redirect } from 'next/navigation';

export default async function Home() {
    const session = await getServerSession(options);

    if (!session) {
        redirect('/');
    }
    
    return (
        <main className="flex min-h-screen gap-4 flex-col bg-background">
            <Navbar />
            <Contents />
        </main>
    );
}
