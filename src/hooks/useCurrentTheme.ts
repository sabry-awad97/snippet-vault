import { useTheme } from 'next-themes';

const useCurrentTheme = () => {
  const { theme, systemTheme, setTheme } = useTheme();
  return {
    theme: theme === 'system' ? systemTheme : theme,
    setTheme,
  };
};

export default useCurrentTheme;
