import { Check } from 'lucide-react';

const plans = [
  {
    name: "Essencial",
    price: "R$ 89",
    period: "/mês",
    desc: "Para profissionais autônomos",
    features: ["Agenda Inteligente", "Prontuário Eletrônico", "Prescrição Digital", "App Mobile", "Suporte por Email"]
  },
  {
    name: "Profissional",
    price: "R$ 149",
    period: "/mês",
    desc: "Para clínicas em crescimento",
    popular: true,
    features: ["Tudo do Essencial", "Teleconsulta Integrada", "Faturamento TISS", "Integração WhatsApp", "Suporte Prioritário"]
  },
  {
    name: "Enterprise",
    price: "Sob Consulta",
    period: "",
    desc: "Para redes de clínicas",
    features: ["Tudo do Profissional", "BI Avançado", "API Aberta", "Gestor de Conta", "SLA 99.9%"]
  }
];

export function Pricing() {
  return (
    <section className="bg-white py-20" id="pricing">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-[#1F2937]" style={{ fontFamily: '"Inter Tight", sans-serif' }}>
            Planos flexíveis para seu tamanho
          </h2>
          <p className="text-[#6B7280]">
            Comece grátis por 14 dias. Sem cartão de crédito.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 lg:gap-12">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative rounded-2xl border p-8 ${plan.popular
                ? 'border-[#4a7c65] bg-white ring-4 ring-[#4a7c65]/10'
                : 'border-gray-200 bg-[#FAFAFA]'
                }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#4a7c65] px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                  Mais Popular
                </div>
              )}

              <h3 className="text-lg font-semibold text-[#1F2937]">{plan.name}</h3>
              <p className="mt-2 text-sm text-[#6B7280]">{plan.desc}</p>

              <div className="my-6 flex items-baseline">
                <span className="text-4xl font-bold text-[#1F2937]">{plan.price}</span>
                <span className="text-[#6B7280]">{plan.period}</span>
              </div>

              <button
                className={`mb-8 w-full rounded-xl py-3 font-semibold transition-transform hover:scale-105 ${plan.popular
                  ? 'bg-[#4a7c65] text-white shadow-lg shadow-[#4a7c65]/25'
                  : 'bg-white border border-gray-200 text-[#374151] hover:bg-gray-50'
                  }`}
              >
                Escolher {plan.name}
              </button>

              <ul className="space-y-4">
                {plan.features.map((feat, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm text-[#6B7280]">
                    <Check className="h-5 w-5 shrink-0 text-[#10B981]" />
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
