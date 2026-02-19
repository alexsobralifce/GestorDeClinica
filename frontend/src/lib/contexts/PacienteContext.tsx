import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { patientsApi, Patient } from '../api/patients';

interface PacienteContextType {
  pacientes: Patient[];
  pacienteSelecionado: Patient | null;
  loading: boolean;
  error: string | null;
  addPaciente: (paciente: Omit<Patient, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updatePaciente: (id: string, paciente: Partial<Patient>) => Promise<void>;
  deletePaciente: (id: string) => Promise<void>;
  selecionarPaciente: (id: string) => void;
  limparSelecao: () => void;
  buscarPaciente: (id: string) => Patient | undefined;
  refreshPacientes: () => Promise<void>;
}

const PacienteContext = createContext<PacienteContextType | undefined>(undefined);

export function PacienteProvider({ children }: { children: ReactNode }) {
  const [pacientes, setPacientes] = useState<Patient[]>([]);
  const [pacienteSelecionado, setPacienteSelecionado] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshPacientes = async () => {
    setLoading(true);
    try {
      const data = await patientsApi.getAll();
      setPacientes(data);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar pacientes:', err);
      setError('Falha ao carregar lista de pacientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshPacientes();
  }, []);

  const addPaciente = async (paciente: Omit<Patient, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    try {
      const novoPaciente = await patientsApi.create(paciente);
      setPacientes(prev => [...prev, novoPaciente]);
    } catch (err) {
      console.error('Erro ao criar paciente:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePaciente = async (id: string, pacienteAtualizado: Partial<Patient>) => {
    setLoading(true);
    try {
      const updated = await patientsApi.update(id, pacienteAtualizado);
      setPacientes(prev =>
        prev.map(p => (p.id === id ? updated : p))
      );

      // Atualizar seleção se for o paciente selecionado
      if (pacienteSelecionado?.id === id) {
        setPacienteSelecionado(updated);
      }
    } catch (err) {
      console.error('Erro ao atualizar paciente:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePaciente = async (id: string) => {
    setLoading(true);
    try {
      await patientsApi.delete(id);
      setPacientes(prev => prev.filter(p => p.id !== id));

      // Limpar seleção se for o paciente selecionado
      if (pacienteSelecionado?.id === id) {
        setPacienteSelecionado(null);
      }
    } catch (err) {
      console.error('Erro ao excluir paciente:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const selecionarPaciente = (id: string) => {
    const paciente = pacientes.find(p => p.id === id);
    setPacienteSelecionado(paciente || null);
  };

  const limparSelecao = () => {
    setPacienteSelecionado(null);
  };

  const buscarPaciente = (id: string): Patient | undefined => {
    return pacientes.find(p => p.id === id);
  };

  return (
    <PacienteContext.Provider
      value={{
        pacientes,
        pacienteSelecionado,
        loading,
        error,
        addPaciente,
        updatePaciente,
        deletePaciente,
        selecionarPaciente,
        limparSelecao,
        buscarPaciente,
        refreshPacientes,
      }}
    >
      {children}
    </PacienteContext.Provider>
  );
}

export function usePacientes(): PacienteContextType {
  const context = useContext(PacienteContext);
  if (context === undefined) {
    throw new Error('usePacientes deve ser usado dentro de PacienteProvider');
  }
  return context;
}