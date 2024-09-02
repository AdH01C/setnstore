import Navbar from "@/app/components/Navbar";
import Contents from "./Contents";

export default function Home() {
    

    return (
        <main className="flex min-h-screen flex-col bg-background">
            <Navbar />
            <Contents />
        </main>
    );
}