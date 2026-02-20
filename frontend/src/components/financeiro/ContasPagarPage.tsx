import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard, Plus, Filter, DollarSign, AlertTriangle,
  Clock, CheckCircle, Trash2, Check, X,
  Calendar, RefreshCw, Building2,
} from 'lucide-react';
import { accountsApi, AccountPayable, AccountsDashboard } from '../../lib/api/accounts';
import { useDevice } from '../../contexts/DeviceContext';
import { FinanceiroMobile } from '../mobile/FinanceiroMobile';
import { FluxoCaixaProvider } from '../../lib/contexts/FluxoCaixaContext';

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  pending: { label: 'Pendente', className: 'bg-amber-100 text-amber-800' },
  scheduled: { label: 'Agendado', className: 'bg-blue-100 text-blue-800' },
  paid: { label: 'Pago', className: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelado', className: 'bg-gray-100 text-gray-600' },
  renegotiated: { label: 'Renegociado', className: 'bg-purple-100 text-purple-800' },
};

const CREDITOR_TYPE_LABELS: Record<string, string> = {
  supplier: 'Fornecedor',
  professional: 'Profissional',
  government: 'Governo/Imposto',
  other: 'Outro',
};

const PAYMENT_METHODS = ['pix', 'transferencia', 'boleto', 'cartao', 'dinheiro', 'cheque'];
const PAYMENT_METHOD_LABELS: Record<string, string> = {
  pix: 'PIX', transferencia: 'Transferência', boleto: 'Boleto',
  cartao: 'Cartão', dinheiro: 'Dinheiro', cheque: 'Cheque',
};

