import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  FileText,
  Upload,
  Mic,
  Activity,
  Heart,
  AlertTriangle,
  Calendar,
  User,
  Phone,
  Mail,
  Download,
  Eye,
  Plus,
  Stethoscope,
  Clock,
  X,
  Pill,
  FileImage,
  Paperclip,
  Save,
  Printer,
  Share2,
  Filter,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FilePlus,
  PenTool,
  RefreshCw,
} from 'lucide-react';
import { patientsApi, type Patient } from '../../lib/api/patients';
import { ehrApi, type EhrEvent } from '../../lib/api/ehr';
import { especialidadeConfig } from '../../lib/types';

// Map event_types to specialties for color coding
const eventTypeConfig: Record<string, { cor: string; corClara: string; label: string; icon: any }> = {
  consultation: { cor: '#3b82f6', corClara: '#dbeafe', label: 'Consulta', icon: Stethoscope },
  evolution: { cor: '#10b981', corClara: '#d1fae5', label: 'Evolução', icon: FileText },
  anamnesis: { cor: '#8b5cf6', corClara: '#ede9fe', label: 'Anamnese', icon: FileText },
  prescription: { cor: '#f59e0b', corClara: '#fef3c7', label: 'Prescrição', icon: Pill },
  exam: { cor: '#ec4899', corClara: '#fce7f3', label: 'Exame', icon: FileImage },
  default: { cor: '#6b7280', corClara: '#f3f4f6', label: 'Registro', icon: FileText },
};

function getEventConfig(type: string) {
  return eventTypeConfig[type] || eventTypeConfig.default;
}

