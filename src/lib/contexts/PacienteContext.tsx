import { createContext, useContext, useState, ReactNode } from 'react';
import { pacientesMock } from '../types';
import type { Paciente } from '../types';

interface PacienteContextType {
  pacientes: Paciente[];
  pacienteSelecionado: Paciente | null;
  addPaciente: (paciente: Omit<Paciente, 'id'>) => string;
  updatePaciente: (id: string, paciente: Partial<Paciente>) => void;
  deletePaciente: (id: string) => void;
  selecionarPaciente: (id: string) => void;
  limparSelecao: () => void;
  buscarPaciente: (id: string) => Paciente | undefined;
}

const PacienteContext = createContext<PacienteContextType | undefined>(undefined);

export function PacienteProvider({ children }: { children: ReactNode }) {
  const [pacientes, setPacientes] = useState<Paciente[]>(pacientesMock);
  const [pacienteSelecionado, setPacienteSelecionado] = useState<Paciente | null>(null);

  const addPaciente = (paciente: Omit<Paciente, 'id'>): string => {
    const novoPaciente: Paciente = {
      ...paciente,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setPacientes(prev => [...prev, novoPaciente]);
    return novoPaciente.id;
  };

  const updatePaciente = (id: string, pacienteAtualizado: Partial<Paciente>) => {
    setPacientes(prev =>
      prev.map(p => (p.id === id ? { ...p, ...pacienteAtualizado } : p))
    );
    
    // Atualizar seleção se for o paciente selecionado
    if (pacienteSelecionado?.id === id) {
      setPacienteSelecionado(prev => prev ? { ...prev, ...pacienteAtualizado } : null);
    }
  };

  const deletePaciente = (id: string) => {
    setPacientes(prev => prev.filter(p => p.id !== id));
    
    // Limpar seleção se for o paciente selecionado
    if (pacienteSelecionado?.id === id) {
      setPacienteSelecionado(null);
    }
  };

  const selecionarPaciente = (id: string) => {
    const paciente = pacientes.find(p => p.id === id);
    setPacienteSelecionado(paciente || null);
  };

  const limparSelecao = () => {
    setPacienteSelecionado(null);
  };

  const buscarPaciente = (id: string): Paciente | undefined => {
    return pacientes.find(p => p.id === id);
  };

  return (
    <PacienteContext.Provider
      value={{
        pacientes,
        pacienteSelecionado,
        addPaciente,
        updatePaciente,
        deletePaciente,
        selecionarPaciente,
        limparSelecao,
        buscarPaciente,
      }}
    >
      {children}
    </PacienteContext.Provider>
  );
}

export function usePacientes(): PacienteContextType {
  const context = useContext(PacienteContext);
  if (context === undefined) {
    // Ao invés de lançar erro imediatamente, retorna um objeto vazio seguro
    console.error('usePacientes deve ser usado dentro de PacienteProvider');
    return {
      pacientes: [],
      pacienteSelecionado: null,
      addPaciente: () => '',
      updatePaciente: () => {},
      deletePaciente: () => {},
      selecionarPaciente: () => {},
      limparSelecao: () => {},
      buscarPaciente: () => undefined,
    };
  }
  return context;
}