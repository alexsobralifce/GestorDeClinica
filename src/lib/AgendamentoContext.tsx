import { createContext, useContext, useState, ReactNode } from 'react';
import { agendamentosMock } from './types';
import type { Agendamento } from './types';

interface AgendamentoContextType {
  agendamentos: Agendamento[];
  addAgendamento: (agendamento: Omit<Agendamento, 'id'>) => void;
  updateAgendamento: (id: string, agendamento: Partial<Agendamento>) => void;
  deleteAgendamento: (id: string) => void;
}

const AgendamentoContext = createContext<AgendamentoContextType | undefined>(undefined);

export function AgendamentoProvider({ children }: { children: ReactNode }) {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>(agendamentosMock);

  const addAgendamento = (agendamento: Omit<Agendamento, 'id'>) => {
    const novoAgendamento: Agendamento = {
      ...agendamento,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setAgendamentos(prev => [...prev, novoAgendamento]);
  };

  const updateAgendamento = (id: string, agendamentoAtualizado: Partial<Agendamento>) => {
    setAgendamentos(prev =>
      prev.map(a => (a.id === id ? { ...a, ...agendamentoAtualizado } : a))
    );
  };

  const deleteAgendamento = (id: string) => {
    setAgendamentos(prev => prev.filter(a => a.id !== id));
  };

  return (
    <AgendamentoContext.Provider
      value={{ agendamentos, addAgendamento, updateAgendamento, deleteAgendamento }}
    >
      {children}
    </AgendamentoContext.Provider>
  );
}

export function useAgendamentos(): AgendamentoContextType {
  const context = useContext(AgendamentoContext);
  if (!context) {
    console.error('useAgendamentos deve ser usado dentro de AgendamentoProvider');
    return {
      agendamentos: [],
      addAgendamento: () => {},
      updateAgendamento: () => {},
      deleteAgendamento: () => {},
    };
  }
  return context;
}