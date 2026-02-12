import { createBrowserRouter } from "react-router";
import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./components/dashboard/Dashboard";
import { AgendaProfissional } from "./components/agenda/AgendaProfissional";
import { Prontuario } from "./components/prontuario/Prontuario";
import { Pacientes } from "./components/pacientes/Pacientes";
import { NotFound } from "./components/NotFound";

// Financeiro
import { FinanceiroPage } from "./components/financeiro/FinanceiroPage";
import { FluxoCaixaPage } from "./components/financeiro/FluxoCaixaPage";
import { PlaceholderPage } from "./components/shared/PlaceholderPage";

// BI
import { DashboardExecutivoPlaceholder } from "./components/bi/DashboardExecutivoPlaceholder";

// Administrativo
import { AdminPlaceholder } from "./components/administrativo/AdminPlaceholder";

// Teste de Agendamento
import { TesteAgendamento } from "./pages/TesteAgendamento";

// Imports para placeholders
import { 
  Receipt, 
  CreditCard, 
  FileBarChart, 
  Users as UsersIcon, 
  TrendingUp, 
  Sparkles,
  UserPlus,
  Building2,
  Settings 
} from "lucide-react";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "agenda", Component: AgendaProfissional },
      
      // Teste de Agendamento
      { path: "teste-agendamento", Component: TesteAgendamento },
      
      { path: "prontuario/:id", Component: Prontuario },
      { path: "prontuario", Component: () => <PlaceholderPage 
        title="Prontuário Eletrônico" 
        description="Selecione um paciente para visualizar o prontuário"
        icon={FileBarChart}
      /> },
      { path: "pacientes", Component: Pacientes },
      
      // Financeiro
      { path: "financeiro", Component: FinanceiroPage },
      { path: "financeiro/fluxo-caixa", Component: FluxoCaixaPage },
      { path: "financeiro/contas-receber", Component: () => <PlaceholderPage 
        title="Contas a Receber" 
        description="Gestão de recebimentos, cobranças e inadimplência"
        icon={Receipt}
        features={[
          'Dashboard de Recebimentos',
          'Gestão de Cobranças',
          'Envio Automático Multicanal',
          'Controle de Inadimplência',
          'Análise por Convênio'
        ]}
      /> },
      { path: "financeiro/contas-pagar", Component: () => <PlaceholderPage 
        title="Contas a Pagar" 
        description="Gestão de pagamentos, fornecedores e despesas"
        icon={CreditCard}
        features={[
          'Agenda de Pagamentos',
          'Aprovação de Despesas',
          'Gestão de Fornecedores',
          'Pagamentos Recorrentes',
          'Controle de Fluxo'
        ]}
      /> },
      { path: "financeiro/relatorios", Component: () => <PlaceholderPage 
        title="Relatórios Financeiros" 
        description="DRE, balancetes e análises contábeis"
        icon={FileBarChart}
        features={[
          'DRE Completo',
          'Balancete',
          'Análise de Comissões',
          'Impostos e Tributos',
          'Exportação Contábil'
        ]}
      /> },
      
      // Business Intelligence
      { path: "bi/dashboard-executivo", Component: DashboardExecutivoPlaceholder },
      { path: "bi/analise-pacientes", Component: () => <PlaceholderPage 
        title="Análise de Pacientes" 
        description="Demografia, comportamento e segmentação RFV"
        icon={UsersIcon}
        features={[
          'Demografia Detalhada',
          'Análise de Comportamento',
          'Segmentação RFV',
          'Taxa de Retenção',
          'Análise de Churn',
          'Canais de Aquisição'
        ]}
      /> },
      { path: "bi/analise-financeira", Component: () => <PlaceholderPage 
        title="Análise Financeira" 
        description="Métricas financeiras avançadas e comparativos"
        icon={TrendingUp}
        features={[
          'Análise de Rentabilidade',
          'Margem Operacional',
          'Ponto de Equilíbrio',
          'Análise de Custos',
          'Comparativos Históricos'
        ]}
      /> },
      { path: "bi/previsoes", Component: () => <PlaceholderPage 
        title="Previsões com IA" 
        description="Machine Learning para previsões de faturamento e ocupação"
        icon={Sparkles}
        features={[
          'Previsão de Faturamento',
          'Previsão de Ocupação',
          'Detecção de Churn',
          'Recomendações Inteligentes',
          'Análise de Tendências'
        ]}
      /> },
      
      // Administrativo
      { path: "admin/profissionais", Component: () => <PlaceholderPage 
        title="Gestão de Profissionais" 
        description="Cadastro completo com vínculo, financeiro e permissões"
        icon={UserPlus}
        features={[
          'Cadastro Multi-Step',
          'Dados Profissionais',
          'Vínculo e Financeiro',
          'Configuração de Agenda',
          'Controle de Permissões RBAC',
          'Estatísticas Individuais'
        ]}
      /> },
      { path: "admin/convenios", Component: () => <PlaceholderPage 
        title="Gestão de Convênios" 
        description="Contratos, tabelas de preços e regras de autorização"
        icon={Building2}
        features={[
          'Cadastro de Convênios',
          'Gestão de Contratos',
          'Tabelas de Preços',
          'Regras de Autorização',
          'Integração com Portais',
          'Análise de Glosas'
        ]}
      /> },
      { path: "admin/configuracoes", Component: () => <PlaceholderPage 
        title="Configurações do Sistema" 
        description="Parâmetros gerais, segurança e integrações"
        icon={Settings}
        features={[
          'Dados da Clínica',
          'Configurações de Agenda',
          'Parâmetros Financeiros',
          'Notificações Automáticas',
          'Segurança e Auditoria',
          'Integrações Externas'
        ]}
      /> },
      
      { path: "*", Component: NotFound },
    ],
  },
]);
