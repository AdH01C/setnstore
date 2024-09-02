import Navbar from "@/app/components/Navbar";
import Contents from "./Contents";

export default function Home() {
    

    return (
        <main className="flex min-h-screen flex-col gap-16 bg-background">
            <Navbar />
            <Contents />
        </main>
    );
}