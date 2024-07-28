import { Linkedin } from 'lucide-react';
import { FaGithub, FaTwitter } from 'react-icons/fa';

const ConnectWithUs = () => (
  <div>
    <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
      Connect With Us
    </h3>
    <div className="flex space-x-4">
      {[
        {
          href: 'https://github.com/your-github',
          icon: <FaGithub size={24} />,
        },
        {
          href: 'https://twitter.com/your-twitter',
          icon: <FaTwitter size={24} />,
        },
        {
          href: 'https://linkedin.com/in/your-linkedin',
          icon: <Linkedin size={24} />,
        },
      ].map((link, index) => (
        <a
          key={index}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
        >
          {link.icon}
        </a>
      ))}
    </div>
  </div>
);

export default ConnectWithUs;
