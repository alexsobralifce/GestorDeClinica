import { useState } from 'react';
import { Phone, Mail, MapPin, Edit, Calendar } from 'lucide-react';
import { MobileAppBar, TabsMobile } from '../mobile';
import { motion } from 'motion/react';

export function DetalhePacienteMobile() {
  const [activeTab, setActiveTab] = useState('dados');

  // Dados de exemplo
  const paciente = {
    nome: 'Maria Silva',
    cpf: '123.456.789-00',
    idade: 45,
    dataNascimento: '15/03/1978',
    telefone: '(85) 99999-9999',
    email: 'maria.silva@email.com',
    endereco: {
      logradouro: 'Rua das Flores, 123',
      bairro: 'Centro',
      cidade: 'Fortaleza',
      estado: 'CE',
      cep: '60000-000',
    },
    convenio: {
      nome: 'Unimed',
      numero: '123456789',
      validade: '12/2026',
      status: 'Ativo',
    },
  };

  const historico = [
    {
      id: '1',
      data: '10/01/2026',
      tipo: 'Consulta',
      profissional: 'Dr. João Santos',
      especialidade: 'Cardiologia',
      diagnostico: 'Hipertensão controlada',
    },
    {
      id: '2',
      data: '15/12/2025',
      tipo: 'Exame',
      profissional: 'Laboratório CliniLab',
      especialidade: 'Análises Clínicas',
      diagnostico: 'Hemograma completo',
    },
    {
      id: '3',
      data: '20/11/2025',
      tipo: 'Consulta',
      profissional: 'Dra. Ana Costa',
      especialidade: 'Clínica Geral',
      diagnostico: 'Check-up anual',
    },
  ];

  const documentos = [
    {
      id: '1',
      nome: 'Exame de sangue - 15/01/2026',
      tipo: 'PDF',
      tamanho: '2.3 MB',
      data: 'Há 3 dias',
    },
    {
      id: '2',
      nome: 'Raio-X Tórax - 10/12/2025',
      tipo: 'IMG',
      tamanho: '4.5 MB',
      data: 'Há 1 mês',
    },
    {
      id: '3',
      nome: 'Receita Médica - 05/11/2025',
      tipo: 'PDF',
      tamanho: '850 KB',
      data: 'Há 2 meses',
    },
  ];

  const tabs = [
    { id: 'dados', label: 'Dados' },
    { id: 'historico', label: 'Histórico' },
    { id: 'documentos', label: 'Documentos' },
  ];

  const getEspecialidadeColor = (especialidade: string) => {
    switch (especialidade) {
      case 'Cardiologia':
        return '#3b82f6';
      case 'Clínica Geral':
        return '#8b5cf6';
      case 'Análises Clínicas':
        return '#10b981';
      default:
        return '#4a7c65';
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* App Bar */}
      <MobileAppBar
        title={paciente.nome}
        showBack
        actions={
          <button className="mobile-app-bar-icon-btn" aria-label="Editar">
            <Edit />
          </button>
        }
      />

      {/* Header com Avatar e Info Principal */}
      <div className="bg-white px-4 py-6 border-b border-[#e8e5df]">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#4a7c65] to-[#3d6653] flex items-center justify-center text-white text-2xl font-bold mb-4">
            MS
          </div>
          <h1 className="text-2xl font-bold text-[#2b2926] mb-1">{paciente.nome}</h1>
          <div className="text-sm text-[#7a7369]">CPF: {paciente.cpf}</div>
        </div>
      </div>

      {/* Tabs */}
      <TabsMobile tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'dados' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Informações Pessoais */}
            <section className="bg-white rounded-xl p-4">
              <h3 className="text-base font-semibold text-[#2b2926] mb-4">
                Informações Pessoais
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#f5f3ef] flex items-center justify-center flex-shrink-0">
                    <Calendar size={20} className="text-[#4a7c65]" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-[#7a7369]">Idade</div>
                    <div className="text-base text-[#2b2926]">
                      {paciente.idade} anos • {paciente.dataNascimento}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#f5f3ef] flex items-center justify-center flex-shrink-0">
                    <Phone size={20} className="text-[#4a7c65]" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-[#7a7369]">Telefone</div>
                    <a
                      href={`tel:${paciente.telefone}`}
                      className="text-base text-[#4a7c65] underline"
                    >
                      {paciente.telefone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#f5f3ef] flex items-center justify-center flex-shrink-0">
                    <Mail size={20} className="text-[#4a7c65]" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-[#7a7369]">Email</div>
                    <a
                      href={`mailto:${paciente.email}`}
                      className="text-base text-[#4a7c65] underline"
                    >
                      {paciente.email}
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* Convênio */}
            <section className="bg-white rounded-xl p-4">
              <h3 className="text-base font-semibold text-[#2b2926] mb-4">Convênio</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-base font-semibold text-[#2b2926]">
                      {paciente.convenio.nome}
                    </div>
                    <div className="text-sm text-[#7a7369]">
                      Nº {paciente.convenio.numero}
                    </div>
                  </div>
                  <span className="text-xs bg-[#10b981]/10 text-[#10b981] px-3 py-1 rounded-full font-medium">
                    {paciente.convenio.status}
                  </span>
                </div>
                <div className="text-sm text-[#7a7369]">
                  Validade: {paciente.convenio.validade}
                </div>
                <button className="btn-secondary btn-mobile-full text-sm">
                  Verificar Elegibilidade
                </button>
              </div>
            </section>

            {/* Endereço */}
            <section className="bg-white rounded-xl p-4">
              <h3 className="text-base font-semibold text-[#2b2926] mb-4">Endereço</h3>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#f5f3ef] flex items-center justify-center flex-shrink-0">
                  <MapPin size={20} className="text-[#4a7c65]" />
                </div>
                <div className="flex-1">
                  <div className="text-base text-[#2b2926]">
                    {paciente.endereco.logradouro}
                  </div>
                  <div className="text-sm text-[#7a7369]">
                    {paciente.endereco.bairro}, {paciente.endereco.cidade} -{' '}
                    {paciente.endereco.estado}
                  </div>
                  <div className="text-sm text-[#7a7369]">CEP: {paciente.endereco.cep}</div>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {activeTab === 'historico' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {historico.map((evento, index) => (
              <div
                key={evento.id}
                className="bg-white rounded-xl p-4"
                style={{
                  borderLeft: `4px solid ${getEspecialidadeColor(evento.especialidade)}`,
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="text-sm text-[#7a7369]">{evento.data}</div>
                  <span className="text-xs bg-[#f5f3ef] text-[#5c5650] px-2 py-1 rounded-md">
                    {evento.tipo}
                  </span>
                </div>
                <div className="text-base font-semibold text-[#2b2926] mb-1">
                  {evento.profissional}
                </div>
                <div
                  className="text-sm mb-2"
                  style={{ color: getEspecialidadeColor(evento.especialidade) }}
                >
                  {evento.especialidade}
                </div>
                <div className="text-sm text-[#7a7369]">{evento.diagnostico}</div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'documentos' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            {documentos.map((doc) => (
              <div key={doc.id} className="bg-white rounded-xl p-4 flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    doc.tipo === 'PDF'
                      ? 'bg-[#e85d3f]/10 text-[#e85d3f]'
                      : 'bg-[#3b82f6]/10 text-[#3b82f6]'
                  }`}
                >
                  <span className="text-xs font-bold">{doc.tipo}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[#2b2926] mb-1 truncate">
                    {doc.nome}
                  </div>
                  <div className="text-xs text-[#7a7369]">
                    {doc.tamanho} • {doc.data}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Bottom Actions - Sticky */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e8e5df] p-4 pb-safe">
        <div className="flex gap-3">
          <button className="btn-primary flex-1">Agendar Consulta</button>
          <button className="btn-secondary w-12 h-12 flex items-center justify-center">
            <Phone size={20} />
          </button>
        </div>
      </div>

      {/* Espaço para os botões fixos */}
      <div className="h-20" />
    </div>
  );
}
