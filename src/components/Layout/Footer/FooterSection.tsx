interface FooterSectionProps {
  title: string;
  description: string;
}

const FooterSection: React.FC<FooterSectionProps> = ({
  title,
  description,
}) => (
  <div>
    <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-400">{description}</p>
  </div>
);

export default FooterSection;
