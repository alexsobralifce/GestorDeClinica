import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, DollarSign, CreditCard, Wallet, Smartphone } from 'lucide-react';
import { useFluxoCaixa } from '../../lib/contexts/FluxoCaixaContext';
import { useAgendamentos } from '../../lib/AgendamentoContext';

interface PagamentoConsultaModalProps {
  isOpen: boolean;
  onClose: () => void;
  agendamento: {
    id: string;
    pacienteId: string;
    pacienteNome: string;
    profissionalId: string;
    profissionalNome: string;
    data: string;
    tipo: string;
  };
}

export function PagamentoConsultaModal({
  isOpen,
  onClose,
  agendamento,
}: PagamentoConsultaModalProps) {
  const { registrarPagamentoConsulta } = useFluxoCaixa();
  const { updateAgendamento } = useAgendamentos();
  
  const [formData, setFormData] = useState({
    valor: '',
    formaPagamento: 'dinheiro',
    observacoes: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const formasPagamento = [
    { value: 'dinheiro', label: 'Dinheiro', icon: Wallet },
    { value: 'debito', label: 'Cartão Débito', icon: CreditCard },
    { value: 'credito', label: 'Cartão Crédito', icon: CreditCard },
    { value: 'pix', label: 'PIX', icon: Smartphone },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.valor || parseFloat(formData.valor) <= 0) {
      return;
    }

    setLoading(true);

    try {
      // Registrar pagamento no fluxo de caixa
      await registrarPagamentoConsulta({
        agendamentoId: agendamento.id,
        pacienteId: agendamento.pacienteId,
        profissionalId: agendamento.profissionalId,
        valor: parseFloat(formData.valor),
        formaPagamento: formData.formaPagamento,
        observacoes: formData.observacoes,
      });

      // Atualizar status do agendamento para concluído
      updateAgendamento(agendamento.id, { status: 'concluido' });

      setSucesso(true);
      
      setTimeout(() => {
        setLoading(false);
        setSucesso(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Erro ao registrar pagamento:', error);
      setLoading(false);
    }
  };

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formatted = (parseFloat(value) / 100).toFixed(2);
    setFormData(prev => ({ ...prev, valor: formatted }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl"
        >
          {sucesso ? (
            <div className="p-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5 }}
                className="flex justify-center mb-6"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#4a7c65]">
                  <DollarSign className="h-10 w-10 text-white" />
                </div>
              </motion.div>
              <h2
                className="text-2xl font-bold text-[#2b2926] mb-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Pagamento Registrado!
              </h2>
              <p className="text-[#7a7369]">
                O valor foi lançado no fluxo de caixa com sucesso
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b-2 border-[#e8e5df]">
                <div>
                  <h2
                    className="text-2xl font-bold text-[#2b2926]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Registrar Pagamento
                  </h2>
                  <p className="text-sm text-[#7a7369] mt-1">
                    {agendamento.pacienteNome} • {agendamento.profissionalNome}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-[#f5f3ef] transition-colors"
                >
                  <X className="h-5 w-5 text-[#7a7369]" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Valor */}
                <div>
                  <label className="block text-sm font-medium text-[#2b2926] mb-2">
                    Valor *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a7369] font-medium">
                      R$
                    </span>
                    <input
                      type="text"
                      value={formData.valor}
                      onChange={handleValorChange}
                      placeholder="0,00"
                      className="input-field pl-12 text-2xl font-bold"
                      required
                    />
                  </div>
                </div>

                {/* Forma de Pagamento */}
                <div>
                  <label className="block text-sm font-medium text-[#2b2926] mb-3">
                    Forma de Pagamento *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {formasPagamento.map((forma) => {
                      const Icon = forma.icon;
                      return (
                        <button
                          key={forma.value}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, formaPagamento: forma.value }))
                          }
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                            formData.formaPagamento === forma.value
                              ? 'border-[#4a7c65] bg-[#f0f5f3]'
                              : 'border-[#e8e5df] hover:border-[#4a7c65]/50'
                          }`}
                        >
                          <Icon
                            className={`h-5 w-5 ${
                              formData.formaPagamento === forma.value
                                ? 'text-[#4a7c65]'
                                : 'text-[#7a7369]'
                            }`}
                          />
                          <span
                            className={`text-sm font-medium ${
                              formData.formaPagamento === forma.value
                                ? 'text-[#4a7c65]'
                                : 'text-[#5c5650]'
                            }`}
                          >
                            {forma.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Observações */}
                <div>
                  <label className="block text-sm font-medium text-[#2b2926] mb-2">
                    Observações (opcional)
                  </label>
                  <textarea
                    value={formData.observacoes}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, observacoes: e.target.value }))
                    }
                    rows={3}
                    className="input-field"
                    placeholder="Informações adicionais sobre o pagamento..."
                  />
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 pt-4 border-t-2 border-[#e8e5df]">
                  <button type="button" onClick={onClose} className="btn-secondary">
                    Cancelar
                  </button>
                  <button type="submit" disabled={loading} className="btn-premium">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Registrando...
                      </>
                    ) : (
                      <>
                        <DollarSign className="h-5 w-5" />
                        Confirmar Pagamento
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
