import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ===== TIPOS E INTERFACES =====
export interface FluxoCaixa {
  id: string;
  data: Date;
  tipo: 'entrada' | 'saida';
  status: 'confirmado' | 'previsto' | 'atrasado';
  valor: number;
  categoria: string;
  descricao: string;
  origem?: 'consulta' | 'procedimento' | 'convenio' | 'produto' | 'outro';
  convenioId?: string;
  pacienteId?: string;
  profissionalId?: string;
  agendamentoId?: string;
  formaPagamento?: string;
  observacoes?: string;
}

export interface Alerta {
  id: string;
  tipo: 'info' | 'warning' | 'error' | 'success';
  titulo: string;
  mensagem: string;
  dataGeracao: Date;
}

export interface ProjecaoFluxo {
  periodo: { inicio: Date; fim: Date };
  saldoInicial: number;
  totalEntradas: number;
  totalSaidas: number;
  saldoFinal: number;
  detalhamento: FluxoCaixa[];
  alertas: Alerta[];
  timeline: {
    data: Date;
    entradasAcumuladas: number;
    saidasAcumuladas: number;
    saldo: number;
  }[];
  entradas: {
    confirmadas: number;
    previstas: number;
    total: number;
    porCategoria: { categoria: string; valor: number; percentual: number }[];
  };
  saidas: {
    confirmadas: number;
    previstas: number;
    total: number;
    porCategoria: { categoria: string; valor: number; percentual: number }[];
  };
  comparativoMesAnterior: {
    receita: { valor: number; variacao: number };
    despesa: { valor: number; variacao: number };
    saldo: { valor: number; variacao: number };
  };
}

export interface FiltrosFluxoCaixa {
  periodo: {
    inicio: Date;
    fim: Date;
    preset?: 'hoje' | 'semana' | 'mes' | 'trimestre' | 'ano' | 'customizado';
  };
  tipo?: 'entrada' | 'saida' | 'todos';
  status?: ('confirmado' | 'previsto' | 'atrasado')[];
  categorias?: string[];
}

interface FluxoCaixaContextData {
  fluxos: FluxoCaixa[];
  projecao: ProjecaoFluxo;
  loading: boolean;
  filtros: FiltrosFluxoCaixa;
  aplicarFiltros: (filtros: Partial<FiltrosFluxoCaixa>) => void;
  limparFiltros: () => void;
  adicionarFluxo: (fluxo: Omit<FluxoCaixa, 'id'>) => Promise<void>;
  atualizarFluxo: (id: string, dados: Partial<FluxoCaixa>) => Promise<void>;
  excluirFluxo: (id: string) => Promise<void>;
  registrarPagamentoConsulta: (dados: {
    agendamentoId: string;
    pacienteId: string;
    profissionalId: string;
    valor: number;
    formaPagamento: string;
    observacoes?: string;
  }) => Promise<void>;
  registrarDespesa: (dados: {
    categoria: string;
    descricao: string;
    valor: number;
    formaPagamento: string;
    observacoes?: string;
  }) => Promise<void>;
}

const FluxoCaixaContext = createContext<FluxoCaixaContextData>({} as FluxoCaixaContextData);