export function Prontuario() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'timeline' | 'documentos' | 'medicamentos'>('timeline');
  const [isRecording, setIsRecording] = useState(false);
  const [showNovoRegistro, setShowNovoRegistro] = useState(false);

  // Data states
  const [patient, setPatient] = useState<Patient | null>(null);
  const [events, setEvents] = useState<EhrEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState('evolution');
  const [formContent, setFormContent] = useState('');
  const [formSpecialty, setFormSpecialty] = useState('medicina');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Filters
  const [filterType, setFilterType] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Load patient data
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    patientsApi.getById(id)
      .then(data => {
        setPatient(data);
        setError(null);
      })
      .catch(err => {
        console.error('Error fetching patient:', err);
        setError('Paciente não encontrado');
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Load timeline events
  const loadTimeline = useCallback(async () => {
    if (!id) return;
    setEventsLoading(true);
    try {
      const data = await ehrApi.getTimeline(id, {
        type: filterType || undefined,
        limit: 50,
      });
      setEvents(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Error fetching timeline:', err);
      // If 403 or no data, just show empty
      setEvents([]);
    } finally {
      setEventsLoading(false);
    }
  }, [id, filterType]);

  useEffect(() => {
    loadTimeline();
  }, [loadTimeline]);

  // Submit new event
  const handleSubmitEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !formTitle.trim() || !formContent.trim()) return;

    setSubmitting(true);
    try {
      await ehrApi.createEvent(id, {
        type: formType,
        payload: {
          title: formTitle,
          content: formContent,
          specialty: formSpecialty,
        },
      });
      setSubmitSuccess(true);
      setTimeout(() => {
        setShowNovoRegistro(false);
        setSubmitSuccess(false);
        setFormTitle('');
        setFormContent('');
        loadTimeline(); // Refresh data
      }, 1500);
    } catch (err: any) {
      console.error('Error creating event:', err);
      alert('Erro ao salvar registro. Verifique se existe um profissional cadastrado e um atendimento ativo.');
    } finally {
      setSubmitting(false);
    }
  };

  const calcularIdade = (dataNascimento: string) => {
    if (!dataNascimento) return 0;
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#4a7c65]" />
          <p className="mt-4 text-[#7a7369]">Carregando prontuário...</p>
        </div>
      </div>
    );
  }

  // Error / not found
  if (error || !patient) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-[#e85d3f]" />
          <p className="mt-4 text-xl text-[#7a7369]">{error || 'Paciente não encontrado'}</p>
          <Link to="/pacientes" className="mt-4 inline-block text-[#4a7c65] hover:underline">
            Voltar para lista de pacientes
          </Link>
        </div>
      </div>
    );
  }

  const allergies = patient.allergies || [];
  const conditions = patient.medical_conditions || [];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link to="/pacientes" className="inline-flex items-center gap-2 text-[#7a7369] hover:text-[#4a7c65]">
        <ArrowLeft className="h-4 w-4" />
        Voltar para pacientes
      </Link>

      {/* Header do Paciente */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#4a7c65]/5 to-transparent" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start p-6">
          {/* Avatar */}
          <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4a7c65] to-[#3d6653] text-3xl font-bold text-white">
            {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>

          {/* Informações principais */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-[#2b2926]" style={{ fontFamily: 'var(--font-heading)' }}>
              {patient.name}
            </h1>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-[#7a7369]">
              {patient.birth_date && (
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {calcularIdade(patient.birth_date)} anos
                </span>
              )}
              {patient.phone && (
                <span className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {patient.phone}
                </span>
              )}
              {patient.email && (
                <span className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {patient.email}
                </span>
              )}
            </div>

            {/* Alertas médicos */}
            {(allergies.length > 0 || conditions.length > 0) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {allergies.map(alergia => (
                  <span
                    key={alergia}
                    className="inline-flex items-center gap-1 rounded-full bg-[#fde8e3] px-3 py-1 text-sm font-medium text-[#7a2b1d]"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    Alergia: {alergia}
                  </span>
                ))}
                {conditions.map(condicao => (
                  <span
                    key={condicao}
                    className="inline-flex items-center gap-1 rounded-full bg-[#fef3c7] px-3 py-1 text-sm font-medium text-[#92400e]"
                  >
                    <Heart className="h-4 w-4" />
                    {condicao}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Ações */}
          <div className="flex flex-wrap gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowNovoRegistro(true)}
              className="btn-premium"
            >
              <Plus className="h-5 w-5" />
              Novo Registro
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-secondary"
            >
              <Upload className="h-5 w-5" />
              Anexar Exame
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="card">
        <div className="flex gap-4 border-b border-[#e8e5df] px-6 pt-4">
          {(['timeline', 'documentos', 'medicamentos'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative pb-3 font-medium transition-colors ${activeTab === tab
                  ? 'text-[#4a7c65]'
                  : 'text-[#7a7369] hover:text-[#5c5650]'
                }`}
            >
              {tab === 'timeline' ? 'Timeline' : tab === 'documentos' ? 'Documentos' : 'Medicamentos'}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4a7c65]"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo das Tabs */}
      <AnimatePresence mode="wait">
        {activeTab === 'timeline' && (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Filtros */}
            <div className="card">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-[#2b2926]">Timeline do Prontuário</h3>
                  <span className="rounded-full bg-[#f0f5f3] px-3 py-1 text-xs font-medium text-[#4a7c65]">
                    {events.length} registro{events.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => loadTimeline()}
                    className="btn-icon"
                    title="Atualizar"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowFilters(!showFilters)}
                    className={`btn-icon ${showFilters ? 'bg-[#f0f5f3] text-[#4a7c65]' : ''}`}
                  >
                    <Filter className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>

              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-[#e8e5df] p-4"
                >
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: '', label: 'Todos' },
                      { value: 'consultation', label: 'Consultas' },
                      { value: 'evolution', label: 'Evoluções' },
                      { value: 'anamnesis', label: 'Anamneses' },
                      { value: 'prescription', label: 'Prescrições' },
                      { value: 'exam', label: 'Exames' },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setFilterType(opt.value)}
                        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${filterType === opt.value
                            ? 'bg-[#4a7c65] text-white'
                            : 'bg-[#f5f3ef] text-[#5c5650] hover:bg-[#e8e5df]'
                          }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Timeline Events */}
            <div className="card relative p-6">
              {/* Linha vertical orgânica */}
              <div className="absolute left-10 top-6 bottom-6 w-1 bg-gradient-to-b from-[#3b82f6] via-[#10b981] via-[#8b5cf6] to-[#f59e0b] rounded-full opacity-20" />

              {eventsLoading ? (
                <div className="py-12 text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#4a7c65]" />
                  <p className="mt-4 text-[#7a7369]">Carregando timeline...</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {events.map((event, index) => {
                    const config = getEventConfig(event.event_type);
                    const IconComponent = config.icon;
                    const data = new Date(event.created_at);
                    const payload = event.payload || {};

                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.08 }}
                        className="relative pl-16"
                      >
                        {/* Marcador na linha */}
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.08 + 0.2, type: 'spring' }}
                          className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-xl shadow-lg"
                          style={{ backgroundColor: config.cor }}
                        >
                          <IconComponent className="h-6 w-6 text-white" />
                        </motion.div>

                        {/* Card do registro */}
                        <motion.div
                          whileHover={{ x: 4 }}
                          className="rounded-2xl border-2 p-6 transition-all hover:shadow-lg"
                          style={{
                            borderColor: config.cor,
                            backgroundColor: config.corClara,
                          }}
                        >
                          {/* Header */}
                          <div className="mb-4 flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-semibold text-[#2b2926]">
                                {payload.title || config.label}
                              </h3>
                              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[#5c5650]">
                                <span className="flex items-center gap-1">
                                  <User className="h-4 w-4" />
                                  {event.professional_name || 'Profissional'}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {data.toLocaleDateString('pt-BR', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric',
                                  })}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {data.toLocaleTimeString('pt-BR', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className="rounded-full px-3 py-1 text-xs font-medium text-white"
                                style={{ backgroundColor: config.cor }}
                              >
                                {config.label}
                              </span>
                              {event.current_version > 1 && (
                                <span className="rounded-full bg-[#dbeafe] px-2 py-1 text-xs font-medium text-[#1e40af]">
                                  v{event.current_version}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Conteúdo */}
                          <div className="prose prose-sm max-w-none">
                            <p className="text-[#2b2926] whitespace-pre-wrap">{payload.content || '—'}</p>
                          </div>

                          {/* Specialty badge */}
                          {payload.specialty && (
                            <div className="mt-3">
                              <span className="rounded-full bg-white/60 px-3 py-1 text-xs font-medium text-[#5c5650]">
                                {payload.specialty}
                              </span>
                            </div>
                          )}
                        </motion.div>
                      </motion.div>
                    );
                  })}

                  {events.length === 0 && !eventsLoading && (
                    <div className="py-12 text-center">
                      <FileText className="mx-auto h-12 w-12 text-[#d4cfc5]" />
                      <p className="mt-4 text-lg font-medium text-[#7a7369]">
                        Nenhum registro no prontuário ainda
                      </p>
                      <p className="mt-1 text-sm text-[#a8a199]">
                        Clique em "Novo Registro" para adicionar o primeiro registro
                      </p>
                      <button
                        onClick={() => setShowNovoRegistro(true)}
                        className="btn-primary mt-6"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar primeiro registro
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'documentos' && (
          <motion.div
            key="documentos"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card"
          >
            <div className="p-8 text-center">
              <FilePlus className="mx-auto h-12 w-12 text-[#d4cfc5]" />
              <h3 className="mt-4 text-lg font-semibold text-[#2b2926]">Documentos Clínicos</h3>
              <p className="mt-2 text-[#7a7369]">
                Gere documentos, atestados e laudos a partir dos registros do prontuário.
              </p>
              <p className="mt-1 text-sm text-[#a8a199]">
                Suporte a assinatura digital ICP-Brasil disponível.
              </p>
            </div>
          </motion.div>
        )}

        {activeTab === 'medicamentos' && (
          <motion.div
            key="medicamentos"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card"
          >
            <div className="p-8 text-center">
              <Pill className="mx-auto h-12 w-12 text-[#d4cfc5]" />
              <h3 className="mt-4 text-lg font-semibold text-[#2b2926]">Medicamentos & Alergias</h3>
              <p className="mt-2 text-[#7a7369]">
                Histórico de prescrições, alergias cadastradas e alertas de interação.
              </p>
              {allergies.length > 0 && (
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {allergies.map(a => (
                    <span key={a} className="inline-flex items-center gap-1 rounded-full bg-[#fde8e3] px-3 py-1 text-sm font-medium text-[#7a2b1d]">
                      <AlertTriangle className="h-3 w-3" />
                      {a}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Novo Registro */}
      <AnimatePresence>
        {showNovoRegistro && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#2b2926]/50 backdrop-blur-sm"
              onClick={() => !submitting && setShowNovoRegistro(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              {submitSuccess ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="py-12 text-center"
                >
                  <CheckCircle2 className="mx-auto h-16 w-16 text-[#10b981]" />
                  <h3 className="mt-4 text-2xl font-bold text-[#2b2926]">Registro Salvo!</h3>
                  <p className="mt-2 text-[#7a7369]">O registro foi adicionado ao prontuário com sucesso.</p>
                </motion.div>
              ) : (
                <>
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-[#2b2926]">
                      Novo Registro no Prontuário
                    </h2>
                    <button
                      onClick={() => setShowNovoRegistro(false)}
                      className="btn-icon"
                      disabled={submitting}
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmitEvent} className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#5c5650]">
                        Título *
                      </label>
                      <input
                        type="text"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="Ex: Consulta de Rotina, Evolução Fisioterapêutica..."
                        className="input"
                        required
                        disabled={submitting}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#5c5650]">
                          Tipo de Registro
                        </label>
                        <select
                          value={formType}
                          onChange={(e) => setFormType(e.target.value)}
                          className="input"
                          disabled={submitting}
                        >
                          <option value="consultation">Consulta</option>
                          <option value="evolution">Evolução</option>
                          <option value="anamnesis">Anamnese</option>
                          <option value="prescription">Prescrição</option>
                          <option value="exam">Exame</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#5c5650]">
                          Especialidade
                        </label>
                        <select
                          value={formSpecialty}
                          onChange={(e) => setFormSpecialty(e.target.value)}
                          className="input"
                          disabled={submitting}
                        >
                          <option value="medicina">Medicina</option>
                          <option value="fisioterapia">Fisioterapia</option>
                          <option value="odontologia">Odontologia</option>
                          <option value="psicologia">Psicologia</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <label className="text-sm font-medium text-[#5c5650]">
                          Conteúdo *
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsRecording(!isRecording)}
                          className={`btn-ghost text-sm ${isRecording ? 'text-[#e85d3f]' : ''}`}
                          disabled={submitting}
                        >
                          <Mic className={`h-4 w-4 ${isRecording ? 'animate-pulse' : ''}`} />
                          {isRecording ? 'Gravando...' : 'Gravar por voz'}
                        </button>
                      </div>
                      <textarea
                        rows={8}
                        value={formContent}
                        onChange={(e) => setFormContent(e.target.value)}
                        className="input resize-none font-mono text-sm"
                        placeholder="Digite ou grave a evolução clínica..."
                        required
                        disabled={submitting}
                      />
                      <p className="mt-2 text-xs text-[#a8a199]">
                        Use a gravação por voz para transcrição automática com IA (Fase 2)
                      </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowNovoRegistro(false)}
                        className="btn-ghost flex-1"
                        disabled={submitting}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="btn-primary flex-1 flex items-center justify-center gap-2"
                        disabled={submitting || !formTitle.trim() || !formContent.trim()}
                      >
                        {submitting ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Save className="h-5 w-5" />
                        )}
                        {submitting ? 'Salvando...' : 'Salvar Registro'}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}