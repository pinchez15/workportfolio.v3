"use client"

export default function DemoPortfolio() {
  const demoPortfolio = {
    name: "Your Name Here",
    avatar: "/default-avatar.png",
    bio: "Write a short bio to introduce yourself.",
    projects: [
      { 
        title: "My First Project",
        description: "Project description goes here...",
        link: "#"
      }
    ]
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <header className="flex items-center space-x-4 mb-6">
        <img
          src={demoPortfolio.avatar}
          alt="Avatar"
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h1 className="text-2xl font-bold">{demoPortfolio.name}</h1>
          <p className="text-gray-600">{demoPortfolio.bio}</p>
        </div>
      </header>

      <section>
        <h2 className="text-xl font-semibold mb-4">Projects</h2>
        <div className="grid grid-cols-1 gap-4">
          {demoPortfolio.projects.map((project, index) => (
            <div
              key={index}
              className="border p-4 rounded shadow-sm bg-white"
            >
              <h3 className="font-bold">{project.title}</h3>
              <p className="text-gray-600">{project.description}</p>
              <a
                href={project.link}
                className="text-blue-500 underline mt-2 inline-block"
              >
                View Project
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
} 