// ===== DADOS MOCKADOS PARA DEMONSTRAÇÃO =====
const gerarDadosMock = (): FluxoCaixa[] => {
  const hoje = new Date();
  const dados: FluxoCaixa[] = [];
  
  // Gerar dados dos últimos 30 dias
  for (let i = 30; i >= 0; i--) {
    const data = new Date(hoje);
    data.setDate(data.getDate() - i);
    
    // Entradas (consultas, convênios)
    if (Math.random() > 0.3) {
      dados.push({
        id: `ent-${i}-1`,
        data,
        tipo: 'entrada',
        status: i <= 2 ? 'previsto' : 'confirmado',
        valor: Math.random() * 800 + 200,
        categoria: 'Consultas Particulares',
        descricao: `Consulta - Paciente ${i}`,
        origem: 'consulta',
      });
    }
    
    if (Math.random() > 0.5) {
      dados.push({
        id: `ent-${i}-2`,
        data,
        tipo: 'entrada',
        status: i <= 5 ? 'previsto' : 'confirmado',
        valor: Math.random() * 600 + 300,
        categoria: 'Convênios',
        descricao: `Convênio Unimed - Lote ${i}`,
        origem: 'convenio',
        convenioId: 'unimed-001',
      });
    }
    
    // Saídas (despesas fixas e variáveis)
    if (data.getDate() === 5) {
      dados.push({
        id: `sai-${i}-1`,
        data,
        tipo: 'saida',
        status: 'confirmado',
        valor: 8500,
        categoria: 'Salários e Encargos',
        descricao: 'Folha de pagamento',
      });
    }
    
    if (data.getDate() === 10) {
      dados.push({
        id: `sai-${i}-2`,
        data,
        tipo: 'saida',
        status: 'confirmado',
        valor: 3200,
        categoria: 'Aluguel e Condomínio',
        descricao: 'Aluguel do consultório',
      });
    }
    
    if (Math.random() > 0.7) {
      dados.push({
        id: `sai-${i}-3`,
        data,
        tipo: 'saida',
        status: 'confirmado',
        valor: Math.random() * 300 + 50,
        categoria: 'Utilidades',
        descricao: 'Despesas operacionais',
      });
    }
  }
  
  // Adicionar projeções futuras (próximos 30 dias)
  for (let i = 1; i <= 30; i++) {
    const data = new Date(hoje);
    data.setDate(data.getDate() + i);
    
    // Entradas previstas
    if (Math.random() > 0.4) {
      dados.push({
        id: `fut-ent-${i}`,
        data,
        tipo: 'entrada',
        status: 'previsto',
        valor: Math.random() * 700 + 250,
        categoria: 'Consultas Particulares',
        descricao: `Consulta agendada`,
        origem: 'consulta',
      });
    }
    
    // Saídas previstas
    if (data.getDate() === 5) {
      dados.push({
        id: `fut-sai-${i}-1`,
        data,
        tipo: 'saida',
        status: 'previsto',
        valor: 8500,
        categoria: 'Salários e Encargos',
        descricao: 'Folha de pagamento (prevista)',
      });
    }
    
    if (data.getDate() === 10) {
      dados.push({
        id: `fut-sai-${i}-2`,
        data,
        tipo: 'saida',
        status: 'previsto',
        valor: 3200,
        categoria: 'Aluguel e Condomínio',
        descricao: 'Aluguel do consultório (previsto)',
      });
    }
  }
  
  return dados;
};

