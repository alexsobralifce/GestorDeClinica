import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Check, Calendar, Clock, User, RefreshCw, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfDay, isBefore, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface NovoAgendamentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface Paciente {
  id: string;
  name: string;
  cpf: string;
  phone: string;
}

interface Profissional {
  id: string;
  name: string;
  specialty: string;
  color: string;
}

interface FormData {
  // Step 1
  pacienteId: string;
  pacienteNome: string;
  // Step 2
  data: Date;
  profissionalId: string;
  profissionalNome: string;
  especialidade: string;
  horario: string;
  duracao: number;
  // Step 3 — Recorrência
  recorrente: boolean;
  diasSemana: number[];   // 0=Dom, 1=Seg, ... 6=Sáb
  numSessoes: number;
  datasGeradas: string[]; // ISO dates YYYY-MM-DD
  // Step 4
  tipo: string;
  observacoes: string;
}

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const STEPS = [
  { id: 1, label: 'Paciente', icon: User },
  { id: 2, label: 'Horário', icon: Clock },
  { id: 3, label: 'Recorrência', icon: RefreshCw },
  { id: 4, label: 'Confirmar', icon: Check },
];

const HORARIOS = [
  '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30',
];

/** Gera array de datas ISO a partir de dias da semana e quantidade de sessões */
function gerarDatas(diasSemana: number[], numSessoes: number, dataInicio: Date): string[] {
  if (diasSemana.length === 0 || numSessoes === 0) return [];
  const datas: string[] = [];
  let dataAtual = startOfDay(dataInicio);
  let tentativas = 0;
  while (datas.length < numSessoes && tentativas < 365) {
    const diaDaSemana = dataAtual.getDay();
    if (diasSemana.includes(diaDaSemana) && !isBefore(dataAtual, startOfDay(dataInicio))) {
      datas.push(format(dataAtual, 'yyyy-MM-dd'));
    }
    dataAtual = addDays(dataAtual, 1);
    tentativas++;
  }
  return datas;
}

function calcEndTime(start: string, duracaoMin: number): string {
  const [h, m] = start.split(':').map(Number);
  const totalMin = h * 60 + m + duracaoMin;
  return `${String(Math.floor(totalMin / 60)).padStart(2, '0')}:${String(totalMin % 60).padStart(2, '0')}`;
}