function formatCurrency(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v ?? 0);
}
function formatDate(d: string | null | undefined) {
  if (!d) return '—';
  return new Date(d + 'T12:00:00').toLocaleDateString('pt-BR');
}
function isOverdue(dueDate: string, status: string) {
  return status === 'pending' && new Date(dueDate) < new Date(new Date().toDateString());
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KPICard({ title, value, icon: Icon, color, subtitle }: {
  title: string; value: number; icon: any; color: string; subtitle?: string;
}) {
  const colorMap: Record<string, string> = {
    primary: 'from-[#4a7c65] to-[#3d6653]',
    danger: 'from-[#e85d3f] to-[#d54426]',
    warning: 'from-[#f59e0b] to-[#d97706]',
    info: 'from-[#6b9dd8] to-[#4a7cc8]',
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="card hover:shadow-lg transition-all cursor-default"
    >
      <div className="card-content">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-[#7a7369] mb-2">{title}</p>
            <p className="text-2xl font-bold text-[#2b2926]">{formatCurrency(value)}</p>
            {subtitle && <p className="text-xs text-[#7a7369] mt-1">{subtitle}</p>}
          </div>
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${colorMap[color]}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Modal: Novo Pagamento ─────────────────────────────────────────────────────
function NovaContaModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    creditor_name: '', creditor_document: '', creditor_type: 'supplier',
    original_amount: '', due_date: '', category_id: '', is_recurring: false,
    frequency: 'monthly', notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.creditor_name || !form.original_amount || !form.due_date) {
      setError('Preencha credor, valor e vencimento.');
      return;
    }
    setSaving(true);
    try {
      await accountsApi.createPayable({
        creditor_name: form.creditor_name,
        creditor_document: form.creditor_document,
        creditor_type: form.creditor_type as any,
        original_amount: parseFloat(form.original_amount),
        due_date: form.due_date,
        category_id: form.category_id || undefined,
        is_recurring: form.is_recurring,
        frequency: form.is_recurring ? form.frequency as any : undefined,
        notes: form.notes,
        requires_approval: false,
      });
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-[#2b2926]/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-8 shadow-2xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#2b2926]">Nova Conta a Pagar</h2>
          <button onClick={onClose} className="btn-icon"><X className="h-5 w-5" /></button>
        </div>
        {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="field-label">Credor *</label>
              <input type="text" className="input-field" placeholder="Nome do credor ou fornecedor"
                value={form.creditor_name} onChange={e => setForm(f => ({ ...f, creditor_name: e.target.value }))} />
            </div>
            <div>
              <label className="field-label">Tipo de Credor</label>
              <select className="input-field" value={form.creditor_type}
                onChange={e => setForm(f => ({ ...f, creditor_type: e.target.value }))}>
                {Object.entries(CREDITOR_TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">CPF/CNPJ</label>
              <input type="text" className="input-field" placeholder="Documento"
                value={form.creditor_document} onChange={e => setForm(f => ({ ...f, creditor_document: e.target.value }))} />
            </div>
            <div>
              <label className="field-label">Valor *</label>
              <input type="number" step="0.01" min="0" className="input-field" placeholder="0,00"
                value={form.original_amount} onChange={e => setForm(f => ({ ...f, original_amount: e.target.value }))} />
            </div>
            <div>
              <label className="field-label">Vencimento *</label>
              <input type="date" className="input-field"
                value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="recurring" checked={form.is_recurring}
              onChange={e => setForm(f => ({ ...f, is_recurring: e.target.checked }))}
              className="h-4 w-4 rounded border-[#e8e5df]" />
            <label htmlFor="recurring" className="text-sm text-[#5c5650]">Pagamento recorrente</label>
          </div>
          {form.is_recurring && (
            <div>
              <label className="field-label">Frequência</label>
              <select className="input-field" value={form.frequency}
                onChange={e => setForm(f => ({ ...f, frequency: e.target.value }))}>
                <option value="monthly">Mensal</option>
                <option value="quarterly">Trimestral</option>
                <option value="yearly">Anual</option>
              </select>
            </div>
          )}
          <div>
            <label className="field-label">Observações</label>
            <textarea className="input-field" rows={2} placeholder="Observações opcionais..."
              value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 bg-white border-2 border-[#e8e5df] rounded-xl font-semibold text-[#5c5650] hover:bg-[#f5f3ef] hover:border-[#d4cfc5] transition-all shadow-sm">Cancelar</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </motion.div>
    </>
  );
}

// ─── Modal: Registrar Pagamento ────────────────────────────────────────────────
function PagarModal({ conta, onClose, onSaved }: { conta: AccountPayable; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ paid_amount: String(conta.original_amount - conta.paid_amount), payment_method: 'pix', payment_date: new Date().toISOString().slice(0, 10) });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await accountsApi.payAccount(conta.id, {
        paid_amount: parseFloat(form.paid_amount),
        payment_method: form.payment_method,
        payment_date: form.payment_date,
      });
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Erro ao registrar pagamento');
    } finally { setSaving(false); }
  };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-[#2b2926]/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-8 shadow-2xl"
      >
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#2b2926]">Registrar Pagamento</h2>
          <p className="text-sm text-[#7a7369] mt-1">{conta.creditor_name}</p>
        </div>
        {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="field-label">Valor Pago</label>
            <input type="number" step="0.01" min="0" className="input-field"
              value={form.paid_amount} onChange={e => setForm(f => ({ ...f, paid_amount: e.target.value }))} />
            <p className="text-xs text-[#7a7369] mt-1">Restante: {formatCurrency(conta.original_amount - conta.paid_amount)}</p>
          </div>
          <div>
            <label className="field-label">Forma de Pagamento</label>
            <select className="input-field" value={form.payment_method}
              onChange={e => setForm(f => ({ ...f, payment_method: e.target.value }))}>
              {PAYMENT_METHODS.map(m => <option key={m} value={m}>{PAYMENT_METHOD_LABELS[m]}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">Data do Pagamento</label>
            <input type="date" className="input-field"
              value={form.payment_date} onChange={e => setForm(f => ({ ...f, payment_date: e.target.value }))} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 bg-white border-2 border-[#e8e5df] rounded-xl font-semibold text-[#5c5650] hover:bg-[#f5f3ef] hover:border-[#d4cfc5] transition-all shadow-sm">Cancelar</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Salvando...' : 'Confirmar Pagamento'}
            </button>
          </div>
        </form>
      </motion.div>
    </>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export function ContasPagarPage() {
  const { isMobile } = useDevice();

  if (isMobile) {
    return (
      <FluxoCaixaProvider>
        <FinanceiroMobile initialTab="pagar" />
      </FluxoCaixaProvider>
    );
  }

  const [contas, setContas] = useState<AccountPayable[]>([]);
  const [dashboard, setDashboard] = useState<AccountsDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showNova, setShowNova] = useState(false);
  const [pagarModal, setPagarModal] = useState<AccountPayable | null>(null);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [list, dash] = await Promise.all([
        accountsApi.getPayable(statusFilter ? { status: statusFilter } : undefined),
        accountsApi.getPayableDashboard(),
      ]);
      setContas(list);
      setDashboard(dash);
    } catch { /* handled by showing empty state */ }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [statusFilter]);

  const filtered = contas.filter(c =>
    c.creditor_name.toLowerCase().includes(search.toLowerCase()) ||
    (c.notes || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="heading-primary mb-0">Contas a Pagar</h1>
          <p className="text-muted mt-2">Gestão de pagamentos, fornecedores e despesas</p>
        </div>
        <div className="cluster-lg">
          <button onClick={load} className="btn-secondary">
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </button>
          <button onClick={() => setShowNova(true)} className="btn-premium">
            <Plus className="h-5 w-5" />
            Nova Conta
          </button>
        </div>
      </div>

      {/* KPIs */}
      {dashboard && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard title="Total em Aberto" value={dashboard.total_open} icon={DollarSign} color="primary" />
          <KPICard title="Em Atraso" value={dashboard.total_overdue} icon={AlertTriangle} color="danger"
            subtitle={`${dashboard.overdue_count} conta(s) vencida(s)`} />
          <KPICard title="Vence Hoje" value={dashboard.due_today} icon={Clock} color="warning" />
          <KPICard title="Próximos 7 dias" value={dashboard.due_next_7_days} icon={Calendar} color="info" />
        </div>
      )}

      {/* Filters */}
      <div className="card">
        <div className="card-content">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7a7369]" />
              <input type="text" placeholder="Buscar credor..." value={search}
                onChange={e => setSearch(e.target.value)} className="input-field pl-10" />
            </div>
            <div className="flex flex-wrap gap-2">
              {[['', 'Todos'], ['pending', 'Pendentes'], ['paid', 'Pagos'], ['cancelled', 'Cancelados']].map(([v, l]) => (
                <button key={v} onClick={() => setStatusFilter(v)}
                  className={`btn-filter ${statusFilter === v ? 'active' : ''}`}>{l}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-10 h-10 border-4 border-[#4a7c65] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <CreditCard className="h-12 w-12 text-[#d4cfc5] mb-3" />
            <p className="text-[#7a7369]">Nenhuma conta encontrada</p>
            <button onClick={() => setShowNova(true)} className="btn-primary mt-4">
              <Plus className="h-4 w-4" /> Cadastrar conta
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f5f3ef] border-b-2 border-[#e8e5df]">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#5c5650]">Credor</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#5c5650]">Tipo</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#5c5650]">Vencimento</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-[#5c5650]">Valor</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-[#5c5650]">Pago</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-[#5c5650]">Status</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-[#5c5650]">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((conta, idx) => {
                  const overdue = isOverdue(conta.due_date, conta.status);
                  const st = STATUS_LABELS[conta.status] || { label: conta.status, className: 'bg-gray-100 text-gray-600' };
                  return (
                    <motion.tr key={conta.id}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className={`border-b border-[#e8e5df] hover:bg-[#faf9f7] transition-colors ${overdue ? 'bg-red-50/30' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e85d3f]/10">
                            <Building2 className="h-4 w-4 text-[#e85d3f]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#2b2926]">{conta.creditor_name}</p>
                            {conta.is_recurring && (
                              <span className="text-xs text-[#7a7369]">
                                <RefreshCw className="h-3 w-3 inline mr-1" />
                                {conta.frequency === 'monthly' ? 'Mensal' : conta.frequency === 'quarterly' ? 'Trimestral' : 'Anual'}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-[#5c5650]">
                          {CREDITOR_TYPE_LABELS[conta.creditor_type] || conta.creditor_type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm ${overdue ? 'text-[#e85d3f] font-medium' : 'text-[#2b2926]'}`}>
                          {overdue && <AlertTriangle className="h-3 w-3 inline mr-1" />}
                          {formatDate(conta.due_date)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-bold text-[#2b2926]">{formatCurrency(conta.original_amount)}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm text-[#4a7c65]">{formatCurrency(conta.paid_amount)}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${st.className}`}>
                          {conta.status === 'paid' ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                          {st.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {conta.status === 'pending' || conta.status === 'scheduled' ? (
                            <button
                              onClick={() => setPagarModal(conta)}
                              className="btn-icon-sm bg-[#4a7c65]/10 hover:bg-[#4a7c65]/20"
                              title="Registrar pagamento"
                            >
                              <Check className="h-4 w-4 text-[#4a7c65]" />
                            </button>
                          ) : null}
                          {conta.status !== 'paid' && conta.status !== 'cancelled' && (
                            <button
                              onClick={async () => { await accountsApi.cancelPayable(conta.id); load(); }}
                              className="btn-icon-sm hover:bg-[#fde8e3]"
                              title="Cancelar"
                            >
                              <Trash2 className="h-4 w-4 text-[#e85d3f]" />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showNova && <NovaContaModal onClose={() => setShowNova(false)} onSaved={load} />}
        {pagarModal && <PagarModal conta={pagarModal} onClose={() => setPagarModal(null)} onSaved={load} />}
      </AnimatePresence>
    </div>
  );
}
