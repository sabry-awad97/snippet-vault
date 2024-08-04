import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { SnippetProvider } from '@/contexts/SnippetContext';
import { TagsProvider } from '@/contexts/TagsContext';
import { PropsWithChildren } from 'react';
import ReactQueryProvider from './ReactQueryProvider';
import { ThemeProvider } from './ThemeProvider';

const Providers = ({ children }: Required<PropsWithChildren>) => (
  <ReactQueryProvider>
    <TagsProvider>
      <SnippetProvider>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster richColors expand />
          </ThemeProvider>
        </AuthProvider>
      </SnippetProvider>
    </TagsProvider>
  </ReactQueryProvider>
);

export default Providers;
