import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Receipt, CreditCard, Wallet, Smartphone } from 'lucide-react';
import { useFluxoCaixa } from '../../lib/contexts/FluxoCaixaContext';

interface DespesaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DespesaModal({ isOpen, onClose }: DespesaModalProps) {
  const { registrarDespesa } = useFluxoCaixa();
  
  const [formData, setFormData] = useState({
    categoria: '',
    descricao: '',
    valor: '',
    formaPagamento: 'dinheiro',
    observacoes: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const categorias = [
    'Salários e Encargos',
    'Aluguel e Condomínio',
    'Utilidades',
    'Fornecedores',
    'Impostos',
    'Marketing',
    'Manutenção',
    'Material de Consumo',
    'Serviços de Terceiros',
    'Outros',
  ];

  const formasPagamento = [
    { value: 'dinheiro', label: 'Dinheiro', icon: Wallet },
    { value: 'debito', label: 'Cartão Débito', icon: CreditCard },
    { value: 'credito', label: 'Cartão Crédito', icon: CreditCard },
    { value: 'pix', label: 'PIX', icon: Smartphone },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.categoria || !formData.descricao || !formData.valor || parseFloat(formData.valor) <= 0) {
      return;
    }

    setLoading(true);

    try {
      await registrarDespesa({
        categoria: formData.categoria,
        descricao: formData.descricao,
        valor: parseFloat(formData.valor),
        formaPagamento: formData.formaPagamento,
        observacoes: formData.observacoes,
      });

      setSucesso(true);
      
      setTimeout(() => {
        setLoading(false);
        setSucesso(false);
        setFormData({
          categoria: '',
          descricao: '',
          valor: '',
          formaPagamento: 'dinheiro',
          observacoes: '',
        });
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Erro ao registrar despesa:', error);
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
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
        >
          {sucesso ? (
            <div className="p-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5 }}
                className="flex justify-center mb-6"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#e85d3f]">
                  <Receipt className="h-10 w-10 text-white" />
                </div>
              </motion.div>
              <h2
                className="text-2xl font-bold text-[#2b2926] mb-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Despesa Registrada!
              </h2>
              <p className="text-[#7a7369]">
                A saída foi lançada no fluxo de caixa com sucesso
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b-2 border-[#e8e5df] bg-white">
                <div>
                  <h2
                    className="text-2xl font-bold text-[#2b2926]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Nova Despesa
                  </h2>
                  <p className="text-sm text-[#7a7369] mt-1">
                    Registre uma saída de caixa
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
                {/* Categoria */}
                <div>
                  <label className="block text-sm font-medium text-[#2b2926] mb-2">
                    Categoria *
                  </label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value }))}
                    className="input-field"
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    {categorias.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Descrição */}
                <div>
                  <label className="block text-sm font-medium text-[#2b2926] mb-2">
                    Descrição *
                  </label>
                  <input
                    type="text"
                    value={formData.descricao}
                    onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                    placeholder="Ex: Pagamento fornecedor X"
                    className="input-field"
                    required
                  />
                </div>

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
                              ? 'border-[#e85d3f] bg-[#fef5f3]'
                              : 'border-[#e8e5df] hover:border-[#e85d3f]/50'
                          }`}
                        >
                          <Icon
                            className={`h-5 w-5 ${
                              formData.formaPagamento === forma.value
                                ? 'text-[#e85d3f]'
                                : 'text-[#7a7369]'
                            }`}
                          />
                          <span
                            className={`text-sm font-medium ${
                              formData.formaPagamento === forma.value
                                ? 'text-[#e85d3f]'
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
                    placeholder="Informações adicionais sobre a despesa..."
                  />
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 pt-4 border-t-2 border-[#e8e5df]">
                  <button type="button" onClick={onClose} className="btn-secondary">
                    Cancelar
                  </button>
                  <button type="submit" disabled={loading} className="btn-danger">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Registrando...
                      </>
                    ) : (
                      <>
                        <Receipt className="h-5 w-5" />
                        Confirmar Despesa
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
