import { currentlySelectedAtom } from "@/jotai/Navigation";
import { useAtom } from "jotai";

import ApplicationDataService from "@/app/services/ApplicationDataService";

interface ProjectCardProps {
  appId: string;
  appName: string;
  companyName: string;
  onDelete: (appId: string) => void;
}

export default function ProjectCard({
  appId,
  appName,
  companyName,
  onDelete,
}: ProjectCardProps) {
  const [currentlySelected, setCurrentlySelected] = useAtom(
    currentlySelectedAtom
  );

  const handleDelete = async (e: React.MouseEvent) => {
    // Prevent the card click event from firing when delete is clicked
    e.stopPropagation();

    try {
      await ApplicationDataService.deleteApplication(companyName, appId);
      console.log(`Application with ID ${appId} deleted successfully`);
      onDelete(appId);
    } catch (error) {
      console.error("Error deleting application:", error);
    }
  };

  return (
    <div
      className="flex flex-col justify-between bg-secondary rounded-lg p-4 hover:border-4 hover:cursor-pointer transition-transform duration-300 ease-out transform hover:scale-105"
      onClick={() =>
        setCurrentlySelected({ type: "Ruleset Management", companyName, appId })
      }
    >
      <div className="flex flex-col gap-4">
        <h1 className="text-white text-2xl font-bold text-center">
          {companyName}
        </h1>
        <h1 className="text-white text-4xl font-bold text-center">{appName}</h1>
      </div>
      <button
        className="mt-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
        onClick={handleDelete}
      >
        Delete
      </button>
    </div>
  );
}
