import { useState } from 'react';

interface Project {
    name: string;
    rulesets: string[];
}

export default function Sidebar() {
    const [openProject, setOpenProject] = useState<number | null>(null);;

    const projects: Project[] = [
    {
      name: 'App 1',
      rulesets: ['Ruleset #1', 'Ruleset #2', 'Ruleset #3'],
    },
    {
      name: 'Sample Application',
      rulesets: ['My Test Ruleset'],
    },
    {
      name: 'Petstore Application',
      rulesets: ['Petstore API', 'Petstore Frontend'],
    },
  ];

    const handleToggle = (index: number) => {
    if (openProject === index) {
      setOpenProject(null);
    } else {
      setOpenProject(index);
    }
  };

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200">
        {/* Sidebar Header */}
      <div className="p-4 font-medium text-md">
        <h2 className="flex items-center text-gray-700">Projects</h2>
      </div>

      {/* Sidebar Projects */}
      {projects.map((project, index) => (
        <div key={index} className="text-gray-700">
          <div 
            className={`cursor-pointer px-4 py-3 ${
              openProject === index ? 'bg-green-100 text-green-800' : 'hover:bg-gray-100'
            }`}
            onClick={() => handleToggle(index)}>
            {project.name}
          </div>

          {/*Ruleset List*/}
          {openProject === index && (
            <ul className="pl-8 py-2 bg-white text-gray-600">
              {project.rulesets.map((ruleset, i) => (
                <li key={i} className="py-1 hover:text-green-600">
                  {ruleset}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

