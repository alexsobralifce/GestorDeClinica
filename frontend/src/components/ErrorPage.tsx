import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

export function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  let errorMessage = "Ocorreu um erro inesperado na aplicação.";
  let errorTitle = "Eita! Algo deu errado.";

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      errorTitle = "Página não encontrada";
      errorMessage = "A página que você está procurando não existe.";
    } else if (error.status === 401) {
      errorTitle = "Acesso não autorizado";
      errorMessage = "Você não tem permissão para acessar esta página.";
    } else if (error.status === 503) {
      errorTitle = "Serviço indisponível";
      errorMessage = "O serviço está temporariamente indisponível.";
    } else {
      errorMessage = error.data?.message || error.statusText || errorMessage;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-[#f9f7f4] p-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md rounded-2xl bg-white p-8 shadow-xl"
      >
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-100 p-4">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
        </div>

        <h1
          className="mb-3 text-2xl font-bold text-[#2b2926]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {errorTitle}
        </h1>

        <p className="mb-8 text-[#5c5650]">
          {errorMessage}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => window.location.reload()}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Tentar novamente
          </button>

          <Link
            to="/dashboard"
            className="btn-primary flex items-center justify-center gap-2"
          >
            <Home className="h-4 w-4" />
            Voltar ao Início
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 overflow-auto max-h-40 rounded bg-gray-100 p-4 text-left text-xs text-gray-700">
            <p className="font-bold mb-1">Detalhes do erro (apenas desenvolvimento):</p>
            <pre>{JSON.stringify(error, null, 2)}</pre>
          </div>
        )}

      </motion.div>
    </div>
  );
}
