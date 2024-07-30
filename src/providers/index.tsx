import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { SnippetProvider } from '@/contexts/SnippetContext';
import { PropsWithChildren } from 'react';
import ReactQueryProvider from './ReactQueryProvider';
import { ThemeProvider } from './ThemeProvider';

const Providers = ({ children }: Required<PropsWithChildren>) => (
  <ReactQueryProvider>
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
  </ReactQueryProvider>
);

export default Providers;
