import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

export function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.h1
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-9xl font-bold text-[#4a7c65]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          404
        </motion.h1>
        <h2 className="mt-4 text-2xl font-semibold text-[#2b2926]">
          Página não encontrada
        </h2>
        <p className="mt-2 text-[#7a7369]">
          A página que você está procurando não existe ou foi movida.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/" className="btn-primary">
            <Home className="h-5 w-5" />
            Voltar ao início
          </Link>
          <button onClick={() => window.history.back()} className="btn-secondary">
            <ArrowLeft className="h-5 w-5" />
            Voltar
          </button>
        </div>
      </motion.div>
    </div>
  );
}
