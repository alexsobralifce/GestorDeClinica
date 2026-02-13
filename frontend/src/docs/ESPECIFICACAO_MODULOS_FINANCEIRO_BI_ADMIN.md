# ESPECIFICAÇÃO TÉCNICA DETALHADA
## Módulos: Gestão Financeira, Business Intelligence e Administrativo

**Sistema:** Gestão Clínica Multidisciplinar - Saúde Humanizada Contemporânea  
**Data:** 2026-02-12  
**Versão:** 1.0

---

## 🎨 PADRÕES DE DESIGN (TODOS OS MÓDULOS)

### Identidade Visual Mantida:
- **Tipografia:** Darker Grotesque (headings) + Karla (body)
- **Paleta Principal:**
  - Verde Primário: `#4a7c65` / `#3d6653` / `#325143`
  - Terra: `#c89f7a` / `#b88a5f`
  - Terracota: `#e85d3f` / `#d54426`
  - Neutros: `#2b2926` (texto escuro) / `#5c5650` / `#7a7369` / `#a8a199`
  - Fundos: `#f9f7f4` / `#f5f3ef` / `#e8e5df`

- **Cores Semânticas Financeiras:**
  - Receita/Positivo: `#4a7c65` (verde primário)
  - Despesa/Negativo: `#e85d3f` (terracota)
  - Projeção: `#6b9dd8` (azul suave)
  - Alerta: `#f5a623` (âmbar)
  - Crítico: `#d0021b` (vermelho)

- **Componentes Base:**
  - Cards: `rounded-2xl`, `shadow-sm`, hover com `shadow-lg` e `translateY(-2px)`
  - Botões: Sistema btn-premium / btn-primary / btn-secondary / btn-filter
  - Inputs: `rounded-xl`, borda `#e8e5df`, focus ring `#4a7c65`
  - Gráficos: Recharts com cores da paleta, tooltips customizados

- **Animações (Framer Motion):**
  - Entrada de página: `initial={{ opacity: 0, y: 20 }}` → `animate={{ opacity: 1, y: 0 }}`
  - Cards: `whileHover={{ y: -2, scale: 1.01 }}`
  - Números: CountUp animation com `duration: 2s`
  - Transições: `transition={{ type: 'spring', stiffness: 300, damping: 30 }}`

---

## 📊 MÓDULO 5: GESTÃO FINANCEIRA COMPLETA

### 5.1 FLUXO DE CAIXA COM PROJEÇÕES

#### Interface TypeScript Completa:

```typescript
// ===== TIPOS BASE =====
interface FluxoCaixa {
  id: string;
  data: Date;
  tipo: 'entrada' | 'saida';
  status: 'confirmado' | 'previsto' | 'atrasado' | 'cancelado';
  valor: number;
  valorPago?: number; // Para casos de pagamento parcial
  categoria: CategoriaFinanceira;
  subcategoria?: string;
  descricao: string;
  observacoes?: string;
  
  // Origem da transação
  origem: 'consulta' | 'procedimento' | 'convenio' | 'produto' | 'salario' | 
          'fornecedor' | 'aluguel' | 'imposto' | 'outro';
  
  // Relacionamentos
  consulta?: {
    id: string;
    pacienteId: string;
    profissionalId: string;
    dataConsulta: Date;
  };
  convenioId?: string;
  fornecedorId?: string;
  profissionalId?: string; // Para repasses
  
  // Pagamento
  formaPagamento?: 'dinheiro' | 'pix' | 'cartao-credito' | 'cartao-debito' | 
                    'boleto' | 'transferencia' | 'convenio';
  parcelas?: {
    numero: number;
    total: number;
    valorParcela: number;
  };
  
  // Recorrência
  recorrente?: {
    frequencia: 'diaria' | 'semanal' | 'quinzenal' | 'mensal' | 'anual';
    dataInicio: Date;
    dataFim?: Date;
    proximaOcorrencia: Date;
  };
  
  // Auditoria
  criadoPor: string;
  criadoEm: Date;
  atualizadoPor?: string;
  atualizadoEm?: Date;
  aprovadoPor?: string; // Para aprovação de despesas acima de X valor
  aprovadoEm?: Date;
  
  // Anexos
  anexos?: {
    id: string;
    nome: string;
    tipo: 'nota-fiscal' | 'recibo' | 'comprovante' | 'contrato' | 'outro';
    url: string;
    uploadEm: Date;
  }[];
  
  // Impostos e taxas
  impostos?: {
    tipo: 'ISS' | 'IRPF' | 'INSS' | 'PIS' | 'COFINS' | 'CSLL';
    percentual: number;
    valor: number;
  }[];
  
  // Tags customizadas
  tags?: string[];
}

interface CategoriaFinanceira {
  id: string;
  nome: string;
  tipo: 'receita' | 'despesa';
  cor: string;
  icone: string; // Nome do ícone Lucide
  orcamentoMensal?: number;
  subcategorias?: string[];
  ativo: boolean;
}

interface ProjecaoFluxo {
  periodo: {
    inicio: Date;
    fim: Date;
    label: string; // "Janeiro 2026", "Q1 2026", etc
  };
  
  saldoInicial: number;
  
  entradas: {
    confirmadas: number;
    previstas: number;
    atrasadas: number;
    total: number;
    porCategoria: { categoria: string; valor: number; percentual: number }[];
  };
  
  saidas: {
    confirmadas: number;
    previstas: number;
    atrasadas: number;
    total: number;
    porCategoria: { categoria: string; valor: number; percentual: number }[];
  };
  
  saldoFinal: number;
  saldoProjetado: number;
  
  // Série temporal para gráfico
  timeline: {
    data: Date;
    entradasAcumuladas: number;
    saidasAcumuladas: number;
    saldo: number;
    detalhes: FluxoCaixa[];
  }[];
  
  // Análises
  margemOperacional: number; // (Receita - Despesa) / Receita
  burnRate: number; // Despesas / dias
  runwayDias: number; // Quanto tempo o saldo atual durará
  
  // Alertas
  alertas: AlertaFinanceiro[];
  
  // Comparativo
  comparativoMesAnterior: {
    receita: { valor: number; variacao: number }; // variação em %
    despesa: { valor: number; variacao: number };
    saldo: { valor: number; variacao: number };
  };
}

interface AlertaFinanceiro {
  id: string;
  tipo: 'info' | 'warning' | 'error' | 'success';
  severidade: 'baixa' | 'media' | 'alta' | 'critica';
  titulo: string;
  mensagem: string;
  dataGeracao: Date;
  dataExpiracao?: Date;
  acao?: {
    label: string;
    href: string;
  };
  lido: boolean;
}

// ===== FILTROS E BUSCAS =====
interface FiltrosFluxoCaixa {
  periodo: {
    inicio: Date;
    fim: Date;
    preset?: 'hoje' | 'semana' | 'mes' | 'trimestre' | 'semestre' | 'ano' | 'customizado';
  };
  tipo?: 'entrada' | 'saida';
  status?: ('confirmado' | 'previsto' | 'atrasado' | 'cancelado')[];
  categorias?: string[];
  origem?: string[];
  profissionais?: string[];
  convenios?: string[];
  valorMin?: number;
  valorMax?: number;
  formaPagamento?: string[];
  tags?: string[];
  textoBusca?: string; // Busca em descricao, observacoes
}

// ===== HOOKS CUSTOMIZADOS =====
interface UseFluxoCaixa {
  fluxos: FluxoCaixa[];
  projecao: ProjecaoFluxo;
  loading: boolean;
  error: Error | null;
  
  // Ações
  adicionarFluxo: (fluxo: Omit<FluxoCaixa, 'id' | 'criadoEm' | 'criadoPor'>) => Promise<void>;
  atualizarFluxo: (id: string, dados: Partial<FluxoCaixa>) => Promise<void>;
  excluirFluxo: (id: string) => Promise<void>;
  confirmarPagamento: (id: string, dados: { valorPago: number; formaPagamento: string; data: Date }) => Promise<void>;
  
  // Filtros
  filtros: FiltrosFluxoCaixa;
  aplicarFiltros: (filtros: Partial<FiltrosFluxoCaixa>) => void;
  limparFiltros: () => void;
  
  // Exportação
  exportarExcel: (formato: 'completo' | 'resumido') => Promise<Blob>;
  exportarPDF: (template: 'padrao' | 'gerencial' | 'auditoria') => Promise<Blob>;
}
```

