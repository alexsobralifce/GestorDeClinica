import { useState } from 'react';
import { Save, Mic, ChevronDown, ChevronUp, Plus, X } from 'lucide-react';
import {
  MobileAppBar,
  TabsMobile,
  BottomSheet,
  FAB,
} from '../mobile';
import { motion, AnimatePresence } from 'framer-motion';

export function ProntuarioMobile() {
  const [activeTab, setActiveTab] = useState('anamnese');
  const [isRecording, setIsRecording] = useState(false);
  const [expandedSections, setExpandedSections] = useState(['queixa']);
  const [lastSaved, setLastSaved] = useState('há 2 min');

  const paciente = {
    nome: 'Maria Silva',
    idade: 45,
    id: '12345',
  };

  const tabs = [
    { id: 'anamnese', label: 'Anamnese' },
    { id: 'evolucao', label: 'Evolução' },
    { id: 'prescricao', label: 'Prescrição' },
    { id: 'atestados', label: 'Atestados' },
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleVoiceInput = () => {
    setIsRecording(true);
    // Simular gravação
    setTimeout(() => {
      setIsRecording(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* App Bar */}
      <MobileAppBar
        title={paciente.nome}
        showBack
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#10b981] flex items-center gap-1">
              <span className="w-2 h-2 bg-[#10b981] rounded-full"></span>
              Salvo {lastSaved}
            </span>
          </div>
        }
      />

      {/* Tabs */}
      <TabsMobile tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Content */}
      <div className="pb-24">
        {activeTab === 'anamnese' && (
          <AnamneseTab
            expandedSections={expandedSections}
            toggleSection={toggleSection}
            onVoiceInput={handleVoiceInput}
          />
        )}

        {activeTab === 'evolucao' && <EvolucaoTab />}

        {activeTab === 'prescricao' && <PrescricaoTab />}

        {activeTab === 'atestados' && <AtestadosTab />}
      </div>

      {/* Voice Recording Modal */}
      <AnimatePresence>
        {isRecording && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[3000]"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed inset-0 m-auto w-[90%] max-w-sm h-[200px] bg-white rounded-2xl p-6 z-[3001] flex flex-col items-center justify-center"
            >
              <div className="w-16 h-16 bg-[#e85d3f] rounded-full flex items-center justify-center mb-4 animate-pulse">
                <Mic size={32} className="text-white" />
              </div>
              <div className="text-lg font-semibold text-[#2b2926] mb-2">Gravando...</div>
              <div className="text-sm text-[#7a7369] mb-4">00:03</div>
              <button
                onClick={() => setIsRecording(false)}
                className="btn-secondary"
              >
                Parar Gravação
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* FAB */}
      <FAB onClick={() => {}} icon={<Save />} label="Salvar" variant="extended" />
    </div>
  );
}

// ==================== TAB: ANAMNESE ====================
interface AnamnseTabProps {
  expandedSections: string[];
  toggleSection: (id: string) => void;
  onVoiceInput: () => void;
}

function AnamneseTab({ expandedSections, toggleSection, onVoiceInput }: AnamnseTabProps) {
  const sections = [
    {
      id: 'queixa',
      title: 'Queixa Principal',
      content: (
        <div className="space-y-4">
          <div>
            <label className="field-label">Descrição da Queixa</label>
            <div className="relative">
              <textarea
                className="input-field min-h-[96px]"
                placeholder="Descreva a queixa principal do paciente..."
                defaultValue="Paciente relata dor no peito há 3 dias"
              />
              <button
                onClick={onVoiceInput}
                className="absolute bottom-3 right-3 w-10 h-10 bg-[#4a7c65] rounded-full flex items-center justify-center"
                aria-label="Gravar áudio"
              >
                <Mic size={20} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'hda',
      title: 'História da Doença Atual',
      content: (
        <div className="space-y-4">
          <div>
            <label className="field-label">Quando iniciou?</label>
            <input type="text" className="input-field" placeholder="Ex: Há 3 dias" />
          </div>
          <div>
            <label className="field-label">Características</label>
            <textarea
              className="input-field min-h-[96px]"
              placeholder="Descreva características, intensidade, fatores de melhora/piora..."
            />
          </div>
        </div>
      ),
    },
    {
      id: 'antecedentes',
      title: 'Antecedentes',
      content: (
        <div className="space-y-4">
          <div>
            <label className="field-label">Doenças Prévias</label>
            <div className="space-y-2">
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-6 h-6" />
                <span>Hipertensão</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-6 h-6" />
                <span>Diabetes</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-6 h-6" />
                <span>Cardiopatia</span>
              </label>
            </div>
          </div>
          <div>
            <label className="field-label">Medicações em Uso</label>
            <textarea className="input-field min-h-[96px]" />
          </div>
        </div>
      ),
    },
    {
      id: 'exame-fisico',
      title: 'Exame Físico',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label">PA</label>
              <input type="text" className="input-field" placeholder="120/80" />
            </div>
            <div>
              <label className="field-label">FC</label>
              <input type="text" className="input-field" placeholder="72 bpm" />
            </div>
            <div>
              <label className="field-label">Temp</label>
              <input type="text" className="input-field" placeholder="36.5°C" />
            </div>
            <div>
              <label className="field-label">SpO2</label>
              <input type="text" className="input-field" placeholder="98%" />
            </div>
          </div>
          <div>
            <label className="field-label">Observações</label>
            <textarea className="input-field min-h-[96px]" />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 space-y-3">
      {sections.map((section) => {
        const isExpanded = expandedSections.includes(section.id);
        return (
          <div key={section.id} className="bg-white rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full p-4 flex items-center justify-between"
            >
              <span className="text-base font-semibold text-[#2b2926]">{section.title}</span>
              {isExpanded ? (
                <ChevronUp size={20} className="text-[#7a7369]" />
              ) : (
                <ChevronDown size={20} className="text-[#7a7369]" />
              )}
            </button>
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-[#e8e5df]"
                >
                  <div className="p-4">{section.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// ==================== TAB: EVOLUÇÃO ====================
function EvolucaoTab() {
  const [showNovaEvolucao, setShowNovaEvolucao] = useState(false);

  const evolucoes = [
    {
      id: '1',
      data: '15/01/2026 14:30',
      subjetivo: 'Paciente relata melhora da dor após início do tratamento',
      objetivo: 'PA: 120/80, FC: 72bpm, ausculta pulmonar limpa',
      avaliacao: 'Evolução clínica favorável',
      plano: 'Manter tratamento atual, retorno em 7 dias',
      cid: 'I10 - Hipertensão essencial',
    },
  ];

  return (
    <div className="p-4 space-y-4">
      <button
        onClick={() => setShowNovaEvolucao(true)}
        className="btn-primary btn-mobile-full"
      >
        <Plus size={20} />
        Nova Evolução
      </button>

      {/* Lista de Evoluções */}
      <div className="space-y-3">
        {evolucoes.map((evolucao) => (
          <div key={evolucao.id} className="bg-white rounded-xl p-4 border-l-4 border-[#4a7c65]">
            <div className="text-sm text-[#7a7369] mb-3">{evolucao.data}</div>

            <div className="space-y-3">
              <div>
                <div className="text-xs font-semibold text-[#7a7369] uppercase tracking-wide mb-1">
                  Subjetivo
                </div>
                <div className="text-sm text-[#2b2926]">{evolucao.subjetivo}</div>
              </div>

              <div>
                <div className="text-xs font-semibold text-[#7a7369] uppercase tracking-wide mb-1">
                  Objetivo
                </div>
                <div className="text-sm text-[#2b2926]">{evolucao.objetivo}</div>
              </div>

              <div>
                <div className="text-xs font-semibold text-[#7a7369] uppercase tracking-wide mb-1">
                  Avaliação
                </div>
                <div className="text-sm text-[#2b2926]">{evolucao.avaliacao}</div>
              </div>

              <div>
                <div className="text-xs font-semibold text-[#7a7369] uppercase tracking-wide mb-1">
                  Plano
                </div>
                <div className="text-sm text-[#2b2926]">{evolucao.plano}</div>
              </div>

              <div className="pt-2 border-t border-[#e8e5df]">
                <span className="text-xs bg-[#f5f3ef] text-[#5c5650] px-2 py-1 rounded-md">
                  {evolucao.cid}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== TAB: PRESCRIÇÃO ====================
function PrescricaoTab() {
  const [medicamentos, setMedicamentos] = useState([
    {
      id: '1',
      nome: 'Losartana',
      dosagem: '50mg',
      via: 'Oral',
      frequencia: '1x/dia',
      duracao: '30 dias',
    },
  ]);

  const removeMedicamento = (id: string) => {
    setMedicamentos((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="p-4 space-y-4">
      <button className="btn-primary btn-mobile-full">
        <Plus size={20} />
        Adicionar Medicamento
      </button>

      {/* Lista de Medicamentos */}
      <div className="space-y-3">
        {medicamentos.map((med, index) => (
          <motion.div
            key={med.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-white rounded-xl p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="text-base font-semibold text-[#2b2926] mb-1">{med.nome}</div>
                <div className="text-sm text-[#7a7369]">{med.dosagem}</div>
              </div>
              <button
                onClick={() => removeMedicamento(med.id)}
                className="w-8 h-8 rounded-full bg-[#e85d3f]/10 flex items-center justify-center"
                aria-label="Remover"
              >
                <X size={16} className="text-[#e85d3f]" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-[#7a7369]">Via:</span>
                <span className="ml-2 text-[#2b2926]">{med.via}</span>
              </div>
              <div>
                <span className="text-[#7a7369]">Frequência:</span>
                <span className="ml-2 text-[#2b2926]">{med.frequencia}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[#7a7369]">Duração:</span>
                <span className="ml-2 text-[#2b2926]">{med.duracao}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {medicamentos.length > 0 && (
        <div className="space-y-2 pt-4">
          <button className="btn-secondary btn-mobile-full">Visualizar Receita</button>
          <button className="btn-primary btn-mobile-full">Assinar e Enviar</button>
        </div>
      )}
    </div>
  );
}

// ==================== TAB: ATESTADOS ====================
function AtestadosTab() {
  const templates = [
    {
      id: 'medico',
      titulo: 'Atestado Médico',
      descricao: 'Afastamento por motivo de saúde',
      icon: '📄',
    },
    {
      id: 'comparecimento',
      titulo: 'Declaração de Comparecimento',
      descricao: 'Comprovante de presença na consulta',
      icon: '✓',
    },
    {
      id: 'acompanhante',
      titulo: 'Atestado de Acompanhante',
      descricao: 'Para acompanhante de paciente',
      icon: '👥',
    },
  ];

  return (
    <div className="p-4">
      <h3 className="text-base font-semibold text-[#2b2926] mb-4">Selecione o tipo:</h3>
      <div className="grid grid-cols-2 gap-3">
        {templates.map((template) => (
          <button
            key={template.id}
            className="bg-white rounded-xl p-4 border border-[#e8e5df] text-left hover:border-[#4a7c65] transition-colors"
          >
            <div className="text-3xl mb-2">{template.icon}</div>
            <div className="text-sm font-semibold text-[#2b2926] mb-1">{template.titulo}</div>
            <div className="text-xs text-[#7a7369]">{template.descricao}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
