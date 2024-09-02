import Navbar from "@/app/components/Navbar";
import Contents from "./Contents";

export default function Home() {
    

    return (
        <main className="flex min-h-screen gap-4 flex-col bg-background">
            <Navbar />
            <Contents />
        </main>
    );
}