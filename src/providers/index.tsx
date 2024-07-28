import { PropsWithChildren } from 'react';
import ReactQueryProvider from './ReactQueryProvider';
import { ThemeProvider } from './ThemeProvider';

const Providers = ({ children }: Required<PropsWithChildren>) => (
  <ReactQueryProvider>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  </ReactQueryProvider>
);

export default Providers;
