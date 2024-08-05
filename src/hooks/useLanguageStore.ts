import { IconType } from 'react-icons';
import { FaGolang } from 'react-icons/fa6';
import { SiJavascript, SiPython, SiRust, SiTypescript } from 'react-icons/si';
import { create } from 'zustand';

interface Language {
  icon: IconType;
  name: string;
}

interface LanguageState {
  languages: Language[];
  languageIcons: Record<string, IconType>;
  addLanguage: (language: Language) => void;
}

const initialLanguages: Language[] = [
  { icon: SiRust, name: 'rust' },
  { icon: SiTypescript, name: 'typescript' },
  { icon: FaGolang, name: 'go' },
  { icon: SiJavascript, name: 'javascript' },
  { icon: SiPython, name: 'python' },
];

const useLanguageStore = create<LanguageState>(set => ({
  languages: initialLanguages,
  languageIcons: Object.fromEntries(
    initialLanguages.map(({ name, icon }) => [name, icon]),
  ),
  addLanguage: (language: Language) =>
    set(state => ({
      languages: [...state.languages, language],
    })),
}));

export default useLanguageStore;
