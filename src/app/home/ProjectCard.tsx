import { currentlySelectedAtom } from "@/jotai/Navigation";
import { useAtom } from "jotai";

export default function ProjectCard() {
  const [currentlySelected, setCurrentlySelected] = useAtom(currentlySelectedAtom);    

  return (
    <button
      className="flex flex-col gap-4 bg-secondary rounded-lg p-4 hover:border-4 hover:cursor-pointer transition-transform duration-300 ease-out transform hover:scale-105"
      onClick={
        () => setCurrentlySelected("Ruleset Management")
      }
    >
      <h1 className="text-white text-2xl font-bold">http.127.0.0.1.nip.io:8443</h1>
      <h1 className="text-white text-4xl font-bold">Details</h1>
    </button>
  );
}
  