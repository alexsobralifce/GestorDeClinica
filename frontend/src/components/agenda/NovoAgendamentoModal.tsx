import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Check, Calendar, Clock, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays, setHours, setMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface NovoAgendamentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormData {
  // Step 1: Paciente
  pacienteId: string;
  pacienteNome: string;
  
  // Step 2: Horário
  data: Date;
  profissionalId: string;
  profissionalNome: string;
  especialidade: string;
  horario: string;
  duracao: number;
  
  // Step 3: Detalhes
  tipo: string;
  convenio: string;
  observacoes: string;
  enviarConfirmacao: boolean;
}

const STEPS = [
  { id: 1, label: 'Paciente', icon: User },
  { id: 2, label: 'Horário', icon: Clock },
  { id: 3, label: 'Confirmação', icon: Check },
];

export function NovoAgendamentoModal({ isOpen, onClose, onSuccess }: NovoAgendamentoModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<FormData>>({
    data: new Date(),
    duracao: 30,
    tipo: 'consulta',
    convenio: 'particular',
    enviarConfirmacao: true,
  });

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
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simular requisição
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Agendamento criado:', formData);
    
    setIsSubmitting(false);
    onSuccess?.();
    onClose();
    
    // Reset form
    setCurrentStep(1);
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
      case 1:
        return !!formData.pacienteId;
      case 2:
        return !!formData.profissionalId && !!formData.horario;
      case 3:
        return true;
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl mx-4 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#e8e5df]">
          <div>
            <h2 className="text-2xl font-bold text-[#2b2926]">Novo Agendamento</h2>
            <p className="text-sm text-[#7a7369] mt-1">
              Preencha as informações para criar um novo agendamento
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-[#f5f3ef] flex items-center justify-center transition-colors"
          >
            <X size={24} className="text-[#7a7369]" />
          </button>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center px-6 py-8 border-b border-[#e8e5df]">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    currentStep === step.id
                      ? 'bg-[#4a7c65] text-white shadow-lg scale-110'
                      : currentStep > step.id
                      ? 'bg-[#10b981] text-white'
                      : 'bg-[#e8e5df] text-[#7a7369]'
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check size={24} />
                  ) : (
                    <step.icon size={24} />
                  )}
                </div>
                <span
                  className={`text-sm font-medium mt-2 ${
                    currentStep === step.id
                      ? 'text-[#4a7c65]'
                      : 'text-[#7a7369]'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector Line */}
              {index < STEPS.length - 1 && (
                <div
                  className={`w-24 h-1 mx-4 transition-all ${
                    currentStep > step.id ? 'bg-[#10b981]' : 'bg-[#e8e5df]'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <Step1Paciente
                formData={formData}
                setFormData={setFormData}
                pacientes={pacientes}
              />
            )}
            {currentStep === 2 && (
              <Step2Horario
                formData={formData}
                setFormData={setFormData}
                profissionais={profissionais}
                horariosDisponiveis={horariosDisponiveis}
              />
            )}
            {currentStep === 3 && (
              <Step3Confirmacao
                formData={formData}
                setFormData={setFormData}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-[#e8e5df] bg-[#faf9f7]">
          <button
            onClick={currentStep === 1 ? onClose : handleBack}
            className="btn-secondary flex items-center gap-2"
          >
            <ChevronLeft size={20} />
            {currentStep === 1 ? 'Cancelar' : 'Voltar'}
          </button>

          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="btn-primary flex items-center gap-2"
            >
              Próximo
              <ChevronRight size={20} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="btn-primary flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Agendando...
                </>
              ) : (
                <>
                  <Check size={20} />
                  Confirmar Agendamento
                </>
              )}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ==================== STEP 1: SELECIONAR PACIENTE ====================
function Step1Paciente({ formData, setFormData, pacientes }: any) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNovoPaciente, setShowNovoPaciente] = useState(false);

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
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#2b2926]">Selecione o Paciente</h3>
        <button
          onClick={() => setShowNovoPaciente(true)}
          className="btn-secondary btn-sm"
        >
          + Novo Paciente
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nome ou CPF..."
          className="input-field pl-10"
        />
        <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a7369]" />
      </div>

      {/* Lista de Pacientes */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {filteredPacientes.map((paciente: any) => (
          <button
            key={paciente.id}
            onClick={() =>
              setFormData({
                ...formData,
                pacienteId: paciente.id,
                pacienteNome: paciente.nome,
              })
            }
            className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
              formData.pacienteId === paciente.id
                ? 'border-[#4a7c65] bg-[#4a7c65]/5'
                : 'border-[#e8e5df] hover:border-[#4a7c65]/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#4a7c65]/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-[#4a7c65]">
                    {paciente.nome.split(' ').map((n: string) => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-[#2b2926]">{paciente.nome}</div>
                  <div className="text-sm text-[#7a7369]">
                    CPF: {paciente.cpf} • {paciente.telefone}
                  </div>
                </div>
              </div>
              {formData.pacienteId === paciente.id && (
                <div className="w-6 h-6 rounded-full bg-[#4a7c65] flex items-center justify-center">
                  <Check size={16} className="text-white" />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {filteredPacientes.length === 0 && (
        <div className="text-center py-12 text-[#7a7369]">
          <User size={48} className="mx-auto mb-4 opacity-30" />
          <p>Nenhum paciente encontrado</p>
          <button
            onClick={() => setShowNovoPaciente(true)}
            className="btn-primary mt-4"
          >
            Cadastrar Novo Paciente
          </button>
        </div>
      )}
    </motion.div>
  );
}

// ==================== STEP 2: ESCOLHER HORÁRIO ====================
function Step2Horario({ formData, setFormData, profissionais, horariosDisponiveis }: any) {
  const [selectedDate, setSelectedDate] = useState(formData.data || new Date());
  
  const next7Days = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h3 className="text-lg font-semibold text-[#2b2926]">Escolha Data e Horário</h3>

      {/* Date Picker */}
      <div>
        <label className="field-label">Data da Consulta</label>
        <div className="grid grid-cols-7 gap-2">
          {next7Days.map((date, index) => {
            const isSelected = format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
            return (
              <button
                key={index}
                onClick={() => {
                  setSelectedDate(date);
                  setFormData({ ...formData, data: date });
                }}
                className={`p-3 rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'border-[#4a7c65] bg-[#4a7c65] text-white'
                    : 'border-[#e8e5df] hover:border-[#4a7c65]/30'
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
        <div className="grid grid-cols-3 gap-3">
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
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  isSelected
                    ? 'border-[#4a7c65] bg-[#4a7c65]/5'
                    : 'border-[#e8e5df] hover:border-[#4a7c65]/30'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: prof.cor }}
                  />
                  <span className="font-semibold text-sm">{prof.nome}</span>
                </div>
                <div className="text-xs text-[#7a7369]">{prof.especialidade}</div>
                {isSelected && (
                  <Check size={16} className="text-[#4a7c65] mt-2" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Horários Disponíveis */}
      {formData.profissionalId && (
        <div>
          <label className="field-label">Horário Disponível</label>
          <div className="grid grid-cols-6 gap-2">
            {horariosDisponiveis.map((horario: string) => {
              const isSelected = formData.horario === horario;
              return (
                <button
                  key={horario}
                  onClick={() => setFormData({ ...formData, horario })}
                  className={`p-3 rounded-lg border-2 transition-all font-medium ${
                    isSelected
                      ? 'border-[#4a7c65] bg-[#4a7c65] text-white'
                      : 'border-[#e8e5df] hover:border-[#4a7c65]/30'
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
      <div className="grid grid-cols-2 gap-4">
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
      </div>
    </motion.div>
  );
}

// ==================== STEP 3: CONFIRMAÇÃO ====================
function Step3Confirmacao({ formData, setFormData }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h3 className="text-lg font-semibold text-[#2b2926]">Confirme os Detalhes</h3>

      {/* Resumo */}
      <div className="bg-[#f5f3ef] rounded-xl p-6 space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-[#4a7c65] flex items-center justify-center flex-shrink-0">
            <User size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-[#7a7369]">Paciente</div>
            <div className="font-semibold text-[#2b2926]">{formData.pacienteNome}</div>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-[#3b82f6] flex items-center justify-center flex-shrink-0">
            <Calendar size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-[#7a7369]">Data e Horário</div>
            <div className="font-semibold text-[#2b2926]">
              {formData.data && format(formData.data, "EEEE, d 'de' MMMM", { locale: ptBR })}
              {' às '}
              {formData.horario}
            </div>
            <div className="text-sm text-[#7a7369]">Duração: {formData.duracao} minutos</div>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-[#8b5cf6] flex items-center justify-center flex-shrink-0">
            <User size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-[#7a7369]">Profissional</div>
            <div className="font-semibold text-[#2b2926]">{formData.profissionalNome}</div>
            <div className="text-sm text-[#7a7369]">{formData.especialidade}</div>
          </div>
        </div>
      </div>

      {/* Detalhes Adicionais */}
      <div className="space-y-4">
        <div>
          <label className="field-label">Tipo de Consulta</label>
          <select
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
            className="input-field"
          >
            <option value="consulta">Consulta</option>
            <option value="retorno">Retorno</option>
            <option value="exame">Exame</option>
            <option value="procedimento">Procedimento</option>
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
            <option value="bradesco">Bradesco Saúde</option>
          </select>
        </div>

        <div>
          <label className="field-label">Observações</label>
          <textarea
            value={formData.observacoes || ''}
            onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
            placeholder="Adicione observações sobre a consulta..."
            className="input-field min-h-[100px]"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="confirmacao"
            checked={formData.enviarConfirmacao}
            onChange={(e) => setFormData({ ...formData, enviarConfirmacao: e.target.checked })}
            className="w-5 h-5"
          />
          <label htmlFor="confirmacao" className="text-sm text-[#2b2926]">
            Enviar confirmação por WhatsApp
          </label>
        </div>
      </div>
    </motion.div>
  );
}
