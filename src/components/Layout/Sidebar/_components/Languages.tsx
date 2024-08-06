import { ScrollArea } from '@/components/ui/scroll-area';
import useLanguageStore from '@/hooks/useLanguageStore';
import { useSnippetsQuery } from '@/hooks/useSnippets';
import { titleCase } from '@/lib/utils/stringUtils';
import { useMemo } from 'react';
import { IconType } from 'react-icons/lib';

const Languages = () => {
  const { data: snippets = [] } = useSnippetsQuery();
  const { languageIcons } = useLanguageStore();

  const snippetLanguages = useMemo(() => {
    const languageCounts = snippets.reduce(
      (counts, snippet) => {
        const language = snippet.language;
        counts[language] = (counts[language] || 0) + 1;
        return counts;
      },
      {} as Record<string, number>,
    );

    const languages = Object.entries(languageCounts).map(
      ([language, count]) => {
        const icon = languageIcons[language];
        return { icon, name: language, count };
      },
    );

    return languages;
  }, [snippets, languageIcons]);

  return (
    <div className="mt-12 text-sm">
      <div className="font-semibold text-slate-400">Languages</div>
      <ScrollArea className="ml-2 mt-5 h-[15rem]">
        <ul className="flex flex-col gap-4 text-slate-400">
          {snippetLanguages.map(({ icon, name, count }, index) => (
            <LanguageItem key={index} icon={icon} name={name} count={count} />
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
};

export default Languages;

interface LanguageItemProps {
  icon?: IconType;
  name: string;
  count: number;
}

const LanguageItem: React.FC<LanguageItemProps> = ({
  icon: Icon,
  name,
  count,
}) => {
  return (
    <li className="flex justify-between">
      <div className="flex items-center gap-1">
        {Icon && <Icon className="size-5" />}
        <span>{titleCase(name)}</span>
      </div>
      <span className="inline-flex items-center justify-center rounded-full bg-purple-100 px-2.5 py-0.5 text-purple-700">
        {count}
      </span>
    </li>
  );
};
