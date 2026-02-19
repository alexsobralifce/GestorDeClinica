import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar as CalendarIcon, Clock, Check, User, ChevronRight, MapPin, AlertCircle } from 'lucide-react';
import { bookingApi, PublicProfessional } from '../../lib/api/booking';

// Steps: 0=Patient Info, 1=Select Slot, 2=Confirmation

interface AgendamentoModalProps {
  onClose: () => void;
}

export function AgendamentoModal({ onClose }: AgendamentoModalProps) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Data
  const [patient, setPatient] = useState({ name: '', cpf: '', email: '', phone: '' });
  const [patientId, setPatientId] = useState('');

  const [professionals, setProfessionals] = useState<PublicProfessional[]>([]);
  const [selectedProf, setSelectedProf] = useState<PublicProfessional | null>(null);

  const [date, setDate] = useState('');
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');

  // Load professionals on mount
  useEffect(() => {
    bookingApi.getProfessionals()
      .then(setProfessionals)
      .catch(err => console.error('Failed to load pros', err));
  }, []);

  // Load slots when prof/date changes
  useEffect(() => {
    if (selectedProf && date) {
      setLoading(true);
      bookingApi.getSlots(selectedProf.id, date)
        .then(setSlots)
        .catch(() => setSlots([]))
        .finally(() => setLoading(false));
    } else {
      setSlots([]);
    }
  }, [selectedProf, date]);

  const handleNext = async () => {
    setError('');

    if (step === 0) {
      // Validate Step 1
      if (!patient.name || !patient.cpf || !patient.email || !patient.phone) {
        setError('Preencha todos os campos obrigatórios.');
        return;
      }
      setLoading(true);
      try {
        const res = await bookingApi.registerPatient(patient);
        setPatientId(res.id);
        setStep(1);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Erro ao cadastrar. Verifique os dados.');
      } finally { setLoading(false); }
    } else if (step === 1) {
      // Validate Step 2
      if (!selectedProf || !date || !selectedSlot) {
        setError('Selecione profissional, data e horário.');
        return;
      }
      setStep(2);
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      if (!selectedProf) return;
      await bookingApi.createAppointment({
        patient_id: patientId,
        professional_id: selectedProf.id,
        date,
        time: selectedSlot
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao agendar.');
    } finally { setLoading(false); }
  };

  const todayStr = new Date().toISOString().slice(0, 10);

  // Format date for display
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-[#4a7c65] p-6 text-white flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl font-bold">Agendar Consulta</h2>
            <p className="text-[#a5d0bc] text-sm">
              {success ? 'Concluído' : `Passo ${step + 1} de 3`}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto flex-1">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <div className="mx-auto h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <Check className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-[#2b2926] mb-2">Agendamento Confirmado!</h3>
                <p className="text-[#5c5650] max-w-md mx-auto mb-8">
                  Sua consulta foi agendada com sucesso. Aguardamos você com 15 minutos de antecedência.
                </p>
                <div className="bg-[#f5f3ef] rounded-xl p-6 text-left max-w-sm mx-auto space-y-3 shadow-inner">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-[#4a7c65]" />
                    <div>
                      <p className="text-xs text-[#a8a199] uppercase font-bold">Profissional</p>
                      <span className="font-medium text-[#2b2926]">{selectedProf?.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="h-5 w-5 text-[#4a7c65]" />
                    <div>
                      <p className="text-xs text-[#a8a199] uppercase font-bold">Data e Hora</p>
                      <span className="text-[#5c5650]">{formatDate(date)} às {selectedSlot}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-[#4a7c65]" />
                    <div>
                      <p className="text-xs text-[#a8a199] uppercase font-bold">Local</p>
                      <span className="text-[#5c5650]">HealthSync Clinic - Sala 4</span>
                    </div>
                  </div>
                </div>
                <button onClick={onClose} className="mt-8 px-6 py-3 bg-[#4a7c65] text-white rounded-xl font-medium hover:bg-[#3d6653] transition-colors w-full max-w-xs">
                  Fechar
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm font-medium flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    {error}
                  </div>
                )}

                {/* Step 0: Patient Info */}
                {step === 0 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h3 className="text-xl font-bold text-[#2b2926]">Identificação</h3>
                      <p className="text-[#7a7369]">Informe seus dados para iniciar o agendamento</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-[#5c5650]">Nome Completo *</label>
                        <input type="text" className="w-full px-4 py-3 rounded-xl border border-[#e8e5df] focus:border-[#4a7c65] focus:ring-1 focus:ring-[#4a7c65] outline-none transition-colors"
                          placeholder="Ex: Maria Silva"
                          value={patient.name} onChange={e => setPatient({ ...patient, name: e.target.value })} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-[#5c5650]">CPF *</label>
                        <input type="text" className="w-full px-4 py-3 rounded-xl border border-[#e8e5df] focus:border-[#4a7c65] focus:ring-1 focus:ring-[#4a7c65] outline-none transition-colors"
                          placeholder="000.000.000-00"
                          value={patient.cpf} onChange={e => setPatient({ ...patient, cpf: e.target.value })} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-[#5c5650]">E-mail *</label>
                        <input type="email" className="w-full px-4 py-3 rounded-xl border border-[#e8e5df] focus:border-[#4a7c65] focus:ring-1 focus:ring-[#4a7c65] outline-none transition-colors"
                          placeholder="seu@email.com"
                          value={patient.email} onChange={e => setPatient({ ...patient, email: e.target.value })} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-[#5c5650]">WhatsApp *</label>
                        <input type="text" className="w-full px-4 py-3 rounded-xl border border-[#e8e5df] focus:border-[#4a7c65] focus:ring-1 focus:ring-[#4a7c65] outline-none transition-colors"
                          placeholder="(00) 00000-0000"
                          value={patient.phone} onChange={e => setPatient({ ...patient, phone: e.target.value })} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 1: Slot Picker */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-[#2b2926]">Escolha o Horário</h3>
                      <p className="text-[#7a7369]">Selecione o profissional e a melhor data</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-[#5c5650] mb-2">Profissional</label>
                          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                            {professionals.map(prof => (
                              <button
                                key={prof.id}
                                onClick={() => { setSelectedProf(prof); setDate(''); setSlots([]); setSelectedSlot(''); }}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${selectedProf?.id === prof.id
                                  ? 'border-[#4a7c65] bg-[#4a7c65]/5'
                                  : 'border-[#e8e5df] hover:border-[#d4cfc5]'
                                  }`}
                              >
                                <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center text-white font-bold text-sm ${selectedProf?.id === prof.id ? 'bg-[#4a7c65]' : 'bg-[#a8a199]'
                                  }`}>
                                  {prof.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                </div>
                                <div className="text-left min-w-0">
                                  <p className="font-semibold text-sm text-[#2b2926] truncate">{prof.name}</p>
                                  <p className="text-xs text-[#7a7369] truncate">{prof.specialty}</p>
                                </div>
                                {selectedProf?.id === prof.id && <Check className="h-4 w-4 ml-auto text-[#4a7c65]" />}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className={`transition-opacity duration-300 ${bookingApi ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                          <label className="block text-sm font-medium text-[#5c5650] mb-2">Data</label>
                          <input
                            type="date"
                            min={todayStr}
                            value={date}
                            disabled={!selectedProf}
                            onChange={e => { setDate(e.target.value); setSelectedSlot(''); }}
                            className="w-full px-4 py-3 rounded-xl border border-[#e8e5df] focus:border-[#4a7c65] outline-none cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-xl border border-[#e8e5df] p-4 flex flex-col h-[320px]">
                        <label className="block text-sm font-bold text-[#5c5650] mb-3 flex items-center gap-2">
                          <Clock className="h-4 w-4" /> Horários Disponíveis
                        </label>

                        {!selectedProf || !date ? (
                          <div className="flex-1 flex flex-col items-center justify-center text-[#a8a199] text-center p-4">
                            <CalendarIcon className="h-8 w-8 mb-2 opacity-50" />
                            <p className="text-sm">Selecione profissional e data para ver horários</p>
                          </div>
                        ) : loading ? (
                          <div className="flex-1 flex items-center justify-center">
                            <div className="w-8 h-8 border-4 border-[#4a7c65] border-t-transparent rounded-full animate-spin" />
                          </div>
                        ) : slots.length === 0 ? (
                          <div className="flex-1 flex flex-col items-center justify-center text-[#7a7369] text-center p-4">
                            <p className="font-medium">Nenhum horário disponível</p>
                            <p className="text-xs mt-1">Tente outra data ou profissional</p>
                          </div>
                        ) : (
                          <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-3 gap-2 content-start">
                            {slots.map(slot => (
                              <button
                                key={slot}
                                onClick={() => setSelectedSlot(slot)}
                                className={`py-2 px-1 rounded-lg text-sm font-medium transition-colors ${selectedSlot === slot
                                  ? 'bg-[#4a7c65] text-white shadow-md transform scale-105'
                                  : 'bg-white border border-[#e8e5df] text-[#5c5650] hover:border-[#4a7c65] hover:text-[#4a7c65]'
                                  }`}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Confirmation */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-[#2b2926]">Confirmação</h3>
                      <p className="text-[#7a7369]">Verifique os dados antes de finalizar</p>
                    </div>

                    <div className="bg-[#f5f3ef] rounded-xl p-6 space-y-4 border border-[#e8e5df]">
                      <div className="flex justify-between items-start pb-4 border-b border-[#dcd9d2]">
                        <div className="flex gap-3">
                          <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-[#4a7c65]">
                            <User className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#a8a199] uppercase tracking-wider mb-0.5">Paciente</p>
                            <p className="font-bold text-[#2b2926]">{patient.name}</p>
                            <p className="text-sm text-[#5c5650]">{patient.cpf}</p>
                          </div>
                        </div>
                        <button onClick={() => setStep(0)} className="text-xs bg-white px-3 py-1 rounded-full text-[#4a7c65] font-bold border border-[#e8e5df] hover:bg-[#4a7c65] hover:text-white transition-colors">ALTERAR</button>
                      </div>

                      <div className="flex justify-between items-start">
                        <div className="flex gap-3">
                          <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-[#4a7c65]">
                            <CalendarIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#a8a199] uppercase tracking-wider mb-0.5">Consulta</p>
                            <p className="font-bold text-[#2b2926]">{selectedProf?.name}</p>
                            <p className="text-sm text-[#5c5650]">
                              {formatDate(date)} às <span className="inline-block bg-[#4a7c65] text-white px-1.5 py-0.5 rounded text-xs ml-1">{selectedSlot}</span>
                            </p>
                          </div>
                        </div>
                        <button onClick={() => setStep(1)} className="text-xs bg-white px-3 py-1 rounded-full text-[#4a7c65] font-bold border border-[#e8e5df] hover:bg-[#4a7c65] hover:text-white transition-colors">ALTERAR</button>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-amber-50 text-amber-800 rounded-xl text-sm border border-amber-100">
                      <Clock className="h-5 w-5 shrink-0 mt-0.5" />
                      <p>O tempo estimado da consulta é de 30 minutos. Caso precise cancelar, entre em contato com 24h de antecedência.</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        {!success && (
          <div className="p-6 border-t border-[#e8e5df] bg-[#faf9f7] flex justify-between shrink-0">
            <button
              onClick={() => step > 0 ? setStep(s => s - 1) : onClose()}
              className="px-6 py-3 rounded-xl font-medium text-[#7a7369] hover:bg-[#e8e5df] transition-colors"
              disabled={loading}
            >
              {step > 0 ? 'Voltar' : 'Cancelar'}
            </button>

            {step < 2 ? (
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-[#4a7c65] text-white rounded-xl font-medium hover:bg-[#3d6653] transition-colors flex items-center gap-2 shadow-lg shadow-[#4a7c65]/20"
                disabled={loading}
              >
                {loading ? 'Processando...' : <>Próximo <ChevronRight className="h-4 w-4" /></>}
              </button>
            ) : (
              <button
                onClick={handleConfirm}
                className="px-8 py-3 bg-[#4a7c65] text-white rounded-xl font-medium hover:bg-[#3d6653] transition-colors flex items-center gap-2 shadow-lg shadow-[#4a7c65]/20"
                disabled={loading}
              >
                {loading ? 'Confirmando...' : <>Confirmar Agendamento <Check className="h-4 w-4" /></>}
              </button>
            )}
          </div>
        )}
      </motion.div>
    </>
  );
}
