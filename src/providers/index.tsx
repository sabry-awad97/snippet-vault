import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { PropsWithChildren } from 'react';
import ReactQueryProvider from './ReactQueryProvider';
import { ThemeProvider } from './ThemeProvider';

const Providers = ({ children }: Required<PropsWithChildren>) => (
  <ReactQueryProvider>
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster />
      </ThemeProvider>
    </AuthProvider>
  </ReactQueryProvider>
);

export default Providers;
