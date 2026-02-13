import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface KPICardProps {
  titulo: string;
  valor: number;
  tipo?: 'monetario' | 'percentual' | 'numero';
  tendencia?: number;
  subtitle?: string;
  icone: LucideIcon;
  cor?: 'primary' | 'success' | 'danger' | 'info' | 'warning';
  delay?: number;
}

const cores = {
  primary: {
    bg: 'from-[#4a7c65] to-[#3d6653]',
    text: 'text-[#4a7c65]',
    bgLight: 'bg-[#4a7c65]/10',
    border: 'border-[#4a7c65]/20',
  },
  success: {
    bg: 'from-[#10b981] to-[#059669]',
    text: 'text-[#10b981]',
    bgLight: 'bg-[#10b981]/10',
    border: 'border-[#10b981]/20',
  },
  danger: {
    bg: 'from-[#e85d3f] to-[#d54426]',
    text: 'text-[#e85d3f]',
    bgLight: 'bg-[#e85d3f]/10',
    border: 'border-[#e85d3f]/20',
  },
  info: {
    bg: 'from-[#6b9dd8] to-[#5a8bc7]',
    text: 'text-[#6b9dd8]',
    bgLight: 'bg-[#6b9dd8]/10',
    border: 'border-[#6b9dd8]/20',
  },
  warning: {
    bg: 'from-[#f5a623] to-[#e09612]',
    text: 'text-[#f5a623]',
    bgLight: 'bg-[#f5a623]/10',
    border: 'border-[#f5a623]/20',
  },
};

export function KPICard({
  titulo,
  valor,
  tipo = 'numero',
  tendencia,
  subtitle,
  icone: Icon,
  cor = 'primary',
  delay = 0,
}: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const colorScheme = cores[cor];

  // Animação countup
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = valor / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current += increment;
      
      if (step >= steps) {
        setDisplayValue(valor);
        clearInterval(timer);
      } else {
        setDisplayValue(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [valor]);

  const formatarValor = (val: number) => {
    if (tipo === 'monetario') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(val);
    }
    if (tipo === 'percentual') {
      return `${val.toFixed(1)}%`;
    }
    return Math.round(val).toLocaleString('pt-BR');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="card cursor-pointer overflow-hidden group"
    >
      {/* Gradiente sutil no topo */}
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${colorScheme.bg}`} />
      
      <div className="card-content">
        {/* Header com ícone e badge de tendência */}
        <div className="flex items-start justify-between mb-5">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: delay + 0.2, type: 'spring', stiffness: 200 }}
            className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${colorScheme.bg} shadow-lg`}
          >
            <Icon className="h-7 w-7 text-white" strokeWidth={2.5} />
          </motion.div>
          
          {tendencia !== undefined && (
            <motion.div
              initial={{ scale: 0, x: 20 }}
              animate={{ scale: 1, x: 0 }}
              transition={{ delay: delay + 0.5, type: 'spring', stiffness: 200, damping: 10 }}
              className={`badge ${
                tendencia >= 0 ? 'badge-success' : 'badge-danger'
              }`}
            >
              <span className="text-sm font-bold">
                {tendencia >= 0 ? '↗' : '↘'} {Math.abs(tendencia).toFixed(1)}%
              </span>
            </motion.div>
          )}
        </div>

        {/* Título */}
        <p className="text-sm font-medium text-[#7a7369] mb-3 uppercase tracking-wide">
          {titulo}
        </p>
        
        {/* Valor principal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.3 }}
          className="mb-3"
        >
          <p
            className="text-4xl font-bold text-[#2b2926] tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {formatarValor(displayValue)}
          </p>
        </motion.div>

        {/* Subtitle ou informação adicional */}
        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.4 }}
            className="text-xs text-[#a8a199] leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}

        {/* Barra de progresso decorativa */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: delay + 0.6, duration: 0.8, ease: 'easeOut' }}
          className="mt-4 h-1.5 w-full rounded-full bg-[#f5f3ef] overflow-hidden origin-left"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 0.7 }}
            transition={{ delay: delay + 0.8, duration: 1, ease: 'easeOut' }}
            className={`h-full bg-gradient-to-r ${colorScheme.bg} origin-left`}
          />
        </motion.div>
      </div>

      {/* Efeito de hover sutil */}
      <div className={`absolute inset-0 ${colorScheme.bgLight} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
    </motion.div>
  );
}
