import Link from 'next/link';

const QuickLinks = () => (
  <div>
    <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
      Quick Links
    </h3>
    <ul className="space-y-2">
      {['about', 'contact', 'privacy', 'terms'].map(link => (
        <li key={link}>
          <Link
            href={`/${link}`}
            className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
          >
            {link.charAt(0).toUpperCase() + link.slice(1).replace('-', ' ')}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default QuickLinks;
