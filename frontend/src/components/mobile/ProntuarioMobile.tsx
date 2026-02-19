import { useState } from 'react';
import { Save, Filter, FileText, Pill, FilePlus, RefreshCw, Calendar, Clock, User, Stethoscope, FileImage, Plus } from 'lucide-react';
import {
  MobileAppBar,
  TabsMobile,
  BottomSheet,
  FAB,
} from '../mobile';
import { motion, AnimatePresence } from 'framer-motion';
import { Patient } from '../../lib/api/patients';
import { EhrEvent } from '../../lib/api/ehr';
import { Professional } from '../../lib/api/professionals';
import { useNavigate } from 'react-router-dom';

interface ProntuarioMobileProps {
  patient: Patient;
  events: EhrEvent[];
  loading: boolean;
  onRefresh: () => void;
  onSubmitEvent: (data: any) => Promise<void>;
  professionals: Professional[];
}

// Map event_types to colors (same as desktop)
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

export function ProntuarioMobile({ patient, events, loading, onRefresh, onSubmitEvent, professionals }: ProntuarioMobileProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('timeline');
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [showNovoRegistro, setShowNovoRegistro] = useState(false);

  // New Record Form State
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState('evolution');
  const [formContent, setFormContent] = useState('');
  const [formSpecialty, setFormSpecialty] = useState('medicina');
  const [selectedProfessionalId, setSelectedProfessionalId] = useState(professionals[0]?.id || '');
  const [submitting, setSubmitting] = useState(false);

  const tabs = [
    { id: 'timeline', label: 'Timeline' },
    { id: 'documentos', label: 'Docs' },
    { id: 'medicamentos', label: 'Meds' },
  ];

  const filteredEvents = filterType
    ? events.filter(e => e.event_type === filterType)
    : events;

  const handleSubmit = async () => {
    if (!formTitle.trim() || !formContent.trim()) return;
    setSubmitting(true);
    try {
      await onSubmitEvent({
        type: formType,
        professional_id: selectedProfessionalId,
        payload: {
          title: formTitle,
          content: formContent,
          specialty: formSpecialty,
        },
      });
      setShowNovoRegistro(false);
      setFormTitle('');
      setFormContent('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] pb-nav">
      {/* App Bar */}
      <MobileAppBar
        title={patient.name}
        showBack
        onBack={() => navigate('/dashboard/pacientes')}
        actions={
          <div className="flex gap-1">
            <button
              onClick={onRefresh}
              className="mobile-app-bar-icon-btn"
            >
              <RefreshCw size={20} />
            </button>
            <button
              onClick={() => setShowFilters(true)}
              className="mobile-app-bar-icon-btn"
            >
              <Filter size={20} />
            </button>
          </div>
        }
      />

      {/* Tabs */}
      <TabsMobile tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Content */}
      <div className="p-4 space-y-4 pb-24">
        {activeTab === 'timeline' && (
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-8"><RefreshCw className="animate-spin text-[#4a7c65]" /></div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-12 text-[#7a7369]">
                <FileText className="mx-auto h-12 w-12 text-[#d4cfc5] mb-2" />
                <p>Nenhum registro encontrado</p>
              </div>
            ) : (
              filteredEvents.map((event, index) => {
                const config = getEventConfig(event.event_type);
                const IconComponent = config.icon;
                const data = new Date(event.created_at);
                const payload = event.payload || {};

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl p-4 border-l-4 shadow-sm"
                    style={{ borderLeftColor: config.cor }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-[#f5f3ef]" style={{ color: config.cor }}>
                          <IconComponent size={16} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#2b2926] text-sm">{payload.title || config.label}</h4>
                          <div className="flex items-center gap-2 text-xs text-[#7a7369]">
                            <span className="flex items-center gap-1"><Calendar size={10} /> {data.toLocaleDateString('pt-BR')}</span>
                            <span className="flex items-center gap-1"><Clock size={10} /> {data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: config.corClara, color: config.cor }}>
                        {config.label}
                      </span>
                    </div>

                    <div className="text-sm text-[#5c5650] whitespace-pre-wrap pl-2 border-l-2 border-[#f0ece5] ml-2">
                      {payload.content || '—'}
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-[#7a7369]">
                        <User size={12} />
                        {event.professional_name}
                      </div>
                      {payload.specialty && (
                        <span className="text-xs bg-[#f5f3ef] text-[#5c5650] px-2 py-1 rounded-md capitalize">
                          {payload.specialty}
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'documentos' && (
          <div className="text-center py-12 text-[#7a7369]">
            <FilePlus className="mx-auto h-12 w-12 text-[#d4cfc5] mb-2" />
            <p>Documentos Clínicos</p>
            <span className="text-xs">Em breve</span>
          </div>
        )}

        {activeTab === 'medicamentos' && (
          <div className="text-center py-12 text-[#7a7369]">
            <Pill className="mx-auto h-12 w-12 text-[#d4cfc5] mb-2" />
            <p>Medicamentos & Alergias</p>
            {(patient.allergies || []).length > 0 && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {(patient.allergies || []).map(a => (
                  <span key={a} className="inline-flex items-center gap-1 rounded-full bg-[#fde8e3] px-3 py-1 text-sm font-medium text-[#7a2b1d]">
                    {a}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* FAB */}
      <FAB onClick={() => setShowNovoRegistro(true)} icon={<Plus />} label="Novo" />

      {/* Bottom Sheet - Filters */}
      <BottomSheet
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filtrar por Tipo"
      >
        <div className="space-y-2">
          <button onClick={() => { setFilterType(''); setShowFilters(false); }} className={`w-full text-left p-3 rounded-lg ${!filterType ? 'bg-[#4a7c65]/10 text-[#4a7c65] font-semibold' : 'text-[#5c5650]'}`}>Todos</button>
          {Object.entries(eventTypeConfig).filter(([key]) => key !== 'default').map(([key, config]) => (
            <button key={key} onClick={() => { setFilterType(key); setShowFilters(false); }} className={`w-full text-left p-3 rounded-lg flex items-center gap-2 ${filterType === key ? 'bg-[#4a7c65]/10 text-[#4a7c65] font-semibold' : 'text-[#5c5650]'}`}>
              <config.icon size={16} />
              {config.label}
            </button>
          ))}
        </div>
      </BottomSheet>

      {/* Bottom Sheet - New Record */}
      <BottomSheet
        isOpen={showNovoRegistro}
        onClose={() => setShowNovoRegistro(false)}
        title="Novo Registro"
        footer={
          <button onClick={handleSubmit} disabled={submitting} className="btn-primary btn-mobile-full flex justify-center items-center gap-2">
            {submitting ? <RefreshCw size={20} className="animate-spin" /> : <Save size={20} />}
            {submitting ? 'Salvando...' : 'Salvar Registro'}
          </button>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="field-label">Título</label>
            <input type="text" className="input-field" value={formTitle} onChange={e => setFormTitle(e.target.value)} placeholder="Ex: Consulta de Rotina" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label">Tipo</label>
              <select className="input-field" value={formType} onChange={e => setFormType(e.target.value)}>
                <option value="evolution">Evolução</option>
                <option value="consultation">Consulta</option>
                <option value="anamnesis">Anamnese</option>
                <option value="prescription">Prescrição</option>
              </select>
            </div>
            <div>
              <label className="field-label">Especialidade</label>
              <select className="input-field" value={formSpecialty} onChange={e => setFormSpecialty(e.target.value)}>
                <option value="medicina">Medicina</option>
                <option value="fisioterapia">Fisioterapia</option>
                <option value="odontologia">Odontologia</option>
                <option value="psicologia">Psicologia</option>
              </select>
            </div>
          </div>

          <div>
            <label className="field-label">Profissional</label>
            <select className="input-field" value={selectedProfessionalId} onChange={e => setSelectedProfessionalId(e.target.value)}>
              {professionals.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="field-label">Conteúdo</label>
            <textarea className="input-field min-h-[150px]" value={formContent} onChange={e => setFormContent(e.target.value)} placeholder="Descreva o atendimento..." />
          </div>
        </div>
      </BottomSheet>

    </div>
  );
}
