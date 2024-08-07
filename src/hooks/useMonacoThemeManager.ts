import dracula from '@/assets/themes/Dracula.json';
import monokai from '@/assets/themes/Monokai.json';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import { OnMount } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import Highlighter from 'monaco-jsx-highlighter';
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

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    for (const theme of themes) {
      monaco.editor.defineTheme(theme.label, theme.value);
    }

    // Activate Monaco JSX Highlighter
    const highlighter = new Highlighter(monaco, parse, traverse, editor);
    highlighter.highlightOnDidChangeModelContent();
    highlighter.addJSXCommentCommand();
  };

  return {
    theme,
    handleEditorDidMount,
  };
};
