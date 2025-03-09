import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import { Portfolio } from '../lib/types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Github, Code, Star, Globe, ArrowRight, Mail } from 'lucide-react';
import { generatePortfolioContent } from '../services/portfolioBuilderService';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

export const PortfolioView = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPortfolio = async () => {
      if (!id) {
        setError('Portfolio ID is required');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const data = await api.getPortfolio(id);
        
        // Check if portfolio is private and user is not authorized
        if (!data.published && (!user || user.id !== data.user_id)) {
          throw new Error('You do not have permission to view this portfolio');
        }

        setPortfolio(data);
        
        if (!data?.github_username) {
          throw new Error('No GitHub username found. Please recreate the portfolio.');
        }
        
        const enhancedData = await generatePortfolioContent(data.github_username);
        setPortfolioData(enhancedData);
      } catch (err: any) {
        const message = err.message || 'Failed to load portfolio';
        console.error('Portfolio Error:', err);
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    loadPortfolio();
  }, [id, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!portfolio || !portfolioData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Portfolio not found</p>
      </div>
    );
  }

  // Return the new template JSX structure
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-8 mb-8">
            <img 
              src={portfolioData.github.avatarUrl}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
            />
            <div>
              <h1 className="text-4xl font-bold mb-2">{portfolioData.hero.headline}</h1>
              <p className="text-xl opacity-90">{portfolioData.hero.subheadline}</p>
            </div>
          </div>
          <a 
            href={portfolioData.github.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors"
          >
            <Github className="w-5 h-5" />
            <span>View GitHub Profile</span>
          </a>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">About Me</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">{portfolioData.about.introduction}</p>
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-semibold mb-4">Expertise</h3>
                <ul className="space-y-2">
                  {portfolioData.about.expertise.map((item: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <Code className="w-5 h-5 text-blue-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Key Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {portfolioData.about.keySkills.map((skill: string, index: number) => (
                    <span 
                      key={index}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12">Featured Projects</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {portfolioData.projects.map((project: any, index: number) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <h3 className="text-xl font-bold mb-2">{project.name}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech: string, techIndex: number) => (
                    <span 
                      key={techIndex}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  {project.highlights.map((highlight: string, hiIndex: number) => (
                    <div key={hiIndex} className="flex items-center gap-1 text-gray-500">
                      {hiIndex === 0 ? <Star className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                      <span className="text-sm">{highlight}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{portfolioData.contact.tagline}</h2>
          <p className="text-gray-600 mb-8">{portfolioData.contact.availability}</p>
          <div className="flex justify-center gap-4">
            <a
              href={`mailto:${portfolioData.github.username}@example.com`}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span>Get in Touch</span>
            </a>
            <a
              href={portfolioData.github.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors"
            >
              <Github className="w-5 h-5" />
              <span>View GitHub</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
