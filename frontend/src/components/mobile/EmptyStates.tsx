import { Search, Inbox, WifiOff, AlertCircle, FileX, Users, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  illustration?: 'search' | 'inbox' | 'offline' | 'error' | 'empty' | 'nodata';
}

export function EmptyState({ icon, title, description, action, illustration }: EmptyStateProps) {
  const defaultIcons = {
    search: <Search size={64} />,
    inbox: <Inbox size={64} />,
    offline: <WifiOff size={64} />,
    error: <AlertCircle size={64} />,
    empty: <FileX size={64} />,
    nodata: <Inbox size={64} />,
  };

  const displayIcon = icon || (illustration && defaultIcons[illustration]) || defaultIcons.empty;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center text-center py-12 px-6"
    >
      {/* Icon/Illustration */}
      <div className="w-40 h-40 flex items-center justify-center mb-6 text-[#d4cfc5]">
        {displayIcon}
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-[#2b2926] mb-2">{title}</h3>

      {/* Description */}
      {description && (
        <p className="text-sm text-[#7a7369] mb-6 max-w-[280px] leading-relaxed">
          {description}
        </p>
      )}

      {/* Action Button */}
      {action && (
        <button onClick={action.onClick} className="btn-primary">
          {action.label}
        </button>
      )}
    </motion.div>
  );
}

// ==================== EMPTY STATE PRESETS ====================

export function EmptyStatePacientes({ onAddPaciente }: { onAddPaciente: () => void }) {
  return (
    <EmptyState
      icon={<Users size={64} />}
      title="Nenhum paciente encontrado"
      description="Comece cadastrando o primeiro paciente da sua clínica"
      action={{
        label: 'Adicionar Primeiro Paciente',
        onClick: onAddPaciente,
      }}
    />
  );
}

export function EmptyStateAgenda({ onAddConsulta }: { onAddConsulta: () => void }) {
  return (
    <EmptyState
      icon={<Calendar size={64} />}
      title="Nenhuma consulta agendada"
      description="Você ainda não tem consultas para este dia"
      action={{
        label: 'Agendar Consulta',
        onClick: onAddConsulta,
      }}
    />
  );
}

export function EmptyStateSearch({ searchTerm }: { searchTerm: string }) {
  return (
    <EmptyState
      illustration="search"
      title="Nenhum resultado encontrado"
      description={`Não encontramos resultados para "${searchTerm}". Tente ajustar sua busca.`}
    />
  );
}

export function EmptyStateOffline() {
  return (
    <EmptyState
      illustration="offline"
      title="Sem conexão"
      description="Você está offline. Verifique sua conexão com a internet e tente novamente."
    />
  );
}

export function EmptyStateError({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      illustration="error"
      title="Algo deu errado"
      description="Não foi possível carregar os dados. Por favor, tente novamente."
      action={
        onRetry
          ? {
              label: 'Tentar Novamente',
              onClick: onRetry,
            }
          : undefined
      }
    />
  );
}

export function EmptyStateNoData({ message }: { message?: string }) {
  return (
    <EmptyState
      illustration="nodata"
      title="Sem dados disponíveis"
      description={message || 'Não há dados para exibir no momento.'}
    />
  );
}

// ==================== EMPTY STATE COM ILUSTRAÇÃO CUSTOMIZADA ====================

interface EmptyStateIllustrationProps {
  svgPath?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyStateIllustration({
  svgPath,
  title,
  description,
  action,
}: EmptyStateIllustrationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center py-12 px-6"
    >
      {/* SVG Illustration */}
      {svgPath && (
        <div className="w-48 h-48 mb-6">
          <img src={svgPath} alt={title} className="w-full h-full object-contain" />
        </div>
      )}

      {/* Title */}
      <h3 className="text-xl font-semibold text-[#2b2926] mb-2">{title}</h3>

      {/* Description */}
      {description && (
        <p className="text-sm text-[#7a7369] mb-6 max-w-[280px] leading-relaxed">
          {description}
        </p>
      )}

      {/* Action */}
      {action && (
        <button onClick={action.onClick} className="btn-primary">
          {action.label}
        </button>
      )}
    </motion.div>
  );
}
