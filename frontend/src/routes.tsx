import { createBrowserRouter, Navigate } from "react-router-dom";
import { LandingPage } from "./components/landing/LandingPage";
import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./components/dashboard/Dashboard";
import { AgendaProfissional } from "./components/agenda/AgendaProfissional";
import { Prontuario } from "./components/prontuario/Prontuario";
import { ProntuarioListing } from "./components/prontuario/ProntuarioListing";
import { Pacientes } from "./components/pacientes/Pacientes";
import { NotFound } from "./components/NotFound";
import { ErrorPage } from "./components/ErrorPage";
import { LoginPage } from "./components/auth/LoginPage";

// Financeiro
import { FinanceiroPage } from "./components/financeiro/FinanceiroPage";
import { FluxoCaixaPage } from "./components/financeiro/FluxoCaixaPage";
import { ContasPagarPage } from "./components/financeiro/ContasPagarPage";
import { ContasReceberPage } from "./components/financeiro/ContasReceberPage";
import { PlaceholderPage } from "./components/shared/PlaceholderPage";

// BI
import { DashboardExecutivoPlaceholder } from "./components/bi/DashboardExecutivoPlaceholder";

// Administrativo
import { ProfissionaisPage } from "./components/administrativo/ProfissionaisPage";


// Teste de Agendamento
import { TesteAgendamento } from "./pages/TesteAgendamento";

// Imports para placeholders
import {
  FileBarChart,
  Users as UsersIcon,
  TrendingUp,
  Sparkles,
  Building2,
  Settings
} from "lucide-react";

// Lazy loaded
import { lazy, Suspense } from "react";
const UsersManagement = lazy(() => import("./components/admin/UsersManagement"));

import { ModuleGuard } from "./components/auth/ModuleGuard";
import { AdminGuard } from "./components/auth/AdminGuard";

// Protected Route wrapper component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('auth_token');

  // Debug log
  console.log('[ProtectedRoute] Token exists:', !!token);

  if (!token) {
    console.log('[ProtectedRoute] Redirecting to /login');
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

// Home page - redirect to dashboard if authenticated, otherwise show landing
function HomePage() {
  const token = localStorage.getItem('auth_token');

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <LandingPage />;
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, Component: Dashboard },

      {
        element: <ModuleGuard module="agenda" />,
        children: [
          { path: "agenda", Component: AgendaProfissional },
          { path: "teste-agendamento", Component: TesteAgendamento },
        ]
      },

      {
        element: <ModuleGuard module="prontuario" />,
        children: [
          { path: "prontuario/:id", Component: Prontuario },
          { path: "prontuario", Component: ProntuarioListing },
          { path: "pacientes", Component: Pacientes },
        ]
      },

      {
        element: <ModuleGuard module="financeiro" />,
        children: [
          { path: "financeiro", Component: FinanceiroPage },
          { path: "financeiro/fluxo-caixa", Component: FluxoCaixaPage },
          {
            path: "financeiro/contas-receber", Component: ContasReceberPage
          },
          {
            path: "financeiro/contas-pagar", Component: ContasPagarPage
          },
          {
            path: "financeiro/relatorios", Component: () => <PlaceholderPage
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
            />
          },
        ]
      },

      {
        element: <ModuleGuard module="bi" />,
        children: [
          { path: "bi/dashboard-executivo", Component: DashboardExecutivoPlaceholder },
          {
            path: "bi/analise-pacientes", Component: () => <PlaceholderPage
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
            />
          },
          {
            path: "bi/analise-financeira", Component: () => <PlaceholderPage
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
            />
          },
          {
            path: "bi/previsoes", Component: () => <PlaceholderPage
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
            />
          },
        ]
      },

      {
        element: <AdminGuard />,
        children: [
          {
            path: "admin/profissionais", Component: ProfissionaisPage
          },
          {
            path: "admin/convenios", Component: () => <PlaceholderPage
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
            />
          },
          {
            path: "admin/usuarios",
            element: (
              <Suspense fallback={<div className="flex h-64 items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-[#4a7c65] border-t-transparent rounded-full" /></div>}>
                <UsersManagement />
              </Suspense>
            ),
          },
          {
            path: "admin/configuracoes", Component: () => <PlaceholderPage
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
            />
          },
        ]
      },

      { path: "*", Component: NotFound },
    ],
  },
]);
