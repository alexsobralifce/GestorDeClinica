import { useState } from 'react';
import { Check, User, Clock, ChevronRight, Calendar } from 'lucide-react';
import {
  MobileAppBar,
  StepperMobile,
  BottomSheet,
} from '../mobile';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface NovoAgendamentoMobileProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormData {
  pacienteId: string;
  pacienteNome: string;
  data: Date;
  profissionalId: string;
  profissionalNome: string;
  especialidade: string;
  horario: string;
  duracao: number;
  tipo: string;
  convenio: string;
  observacoes: string;
  enviarConfirmacao: boolean;
}

export function NovoAgendamentoMobile({ isOpen, onClose, onSuccess }: NovoAgendamentoMobileProps) {
  const [currentStep, setCurrentStep] = useState('paciente');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<FormData>>({
    data: new Date(),
    duracao: 30,
    tipo: 'consulta',
    convenio: 'particular',
    enviarConfirmacao: true,
  });

  const steps = [
    { id: 'paciente', label: 'Paciente' },
    { id: 'horario', label: 'Horário' },
    { id: 'confirmacao', label: 'Confirmar' },
  ];

  // Dados mockados
  const pacientes = [
    { id: '1', nome: 'Maria Silva', cpf: '123.456.789-00', telefone: '(85) 99999-9999' },
    { id: '2', nome: 'João Santos', cpf: '987.654.321-00', telefone: '(85) 98888-8888' },
    { id: '3', nome: 'Ana Costa', cpf: '456.789.123-00', telefone: '(85) 97777-7777' },
  ];

  const profissionais = [
    { id: '1', nome: 'Dr. João Santos', especialidade: 'Cardiologia', cor: '#3b82f6' },
    { id: '2', nome: 'Dra. Ana Costa', especialidade: 'Clínica Geral', cor: '#8b5cf6' },
    { id: '3', nome: 'Dr. Pedro Lima', especialidade: 'Ortopedia', cor: '#10b981' },
  ];

  const horariosDisponiveis = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  ];

  const handleNext = () => {
    if (currentStep === 'paciente') setCurrentStep('horario');
    else if (currentStep === 'horario') setCurrentStep('confirmacao');
  };

  const handleBack = () => {
    if (currentStep === 'confirmacao') setCurrentStep('horario');
    else if (currentStep === 'horario') setCurrentStep('paciente');
    else onClose();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Agendamento Mobile criado:', formData);
    
    setIsSubmitting(false);
    onSuccess?.();
    onClose();
    
    // Reset
    setCurrentStep('paciente');
    setFormData({
      data: new Date(),
      duracao: 30,
      tipo: 'consulta',
      convenio: 'particular',
      enviarConfirmacao: true,
    });
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 'paciente':
        return !!formData.pacienteId;
      case 'horario':
        return !!formData.profissionalId && !!formData.horario;
      case 'confirmacao':
        return true;
      default:
        return false;
    }
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Novo Agendamento"
      size="full"
    >
      <div className="flex flex-col h-full">
        {/* Stepper */}
        <div className="pb-4">
          <StepperMobile steps={steps} currentStep={currentStep} />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pb-24">
          <AnimatePresence mode="wait">
            {currentStep === 'paciente' && (
              <Step1PacienteMobile
                formData={formData}
                setFormData={setFormData}
                pacientes={pacientes}
              />
            )}
            {currentStep === 'horario' && (
              <Step2HorarioMobile
                formData={formData}
                setFormData={setFormData}
                profissionais={profissionais}
                horariosDisponiveis={horariosDisponiveis}
              />
            )}
            {currentStep === 'confirmacao' && (
              <Step3ConfirmacaoMobile
                formData={formData}
                setFormData={setFormData}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Fixed Bottom Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e8e5df] p-4 pb-safe space-y-2">
          {currentStep !== 'confirmacao' ? (
            <>
              <button onClick={handleBack} className="btn-secondary btn-mobile-full">
                {currentStep === 'paciente' ? 'Cancelar' : 'Voltar'}
              </button>
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="btn-primary btn-mobile-full"
              >
                Próximo
              </button>
            </>
          ) : (
            <>
              <button onClick={handleBack} className="btn-secondary btn-mobile-full">
                Voltar
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn-primary btn-mobile-full"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Agendando...
                  </div>
                ) : (
                  <>
                    <Check size={20} />
                    Confirmar Agendamento
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </BottomSheet>
  );
}

// ==================== STEP 1: PACIENTE MOBILE ====================
function Step1PacienteMobile({ formData, setFormData, pacientes }: any) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPacientes = pacientes.filter((p: any) =>
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.cpf.includes(searchTerm)
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <div className="mb-4">
        <button className="btn-secondary btn-mobile-full">
          + Cadastrar Novo Paciente
        </button>
      </div>

      {/* Search */}
      <div className="search-bar-mobile">
        <User className="search-bar-mobile-icon" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nome ou CPF..."
          className="search-bar-mobile-input"
        />
      </div>

      {/* Lista */}
      <div className="space-y-2">
        {filteredPacientes.map((paciente: any) => {
          const isSelected = formData.pacienteId === paciente.id;
          return (
            <button
              key={paciente.id}
              onClick={() =>
                setFormData({
                  ...formData,
                  pacienteId: paciente.id,
                  pacienteNome: paciente.nome,
                })
              }
              className={`w-full p-4 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-[#4a7c65] bg-[#4a7c65]/5'
                  : 'border-[#e8e5df]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#4a7c65]/10 flex items-center justify-center">
                    <span className="text-base font-bold text-[#4a7c65]">
                      {paciente.nome.split(' ').map((n: string) => n[0]).join('')}
                    </span>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-[#2b2926]">{paciente.nome}</div>
                    <div className="text-sm text-[#7a7369]">{paciente.cpf}</div>
                  </div>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-[#4a7c65] flex items-center justify-center">
                    <Check size={16} className="text-white" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ==================== STEP 2: HORÁRIO MOBILE ====================
function Step2HorarioMobile({ formData, setFormData, profissionais, horariosDisponiveis }: any) {
  const [selectedDate, setSelectedDate] = useState(formData.data || new Date());
  const next7Days = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Date Picker Horizontal Scroll */}
      <div>
        <label className="field-label">Data</label>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {next7Days.map((date, index) => {
            const isSelected = format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
            return (
              <button
                key={index}
                onClick={() => {
                  setSelectedDate(date);
                  setFormData({ ...formData, data: date });
                }}
                className={`flex-shrink-0 w-16 p-3 rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'border-[#4a7c65] bg-[#4a7c65] text-white'
                    : 'border-[#e8e5df]'
                }`}
              >
                <div className="text-xs font-medium">
                  {format(date, 'EEE', { locale: ptBR }).toUpperCase()}
                </div>
                <div className="text-2xl font-bold mt-1">{format(date, 'd')}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Profissional */}
      <div>
        <label className="field-label">Profissional</label>
        <div className="space-y-2">
          {profissionais.map((prof: any) => {
            const isSelected = formData.profissionalId === prof.id;
            return (
              <button
                key={prof.id}
                onClick={() =>
                  setFormData({
                    ...formData,
                    profissionalId: prof.id,
                    profissionalNome: prof.nome,
                    especialidade: prof.especialidade,
                  })
                }
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'border-[#4a7c65] bg-[#4a7c65]/5'
                    : 'border-[#e8e5df]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: prof.cor }}
                    />
                    <div className="text-left">
                      <div className="font-semibold text-[#2b2926]">{prof.nome}</div>
                      <div className="text-sm text-[#7a7369]">{prof.especialidade}</div>
                    </div>
                  </div>
                  {isSelected && (
                    <Check size={20} className="text-[#4a7c65]" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Horários */}
      {formData.profissionalId && (
        <div>
          <label className="field-label">Horário</label>
          <div className="grid grid-cols-3 gap-2">
            {horariosDisponiveis.map((horario: string) => {
              const isSelected = formData.horario === horario;
              return (
                <button
                  key={horario}
                  onClick={() => setFormData({ ...formData, horario })}
                  className={`p-3 rounded-lg border-2 transition-all font-semibold ${
                    isSelected
                      ? 'border-[#4a7c65] bg-[#4a7c65] text-white'
                      : 'border-[#e8e5df]'
                  }`}
                >
                  {horario}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Duração */}
      <div>
        <label className="field-label">Duração</label>
        <select
          value={formData.duracao}
          onChange={(e) => setFormData({ ...formData, duracao: Number(e.target.value) })}
          className="input-field"
        >
          <option value={15}>15 minutos</option>
          <option value={30}>30 minutos</option>
          <option value={45}>45 minutos</option>
          <option value={60}>60 minutos</option>
        </select>
      </div>
    </motion.div>
  );
}

// ==================== STEP 3: CONFIRMAÇÃO MOBILE ====================
function Step3ConfirmacaoMobile({ formData, setFormData }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Resumo */}
      <div className="bg-[#f5f3ef] rounded-xl p-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#4a7c65] flex items-center justify-center">
            <User size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="text-xs text-[#7a7369]">Paciente</div>
            <div className="font-semibold text-[#2b2926]">{formData.pacienteNome}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#3b82f6] flex items-center justify-center">
            <Calendar size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="text-xs text-[#7a7369]">Data e Horário</div>
            <div className="font-semibold text-[#2b2926]">
              {formData.data && format(formData.data, "EEE, d 'de' MMM", { locale: ptBR })}
              {' às '}
              {formData.horario}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#8b5cf6] flex items-center justify-center">
            <User size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="text-xs text-[#7a7369]">Profissional</div>
            <div className="font-semibold text-[#2b2926]">{formData.profissionalNome}</div>
            <div className="text-xs text-[#7a7369]">{formData.especialidade}</div>
          </div>
        </div>
      </div>

      {/* Detalhes */}
      <div className="space-y-4">
        <div>
          <label className="field-label">Tipo</label>
          <select
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
            className="input-field"
          >
            <option value="consulta">Consulta</option>
            <option value="retorno">Retorno</option>
            <option value="exame">Exame</option>
          </select>
        </div>

        <div>
          <label className="field-label">Convênio</label>
          <select
            value={formData.convenio}
            onChange={(e) => setFormData({ ...formData, convenio: e.target.value })}
            className="input-field"
          >
            <option value="particular">Particular</option>
            <option value="unimed">Unimed</option>
            <option value="amil">Amil</option>
          </select>
        </div>

        <div>
          <label className="field-label">Observações</label>
          <textarea
            value={formData.observacoes || ''}
            onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
            placeholder="Observações..."
            className="input-field min-h-[100px]"
          />
        </div>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={formData.enviarConfirmacao}
            onChange={(e) => setFormData({ ...formData, enviarConfirmacao: e.target.checked })}
            className="w-6 h-6"
          />
          <span className="text-sm text-[#2b2926]">
            Enviar confirmação por WhatsApp
          </span>
        </label>
      </div>
    </motion.div>
  );
}
