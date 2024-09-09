"use client"

import { useEffect, useState } from 'react';
import Loading from '@/app/components/Loading';
import ProjectCard from './ProjectCard';
import CreateProjectCard from './CreateProjectCard';


export default function Dashboard() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Allow time for render
        const timer = setTimeout(() => {
        setIsLoading(false);
        }, 50);

        // Cleanup the timer on component unmount
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex flex-col justify-center items-center w-full h-full text-4xl gap-8 font-bold pt-8">
            {isLoading ? (
                <Loading />
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-3/4">
                <ProjectCard />
                <CreateProjectCard />
                
  
            </div>
            )}
        </div>
    );
}