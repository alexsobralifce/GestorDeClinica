import { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#faf9f7] p-6">
          <div className="card max-w-2xl w-full">
            <div className="card-content-lg text-center">
              <div className="flex justify-center mb-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#e85d3f] to-[#d54426]">
                  <AlertTriangle className="h-10 w-10 text-white" />
                </div>
              </div>
              
              <h1 className="heading-secondary mb-3">
                Oops! Algo deu errado
              </h1>
              
              <p className="text-muted mb-6 max-w-md mx-auto">
                Encontramos um erro inesperado. Por favor, tente recarregar a página.
              </p>

              {this.state.error && (
                <details className="text-left bg-[#f5f3ef] rounded-xl p-4 mb-6">
                  <summary className="cursor-pointer font-medium text-[#2b2926] mb-2">
                    Detalhes técnicos
                  </summary>
                  <pre className="text-xs text-[#7a7369] overflow-auto">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="btn-premium"
                >
                  Recarregar Página
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="btn-secondary"
                >
                  Voltar ao Início
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