// ===== PROVIDER =====
export function FluxoCaixaProvider({ children }: { children: ReactNode }) {
  const [fluxos, setFluxos] = useState<FluxoCaixa[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState<FiltrosFluxoCaixa>({
    periodo: {
      inicio: new Date(new Date().setDate(1)), // Primeiro dia do mês
      fim: new Date(new Date().setMonth(new Date().getMonth() + 1, 0)), // Último dia do mês
      preset: 'mes',
    },
    tipo: 'todos',
  });

  // Carregar dados iniciais
  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      // Simular chamada à API
      await new Promise(resolve => setTimeout(resolve, 500));
      const dadosMock = gerarDadosMock();
      setFluxos(dadosMock);
      setLoading(false);
    };

    carregarDados();
  }, []);

  // Calcular projeção com base nos fluxos e filtros
  const calcularProjecao = (): ProjecaoFluxo => {
    const fluxosFiltrados = fluxos.filter(f => {
      const dataFluxo = new Date(f.data);
      const dentroIntervalo = dataFluxo >= filtros.periodo.inicio && dataFluxo <= filtros.periodo.fim;
      const tipoMatch = filtros.tipo === 'todos' || f.tipo === filtros.tipo;
      const statusMatch = !filtros.status || filtros.status.includes(f.status);
      const categoriaMatch = !filtros.categorias || filtros.categorias.includes(f.categoria);
      
      return dentroIntervalo && tipoMatch && statusMatch && categoriaMatch;
    });

    const entradas = fluxosFiltrados.filter(f => f.tipo === 'entrada');
    const saidas = fluxosFiltrados.filter(f => f.tipo === 'saida');

    const entradasConfirmadas = entradas
      .filter(e => e.status === 'confirmado')
      .reduce((sum, e) => sum + e.valor, 0);
    
    const entradasPrevistas = entradas
      .filter(e => e.status === 'previsto')
      .reduce((sum, e) => sum + e.valor, 0);

    const saidasConfirmadas = saidas
      .filter(s => s.status === 'confirmado')
      .reduce((sum, s) => sum + s.valor, 0);
    
    const saidasPrevistas = saidas
      .filter(s => s.status === 'previsto')
      .reduce((sum, s) => sum + s.valor, 0);

    // Calcular categorias
    const categoriasEntrada = new Map<string, number>();
    entradas.forEach(e => {
      const atual = categoriasEntrada.get(e.categoria) || 0;
      categoriasEntrada.set(e.categoria, atual + e.valor);
    });

    const categoriasSaida = new Map<string, number>();
    saidas.forEach(s => {
      const atual = categoriasSaida.get(s.categoria) || 0;
      categoriasSaida.set(s.categoria, atual + s.valor);
    });

    const totalEntradas = entradasConfirmadas + entradasPrevistas;
    const totalSaidas = saidasConfirmadas + saidasPrevistas;

    // Criar timeline para o gráfico
    const timeline: { data: Date; entradasAcumuladas: number; saidasAcumuladas: number; saldo: number }[] = [];
    let entradasAcc = 0;
    let saidasAcc = 0;
    
    const dias = Math.ceil((filtros.periodo.fim.getTime() - filtros.periodo.inicio.getTime()) / (1000 * 60 * 60 * 24));
    
    for (let i = 0; i <= dias; i++) {
      const data = new Date(filtros.periodo.inicio);
      data.setDate(data.getDate() + i);
      
      const fluxosDia = fluxosFiltrados.filter(f => {
        const dataFluxo = new Date(f.data);
        return dataFluxo.toDateString() === data.toDateString();
      });
      
      const entradasDia = fluxosDia.filter(f => f.tipo === 'entrada').reduce((sum, f) => sum + f.valor, 0);
      const saidasDia = fluxosDia.filter(f => f.tipo === 'saida').reduce((sum, f) => sum + f.valor, 0);
      
      entradasAcc += entradasDia;
      saidasAcc += saidasDia;
      
      timeline.push({
        data,
        entradasAcumuladas: entradasAcc,
        saidasAcumuladas: saidasAcc,
        saldo: entradasAcc - saidasAcc,
      });
    }

    // Gerar alertas
    const alertas: Alerta[] = [];
    const saldoProjetado = totalEntradas - totalSaidas;
    
    if (saldoProjetado < 0) {
      alertas.push({
        id: '1',
        tipo: 'error',
        titulo: 'Saldo Projetado Negativo',
        mensagem: `Atenção! O saldo projetado para o período é negativo: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(saldoProjetado)}`,
        dataGeracao: new Date(),
      });
    }

    if (saldoProjetado > 50000) {
      alertas.push({
        id: '2',
        tipo: 'info',
        titulo: 'Oportunidade de Investimento',
        mensagem: 'Saldo positivo alto. Considere aplicações financeiras.',
        dataGeracao: new Date(),
      });
    }

    return {
      periodo: filtros.periodo,
      saldoInicial: 15000, // Mock
      totalEntradas,
      totalSaidas,
      saldoFinal: 15000 + totalEntradas - totalSaidas,
      detalhamento: fluxosFiltrados,
      alertas,
      timeline,
      entradas: {
        confirmadas: entradasConfirmadas,
        previstas: entradasPrevistas,
        total: totalEntradas,
        porCategoria: Array.from(categoriasEntrada.entries()).map(([categoria, valor]) => ({
          categoria,
          valor,
          percentual: (valor / totalEntradas) * 100,
        })),
      },
      saidas: {
        confirmadas: saidasConfirmadas,
        previstas: saidasPrevistas,
        total: totalSaidas,
        porCategoria: Array.from(categoriasSaida.entries()).map(([categoria, valor]) => ({
          categoria,
          valor,
          percentual: (valor / totalSaidas) * 100,
        })),
      },
      comparativoMesAnterior: {
        receita: { valor: entradasConfirmadas * 0.9, variacao: 12.5 },
        despesa: { valor: saidasConfirmadas * 0.95, variacao: 5.3 },
        saldo: { valor: (entradasConfirmadas - saidasConfirmadas) * 0.85, variacao: 18.2 },
      },
    };
  };

  const projecao = calcularProjecao();

  const aplicarFiltros = (novosFiltros: Partial<FiltrosFluxoCaixa>) => {
    setFiltros(prev => ({
      ...prev,
      ...novosFiltros,
      periodo: novosFiltros.periodo ? { ...prev.periodo, ...novosFiltros.periodo } : prev.periodo,
    }));
  };

  const limparFiltros = () => {
    setFiltros({
      periodo: {
        inicio: new Date(new Date().setDate(1)),
        fim: new Date(new Date().setMonth(new Date().getMonth() + 1, 0)),
        preset: 'mes',
      },
      tipo: 'todos',
    });
  };

  const adicionarFluxo = async (fluxo: Omit<FluxoCaixa, 'id'>) => {
    const novoFluxo: FluxoCaixa = {
      ...fluxo,
      id: `fluxo-${Date.now()}`,
    };
    setFluxos(prev => [...prev, novoFluxo]);
  };

  const atualizarFluxo = async (id: string, dados: Partial<FluxoCaixa>) => {
    setFluxos(prev =>
      prev.map(f => (f.id === id ? { ...f, ...dados } : f))
    );
  };

  const excluirFluxo = async (id: string) => {
    setFluxos(prev => prev.filter(f => f.id !== id));
  };

  const registrarPagamentoConsulta = async (dados: {
    agendamentoId: string;
    pacienteId: string;
    profissionalId: string;
    valor: number;
    formaPagamento: string;
    observacoes?: string;
  }) => {
    const novoFluxo: FluxoCaixa = {
      id: `fluxo-${Date.now()}`,
      data: new Date(),
      tipo: 'entrada',
      status: 'confirmado',
      valor: dados.valor,
      categoria: 'Consultas Particulares',
      descricao: `Pagamento de consulta agendada`,
      origem: 'consulta',
      agendamentoId: dados.agendamentoId,
      pacienteId: dados.pacienteId,
      profissionalId: dados.profissionalId,
      formaPagamento: dados.formaPagamento,
      observacoes: dados.observacoes,
    };
    setFluxos(prev => [...prev, novoFluxo]);
  };

  const registrarDespesa = async (dados: {
    categoria: string;
    descricao: string;
    valor: number;
    formaPagamento: string;
    observacoes?: string;
  }) => {
    const novoFluxo: FluxoCaixa = {
      id: `fluxo-${Date.now()}`,
      data: new Date(),
      tipo: 'saida',
      status: 'confirmado',
      valor: dados.valor,
      categoria: dados.categoria,
      descricao: dados.descricao,
      formaPagamento: dados.formaPagamento,
      observacoes: dados.observacoes,
    };
    setFluxos(prev => [...prev, novoFluxo]);
  };

  return (
    <FluxoCaixaContext.Provider
      value={{
        fluxos,
        projecao,
        loading,
        filtros,
        aplicarFiltros,
        limparFiltros,
        adicionarFluxo,
        atualizarFluxo,
        excluirFluxo,
        registrarPagamentoConsulta,
        registrarDespesa,
      }}
    >
      {children}
    </FluxoCaixaContext.Provider>
  );
}

