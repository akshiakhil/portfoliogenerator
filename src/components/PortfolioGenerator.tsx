import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Github, Loader2, Sparkles } from 'lucide-react';
import { api } from '../lib/api';
import type { TemplateType } from '../lib/types';
import { TemplatePreview } from './TemplatePreview';

interface FormData {
  githubUsername: string;
  template: TemplateType;
}

interface PortfolioGeneratorProps {
  onPortfolioCreated: () => void;
}

export const PortfolioGenerator: React.FC<PortfolioGeneratorProps> = ({ onPortfolioCreated }) => {
  const [loading, setLoading] = React.useState(false);
  const { register, handleSubmit, watch } = useForm<FormData>({
    defaultValues: {
      template: 'minimal'
    }
  });

  const selectedTemplate = watch('template');

  const onSubmit = async (data: FormData) => {
    const toastId = toast.loading('Fetching GitHub data...');
    setLoading(true);

    try {
      // First validate GitHub username exists
      await api.getGithubData(data.githubUsername);
      
      // Create portfolio with username
      await api.createPortfolio({
        title: `${data.githubUsername}'s Portfolio`,
        description: `Portfolio for ${data.githubUsername}`,
        template: data.template,
        github_username: data.githubUsername,
        published: true
      });

      toast.success('Portfolio created successfully!', { id: toastId });
      onPortfolioCreated();
    } catch (error: any) {
      console.error('Error generating portfolio:', error);
      toast.error(error.message || 'Failed to generate portfolio', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-bold">Generate Your Portfolio</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GitHub Username
            </label>
            <div className="relative">
              <Github className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                {...register('githubUsername', { required: true })}
                type="text"
                className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your GitHub username"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Template
            </label>
            <div className="grid md:grid-cols-3 gap-4">
              <TemplatePreview
                type="minimal"
                selected={selectedTemplate === 'minimal'}
                register={register}
              />
              <TemplatePreview
                type="professional"
                selected={selectedTemplate === 'professional'}
                register={register}
              />
              <TemplatePreview
                type="creative"
                selected={selectedTemplate === 'creative'}
                register={register}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Portfolio
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};