import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign, Plus, Filter, AlertTriangle, Clock,
  CheckCircle, User, Calendar, RefreshCw, X, Check,
} from 'lucide-react';
import { accountsApi, AccountReceivable, AccountsDashboard } from '../../lib/api/accounts';
import { useDevice } from '../../contexts/DeviceContext';
import { FinanceiroMobile } from '../mobile/FinanceiroMobile';
import { FluxoCaixaProvider } from '../../lib/contexts/FluxoCaixaContext';

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  pending: { label: 'Pendente', className: 'bg-amber-100 text-amber-800' },
  partial: { label: 'Parcial', className: 'bg-blue-100 text-blue-800' },
  paid: { label: 'Recebido', className: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelado', className: 'bg-gray-100 text-gray-600' },
  protested: { label: 'Protestado', className: 'bg-red-100 text-red-800' },
};

const DEBTOR_TYPE_LABELS: Record<string, string> = {
  patient: 'Paciente',
  convenio: 'Convênio',
  other: 'Outro',
};

const PAYMENT_METHODS = ['pix', 'transferencia', 'boleto', 'cartao', 'dinheiro'];
const PAYMENT_METHOD_LABELS: Record<string, string> = {
  pix: 'PIX', transferencia: 'Transferência', boleto: 'Boleto',
  cartao: 'Cartão', dinheiro: 'Dinheiro',
};

function formatCurrency(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v ?? 0);
}
function formatDate(d: string | null | undefined) {
  if (!d) return '—';
  return new Date(d + 'T12:00:00').toLocaleDateString('pt-BR');
}

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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="card hover:shadow-lg transition-all cursor-default">
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

