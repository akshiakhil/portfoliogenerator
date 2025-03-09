import JSZip from 'jszip';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Download, Github, Code, Star, Globe, ArrowRight, User, Mail, MapPin, Building } from 'lucide-react';
import { generatePortfolioContent, generateSourceCode } from '../services/portfolioBuilderService';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { toast } from 'sonner';

export const PortfolioBuilder = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleGeneratePortfolio = async () => {
    if (!username) {
      toast.error('Please enter a GitHub username');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Generating portfolio...');

    try {
      // First generate the content
      const portfolioData = await generatePortfolioContent(username);
      
      // Create portfolio in database with GitHub username
      const portfolio = await api.createPortfolio({
        title: portfolioData.hero.headline,
        description: portfolioData.about.introduction,
        template: 'professional',
        github_username: username, // Add this field
        published: true
      });

      toast.success('Portfolio created successfully!', { id: toastId });
      navigate(`/portfolio/${portfolio.id}`);
    } catch (error: any) {
      console.error('Error generating portfolio:', error);
      toast.error(error.message || 'Failed to generate portfolio', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h2 className="text-2xl font-bold mb-6">Create Portfolio</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">GitHub Username</label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your GitHub username"
                />
                <Github className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
            </div>
            <button
              onClick={handleGeneratePortfolio}
              disabled={loading || !username}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white" />
                  Generating...
                </>
              ) : (
                <>
                  <Globe className="w-5 h-5" />
                  Generate Portfolio
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
