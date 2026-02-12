import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AgendamentoProvider } from './lib/AgendamentoContext';
import { FluxoCaixaProvider } from './lib/contexts/FluxoCaixaContext';
import { PacienteProvider } from './lib/contexts/PacienteContext';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { LoadingFallback } from './components/shared/LoadingFallback';
import './styles/globals.css';
import './styles/mobile.css';

function App() {
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