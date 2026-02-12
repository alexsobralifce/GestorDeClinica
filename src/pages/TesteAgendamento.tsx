import { useState } from 'react';
import { Calendar, Plus, Smartphone, Monitor } from 'lucide-react';
import { NovoAgendamentoModal } from '../components/agenda/NovoAgendamentoModal';
import { NovoAgendamentoMobile } from '../components/mobile/NovoAgendamentoMobile';
import { useIsMobile } from '../hooks/useIsMobile';

export function TesteAgendamento() {
  const [showWebModal, setShowWebModal] = useState(false);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const isMobile = useIsMobile();

  const handleSuccess = () => {
    setSuccessMessage('✅ Agendamento criado com sucesso!');
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-[#4a7c65] to-[#3d6653] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Calendar size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-[#2b2926] mb-4">
            Teste de Agendamento
          </h1>
          <p className="text-lg text-[#7a7369]">
            Sistema de Gestão Clínica - Novo Agendamento
          </p>
          {isMobile && (
            <div className="mt-4 inline-flex items-center gap-2 bg-[#3b82f6]/10 text-[#3b82f6] px-4 py-2 rounded-full text-sm font-medium">
              <Smartphone size={16} />
              Modo Mobile Detectado
            </div>
          )}
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-8 bg-[#10b981]/10 border-2 border-[#10b981] text-[#10b981] px-6 py-4 rounded-xl text-center font-semibold animate-fade-in">
            {successMessage}
          </div>
        )}

        {/* Test Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Web Version */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#e8e5df]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-[#4a7c65]/10 rounded-xl flex items-center justify-center">
                <Monitor size={32} className="text-[#4a7c65]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#2b2926]">Versão Web</h2>
                <p className="text-sm text-[#7a7369]">Desktop / Tablet</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#10b981] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <div>
                  <div className="font-semibold text-[#2b2926]">Modal Centralizado</div>
                  <div className="text-sm text-[#7a7369]">Stepper horizontal com 3 etapas</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#10b981] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <div>
                  <div className="font-semibold text-[#2b2926]">Grid Layout</div>
                  <div className="text-sm text-[#7a7369]">Seleção visual de horários em grid</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#10b981] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <div>
                  <div className="font-semibold text-[#2b2926]">Animações Suaves</div>
                  <div className="text-sm text-[#7a7369]">Transições entre etapas com Motion</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#10b981] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <div>
                  <div className="font-semibold text-[#2b2926]">Validação em Tempo Real</div>
                  <div className="text-sm text-[#7a7369]">Botão "Próximo" habilitado dinamicamente</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowWebModal(true)}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Testar Versão Web
            </button>
          </div>

          {/* Mobile Version */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#e8e5df]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-[#3b82f6]/10 rounded-xl flex items-center justify-center">
                <Smartphone size={32} className="text-[#3b82f6]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#2b2926]">Versão Mobile</h2>
                <p className="text-sm text-[#7a7369]">Smartphone</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#10b981] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <div>
                  <div className="font-semibold text-[#2b2926]">Bottom Sheet Full</div>
                  <div className="text-sm text-[#7a7369]">Modal que ocupa tela inteira</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#10b981] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <div>
                  <div className="font-semibold text-[#2b2926]">Touch-Friendly</div>
                  <div className="text-sm text-[#7a7369]">Botões e áreas tocáveis {'≥'} 48px</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#10b981] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <div>
                  <div className="font-semibold text-[#2b2926]">Scroll Horizontal</div>
                  <div className="text-sm text-[#7a7369]">Date picker e horários com scroll</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#10b981] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <div>
                  <div className="font-semibold text-[#2b2926]">Safe Area Support</div>
                  <div className="text-sm text-[#7a7369]">Suporte a notch e home indicator iOS</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowMobileModal(true)}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Testar Versão Mobile
            </button>
          </div>
        </div>

        {/* Features Comparison */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#e8e5df]">
          <h3 className="text-2xl font-bold text-[#2b2926] mb-6">
            Comparação de Features
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-[#e8e5df]">
                  <th className="text-left py-3 px-4 font-semibold text-[#2b2926]">Feature</th>
                  <th className="text-center py-3 px-4 font-semibold text-[#2b2926]">Web</th>
                  <th className="text-center py-3 px-4 font-semibold text-[#2b2926]">Mobile</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Stepper de Progresso', web: true, mobile: true },
                  { feature: 'Busca de Pacientes', web: true, mobile: true },
                  { feature: 'Seleção de Data', web: true, mobile: true },
                  { feature: 'Seleção de Profissional', web: true, mobile: true },
                  { feature: 'Horários Disponíveis', web: true, mobile: true },
                  { feature: 'Confirmação WhatsApp', web: true, mobile: true },
                  { feature: 'Validação em Tempo Real', web: true, mobile: true },
                  { feature: 'Loading States', web: true, mobile: true },
                  { feature: 'Animações Suaves', web: true, mobile: true },
                  { feature: 'Responsive Design', web: true, mobile: true },
                ].map((row, index) => (
                  <tr key={index} className="border-b border-[#e8e5df]">
                    <td className="py-3 px-4 text-[#2b2926]">{row.feature}</td>
                    <td className="text-center py-3 px-4">
                      {row.web ? (
                        <span className="text-[#10b981] text-2xl">✓</span>
                      ) : (
                        <span className="text-[#e8e5df] text-2xl">−</span>
                      )}
                    </td>
                    <td className="text-center py-3 px-4">
                      {row.mobile ? (
                        <span className="text-[#10b981] text-2xl">✓</span>
                      ) : (
                        <span className="text-[#e8e5df] text-2xl">−</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-[#3b82f6]/10 rounded-2xl p-8 border border-[#3b82f6]/20">
          <h3 className="text-xl font-bold text-[#2b2926] mb-4">
            📋 Instruções de Teste
          </h3>
          <ol className="space-y-3 text-[#2b2926]">
            <li className="flex gap-3">
              <span className="font-bold text-[#3b82f6]">1.</span>
              <span>Clique em "Testar Versão Web" ou "Testar Versão Mobile"</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-[#3b82f6]">2.</span>
              <span>Siga o wizard de 3 etapas: Paciente → Horário → Confirmação</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-[#3b82f6]">3.</span>
              <span>Selecione um paciente da lista (ou busque pelo nome)</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-[#3b82f6]">4.</span>
              <span>Escolha data, profissional e horário disponível</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-[#3b82f6]">5.</span>
              <span>Revise os detalhes e confirme o agendamento</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-[#3b82f6]">6.</span>
              <span>Aguarde a simulação de 1.5s e veja a mensagem de sucesso</span>
            </li>
          </ol>
        </div>
      </div>

      {/* Modals */}
      <NovoAgendamentoModal
        isOpen={showWebModal}
        onClose={() => setShowWebModal(false)}
        onSuccess={handleSuccess}
      />

      <NovoAgendamentoMobile
        isOpen={showMobileModal}
        onClose={() => setShowMobileModal(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}