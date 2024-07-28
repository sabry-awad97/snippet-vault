'use client';

import { motion } from 'framer-motion';
import { Code, Lock, Share2 } from 'lucide-react';
import FeatureCard from './FeatureCard';

const features = [
  {
    icon: <Code size={40} />,
    title: 'Organize Your Code',
    description:
      'Keep your snippets organized with custom collections and tags.',
  },
  {
    icon: <Share2 size={40} />,
    title: 'Easy Sharing',
    description:
      'Share your snippets with teammates or the community with a single click.',
  },
  {
    icon: <Lock size={40} />,
    title: 'Secure Storage',
    description:
      'Your snippets are encrypted and securely stored in the cloud.',
  },
];

const FeaturesSection = () => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4, duration: 0.8 }}
    className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3"
  >
    {features.map((feature, index) => (
      <FeatureCard
        key={index}
        icon={feature.icon}
        title={feature.title}
        description={feature.description}
      />
    ))}
  </motion.div>
);

export default FeaturesSection;
