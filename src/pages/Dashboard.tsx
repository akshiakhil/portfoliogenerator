import React, { useEffect, useState } from 'react';
import { PortfolioGenerator } from '../components/PortfolioGenerator';
import { PortfolioList } from '../components/PortfolioList';
import { Toaster } from 'sonner';
import { api } from '../lib/api';
import type { Portfolio } from '../lib/types';

export const Dashboard = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);

  useEffect(() => {
    loadPortfolios();
  }, []);

  const loadPortfolios = async () => {
    try {
      const data = await api.getPortfolios();
      setPortfolios(data);
    } catch (error) {
      console.error('Failed to load portfolios:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" richColors />
      <div className="max-w-7xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-center mb-12">
          Portfolio Dashboard
        </h1>
        
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-semibold mb-6">Create New Portfolio</h2>
            <PortfolioGenerator onPortfolioCreated={loadPortfolios} />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-6">Your Portfolios</h2>
            <PortfolioList portfolios={portfolios} />
          </section>
        </div>
      </div>
    </div>
  );
};