// ─── Modal: Nova Conta a Receber ───────────────────────────────────────────────
function NovaContaModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    debtor_type: 'patient', debtor_name: '', debtor_document: '',
    debtor_email: '', debtor_phone: '', original_amount: '', due_date: '', notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.debtor_name || !form.original_amount || !form.due_date) {
      setError('Preencha devedor, valor e vencimento.');
      return;
    }
    setSaving(true);
    try {
      await accountsApi.createReceivable({
        debtor_type: form.debtor_type as any,
        debtor_name: form.debtor_name,
        debtor_document: form.debtor_document || undefined,
        debtor_email: form.debtor_email || undefined,
        debtor_phone: form.debtor_phone || undefined,
        original_amount: parseFloat(form.original_amount),
        due_date: form.due_date,
        interest_rate: 0.02,
        notes: form.notes,
      });
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Erro ao salvar');
    } finally { setSaving(false); }
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
          <h2 className="text-xl font-bold text-[#2b2926]">Nova Conta a Receber</h2>
          <button onClick={onClose} className="btn-icon"><X className="h-5 w-5" /></button>
        </div>
        {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Tipo de Devedor</label>
              <select className="input-field" value={form.debtor_type}
                onChange={e => setForm(f => ({ ...f, debtor_type: e.target.value }))}>
                {Object.entries(DEBTOR_TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Nome *</label>
              <input type="text" className="input-field" placeholder="Nome do devedor"
                value={form.debtor_name} onChange={e => setForm(f => ({ ...f, debtor_name: e.target.value }))} />
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
            <div>
              <label className="field-label">E-mail</label>
              <input type="email" className="input-field" placeholder="E-mail do devedor"
                value={form.debtor_email} onChange={e => setForm(f => ({ ...f, debtor_email: e.target.value }))} />
            </div>
            <div>
              <label className="field-label">Telefone</label>
              <input type="text" className="input-field" placeholder="(00) 00000-0000"
                value={form.debtor_phone} onChange={e => setForm(f => ({ ...f, debtor_phone: e.target.value }))} />
            </div>
            <div className="col-span-2">
              <label className="field-label">Observações</label>
              <textarea className="input-field" rows={2} placeholder="Observações opcionais..."
                value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            </div>
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

// ─── Modal: Registrar Recebimento ──────────────────────────────────────────────
function ReceberModal({ conta, onClose, onSaved }: { conta: AccountReceivable; onClose: () => void; onSaved: () => void }) {
  const restante = conta.original_amount - conta.paid_amount;
  const [form, setForm] = useState({ paid_amount: String(restante), payment_method: 'pix', payment_date: new Date().toISOString().slice(0, 10) });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await accountsApi.receivePayment(conta.id, {
        paid_amount: parseFloat(form.paid_amount),
        payment_method: form.payment_method,
        payment_date: form.payment_date,
      });
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Erro ao registrar recebimento');
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
          <h2 className="text-xl font-bold text-[#2b2926]">Registrar Recebimento</h2>
          <p className="text-sm text-[#7a7369] mt-1">{conta.debtor_name}</p>
        </div>
        {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="field-label">Valor Recebido</label>
            <input type="number" step="0.01" min="0" className="input-field"
              value={form.paid_amount} onChange={e => setForm(f => ({ ...f, paid_amount: e.target.value }))} />
            <p className="text-xs text-[#7a7369] mt-1">Restante: {formatCurrency(restante)}</p>
          </div>
          <div>
            <label className="field-label">Forma de Pagamento</label>
            <select className="input-field" value={form.payment_method}
              onChange={e => setForm(f => ({ ...f, payment_method: e.target.value }))}>
              {PAYMENT_METHODS.map(m => <option key={m} value={m}>{PAYMENT_METHOD_LABELS[m]}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">Data do Recebimento</label>
            <input type="date" className="input-field"
              value={form.payment_date} onChange={e => setForm(f => ({ ...f, payment_date: e.target.value }))} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 bg-white border-2 border-[#e8e5df] rounded-xl font-semibold text-[#5c5650] hover:bg-[#f5f3ef] hover:border-[#d4cfc5] transition-all shadow-sm">Cancelar</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Salvando...' : 'Confirmar Recebimento'}
            </button>
          </div>
        </form>
      </motion.div>
    </>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export function ContasReceberPage() {
  const { isMobile } = useDevice();

  if (isMobile) {
    return (
      <FluxoCaixaProvider>
        <FinanceiroMobile initialTab="receber" />
      </FluxoCaixaProvider>
    );
  }

  const [contas, setContas] = useState<AccountReceivable[]>([]);
  const [dashboard, setDashboard] = useState<AccountsDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [debtorFilter, setDebtorFilter] = useState<string>('');
  const [showNova, setShowNova] = useState(false);
  const [receberModal, setReceberModal] = useState<AccountReceivable | null>(null);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (statusFilter) filters.status = statusFilter;
      if (debtorFilter) filters.debtor_type = debtorFilter;
      const [list, dash] = await Promise.all([
        accountsApi.getReceivable(filters),
        accountsApi.getReceivableDashboard(),
      ]);
      setContas(list);
      setDashboard(dash);
    } catch { /* empty state */ }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [statusFilter, debtorFilter]);

  const filtered = contas.filter(c =>
    c.debtor_name.toLowerCase().includes(search.toLowerCase()) ||
    (c.notes || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="heading-primary mb-0">Contas a Receber</h1>
          <p className="text-muted mt-2">Gestão de recebimentos, cobranças e inadimplência</p>
        </div>
        <div className="cluster-lg">
          <button onClick={load} className="btn-secondary">
            <RefreshCw className="h-4 w-4" /> Atualizar
          </button>
          <button onClick={() => setShowNova(true)} className="btn-premium">
            <Plus className="h-5 w-5" /> Nova Conta
          </button>
        </div>
      </div>

      {/* KPIs */}
      {dashboard && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard title="Total a Receber" value={dashboard.total_open} icon={DollarSign} color="primary" />
          <KPICard title="Em Atraso" value={dashboard.total_overdue} icon={AlertTriangle} color="danger"
            subtitle={`Inadimplência: ${dashboard.default_rate ?? 0}%`} />
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
              <input type="text" placeholder="Buscar devedor..." value={search}
                onChange={e => setSearch(e.target.value)} className="input-field pl-10" />
            </div>
            <div className="flex flex-wrap gap-2">
              {[['', 'Todos'], ['overdue', 'Em Atraso'], ['today', 'Vence Hoje'], ['paid', 'Recebidos']].map(([v, l]) => (
                <button key={v} onClick={() => setStatusFilter(v)}
                  className={`btn-filter ${statusFilter === v ? 'active' : ''}`}>{l}</button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {[['', 'Todos'], ['patient', 'Pacientes'], ['convenio', 'Convênios']].map(([v, l]) => (
                <button key={v} onClick={() => setDebtorFilter(v)}
                  className={`btn-filter ${debtorFilter === v ? 'active' : ''}`}>{l}</button>
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
            <DollarSign className="h-12 w-12 text-[#d4cfc5] mb-3" />
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
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#5c5650]">Devedor</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#5c5650]">Tipo</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#5c5650]">Vencimento</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#5c5650]">Atraso</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-[#5c5650]">Valor</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-[#5c5650]">Recebido</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-[#5c5650]">Status</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-[#5c5650]">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((conta, idx) => {
                  const st = STATUS_LABELS[conta.status] || { label: conta.status, className: 'bg-gray-100 text-gray-600' };
                  const overdue = conta.days_overdue > 0;
                  return (
                    <motion.tr key={conta.id}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className={`border-b border-[#e8e5df] hover:bg-[#faf9f7] transition-colors ${overdue ? 'bg-red-50/30' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#4a7c65]/10">
                            <User className="h-4 w-4 text-[#4a7c65]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#2b2926]">{conta.debtor_name}</p>
                            {conta.debtor_email && <p className="text-xs text-[#7a7369]">{conta.debtor_email}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-[#5c5650]">
                          {DEBTOR_TYPE_LABELS[conta.debtor_type] || conta.debtor_type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm ${overdue ? 'text-[#e85d3f] font-medium' : 'text-[#2b2926]'}`}>
                          {formatDate(conta.due_date)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {overdue ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-100 text-red-700 font-medium">
                            <AlertTriangle className="h-3 w-3" />
                            {conta.days_overdue}d
                          </span>
                        ) : (
                          <span className="text-xs text-[#7a7369]">—</span>
                        )}
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
                        <div className="flex items-center justify-center">
                          {(conta.status === 'pending' || conta.status === 'partial') && (
                            <button onClick={() => setReceberModal(conta)}
                              className="btn-icon-sm bg-[#4a7c65]/10 hover:bg-[#4a7c65]/20"
                              title="Registrar recebimento">
                              <Check className="h-4 w-4 text-[#4a7c65]" />
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
        {receberModal && <ReceberModal conta={receberModal} onClose={() => setReceberModal(null)} onSaved={load} />}
      </AnimatePresence>
    </div>
  );
}