#### Componentes React:

```typescript
// ===== PÁGINA PRINCIPAL =====
export function FluxoCaixaPage() {
  const { fluxos, projecao, loading, filtros, aplicarFiltros } = useFluxoCaixa();
  const [showModalNovoFluxo, setShowModalNovoFluxo] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<FluxoCaixa | null>(null);
  const [viewMode, setViewMode] = useState<'grafico' | 'lista' | 'calendario'>('grafico');
  
  return (
    <div className="space-y-6">
      {/* Header com KPIs */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-xl">Fluxo de Caixa</h1>
          <p className="text-secondary">Gestão financeira em tempo real</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-filter" onClick={() => setShowFiltros(!showFiltros)}>
            <Filter className="h-5 w-5" />
            Filtros
            {Object.keys(filtros).length > 0 && (
              <span className="btn-badge">{Object.keys(filtros).length}</span>
            )}
          </button>
          <button className="btn-secondary">
            <Download className="h-5 w-5" />
            Exportar
          </button>
          <button className="btn-premium" onClick={() => setShowModalNovoFluxo(true)}>
            <Plus className="h-5 w-5" />
            Nova Transação
          </button>
        </div>
      </div>
      
      {/* Cards KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          titulo="Saldo Atual"
          valor={projecao.saldoFinal}
          tipo="monetario"
          tendencia={projecao.comparativoMesAnterior.saldo.variacao}
          icone={Wallet}
          cor="primary"
        />
        <KPICard
          titulo="Entradas do Mês"
          valor={projecao.entradas.confirmadas}
          tipo="monetario"
          tendencia={projecao.comparativoMesAnterior.receita.variacao}
          icone={TrendingUp}
          cor="success"
        />
        <KPICard
          titulo="Saídas do Mês"
          valor={projecao.saidas.confirmadas}
          tipo="monetario"
          tendencia={projecao.comparativoMesAnterior.despesa.variacao}
          icone={TrendingDown}
          cor="danger"
        />
        <KPICard
          titulo="Projeção 30 dias"
          valor={projecao.saldoProjetado}
          tipo="monetario"
          subtitle={`Runway: ${projecao.runwayDias} dias`}
          icone={CalendarDays}
          cor="info"
        />
      </div>
      
      {/* Alertas */}
      {projecao.alertas.length > 0 && (
        <AlertasFinanceiros alertas={projecao.alertas} />
      )}
      
      {/* Selector de visualização */}
      <div className="flex items-center gap-2">
        <button
          className={`btn-filter ${viewMode === 'grafico' ? 'active' : ''}`}
          onClick={() => setViewMode('grafico')}
        >
          <LineChart className="h-5 w-5" />
          Gráfico
        </button>
        <button
          className={`btn-filter ${viewMode === 'lista' ? 'active' : ''}`}
          onClick={() => setViewMode('lista')}
        >
          <List className="h-5 w-5" />
          Lista
        </button>
        <button
          className={`btn-filter ${viewMode === 'calendario' ? 'active' : ''}`}
          onClick={() => setViewMode('calendario')}
        >
          <Calendar className="h-5 w-5" />
          Calendário
        </button>
      </div>
      
      {/* Conteúdo principal */}
      <AnimatePresence mode="wait">
        {viewMode === 'grafico' && (
          <motion.div
            key="grafico"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <GraficoFluxoCaixa 
              dados={projecao.timeline} 
              onClickPonto={(data) => setSelectedTransaction(data)}
            />
          </motion.div>
        )}
        
        {viewMode === 'lista' && (
          <motion.div
            key="lista"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <TabelaTransacoes 
              transacoes={fluxos}
              onSelectTransacao={(t) => setSelectedTransaction(t)}
            />
          </motion.div>
        )}
        
        {viewMode === 'calendario' && (
          <motion.div
            key="calendario"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <CalendarioFinanceiro 
              transacoes={fluxos}
              onSelectDia={(dia) => console.log(dia)}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Análise por Categoria */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoriasPieChart 
          titulo="Receitas por Categoria"
          dados={projecao.entradas.porCategoria}
          tipo="receita"
        />
        <CategoriasPieChart 
          titulo="Despesas por Categoria"
          dados={projecao.saidas.porCategoria}
          tipo="despesa"
        />
      </div>
      
      {/* Modais */}
      {showModalNovoFluxo && (
        <ModalNovoFluxo 
          onClose={() => setShowModalNovoFluxo(false)}
          onSave={(fluxo) => adicionarFluxo(fluxo)}
        />
      )}
      
      {selectedTransaction && (
        <DrawerDetalhesTransacao
          transacao={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          onEdit={(dados) => atualizarFluxo(selectedTransaction.id, dados)}
        />
      )}
    </div>
  );
}

// ===== COMPONENTE GRÁFICO =====
function GraficoFluxoCaixa({ dados, onClickPonto }) {
  return (
    <div className="card p-6">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={dados} onClick={(e) => e && onClickPonto(e.activePayload[0].payload)}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e8e5df" />
          <XAxis 
            dataKey="data" 
            tickFormatter={(date) => format(new Date(date), 'dd/MM')}
            stroke="#7a7369"
          />
          <YAxis 
            tickFormatter={(value) => formatCurrency(value)}
            stroke="#7a7369"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {/* Linhas */}
          <Line 
            type="monotone" 
            dataKey="entradasAcumuladas" 
            stroke="#4a7c65" 
            strokeWidth={3}
            name="Entradas"
            dot={{ fill: '#4a7c65', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="saidasAcumuladas" 
            stroke="#e85d3f" 
            strokeWidth={3}
            name="Saídas"
            dot={{ fill: '#e85d3f', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="saldo" 
            stroke="#6b9dd8" 
            strokeWidth={3}
            strokeDasharray="5 5"
            name="Saldo Projetado"
            dot={{ fill: '#6b9dd8', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

#### Regras de Negócio:

1. **Confirmação de Pagamento:**
   - Apenas usuários com permissão `financeiro.confirmar` podem confirmar transações previstas
   - Transações acima de R$ 5.000 requerem aprovação dupla
   - Ao confirmar, gerar evento de auditoria

2. **Cálculo de Projeções:**
   - Receitas recorrentes (consultas regulares) são projetadas automaticamente
   - Despesas fixas (aluguel, salários) são replicadas mensalmente
   - Convênios têm prazo de pagamento estimado (30-60 dias)

3. **Alertas Automáticos:**
   - Saldo negativo em 7 dias: Alerta CRÍTICO ao admin
   - Saldo negativo em 30 dias: Alerta ALTO
   - Conta a receber vencida há mais de 15 dias: Alerta MÉDIO
   - Oportunidade de aplicação (saldo > 10x despesa mensal média): Alerta INFO

4. **Integrações:**
   - Consultas confirmadas geram entrada prevista automaticamente
   - Pagamentos de salário são calculados pela folha de pagamento
   - Impostos são calculados conforme regime tributário (Simples, Lucro Real, etc)

---

### 5.2 CONTAS A RECEBER E A PAGAR

#### Interface TypeScript:

```typescript
interface ContaReceber {
  id: string;
  fluxoCaixaId: string; // Referência ao FluxoCaixa
  
