import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AgendamentoProvider } from './lib/AgendamentoContext';
import { FluxoCaixaProvider } from './lib/contexts/FluxoCaixaContext';
import { PacienteProvider } from './lib/contexts/PacienteContext';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { LoadingFallback } from './components/shared/LoadingFallback';
import { useEffect } from 'react';
import './styles/globals.css';
import './styles/mobile.css';

// Load Google Fonts via <link> tag to avoid @import ordering issues in bundled CSS
function useGoogleFonts() {
  useEffect(() => {
    const id = 'google-fonts-link';
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Darker+Grotesque:wght@400;500;600;700;800&family=Karla:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';
      document.head.appendChild(link);
    }
  }, []);
}

function App() {
  useGoogleFonts();
  
  return (
    <ErrorBoundary>
      <PacienteProvider>
        <AgendamentoProvider>
          <FluxoCaixaProvider>
            <RouterProvider 
              router={router} 
              fallbackElement={<LoadingFallback />}
            />
          </FluxoCaixaProvider>
        </AgendamentoProvider>
      </PacienteProvider>
    </ErrorBoundary>
  );
}

export default App;