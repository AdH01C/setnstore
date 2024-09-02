"use client"
import { currentlySelectedAtom } from "@/jotai/Navigation";
import { UserOutlined } from "@ant-design/icons";
import { useAtom } from 'jotai'

export default function Navbar() {
    const [currentlySelected, setCurrentlySelected] = useAtom(currentlySelectedAtom);

    return (
        <nav className="flex flex-col items-center py-4 px-8 gap-8 w-full">
            <div className="flex justify-between w-full">
                <h1 className="text-white text-4xl text-primary font-bold">Inquisito</h1>
                <UserOutlined className="hover:cursor-pointer text-white text-2xl" />
            </div>
            
            <div className="flex w-full font-bold gap-4">
                <a className={`text-white hover:cursor-pointer hover:text-primary ${currentlySelected === 'Dashboard' ? 'text-primary' : ''}`} onClick={() => setCurrentlySelected('Dashboard')}>Dashboard</a>
                <a className={`text-white hover:cursor-pointer hover:text-primary ${currentlySelected === 'Ruleset Management' ? 'text-primary' : ''}`} onClick={() => setCurrentlySelected('Ruleset Management')}>Ruleset Management</a>
                <a className={`text-white hover:cursor-pointer hover:text-primary ${currentlySelected === 'Application Status' ? 'text-primary' : ''}`} onClick={() => setCurrentlySelected('Application Status')}>Application Status</a>
            </div>
        </nav>
    );
}