  // Dados do devedor
  devedor: {
    tipo: 'paciente' | 'convenio' | 'outro';
    id: string;
    nome: string;
    documento: string; // CPF/CNPJ
    contato?: {
      email: string;
      telefone: string;
    };
  };
  
  // Dados financeiros
  valorOriginal: number;
  valorPago: number;
  valorRestante: number;
  descontos: {
    tipo: 'percentual' | 'fixo';
    valor: number;
    motivo: string;
    autorizadoPor: string;
  }[];
  juros: {
    tipo: 'simples' | 'composto';
    percentualMes: number;
    valorAcumulado: number;
  };
  
  // Datas
  dataEmissao: Date;
  dataVencimento: Date;
  dataPagamento?: Date;
  diasAtraso: number;
  
  // Status
  status: 'pendente' | 'parcial' | 'pago' | 'cancelado' | 'protestado';
  
  // Parcelamento
  parcelamento?: {
    numeroParcela: number;
    totalParcelas: number;
    valorParcela: number;
    contaOrigemId?: string; // Se veio de parcelamento
  };
  
  // Cobrança
  cobranca: {
    metodo: 'boleto' | 'pix' | 'cartao' | 'link-pagamento' | 'manual';
    tentativas: {
      data: Date;
      canal: 'email' | 'sms' | 'whatsapp' | 'telefone' | 'presencial';
      status: 'enviado' | 'visualizado' | 'erro';
      mensagem?: string;
    }[];
    proximaCobranca?: Date;
  };
  
  // Observações
  observacoes?: string;
  historico: {
    data: Date;
    usuario: string;
    acao: string;
    detalhes?: string;
  }[];
}

interface ContaPagar {
  id: string;
  fluxoCaixaId: string;
  
  // Dados do credor
  credor: {
    tipo: 'fornecedor' | 'profissional' | 'governo' | 'outro';
    id?: string;
    nome: string;
    documento: string;
    dadosBancarios?: {
      banco: string;
      agencia: string;
      conta: string;
      pix?: string;
    };
  };
  
  // Dados financeiros
  valorOriginal: number;
  valorPago: number;
  valorRestante: number;
  descontos: number;
  multa: number;
  juros: number;
  
  // Datas
  dataEmissao: Date;
  dataVencimento: Date;
  dataPagamento?: Date;
  diasAtraso: number;
  
  // Status
  status: 'pendente' | 'agendado' | 'pago' | 'cancelado' | 'renegociado';
  
  // Aprovação (para valores altos)
  aprovacao?: {
    necessaria: boolean;
    status: 'pendente' | 'aprovado' | 'rejeitado';
    aprovadoPor?: string;
    aprovadoEm?: Date;
    motivo?: string;
  };
  
  // Pagamento
  pagamento?: {
    metodo: 'transferencia' | 'boleto' | 'pix' | 'cheque' | 'dinheiro';
    comprovante?: {
      url: string;
      uploadEm: Date;
    };
    agendado: boolean;
    dataAgendamento?: Date;
  };
  
  // Recorrência
  recorrente: boolean;
  frequencia?: 'mensal' | 'trimestral' | 'anual';
  
  observacoes?: string;
  tags?: string[];
}

// ===== COMPONENTES =====
interface ContasReceberDashboard {
  totalAberto: number;
  vencidoHoje: number;
  vencidoAtraso: number;
  proximosVencer: number; // Próximos 7 dias
  taxaInadimplencia: number; // %
  
  porStatus: {
    pendente: number;
    parcial: number;
    pago: number;
    protestado: number;
  };
  
  porConvenio: {
    convenioId: string;
    convenioNome: string;
    valorTotal: number;
    quantidade: number;
    ticketMedio: number;
  }[];
  