export const useFluxoCaixa = (): FluxoCaixaContextData => {
  const context = useContext(FluxoCaixaContext);
  if (!context || !context.projecao) {
    console.error('useFluxoCaixa deve ser usado dentro de FluxoCaixaProvider');
    // Retornar valores padrão seguros
    return {
      fluxos: [],
      projecao: {
        periodo: { inicio: new Date(), fim: new Date() },
        saldoInicial: 0,
        totalEntradas: 0,
        totalSaidas: 0,
        saldoFinal: 0,
        detalhamento: [],
        alertas: [],
        timeline: [],
        entradas: {
          confirmadas: 0,
          previstas: 0,
          total: 0,
          porCategoria: [],
        },
        saidas: {
          confirmadas: 0,
          previstas: 0,
          total: 0,
          porCategoria: [],
        },
        comparativoMesAnterior: {
          receita: { valor: 0, variacao: 0 },
          despesa: { valor: 0, variacao: 0 },
          saldo: { valor: 0, variacao: 0 },
        },
      },
      loading: false,
      filtros: {
        periodo: {
          inicio: new Date(),
          fim: new Date(),
          preset: 'mes',
        },
        tipo: 'todos',
      },
      aplicarFiltros: () => {},
      limparFiltros: () => {},
      adicionarFluxo: async () => {},
      atualizarFluxo: async () => {},
      excluirFluxo: async () => {},
      registrarPagamentoConsulta: async () => {},
      registrarDespesa: async () => {},
    };
  }
  return context;
};