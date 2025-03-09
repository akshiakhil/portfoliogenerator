import React from 'react';
import { motion } from 'framer-motion';
import { UseFormRegister } from 'react-hook-form';
import { cn } from '../lib/utils';
import type { TemplateType } from '../lib/types';

interface TemplatePreviewProps {
  type: TemplateType;
  selected: boolean;
  register: UseFormRegister<any>;
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  type,
  selected,
  register
}) => {
  const templates = {
    minimal: {
      title: 'Minimal',
      description: 'Clean and simple design focusing on content',
      preview: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    professional: {
      title: 'Professional',
      description: 'Traditional layout with modern touches',
      preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    creative: {
      title: 'Creative',
      description: 'Bold design for standing out',
      preview: 'https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    }
  };

  const template = templates[type];

  return (
    <label className="cursor-pointer">
      <input
        type="radio"
        value={type}
        className="sr-only"
        {...register('template')}
      />
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={cn(
          'rounded-lg border-2 p-4 transition-colors',
          selected
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200 hover:border-gray-300'
        )}
      >
        <img
          src={template.preview}
          alt={template.title}
          className="w-full h-32 object-cover rounded-md mb-3"
        />
        <h3 className="font-semibold text-gray-900">{template.title}</h3>
        <p className="text-sm text-gray-500">{template.description}</p>
      </motion.div>
    </label>
  );
};