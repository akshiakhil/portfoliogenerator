import { Portfolio } from '../../lib/types';
import { Github, Globe, Briefcase, Code } from 'lucide-react';

interface TemplateProps {
  portfolio: Portfolio;
}

export const ProfessionalTemplate = ({ portfolio }: TemplateProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">{portfolio.title}</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">{portfolio.description}</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-16">
        {portfolio.projects && portfolio.projects.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <Briefcase className="w-8 h-8 text-blue-600" />
              <h2 className="text-3xl font-bold">Featured Projects</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {portfolio.projects.map((project) => (
                <div key={project.id} className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold mb-3">{project.title}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  
                  {project.technologies && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-4">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
                      >
                        <Github size={18} />
                        <span>View Code</span>
                      </a>
                    )}
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
                      >
                        <Globe size={18} />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {portfolio.skills && portfolio.skills.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <Code className="w-8 h-8 text-blue-600" />
              <h2 className="text-3xl font-bold">Technical Skills</h2>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="grid md:grid-cols-2 gap-12">
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
                    <h3 className="text-xl font-semibold mb-4">{category}</h3>
                    <div className="space-y-4">
                      {skills.map((skill) => (
                        <div key={skill.id}>
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">{skill.name}</span>
                            <span className="text-gray-500">{skill.proficiency}/5</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600 rounded-full transition-all duration-500"
                              style={{ width: `${(skill.proficiency / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
