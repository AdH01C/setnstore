export default function ProjectCard() {
    return (
      <div className="flex flex-col gap-4 bg-secondary rounded-lg p-4 hover:border-4 hover:cursor-pointer transition-transform duration-300 ease-out transform hover:scale-105">
        <h1 className="text-white text-2xl font-bold">Project Name</h1>
        <h1 className="text-white text-4xl font-bold">Details</h1>
      </div>
    );
  }
  