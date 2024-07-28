interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-lg transition-transform duration-300 hover:scale-105 dark:bg-gray-800">
      <div className="mb-4 text-purple-600 dark:text-purple-400">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-200">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}
