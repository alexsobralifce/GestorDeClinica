import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Check, User, Briefcase, Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Professional, professionalsApi } from '../../lib/api/professionals';
import { especialidadeConfig } from '../../lib/types';
import { maskPhone } from '../../utils/masks';

const CORES = [
  '#4a7c65', '#3b82f6', '#8b5cf6', '#f59e0b', '#e85d3f',
  '#10b981', '#6b9dd8', '#ec4899', '#14b8a6', '#f97316'
];

const DIAS_SEMANA = [
  { key: 'segunda', label: 'Segunda-feira' },
  { key: 'terca', label: 'Terça-feira' },
  { key: 'quarta', label: 'Quarta-feira' },
  { key: 'quinta', label: 'Quinta-feira' },
  { key: 'sexta', label: 'Sexta-feira' },
  { key: 'sabado', label: 'Sábado' },
  { key: 'domingo', label: 'Domingo' },
] as const;


interface ProfissionalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  profissional?: Professional | null;
}

const STEPS = [
  { id: 1, label: 'Dados Pessoais', icon: User },
  { id: 2, label: 'Profissional', icon: Briefcase },
  { id: 3, label: 'Agenda', icon: Calendar },
];

export function ProfissionalModal({ isOpen, onClose, onSuccess, profissional }: ProfissionalModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Professional>>({
    name: '',
    email: '',
    phone: '',
    specialty: 'medicina',
    registration_number: '',
    color: '#4a7c65',
    schedule: {
      segunda: { ativo: true, inicio: '08:00', fim: '18:00' },
      terca: { ativo: true, inicio: '08:00', fim: '18:00' },
      quarta: { ativo: true, inicio: '08:00', fim: '18:00' },
      quinta: { ativo: true, inicio: '08:00', fim: '18:00' },
      sexta: { ativo: true, inicio: '08:00', fim: '18:00' },
      sabado: { ativo: false, inicio: '09:00', fim: '13:00' },
      domingo: { ativo: false, inicio: '09:00', fim: '13:00' },
    }
  });

  useEffect(() => {
    if (profissional) {
      setFormData({
        name: profissional.name,
        email: profissional.email || '',
        phone: profissional.phone || '',
        specialty: profissional.specialty,
        registration_number: profissional.registration_number || '',
        color: profissional.color || '#4a7c65',
        schedule: profissional.schedule || formData.schedule
      });
    }
  }, [profissional]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      const payload = {
        name: formData.name!,
        email: formData.email,
        phone: formData.phone,
        specialty: formData.specialty!,
        registration_number: formData.registration_number,
        color: formData.color,
        schedule: formData.schedule
      };

      if (profissional?.id) {
        await professionalsApi.update(profissional.id, payload);
      } else {
        await professionalsApi.create(payload);
      }

      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar profissional');
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isStepValid = () => {
    if (currentStep === 1) {
      return formData.name && formData.name.length >= 3;
    }
    if (currentStep === 2) {
      return formData.specialty && formData.registration_number;
    }
    return true;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-0">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#e8e5df]">
          <div>
            <h2 className="text-xl font-bold text-[#2b2926]" style={{ fontFamily: 'var(--font-heading)' }}>
              {profissional ? 'Editar Profissional' : 'Novo Profissional'}
            </h2>
            <p className="text-sm text-[#7a7369] mt-1">Preencha os dados do profissional</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#7a7369] hover:bg-[#f5f3ef] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Progress */}
        <div className="px-6 py-4 bg-[#f5f3ef]/50 border-b border-[#e8e5df]">
          <div className="flex justify-between relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#e8e5df] -z-10 -translate-y-1/2"></div>
            <div
              className="absolute top-1/2 left-0 h-0.5 bg-[#4a7c65] -z-10 -translate-y-1/2 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
            ></div>

            {STEPS.map((step) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isPast = step.id < currentStep;

              return (
                <div key={step.id} className="flex flex-col items-center gap-2 bg-[#f5f3ef]/50 px-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors border-2 ${isActive ? 'bg-[#4a7c65] text-white border-[#4a7c65]' :
                      isPast ? 'bg-[#4a7c65] text-white border-[#4a7c65]' :
                        'bg-white text-[#c4bdaf] border-[#e8e5df]'
                      }`}
                  >
                    {isPast ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-xs font-semibold ${isActive || isPast ? 'text-[#2b2926]' : 'text-[#c4bdaf]'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ minHeight: '350px' }}>
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-start gap-2">
              <span className="font-bold">Erro:</span> {error}
            </div>
          )}

          {currentStep === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2b2926] mb-1">Nome Completo *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="input-field w-full"
                  placeholder="Ex: Dr. João Silva"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2b2926] mb-1">E-mail</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="input-field w-full"
                    placeholder="joao@clinica.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2b2926] mb-1">Telefone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: maskPhone(e.target.value) })}
                    className="input-field w-full"
                    placeholder="(11) 98765-4321"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#2b2926] mb-3">Especialidade *</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(especialidadeConfig).map(([key, config]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setFormData({ ...formData, specialty: key })}
                      className={`p-3 rounded-xl border-2 text-sm font-bold transition-all ${formData.specialty === key
                        ? 'border-[var(--color)] bg-[var(--bg)] text-[var(--color)]'
                        : 'border-[#e8e5df] bg-white text-[#7a7369] hover:bg-[#f5f3ef]'
                        }`}
                      style={{
                        '--color': config.cor,
                        '--bg': config.corClara
                      } as React.CSSProperties}
                    >
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2b2926] mb-1">Registro Profissional (CRM/CRO/CRP/CREFITO) *</label>
                <input
                  type="text"
                  value={formData.registration_number || ''}
                  onChange={e => setFormData({ ...formData, registration_number: e.target.value })}
                  className="input-field w-full md:w-1/2"
                  placeholder="Ex: CRM-SP 123456"
                />
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-[#2b2926] mb-3">Cor de Identificação *</label>
                <div className="flex flex-wrap gap-3">
                  {CORES.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: c })}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${formData.color === c ? 'ring-2 ring-offset-2 scale-110' : 'hover:scale-105'
                        }`}
                      style={{ backgroundColor: c, '--tw-ring-color': c } as React.CSSProperties}
                    >
                      {formData.color === c && <Check className="w-5 h-5 text-white" />}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-[#7a7369] mt-2">Esta cor será usada para identificar o profissional na grade de agendamentos.</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-[#4a7c65]" />
                  <label className="font-bold text-[#2b2926]">Horários de Atendimento Padrão</label>
                </div>

                <div className="space-y-3 bg-[#f5f3ef]/50 p-4 rounded-xl border border-[#e8e5df]">
                  {DIAS_SEMANA.map((dia) => {
                    const cfg = formData.schedule?.[dia.key] || { ativo: false, inicio: '08:00', fim: '18:00' };

                    return (
                      <div key={dia.key} className="flex items-center gap-4 bg-white p-3 rounded-lg border border-[#e8e5df]">
                        <label className="flex items-center gap-2 w-32 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={cfg.ativo}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setFormData(prev => ({
                                ...prev,
                                schedule: {
                                  ...prev.schedule,
                                  [dia.key]: { ...cfg, ativo: checked }
                                }
                              }));
                            }}
                            className="w-4 h-4 text-[#4a7c65] bg-gray-100 border-gray-300 rounded focus:ring-[#4a7c65]"
                          />
                          <span className={`${cfg.ativo ? 'font-semibold text-[#2b2926]' : 'text-[#a19b91]'}`}>
                            {dia.label}
                          </span>
                        </label>

                        <div className={`flex items-center gap-2 transition-opacity ${cfg.ativo ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                          <input
                            type="time"
                            value={cfg.inicio}
                            onChange={(e) => {
                              setFormData(prev => ({
                                ...prev,
                                schedule: {
                                  ...prev.schedule,
                                  [dia.key]: { ...cfg, inicio: e.target.value }
                                }
                              }));
                            }}
                            className="input-field py-1 px-2 text-sm w-28"
                          />
                          <span className="text-[#a19b91]">até</span>
                          <input
                            type="time"
                            value={cfg.fim}
                            onChange={(e) => {
                              setFormData(prev => ({
                                ...prev,
                                schedule: {
                                  ...prev.schedule,
                                  [dia.key]: { ...cfg, fim: e.target.value }
                                }
                              }));
                            }}
                            className="input-field py-1 px-2 text-sm w-28"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#e8e5df] flex justify-between gap-4 bg-gray-50/50 rounded-b-2xl mt-auto">
          <button
            type="button"
            onClick={currentStep === 1 ? onClose : prevStep}
            className="flex-1 py-3 bg-white border-2 border-[#e8e5df] rounded-xl font-semibold text-[#5c5650] hover:bg-[#f5f3ef] hover:border-[#d4cfc5] transition-all shadow-sm flex items-center justify-center gap-2"
          >
            {currentStep === 1 ? 'Cancelar' : <><ChevronLeft className="w-5 h-5" /> Voltar</>}
          </button>

          {currentStep < 3 ? (
            <button
              onClick={nextStep}
              disabled={!isStepValid()}
              className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              Próximo <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !isStepValid()}
              className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <><Check className="w-5 h-5" /> Salvar Profissional</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
