import dracula from '@/assets/themes/Dracula.json';
import monokai from '@/assets/themes/Monokai.json';
import { OnMount } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import useCurrentTheme from './useCurrentTheme';

const draculaTheme: editor.IStandaloneThemeData =
  dracula as editor.IStandaloneThemeData;
const monokaiTheme: editor.IStandaloneThemeData =
  monokai as editor.IStandaloneThemeData;

export const themes: {
  label: string;
  value: editor.IStandaloneThemeData;
}[] = [
  { label: 'Dracula', value: draculaTheme },
  { label: 'Monokai', value: monokaiTheme },
];

export const useMonacoThemeManager = () => {
  const { theme: currentTheme } = useCurrentTheme();

  const theme = currentTheme === 'dark' ? 'Dracula' : 'Monokai';

  console.log(theme);

  const handleEditorDidMount: OnMount = (_, monaco) => {
    for (const theme of themes) {
      monaco.editor.defineTheme(theme.label, theme.value);
    }
  };

  return {
    theme,
    handleEditorDidMount,
  };
};