export function NovoAgendamentoModal({ isOpen, onClose, onSuccess }: NovoAgendamentoModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  const [formData, setFormData] = useState<Partial<FormData>>({
    data: new Date(),
    duracao: 60,
    tipo: 'sessao',
    recorrente: false,
    diasSemana: [],
    numSessoes: 10,
    datasGeradas: [],
  });

  useEffect(() => {
    if (!isOpen) return;
    setLoadingData(true);
    Promise.all([
      axios.get(`${API_URL}/patients`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
      axios.get(`${API_URL}/professionals`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
    ])
      .then(([pRes, prRes]) => {
        setPacientes(pRes.data);
        setProfissionais(prRes.data.filter((p: Profissional) => p));
      })
      .catch(() => setError('Erro ao carregar dados. Tente novamente.'))
      .finally(() => setLoadingData(false));
  }, [isOpen]);

  // Recalcular datas geradas sempre que recorrência mudar
  useEffect(() => {
    if (formData.recorrente && formData.diasSemana && formData.numSessoes && formData.data) {
      const datas = gerarDatas(formData.diasSemana, formData.numSessoes, formData.data);
      setFormData(prev => ({ ...prev, datasGeradas: datas }));
    }
  }, [formData.recorrente, formData.diasSemana, formData.numSessoes, formData.data]);

  const resetForm = () => {
    setCurrentStep(1);
    setError(null);
    setSuccess(false);
    setFormData({
      data: new Date(),
      duracao: 60,
      tipo: 'sessao',
      recorrente: false,
      diasSemana: [],
      numSessoes: 10,
      datasGeradas: [],
    });
  };

  const handleNext = () => { if (currentStep < 4) setCurrentStep(s => s + 1); };
  const handleBack = () => { if (currentStep > 1) setCurrentStep(s => s - 1); };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return !!formData.pacienteId;
      case 2: return !!formData.profissionalId && !!formData.horario;
      case 3:
        if (!formData.recorrente) return true;
        return (formData.datasGeradas?.length ?? 0) > 0;
      case 4: return true;
      default: return false;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const endTime = calcEndTime(formData.horario!, formData.duracao!);

    try {
      if (formData.recorrente && (formData.datasGeradas?.length ?? 0) > 1) {
        // Agendamento em lote
        await axios.post(`${API_URL}/appointments/batch`, {
          patient_id: formData.pacienteId,
          professional_id: formData.profissionalId,
          start_time: formData.horario,
          end_time: endTime,
          duration: formData.duracao,
          specialty: formData.especialidade,
          notes: formData.observacoes,
          dates: formData.datasGeradas,
        }, { headers });
      } else {
        // Agendamento único
        const dataSingle = formData.recorrente && formData.datasGeradas?.length
          ? formData.datasGeradas[0]
          : format(formData.data!, 'yyyy-MM-dd');
        await axios.post(`${API_URL}/appointments`, {
          patient_id: formData.pacienteId,
          professional_id: formData.profissionalId,
          appointment_date: dataSingle,
          start_time: formData.horario,
          end_time: endTime,
          duration: formData.duracao,
          specialty: formData.especialidade,
          notes: formData.observacoes,
          status: 'scheduled',
        }, { headers });
      }
      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        onClose();
        resetForm();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao salvar agendamento. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl mx-4 max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#e8e5df]">
          <div>
            <h2 className="text-2xl font-bold text-[#2b2926]">Novo Agendamento</h2>
            <p className="text-sm text-[#7a7369] mt-1">
              Preencha as informações para criar um ou mais agendamentos
            </p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-[#f5f3ef] flex items-center justify-center transition-colors">
            <X size={24} className="text-[#7a7369]" />
          </button>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center px-6 py-6 border-b border-[#e8e5df]">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${currentStep === step.id ? 'bg-[#4a7c65] text-white shadow-lg scale-110'
                  : currentStep > step.id ? 'bg-[#10b981] text-white'
                    : 'bg-[#e8e5df] text-[#7a7369]'
                  }`}>
                  {currentStep > step.id ? <Check size={20} /> : <step.icon size={20} />}
                </div>
                <span className={`text-xs font-medium mt-1 ${currentStep === step.id ? 'text-[#4a7c65]' : 'text-[#7a7369]'}`}>
                  {step.label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div className={`w-20 h-1 mx-3 transition-all ${currentStep > step.id ? 'bg-[#10b981]' : 'bg-[#e8e5df]'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
          )}
          {success && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-20 h-20 rounded-full bg-[#10b981] flex items-center justify-center mb-4">
                <Check size={40} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#2b2926]">
                {formData.recorrente ? `${formData.datasGeradas?.length} sessões agendadas!` : 'Agendamento criado!'}
              </h3>
              <p className="text-[#7a7369] mt-2 text-center">
                {formData.recorrente
                  ? `Pacote para ${formData.pacienteNome} criado com sucesso.`
                  : `Consulta de ${formData.pacienteNome} salva com sucesso.`}
              </p>
            </div>
          )}
          {!success && (
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <Step1Paciente
                  key="step1"
                  formData={formData}
                  setFormData={setFormData}
                  pacientes={pacientes}
                  loading={loadingData}
                />
              )}
              {currentStep === 2 && (
                <Step2Horario
                  key="step2"
                  formData={formData}
                  setFormData={setFormData}
                  profissionais={profissionais}
                />
              )}
              {currentStep === 3 && (
                <Step3Recorrencia
                  key="step3"
                  formData={formData}
                  setFormData={setFormData}
                />
              )}
              {currentStep === 4 && (
                <Step4Confirmacao
                  key="step4"
                  formData={formData}
                  setFormData={setFormData}
                />
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        {!success && (
          <div className="flex items-center justify-between p-6 border-t border-[#e8e5df] bg-[#faf9f7]">
            <button
              onClick={currentStep === 1 ? onClose : handleBack}
              className="btn-secondary flex items-center gap-2"
            >
              <ChevronLeft size={20} />
              {currentStep === 1 ? 'Cancelar' : 'Voltar'}
            </button>
            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="btn-primary flex items-center gap-2"
              >
                Próximo <ChevronRight size={20} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn-primary flex items-center gap-2"
              >
                {isSubmitting ? (
                  <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Agendando...</>
                ) : (
                  <><Check size={20} />{formData.recorrente ? `Criar ${formData.datasGeradas?.length ?? 0} Sessões` : 'Confirmar Agendamento'}</>
                )}
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ==================== STEP 1: PACIENTE ====================
function Step1Paciente({ formData, setFormData, pacientes, loading }: any) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = pacientes.filter((p: Paciente) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.cpf || '').includes(searchTerm)
  );

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
      <h3 className="text-lg font-semibold text-[#2b2926]">Selecione o Paciente</h3>
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
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-[#4a7c65] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
          {filtered.map((p: Paciente) => (
            <button
              key={p.id}
              onClick={() => setFormData({ ...formData, pacienteId: p.id, pacienteNome: p.name })}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left ${formData.pacienteId === p.id ? 'border-[#4a7c65] bg-[#4a7c65]/5' : 'border-[#e8e5df] hover:border-[#4a7c65]/30'
                }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#4a7c65]/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-[#4a7c65]">{p.name.split(' ').slice(0, 2).map((n: string) => n[0]).join('')}</span>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-[#2b2926]">{p.name}</div>
                  {p.cpf && <div className="text-sm text-[#7a7369]">CPF: {p.cpf} {p.phone && `• ${p.phone}`}</div>}
                </div>
                {formData.pacienteId === p.id && (
                  <div className="w-6 h-6 rounded-full bg-[#4a7c65] flex items-center justify-center">
                    <Check size={14} className="text-white" />
                  </div>
                )}
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-[#7a7369]">
              <User size={48} className="mx-auto mb-4 opacity-30" />
              <p>Nenhum paciente encontrado</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

// ==================== STEP 2: HORÁRIO ====================
function Step2Horario({ formData, setFormData, profissionais }: any) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <h3 className="text-lg font-semibold text-[#2b2926]">Data, Profissional e Horário</h3>

      {/* Profissionais */}
      <div>
        <label className="field-label">Profissional</label>
        <div className="grid grid-cols-2 gap-3">
          {profissionais.map((prof: Profissional) => (
            <button
              key={prof.id}
              onClick={() => setFormData({ ...formData, profissionalId: prof.id, profissionalNome: prof.name, especialidade: prof.specialty })}
              className={`p-4 rounded-xl border-2 transition-all text-left ${formData.profissionalId === prof.id ? 'border-[#4a7c65] bg-[#4a7c65]/5' : 'border-[#e8e5df] hover:border-[#4a7c65]/30'
                }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: prof.color || '#4a7c65' }} />
                <span className="font-semibold text-sm text-[#2b2926]">{prof.name}</span>
              </div>
              <div className="text-xs text-[#7a7369]">{prof.specialty}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Data (só se NÃO for recorrente, a data de início é configurada no step 3) */}
      <div>
        <label className="field-label">Data de início</label>
        <input
          type="date"
          value={formData.data ? format(formData.data, 'yyyy-MM-dd') : ''}
          min={format(new Date(), 'yyyy-MM-dd')}
          onChange={(e) => setFormData({ ...formData, data: new Date(e.target.value + 'T12:00:00') })}
          className="input-field"
        />
      </div>

      {/* Horário */}
      {formData.profissionalId && (
        <div>
          <label className="field-label">Horário</label>
          <div className="grid grid-cols-5 gap-2">
            {HORARIOS.map((h) => (
              <button
                key={h}
                onClick={() => setFormData({ ...formData, horario: h })}
                className={`p-3 rounded-lg border-2 transition-all font-medium text-sm ${formData.horario === h ? 'border-[#4a7c65] bg-[#4a7c65] text-white' : 'border-[#e8e5df] hover:border-[#4a7c65]/30'
                  }`}
              >
                {h}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Duração */}
      <div>
        <label className="field-label">Duração da sessão</label>
        <div className="grid grid-cols-4 gap-3">
          {[30, 45, 60, 90].map((min) => (
            <button
              key={min}
              onClick={() => setFormData({ ...formData, duracao: min })}
              className={`p-3 rounded-xl border-2 transition-all font-medium ${formData.duracao === min ? 'border-[#4a7c65] bg-[#4a7c65] text-white' : 'border-[#e8e5df] hover:border-[#4a7c65]/30'
                }`}
            >
              {min} min
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ==================== STEP 3: RECORRÊNCIA ====================
function Step3Recorrencia({ formData, setFormData }: any) {
  const toggleDia = (dia: number) => {
    const atual = formData.diasSemana || [];
    const novo = atual.includes(dia) ? atual.filter((d: number) => d !== dia) : [...atual, dia];
    setFormData({ ...formData, diasSemana: novo });
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <h3 className="text-lg font-semibold text-[#2b2926]">Recorrência do Agendamento</h3>

      {/* Toggle único/pacote */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setFormData({ ...formData, recorrente: false, datasGeradas: [] })}
          className={`p-5 rounded-xl border-2 transition-all text-left ${!formData.recorrente ? 'border-[#4a7c65] bg-[#4a7c65]/5' : 'border-[#e8e5df] hover:border-[#4a7c65]/20'
            }`}
        >
          <Calendar size={28} className={!formData.recorrente ? 'text-[#4a7c65]' : 'text-[#7a7369]'} />
          <div className="mt-3 font-semibold text-[#2b2926]">Agendamento Único</div>
          <div className="text-sm text-[#7a7369] mt-1">Uma consulta na data escolhida</div>
        </button>
        <button
          onClick={() => setFormData({ ...formData, recorrente: true })}
          className={`p-5 rounded-xl border-2 transition-all text-left ${formData.recorrente ? 'border-[#4a7c65] bg-[#4a7c65]/5' : 'border-[#e8e5df] hover:border-[#4a7c65]/20'
            }`}
        >
          <Package size={28} className={formData.recorrente ? 'text-[#4a7c65]' : 'text-[#7a7369]'} />
          <div className="mt-3 font-semibold text-[#2b2926]">Pacote de Sessões</div>
          <div className="text-sm text-[#7a7369] mt-1">Múltiplas sessões recorrentes</div>
        </button>
      </div>

      {formData.recorrente && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          {/* Dias da semana */}
          <div>
            <label className="field-label">Dias da semana</label>
            <div className="flex gap-2 flex-wrap">
              {DIAS_SEMANA.map((dia, index) => (
                <button
                  key={index}
                  onClick={() => toggleDia(index)}
                  className={`w-14 h-14 rounded-xl border-2 font-semibold transition-all ${(formData.diasSemana || []).includes(index)
                    ? 'border-[#4a7c65] bg-[#4a7c65] text-white'
                    : 'border-[#e8e5df] text-[#7a7369] hover:border-[#4a7c65]/30'
                    }`}
                >
                  {dia}
                </button>
              ))}
            </div>
          </div>

          {/* Número de sessões */}
          <div>
            <label className="field-label">Número de sessões: <strong>{formData.numSessoes}</strong></label>
            <input
              type="range"
              min={2}
              max={40}
              value={formData.numSessoes || 10}
              onChange={(e) => setFormData({ ...formData, numSessoes: Number(e.target.value) })}
              className="w-full accent-[#4a7c65]"
            />
            <div className="flex justify-between text-xs text-[#7a7369] mt-1">
              <span>2 sessões</span>
              <span>40 sessões</span>
            </div>
          </div>

          {/* Preview das datas */}
          {(formData.datasGeradas?.length ?? 0) > 0 && (
            <div>
              <label className="field-label">
                📅 {formData.datasGeradas.length} sessões geradas — prévia:
              </label>
              <div className="bg-[#f5f3ef] rounded-xl p-4 max-h-48 overflow-y-auto">
                <div className="grid grid-cols-2 gap-2">
                  {formData.datasGeradas.slice(0, 20).map((d: string, i: number) => (
                    <div key={d} className="flex items-center gap-2 text-sm">
                      <span className="w-6 h-6 rounded-full bg-[#4a7c65] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-[#2b2926]">
                        {format(new Date(d + 'T12:00:00'), "EEE, d 'de' MMM", { locale: ptBR })}
                      </span>
                    </div>
                  ))}
                  {formData.datasGeradas.length > 20 && (
                    <div className="col-span-2 text-sm text-[#7a7369] text-center pt-2">
                      + {formData.datasGeradas.length - 20} sessões adicionais...
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {(formData.diasSemana?.length ?? 0) === 0 && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm">
              ⚠️ Selecione pelo menos um dia da semana para gerar o pacote.
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

// ==================== STEP 4: CONFIRMAÇÃO ====================
function Step4Confirmacao({ formData, setFormData }: any) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <h3 className="text-lg font-semibold text-[#2b2926]">Confirme os Detalhes</h3>

      <div className="bg-[#f5f3ef] rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#4a7c65] flex items-center justify-center flex-shrink-0">
            <User size={22} className="text-white" />
          </div>
          <div>
            <div className="text-xs text-[#7a7369]">Paciente</div>
            <div className="font-semibold text-[#2b2926]">{formData.pacienteNome}</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#3b82f6] flex items-center justify-center flex-shrink-0">
            <User size={22} className="text-white" />
          </div>
          <div>
            <div className="text-xs text-[#7a7369]">Profissional</div>
            <div className="font-semibold text-[#2b2926]">{formData.profissionalNome}</div>
            <div className="text-sm text-[#7a7369]">{formData.especialidade}</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#8b5cf6] flex items-center justify-center flex-shrink-0">
            <Clock size={22} className="text-white" />
          </div>
          <div>
            <div className="text-xs text-[#7a7369]">Horário</div>
            <div className="font-semibold text-[#2b2926]">{formData.horario} • {formData.duracao} min</div>
          </div>
        </div>
        {formData.recorrente ? (
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#f59e0b] flex items-center justify-center flex-shrink-0">
              <Package size={22} className="text-white" />
            </div>
            <div>
              <div className="text-xs text-[#7a7369]">Pacote de Sessões</div>
              <div className="font-semibold text-[#2b2926]">{formData.datasGeradas?.length} sessões</div>
              <div className="text-sm text-[#7a7369]">
                {formData.datasGeradas?.[0] && format(new Date(formData.datasGeradas[0] + 'T12:00:00'), "d MMM", { locale: ptBR })}
                {' → '}
                {formData.datasGeradas?.at(-1) && format(new Date(formData.datasGeradas.at(-1) + 'T12:00:00'), "d MMM yyyy", { locale: ptBR })}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#10b981] flex items-center justify-center flex-shrink-0">
              <Calendar size={22} className="text-white" />
            </div>
            <div>
              <div className="text-xs text-[#7a7369]">Data</div>
              <div className="font-semibold text-[#2b2926]">
                {formData.data && format(formData.data, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="field-label">Tipo de Atendimento</label>
          <select
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
            className="input-field"
          >
            <option value="sessao">Sessão de Fisioterapia</option>
            <option value="avaliacao">Avaliação Inicial</option>
            <option value="retorno">Retorno</option>
            <option value="consulta">Consulta</option>
          </select>
        </div>
        <div>
          <label className="field-label">Observações</label>
          <textarea
            value={formData.observacoes || ''}
            onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
            placeholder="Ex: Pacote de 10 sessões de RPG pós-cirurgia..."
            className="input-field min-h-[80px]"
          />
        </div>
      </div>
    </motion.div>
  );
}
