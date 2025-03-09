import { Portfolio } from '../../lib/types';
import { Github, Globe, Code } from 'lucide-react';

interface TemplateProps {
  portfolio: Portfolio;
}

export const MinimalTemplate = ({ portfolio }: TemplateProps) => {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{portfolio.title}</h1>
          <p className="text-xl text-gray-600">{portfolio.description}</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {portfolio.projects && portfolio.projects.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6">Projects</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {portfolio.projects.map((project) => (
                <div key={project.id} className="border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex items-center gap-4">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                      >
                        <Github size={16} />
                        <span>Code</span>
                      </a>
                    )}
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                      >
                        <Globe size={16} />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                  {project.technologies && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-600"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {portfolio.skills && portfolio.skills.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-6">Skills</h2>
            <div className="grid md:grid-cols-2 gap-y-8">
              {Object.entries(
                portfolio.skills.reduce((acc, skill) => {
                  if (!acc[skill.category]) {
                    acc[skill.category] = [];
                  }
                  acc[skill.category].push(skill);
                  return acc;
                }, {} as Record<string, typeof portfolio.skills>)
              ).map(([category, skills]) => (
                <div key={category}>
                  <h3 className="text-lg font-medium mb-3">{category}</h3>
                  <div className="space-y-2">
                    {skills.map((skill) => (
                      <div key={skill.id} className="flex items-center gap-2">
                        <Code size={16} className="text-gray-400" />
                        <span>{skill.name}</span>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${(skill.proficiency / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
