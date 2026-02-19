import { motion } from 'framer-motion';
import {
  Calendar, Users, FileText, Video, DollarSign, BarChart3, Mic, Smartphone, Shield
} from 'lucide-react';

const features = [
  {
    icon: Calendar,
    title: "Agenda Inteligente",
    description: "Agendamento online, confirmações via WhatsApp e preenchimento de horários vagos com IA."
  },
  {
    icon: Users,
    title: "Prontuário Compartilhado",
    description: "Histórico unificado acessível por todos profissionais. Atendimento integrado entre especialidades."
  },
  {
    icon: FileText,
    title: "Prescrição Digital",
    description: "Receitas, atestados e laudos com assinatura ICP-Brasil. Envio automático."
  },
  {
    icon: Video,
    title: "Teleconsulta Integrada",
    description: "Atendimento remoto com prontuário e prescrição no mesmo fluxo. Conformidade CFM."
  },
  {
    icon: DollarSign,
    title: "Gestão Financeira",
    description: "Fluxo de caixa, contas a receber/pagar e faturamento TISS automatizado."
  },
  {
    icon: BarChart3,
    title: "Business Intelligence",
    description: "Relatórios em tempo real: ocupação, receita e produtividade por profissional."
  },
  {
    icon: Mic,
    title: "Evolução por Voz",
    description: "Transcrição automática de consultas. Economize 30 minutos por paciente."
  },
  {
    icon: Smartphone,
    title: "App Mobile",
    description: "Acesse agenda e prontuário em movimento. Sincronização offline."
  },
  {
    icon: Shield,
    title: "Segurança Total",
    description: "LGPD, criptografia ponta a ponta e auditoria completa de acessos."
  }
];

export function Features() {
  return (
    <section className="bg-[#FAFAFA] py-20" id="features">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-[#1F2937] md:text-4xl" style={{ fontFamily: '"Inter Tight", sans-serif' }}>
            Tudo que sua clínica precisa em uma plataforma
          </h2>
          <p className="mx-auto max-w-2xl text-[#6B7280]">
            Centralize sua operação, elimine papelada e ofereça uma experiência premium aos seus pacientes.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                className="group rounded-2xl bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#f0f5f3] text-[#4a7c65] transition-colors group-hover:bg-[#4a7c65] group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-[#1F2937]">{feature.title}</h3>
                <p className="text-[#6B7280]">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