  maioresDevedores: {
    devedorId: string;
    devedorNome: string;
    valorTotal: number;
    contasAbertas: number;
    diasMedioAtraso: number;
  }[];
}
```

#### Componente React:

```typescript
export function ContasReceberPage() {
  const { contas, dashboard, loading } = useContasReceber();
  const [filtros, setFiltros] = useState<FiltrosContas>({});
  const [selectedConta, setSelectedConta] = useState<ContaReceber | null>(null);
  const [showModalCobranca, setShowModalCobranca] = useState(false);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-xl">Contas a Receber</h1>
          <p className="text-secondary">Gestão de recebimentos e cobranças</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary">
            <FileDown className="h-5 w-5" />
            Relatório
          </button>
          <button className="btn-premium" onClick={() => setShowModalCobranca(true)}>
            <Send className="h-5 w-5" />
            Enviar Cobranças
          </button>
        </div>
      </div>
      
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          titulo="Total em Aberto"
          valor={dashboard.totalAberto}
          tipo="monetario"
          icone={DollarSign}
          cor="primary"
        />
        <KPICard
          titulo="Vencido (Atraso)"
          valor={dashboard.vencidoAtraso}
          tipo="monetario"
          subtitle={`${dashboard.taxaInadimplencia}% de inadimplência`}
          icone={AlertTriangle}
          cor="danger"
        />
        <KPICard
          titulo="Vence Hoje"
          valor={dashboard.vencidoHoje}
          tipo="monetario"
          icone={Clock}
          cor="warning"
        />
        <KPICard
          titulo="Próximos 7 dias"
          valor={dashboard.proximosVencer}
          tipo="monetario"
          icone={CalendarCheck}
          cor="info"
        />
      </div>
      
      {/* Filtros rápidos */}
      <div className="flex flex-wrap gap-2">
        <button 
          className={`btn-filter ${filtros.status === 'vencido' ? 'active' : ''}`}
          onClick={() => setFiltros({ ...filtros, status: 'vencido' })}
        >
          <AlertCircle className="h-4 w-4" />
          Em Atraso
          <span className="btn-badge">{dashboard.vencidoAtraso}</span>
        </button>
        <button 
          className={`btn-filter ${filtros.status === 'hoje' ? 'active' : ''}`}
          onClick={() => setFiltros({ ...filtros, status: 'hoje' })}
        >
          Vence Hoje
        </button>
        <button 
          className={`btn-filter ${filtros.tipo === 'convenio' ? 'active' : ''}`}
          onClick={() => setFiltros({ ...filtros, tipo: 'convenio' })}
        >
          Convênios
        </button>
        <button 
          className={`btn-filter ${filtros.tipo === 'particular' ? 'active' : ''}`}
          onClick={() => setFiltros({ ...filtros, tipo: 'particular' })}
        >
          Particulares
        </button>
      </div>
      
      {/* Tabela de contas */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#f5f3ef] border-b-2 border-[#e8e5df]">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#5c5650]">
                Devedor
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#5c5650]">
                Vencimento
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-[#5c5650]">
                Valor Original
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-[#5c5650]">
                Valor Pago
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-[#5c5650]">
                Saldo
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-[#5c5650]">
                Status
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-[#5c5650]">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {contas.map((conta) => (
              <motion.tr
                key={conta.id}
                className="border-b border-[#e8e5df] hover:bg-[#f9f7f4] cursor-pointer transition-colors"
                onClick={() => setSelectedConta(conta)}
                whileHover={{ backgroundColor: '#f9f7f4' }}
              >
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold text-[#2b2926]">{conta.devedor.nome}</p>
                    <p className="text-sm text-[#7a7369]">{conta.devedor.documento}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-[#2b2926]">
                      {format(new Date(conta.dataVencimento), 'dd/MM/yyyy')}
                    </p>
                    {conta.diasAtraso > 0 && (
                      <p className="text-sm text-[#e85d3f] font-medium">
                        {conta.diasAtraso} dias de atraso
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-mono">
                  {formatCurrency(conta.valorOriginal)}
                </td>
                <td className="px-6 py-4 text-right font-mono text-[#4a7c65]">
                  {formatCurrency(conta.valorPago)}
                </td>
                <td className="px-6 py-4 text-right font-mono font-semibold">
                  {formatCurrency(conta.valorRestante)}
                </td>
                <td className="px-6 py-4 text-center">
                  <StatusBadge status={conta.status} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      className="btn-icon btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEnviarCobranca(conta);
                      }}
                    >
                      <Send className="h-4 w-4" />
                    </button>
                    <button 
                      className="btn-icon btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRegistrarPagamento(conta);
                      }}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Análises */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Maiores devedores */}
        <div className="card">
          <h3 className="heading-md mb-4">Maiores Devedores</h3>
          <div className="space-y-3">
            {dashboard.maioresDevedores.map((devedor) => (
              <div 
                key={devedor.devedorId}
                className="flex items-center justify-between p-4 rounded-xl bg-[#f9f7f4] hover:bg-[#f5f3ef] transition-colors"
              >
                <div>
                  <p className="font-semibold text-[#2b2926]">{devedor.devedorNome}</p>
                  <p className="text-sm text-[#7a7369]">
                    {devedor.contasAbertas} contas • {devedor.diasMedioAtraso} dias atraso médio
                  </p>
                </div>
                <p className="font-mono font-bold text-lg text-[#e85d3f]">
                  {formatCurrency(devedor.valorTotal)}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Recebimentos por convênio */}
        <div className="card">
          <h3 className="heading-md mb-4">Por Convênio</h3>
          <div className="space-y-3">
            {dashboard.porConvenio.map((convenio) => (
              <div 
                key={convenio.convenioId}
                className="flex items-center justify-between p-4 rounded-xl border-2 border-[#e8e5df] hover:border-[#4a7c65]/30 transition-colors"
              >
                <div>
                  <p className="font-semibold text-[#2b2926]">{convenio.convenioNome}</p>
                  <p className="text-sm text-[#7a7369]">
                    {convenio.quantidade} contas • Ticket médio: {formatCurrency(convenio.ticketMedio)}
                  </p>
                </div>
                <p className="font-mono font-bold text-lg text-[#4a7c65]">
                  {formatCurrency(convenio.valorTotal)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

### 5.3 RELATÓRIOS FINANCEIROS E EXPORTAÇÕES

#### Relatórios Disponíveis:

```typescript
interface RelatorioFinanceiro {
  tipo: 'DRE' | 'fluxo-caixa' | 'contas-receber' | 'contas-pagar' | 
        'comissoes' | 'impostos' | 'balancete' | 'auditoria';
  
  periodo: {
    inicio: Date;
    fim: Date;
    comparativo?: {
      inicio: Date;
      fim: Date;
    };
  };
  
  filtros?: {
    categorias?: string[];
    profissionais?: string[];
    centrosCusto?: string[];
  };
  
  formato: 'pdf' | 'excel' | 'csv';
  template?: 'executivo' | 'detalhado' | 'contabil';
  
  opcoes: {
    incluirGraficos: boolean;
    incluirAnexos: boolean;
    agruparPor: 'dia' | 'semana' | 'mes' | 'categoria' | 'profissional';
    ordenarPor: string;
    assinaturaDigital: boolean;
  };
}

// DRE - Demonstração do Resultado do Exercício
interface DRE {
  periodo: { inicio: Date; fim: Date };
  
  receitaBruta: {
    consultas: number;
    procedimentos: number;
    produtos: number;
    total: number;
  };
  
  deducoes: {
    impostos: number;
    descontos: number;
    glosas: number; // Glosas de convênio
    total: number;
  };
  
  receitaLiquida: number;
  
  custosVariaveis: {
    comissoes: number;
    materiaisDiretos: number;
    laboratorios: number;
    total: number;
  };
  
  margemContribuicao: number;
  
  despesasFixas: {
    salarios: number;
    aluguel: number;
    utilidades: number;
    marketing: number;
    administrativo: number;
    depreciacaoAmortizacao: number;
    total: number;
  };
  
  ebitda: number; // Earnings Before Interest, Taxes, Depreciation, Amortization
  
  despesasFinanceiras: {
    juros: number;
    tarifasBancarias: number;
    total: number;
  };
  
  receitasFinanceiras: {
    jurosRecebidos: number;
    rendimentos: number;
    total: number;
  };
  
  resultadoAntesImpostos: number;
  
  impostoRenda: number;
  
  lucroLiquido: number;
  
  // Indicadores
  margemBruta: number; // %
  margemOperacional: number; // %
  margemLiquida: number; // %
  
  // Comparativo período anterior
  comparativo?: {
    receita: { valor: number; variacao: number };
    lucro: { valor: number; variacao: number };
    margem: { valor: number; variacao: number };
  };
}
```

---

## 📈 MÓDULO 6: BUSINESS INTELLIGENCE (BI)

### 6.1 DASHBOARD EXECUTIVO

#### Interface TypeScript:

```typescript
interface DashboardExecutivo {
  periodo: { inicio: Date; fim: Date };
  atualizadoEm: Date;
  
  // KPIs Principais
  kpis: {
    faturamento: {
      total: number;
      meta: number;
      percentualMeta: number;
      variacao: number; // vs período anterior
      tendencia: 'crescimento' | 'estavel' | 'queda';
    };
    
    ticketMedio: {
      valor: number;
      variacao: number;
      porEspecialidade: { especialidade: string; valor: number }[];
    };
    
    taxa Ocupacao: {
      percentual: number;
      horasTrabalhadas: number;
      horasDisponiveis: number;
      porProfissional: { profissionalId: string; percentual: number }[];
    };
    
    nps: {
      score: number;
      promotores: number;
      neutros: number;
      detratores: number;
      evolucao: { data: Date; score: number }[];
    };
    
    taxaRetorno: {
      percentual: number;
      pacientesNovos: number;
      pacientesRetorno: number;
      evolucao: { mes: string; percentual: number }[];
    };
    
    cac: {  // Custo de Aquisição de Cliente
      valor: number;
      investimentoMarketing: number;
      clientesAdquiridos: number;
    };
    
    ltv: {  // Lifetime Value
      valor: number;
      ticketMedio: number;
      frequenciaMedia: number;
      tempoVidaMedio: number; // meses
    };
  };
  
  // Análises
  analises: {
    faturamentoPorEspecialidade: {
      especialidade: string;
      valor: number;
      percentual: number;
      crescimento: number;
    }[];
    
    faturamentoPorProfissional: {
      profissionalId: string;
      profissionalNome: string;
      valor: number;
      atendimentos: number;
      ticketMedio: number;
      comissao: number;
    }[];
    
    faturamentoPorConvenio: {
      convenioId: string;
      convenioNome: string;
      valor: number;
      atendimentos: number;
      ticketMedio: number;
      prazoMedioRecebimento: number;
    }[];
    
    horariosPico: {
      diaSemana: string;
      hora: number;
      ocupacao: number;
      faturamento: number;
    }[];
    
    procedimentosMaisRealizados: {
      procedimento: string;
      quantidade: number;
      valor: number;
      crescimento: number;
    }[];
  };
  
  // Previsões (Machine Learning)
  previsoes: {
    faturamentoProximoMes: {
      valor: number;
      intervaloConfianca: { min: number; max: number };
      fatores: string[];
    };
    
    ocupacaoProximaSemana: {
      data: Date;
      ocupacaoEsperada: number;
      horariosDisponiveis: string[];
    }[];
    
    churnRisco: {
      pacienteId: string;
      pacienteNome: string;
      probabilidade: number; // 0-100
      ultimaConsulta: Date;
      acoesRecomendadas: string[];
    }[];
  };
}

// ===== COMPONENTE PRINCIPAL =====
export function DashboardExecutivoPage() {
  const { dashboard, loading } = useDashboardExecutivo();
  const [periodoSelecionado, setPeriodoSelecionado] = useState<'mes' | 'trimestre' | 'ano'>('mes');
  const [selectedKPI, setSelectedKPI] = useState<string | null>(null);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-xl">Dashboard Executivo</h1>
          <p className="text-secondary">
            Atualizado em {format(dashboard.atualizadoEm, "dd/MM/yyyy 'às' HH:mm")}
          </p>
        </div>
        
        <div className="flex gap-3">
          {/* Seletor de período */}
          <div className="flex gap-2">
            <button 
              className={`btn-filter ${periodoSelecionado === 'mes' ? 'active' : ''}`}
              onClick={() => setPeriodoSelecionado('mes')}
            >
              Mês
            </button>
            <button 
              className={`btn-filter ${periodoSelecionado === 'trimestre' ? 'active' : ''}`}
              onClick={() => setPeriodoSelecionado('trimestre')}
            >
              Trimestre
            </button>
            <button 
              className={`btn-filter ${periodoSelecionado === 'ano' ? 'active' : ''}`}
              onClick={() => setPeriodoSelecionado('ano')}
            >
              Ano
            </button>
          </div>
          
          <button className="btn-secondary">
            <Download className="h-5 w-5" />
            Exportar
          </button>
          
          <button className="btn-secondary">
            <RefreshCw className="h-5 w-5" />
            Atualizar
          </button>
        </div>
      </div>
      
      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICardExecutivo
          titulo="Faturamento"
          valor={dashboard.kpis.faturamento.total}
          meta={dashboard.kpis.faturamento.meta}
          percentualMeta={dashboard.kpis.faturamento.percentualMeta}
          tendencia={dashboard.kpis.faturamento.tendencia}
          variacao={dashboard.kpis.faturamento.variacao}
          icone={DollarSign}
          onClick={() => setSelectedKPI('faturamento')}
        />
        
        <KPICardExecutivo
          titulo="Ticket Médio"
          valor={dashboard.kpis.ticketMedio.valor}
          variacao={dashboard.kpis.ticketMedio.variacao}
          icone={Receipt}
          onClick={() => setSelectedKPI('ticket')}
        />
        
        <KPICardExecutivo
          titulo="Taxa de Ocupação"
          valor={dashboard.kpis.taxaOcupacao.percentual}
          tipo="percentual"
          subtitle={`${dashboard.kpis.taxaOcupacao.horasTrabalhadas}h trabalhadas`}
          icone={Clock}
          onClick={() => setSelectedKPI('ocupacao')}
        />
        
        <KPICardExecutivo
          titulo="NPS Score"
          valor={dashboard.kpis.nps.score}
          tipo="nps"
          subtitle={`${dashboard.kpis.nps.promotores} promotores`}
          icone={Heart}
          onClick={() => setSelectedKPI('nps')}
        />
      </div>
      
      {/* Gráfico de Faturamento (Destaque) */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="heading-lg">Evolução do Faturamento</h2>
          <div className="flex gap-2">
            <button className="btn-filter active">
              <TrendingUp className="h-4 w-4" />
              Receita
            </button>
            <button className="btn-filter">
              <TrendingDown className="h-4 w-4" />
              Despesa
            </button>
            <button className="btn-filter">
              <Activity className="h-4 w-4" />
              Lucro
            </button>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={dashboard.analises.faturamentoEvol ucao}>
            <defs>
              <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4a7c65" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#4a7c65" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e5df" />
            <XAxis dataKey="mes" stroke="#7a7369" />
            <YAxis tickFormatter={(value) => formatCurrency(value)} stroke="#7a7369" />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="valor" 
              stroke="#4a7c65" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorReceita)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Grid de Análises */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Faturamento por Especialidade */}
        <div className="card p-6">
          <h3 className="heading-md mb-4">Por Especialidade</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboard.analises.faturamentoPorEspecialidade}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e5df" />
              <XAxis dataKey="especialidade" stroke="#7a7369" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} stroke="#7a7369" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="valor" fill="#4a7c65" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Top Profissionais */}
        <div className="card p-6">
          <h3 className="heading-md mb-4">Top Profissionais</h3>
          <div className="space-y-3">
            {dashboard.analises.faturamentoPorProfissional.slice(0, 5).map((prof, index) => (
              <motion.div
                key={prof.profissionalId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-[#f9f7f4] hover:bg-[#f5f3ef] transition-colors cursor-pointer"
              >
                <div 
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl font-bold text-white text-lg"
                  style={{ backgroundColor: `hsl(${index * 60}, 45%, 55%)` }}
                >
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#2b2926] truncate">{prof.profissionalNome}</p>
                  <p className="text-sm text-[#7a7369]">
                    {prof.atendimentos} atendimentos • Ticket: {formatCurrency(prof.ticketMedio)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-lg text-[#4a7c65]">
                    {formatCurrency(prof.valor)}
                  </p>
                  <p className="text-xs text-[#7a7369]">
                    Comissão: {formatCurrency(prof.comissao)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Horários de Pico */}
        <div className="card p-6">
          <h3 className="heading-md mb-4">Horários de Maior Ocupação</h3>
          <ResponsiveContainer width="100%" height={300}>
            <HeatmapChart data={dashboard.analises.horariosPico} />
          </ResponsiveContainer>
        </div>
        
        {/* Procedimentos Top */}
        <div className="card p-6">
          <h3 className="heading-md mb-4">Procedimentos Mais Realizados</h3>
          <div className="space-y-3">
            {dashboard.analises.procedimentosMaisRealizados.map((proc) => (
              <div 
                key={proc.procedimento}
                className="flex items-center justify-between p-3 rounded-xl border-2 border-[#e8e5df]"
              >
                <div>
                  <p className="font-semibold text-[#2b2926]">{proc.procedimento}</p>
                  <p className="text-sm text-[#7a7369]">{proc.quantidade} realizações</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-[#4a7c65]">
                    {formatCurrency(proc.valor)}
                  </p>
                  {proc.crescimento !== 0 && (
                    <p className={`text-xs font-medium ${proc.crescimento > 0 ? 'text-[#4a7c65]' : 'text-[#e85d3f]'}`}>
                      {proc.crescimento > 0 ? '+' : ''}{proc.crescimento}%
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Previsões com IA */}
      <div className="card p-6 bg-gradient-to-br from-[#4a7c65]/5 to-[#6b9dd8]/5 border-2 border-[#4a7c65]/20">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="h-6 w-6 text-[#4a7c65]" />
          <h2 className="heading-lg">Previsões Inteligentes</h2>
          <span className="px-3 py-1 rounded-full bg-[#4a7c65] text-white text-xs font-semibold">
            IA
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold text-[#5c5650] mb-3">Faturamento Próximo Mês</h4>
            <p className="text-3xl font-bold text-[#2b2926] mb-2">
              {formatCurrency(dashboard.previsoes.faturamentoProximoMes.valor)}
            </p>
            <p className="text-sm text-[#7a7369]">
              Intervalo: {formatCurrency(dashboard.previsoes.faturamentoProximoMes.intervaloConfianca.min)} - {formatCurrency(dashboard.previsoes.faturamentoProximoMes.intervaloConfianca.max)}
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-[#5c5650] mb-3">Ocupação Próxima Semana</h4>
            <p className="text-3xl font-bold text-[#2b2926] mb-2">
              {dashboard.previsoes.ocupacaoProximaSemana[0].ocupacaoEsperada}%
            </p>
            <p className="text-sm text-[#7a7369]">
              {dashboard.previsoes.ocupacaoProximaSemana[0].horariosDisponiveis.length} horários disponíveis
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-[#5c5650] mb-3">Risco de Churn</h4>
            <p className="text-3xl font-bold text-[#e85d3f] mb-2">
              {dashboard.previsoes.churnRisco.length}
            </p>
            <p className="text-sm text-[#7a7369]">
              pacientes em risco alto
            </p>
            <button className="mt-2 btn-sm btn-outline">
              Ver detalhes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 6.2 ANÁLISE DE PACIENTES

```typescript
interface AnalisePacientes {
  // Demografia
  demografia: {
    totalPacientes: number;
    pacientesAtivos: number;
    pacientesInativos: number;
    pacientesNovos: number; // Período
    
    porGenero: {
      masculino: number;
      feminino: number;
      outro: number;
    };
    
    porFaixaEtaria: {
      faixa: string; // "0-18", "19-30", etc
      quantidade: number;
      percentual: number;
    }[];
    
    porLocalizacao: {
      cidade: string;
      bairro: string;
      quantidade: number;
    }[];
  };
  
  // Comportamento
  comportamento: {
    frequenciaMedia: number; // consultas/mês
    ticketMedio: number;
    tempoVidaMedio: number; // meses desde primeira consulta
    
    porFrequencia: {
      categoria: 'high-frequency' | 'regular' | 'occasional' | 'one-time';
      quantidade: number;
      valorTotal: number;
    }[];
    
    horarioPreferido: {
      periodo: 'manha' | 'tarde' | 'noite';
      diaSemana: string;
      quantidade: number;
    }[];
    
    canalAquisicao: {
      canal: 'indicacao' | 'google' | 'redes-sociais' | 'convenio' | 'outro';
      quantidade: number;
      custoAquisicao: number;
      ltv: number;
      roi: number;
    }[];
  };
  
  // Saúde da Base
  saudeBase: {
    taxaRetencao: number; // %
    taxaChurn: number; // %
    taxaCrescimento: number; // %
    
    churnPorMotivo: {
      motivo: string;
      quantidade: number;
      percentual: number;
    }[];
    
    npsSegmentado: {
      segmento: string;
      score: number;
      promotores: number;
      detratores: number;
    }[];
  };
  
  // Segmentação RFV (Recência, Frequência, Valor)
  segmentacaoRFV: {
    vips: { quantidade: number; valorTotal: number; ltv: number };
    fies: { quantidade: number; valorTotal: number; ltv: number };
    regulares: { quantidade: number; valorTotal: number; ltv: number };
    ocasionais: { quantidade: number; valorTotal: number; ltv: number };
    inativos: { quantidade: number; valorTotal: number; ltv: number };
  };
}
```

---

## ⚙️ MÓDULO 7: CADASTROS E ADMINISTRATIVO

### 7.1 GESTÃO DE PROFISSIONAIS

```typescript
interface Profissional {
  id: string;
  
  // Dados Pessoais
  dadosPessoais: {
    nome: string;
    nomeExibicao: string; // Nome que aparece na agenda
    cpf: string;
    rg: string;
    dataNascimento: Date;
    genero: 'masculino' | 'feminino' | 'outro' | 'nao-informado';
    estadoCivil: string;
    foto?: string;
  };
  
  // Contato
  contato: {
    email: string;
    emailSecundario?: string;
    telefone: string;
    celular: string;
    whatsapp?: string;
  };
  
  // Endereço
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  
  // Profissional
  dadosProfissionais: {
    especialidade: string;
    subespecialidades?: string[];
    registroProfissional: string; // CRM, CRO, CREFITO, CRP
    ufRegistro: string;
    especialidadeCertificada: boolean;
    certificacoes?: {
      nome: string;
      instituicao: string;
      dataEmissao: Date;
      dataValidade?: Date;
      anexo?: string;
    }[];
    formacaoAcademica: {
      nivel: 'graduacao' | 'pos-graduacao' | 'mestrado' | 'doutorado';
      instituicao: string;
      curso: string;
      anoConclusao: number;
    }[];
  };
  
  // Vínculo
  vinculo: {
    tipo: 'clt' | 'pj' | 'autonomo' | 'cooperado';
    dataAdmissao: Date;
    dataDesligamento?: Date;
    status: 'ativo' | 'inativo' | 'ferias' | 'afastado' | 'desligado';
    cargoFuncao: string;
  };
  
  // Financeiro
  financeiro: {
    salarioBase?: number;
    modeloRemuneracao: 'fixo' | 'comissao' | 'misto';
    comissao?: {
      tipo: 'percentual' | 'fixo-por-atendimento';
      valor: number;
      porTipoAtendimento?: {
        tipo: string;
        valor: number;
      }[];
    };
    dadosBancarios: {
      banco: string;
      agencia: string;
      conta: string;
      tipoConta: 'corrente' | 'poupanca';
      pix?: string;
    };
    impostos: {
      regime: 'mei' | 'simples' | 'lucro-presumido' | 'clt';
      aliquotaISS?: number;
      aliquotaIRRF?: number;
    };
  };
  
  // Agenda
  configuracaoAgenda: {
    duracaoPadraoConsulta: number; // minutos
    intervaloEntreConsultas: number;
    horarioTrabalho: {
      diaSemana: 0 | 1 | 2 | 3 | 4 | 5 | 6;
      inicio: string; // "08:00"
      fim: string; // "18:00"
      intervaloAlmoco?: {
        inicio: string;
        fim: string;
      };
    }[];
    salas?: string[];
    aceitaEncaixe: boolean;
    limitePacientesDia?: number;
  };
  
  // Permissões
  permissoes: {
    role: 'admin' | 'medico' | 'psicologo' | 'fisioterapeuta' | 'dentista' | 
           'secretaria' | 'financeiro';
    modulos: {
      nome: string;
      permissoes: ('visualizar' | 'criar' | 'editar' | 'excluir' | 'aprovar')[];
    }[];
    nivelAcesso: 'total' | 'apenas-seus-pacientes' | 'somente-leitura';
  };
  
  // Estatísticas
  estatisticas?: {
    totalAtendimentos: number;
    atendimentosMes: number;
    faturamentoTotal: number;
    faturamentoMes: number;
    avaliacaoMedia: number;
    taxaRetorno: number;
    ticketMedio: number;
  };
  
  // Auditoria
  criadoEm: Date;
  atualizadoEm: Date;
  criadoPor: string;
}

// ===== COMPONENTE DE CADASTRO =====
export function CadastroProfissionalPage() {
  const { profissional, loading, salvar } = useProfissional();
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  
  const [formData, setFormData] = useState<Partial<Profissional>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };
  
  const handlePrevious = () => {
    setStep(step - 1);
  };
  
  const handleSubmit = async () => {
    if (validateAll()) {
      await salvar(formData);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="heading-xl">Cadastro de Profissional</h1>
        <p className="text-secondary">Preencha todos os dados do profissional</p>
      </div>
      
      {/* Progress Stepper */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          {[
            { num: 1, label: 'Dados Pessoais' },
            { num: 2, label: 'Dados Profissionais' },
            { num: 3, label: 'Vínculo e Financeiro' },
            { num: 4, label: 'Configuração Agenda' },
            { num: 5, label: 'Permissões' },
          ].map((s, index) => (
            <div key={s.num} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <motion.div
                  className={`flex h-12 w-12 items-center justify-center rounded-full font-bold text-white ${
                    step >= s.num 
                      ? 'bg-gradient-to-br from-[#4a7c65] to-[#3d6653]' 
                      : 'bg-[#d4cfc5]'
                  }`}
                  initial={false}
                  animate={{ 
                    scale: step === s.num ? 1.1 : 1,
                    boxShadow: step === s.num 
                      ? '0 8px 16px rgba(74, 124, 101, 0.25)'
                      : '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {step > s.num ? <Check className="h-6 w-6" /> : s.num}
                </motion.div>
                <p className={`mt-2 text-sm font-medium ${
                  step >= s.num ? 'text-[#4a7c65]' : 'text-[#7a7369]'
                }`}>
                  {s.label}
                </p>
              </div>
              
              {index < totalSteps - 1 && (
                <div className="flex-1 mx-4">
                  <div className={`h-1 rounded-full transition-colors ${
                    step > s.num ? 'bg-[#4a7c65]' : 'bg-[#e8e5df]'
                  }`} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Form Steps */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="card p-6"
        >
          {step === 1 && <StepDadosPessoais formData={formData} setFormData={setFormData} errors={errors} />}
          {step === 2 && <StepDadosProfissionais formData={formData} setFormData={setFormData} errors={errors} />}
          {step === 3 && <StepVinculoFinanceiro formData={formData} setFormData={setFormData} errors={errors} />}
          {step === 4 && <StepConfiguracaoAgenda formData={formData} setFormData={setFormData} errors={errors} />}
          {step === 5 && <StepPermissoes formData={formData} setFormData={setFormData} errors={errors} />}
        </motion.div>
      </AnimatePresence>
      
      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={step === 1}
          className="btn-ghost"
        >
          <ChevronLeft className="h-5 w-5" />
          Anterior
        </button>
        
        <div className="text-center">
          <p className="text-sm text-[#7a7369]">
            Passo {step} de {totalSteps}
          </p>
        </div>
        
        {step < totalSteps ? (
          <button onClick={handleNext} className="btn-primary">
            Próximo
            <ChevronRight className="h-5 w-5" />
          </button>
        ) : (
          <button onClick={handleSubmit} className="btn-premium">
            <Save className="h-5 w-5" />
            Salvar Profissional
          </button>
        )}
      </div>
    </div>
  );
}
```

### 7.2 GESTÃO DE CONVÊNIOS

```typescript
interface Convenio {
  id: string;
  
  // Dados Básicos
  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;
  inscricaoEstadual?: string;
  logo?: string;
  
  // Contato
  contato: {
    telefone: string;
    email: string;
    site?: string;
    contatoPrincipal: {
      nome: string;
      cargo: string;
      telefone: string;
      email: string;
    };
    contatoFinanceiro?: {
      nome: string;
      telefone: string;
      email: string;
    };
  };
  
  // Endereço
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  
  // Contrato
  contrato: {
    numeroContrato: string;
    dataInicio: Date;
    dataFim?: Date;
    renovacaoAutomatica: boolean;
    anexoContrato?: string;
    status: 'ativo' | 'suspenso' | 'encerrado';
  };
  
  // Financeiro
  financeiro: {
    tabelaPrecos: {
      procedimento: string;
      codigoTUSS?: string;
      valorConvenio: number;
      valorParticular: number;
      percentualDesconto: number;
    }[];
    
    formaPagamento: {
      tipo: 'boleto' | 'transferencia' | 'deposito';
      prazoRecebimento: number; // dias
      diaFechamento?: number; // dia do mês
      observacoes?: string;
    };
    
    dadosBancarios?: {
      banco: string;
      agencia: string;
      conta: string;
    };
  };
  
  // Regras de Autorização
  autorizacao: {
    requerAutorizacao: boolean;
    procedimentosNecessitamAutorizacao?: string[];
    prazoAutorizacao?: number; // dias
    formaAutorizacao: 'online' | 'email' | 'fax' | 'telefone';
    urlPortal?: string;
    loginPortal?: string;
    senhaPortal?: string; // Criptografada
  };
  
  // Estatísticas
  estatisticas?: {
    totalAtendimentos: number;
    atendimentosMes: number;
    faturamentoTotal: number;
    faturamentoMes: number;
    ticketMedio: number;
    prazoMedioRecebimento: number;
    taxaGlosa: number; // %
    valorGlosasTotal: number;
  };
  
  // Auditoria
  ativo: boolean;
  criadoEm: Date;
  atualizadoEm: Date;
}
```

### 7.3 CONFIGURAÇÕES DO SISTEMA

```typescript
interface ConfiguracaoSistema {
  // Clínica
  clinica: {
    nomeFantasia: string;
    razaoSocial: string;
    cnpj: string;
    inscricaoMunicipal?: string;
    logo: string;
    logoSecundaria?: string;
    favicon?: string;
    
    endereco: {
      cep: string;
      logradouro: string;
      numero: string;
      complemento?: string;
      bairro: string;
      cidade: string;
      estado: string;
    };
    
    contato: {
      telefone: string;
      whatsapp?: string;
      email: string;
      site?: string;
      redesSociais?: {
        instagram?: string;
        facebook?: string;
        linkedin?: string;
      };
    };
  };
  
  // Agenda
  agenda: {
    duracaoPadraoConsulta: number;
    intervaloMinimoConsultas: number;
    horarioAberturaClinica: string;
    horarioFechamentoClinica: string;
    diasFuncionamento: number[]; // 0-6 (Dom-Sáb)
    aceitaEncaixe: boolean;
    limitePacientesPorProfissional: number;
    bloqueioRetroativo: boolean; // Bloqueia edição de consultas passadas
    diasBloqueioRetroativo?: number;
  };
  
  // Financeiro
  financeiro: {
    moeda: 'BRL';
    regimeTributario: 'simples' | 'lucro-presumido' | 'lucro-real';
    aliquotaISS: number;
    dataFechamentoCaixa: number; // Dia do mês
    categoriasPadrao: CategoriaFinanceira[];
    aprovaçãoDespesasAcima: number; // Valor que requer aprovação
  };
  
  // Notificações
  notificacoes: {
    email: {
      ativo: boolean;
      servidorSMTP: string;
      porta: number;
      usuario: string;
      senha: string; // Criptografada
      remetente: string;
      nomeRemetente: string;
    };
    
    sms: {
      ativo: boolean;
      provedor: 'twilio' | 'zenvia' | 'outro';
      apiKey: string; // Criptografada
      numeroRemetente: string;
    };
    
    whatsapp: {
      ativo: boolean;
      apiKey: string; // Criptografada
      numeroConectado: string;
      mensagensPadrao: {
        confirmacao: string;
        lembrete24h: string;
        lembrete3h: string;
        reagendamento: string;
      };
    };
    
    temposEnvio: {
      confirmacao: number; // minutos após agendamento
      lembrete1: number; // horas antes
      lembrete2: number; // horas antes
    };
  };
  
  // Segurança
  seguranca: {
    senhaExpiraDias: number;
    tamanhoMinimoSenha: number;
    exigirCaracteresEspeciais: boolean;
    tentativasLoginMaximo: number;
    tempoSessaoMinutos: number;
    autenticacaoDoisFatores: boolean;
    logAuditoria: boolean;
    backupAutomatico: boolean;
    frequenciaBackupHoras: number;
  };
  
  // Integrações
  integracoes: {
    googleCalendar: {
      ativo: boolean;
      clientId?: string;
      clientSecret?: string;
    };
    
    pep: { // Prontuário Eletrônico
      ativo: boolean;
      provedor?: string;
      apiUrl?: string;
      apiKey?: string;
    };
    
    certificadoDigital: {
      ativo: boolean;
      tipo: 'A1' | 'A3';
      arquivo?: string;
      senha?: string;
      dataValidade?: Date;
    };
  };
}
```

---

## 🔒 SEGURANÇA E COMPLIANCE

### Controle de Acesso (RBAC)

```typescript
interface Role {
  id: string;
  nome: string;
  descricao: string;
  permissoes: Permissao[];
}

interface Permissao {
  modulo: 'agenda' | 'prontuario' | 'financeiro' | 'bi' | 'administrativo' | 'pacientes';
  recurso: string;
  acoes: ('visualizar' | 'criar' | 'editar' | 'excluir' | 'aprovar' | 'exportar')[];
  condicoes?: {
    campo: string;
    operador: '=' | '!=' | '>' | '<' | 'in' | 'not_in';
    valor: any;
  }[];
}

// Exemplos de roles:
const ROLES_PADRAO: Role[] = [
  {
    id: 'admin',
    nome: 'Administrador',
    descricao: 'Acesso total ao sistema',
    permissoes: [/* todas */],
  },
  {
    id: 'medico',
    nome: 'Médico',
    descricao: 'Acesso a consultas, prontuários e agenda própria',
    permissoes: [
      {
        modulo: 'agenda',
        recurso: 'consultas',
        acoes: ['visualizar', 'criar', 'editar'],
        condicoes: [{ campo: 'profissionalId', operador: '=', valor: '$userId' }],
      },
      {
        modulo: 'prontuario',
        recurso: 'evolucoes',
        acoes: ['visualizar', 'criar', 'editar'],
        condicoes: [{ campo: 'profissionalId', operador: '=', valor: '$userId' }],
      },
      {
        modulo: 'financeiro',
        recurso: 'repasses',
        acoes: ['visualizar'],
        condicoes: [{ campo: 'profissionalId', operador: '=', valor: '$userId' }],
      },
    ],
  },
  {
    id: 'secretaria',
    nome: 'Secretária',
    descricao: 'Gestão de agenda e cadastros',
    permissoes: [
      {
        modulo: 'agenda',
        recurso: 'consultas',
        acoes: ['visualizar', 'criar', 'editar', 'excluir'],
      },
      {
        modulo: 'pacientes',
        recurso: 'cadastros',
        acoes: ['visualizar', 'criar', 'editar'],
      },
      {
        modulo: 'prontuario',
        recurso: 'visualizacao',
        acoes: ['visualizar'],
      },
    ],
  },
  {
    id: 'financeiro',
    nome: 'Financeiro',
    descricao: 'Gestão financeira completa',
    permissoes: [
      {
        modulo: 'financeiro',
        recurso: '*',
        acoes: ['visualizar', 'criar', 'editar', 'aprovar', 'exportar'],
      },
      {
        modulo: 'bi',
        recurso: 'relatorios-financeiros',
        acoes: ['visualizar', 'exportar'],
      },
    ],
  },
];
```

### Auditoria

```typescript
interface LogAuditoria {
  id: string;
  timestamp: Date;
  usuario: {
    id: string;
    nome: string;
    role: string;
    ip: string;
    userAgent: string;
  };
  acao: 'criar' | 'editar' | 'excluir' | 'visualizar' | 'exportar' | 'login' | 'logout';
  modulo: string;
  recurso: string;
  recursoId?: string;
  dadosAnteriores?: any;
  dadosNovos?: any;
  sucesso: boolean;
  mensagemErro?: string;
}

// Todas as ações críticas devem gerar log:
// - Acesso a prontuários
// - Alterações financeiras
// - Exclusões
// - Exportações de dados
// - Alterações de permissões
```

---

## 📦 ESTRUTURA DE ARQUIVOS SUGERIDA

```
/src
  /components
    /financeiro
      /fluxo-caixa
        FluxoCaixaPage.tsx
        GraficoFluxoCaixa.tsx
        KPICard.tsx
        ModalNovoFluxo.tsx
      /contas-receber
        ContasReceberPage.tsx
        TabelaContas.tsx
        ModalCobranca.tsx
      /relatorios
        RelatoriosPage.tsx
        GeradorDRE.tsx
    
    /bi
      DashboardExecutivoPage.tsx
      AnalisePacientesPage.tsx
      PrevisõesIA.tsx
      
    /administrativo
      /profissionais
        ListaProfissionais.tsx
        CadastroProfissionalPage.tsx
        StepDadosPessoais.tsx
        StepDadosProfissionais.tsx
        StepVinculoFinanceiro.tsx
        StepConfiguracaoAgenda.tsx
        StepPermissoes.tsx
      /convenios
        ListaConvenios.tsx
        CadastroConvenio.tsx
        TabelaPrecos.tsx
      /configuracoes
        ConfiguracoesPage.tsx
        ConfigClinica.tsx
        ConfigFinanceiro.tsx
        ConfigNotificacoes.tsx
        ConfigSeguranca.tsx
        
  /lib
    /hooks
      useFluxoCaixa.ts
      useContasReceber.ts
      useDashboardExecutivo.ts
      useProfissional.ts
    /contexts
      FluxoCaixaContext.tsx
      BIContext.tsx
    /utils
      formatters.ts (formatCurrency, formatDate, etc)
      validators.ts
      calculators.ts (cálculos financeiros)
      
  /types
    financeiro.types.ts
    bi.types.ts
    administrativo.types.ts
```

---

## 🎯 PRÓXIMOS PASSOS DE IMPLEMENTAÇÃO

1. **Implementar Context de Fluxo de Caixa** com estado global
2. **Criar componentes de gráficos** usando Recharts
3. **Implementar formulários** com react-hook-form e validação
4. **Desenvolver KPI Cards** com animações de CountUp
5. **Criar sistema de filtros** avançados para cada módulo
6. **Implementar exportação** de relatórios (PDF/Excel)
7. **Desenvolver dashboard BI** com previsões
8. **Criar fluxo de cadastro** multi-step para profissionais
9. **Implementar gestão de convênios** e tabelas de preços
10. **Configurar permissões RBAC** e auditoria

---

**IMPORTANTE:** Todos os componentes devem seguir rigorosamente a identidade visual estabelecida (tipografia Darker Grotesque + Karla, paleta de cores, animações com Framer Motion, design humanizado e acolhedor).

