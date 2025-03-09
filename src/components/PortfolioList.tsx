import React from 'react';
import { motion } from 'framer-motion';
import { Portfolio } from '../lib/types';
import { ExternalLink, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PortfolioListProps {
  portfolios: Portfolio[];
}

export const PortfolioList: React.FC<PortfolioListProps> = ({ portfolios }) => {
  if (!portfolios.length) {
    return <p className="text-gray-500 text-center">No portfolios yet.</p>;
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {portfolios.map((portfolio) => (
        <motion.div
          key={portfolio.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h3 className="text-xl font-semibold mb-2">{portfolio.title}</h3>
          <p className="text-gray-600 mb-4 line-clamp-3">{portfolio.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              Template: {portfolio.template}
            </span>
            <div className="flex space-x-2">
              <Link 
                to={`/portfolio/${portfolio.id}`}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
              {!portfolio.published && (
                <button 
                  className="p-2 hover:bg-gray-100 rounded-full"
                  onClick={() => {}} // TODO: Add edit functionality
                >
                  <Github className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
