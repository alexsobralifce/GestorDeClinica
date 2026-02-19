import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';

interface HeroProps {
  onCtaClick: () => void;
  onBookingClick: () => void;
}

export function Hero({ onCtaClick, onBookingClick }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] translate-x-1/2 -translate-y-1/4 rounded-full bg-[#f0f5f3]/50 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -z-10 h-[400px] w-[400px] -translate-x-1/3 translate-y-1/4 rounded-full bg-[#dce8e3]/50 blur-3xl"></div>

      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#f0f5f3] px-4 py-1.5 text-sm font-medium text-[#4a7c65]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4a7c65] opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#4a7c65]"></span>
              </span>
              Nova Geração de Gestão Clínica
            </div>

            <h1 className="mb-6 text-4xl font-bold leading-tight text-[#1F2937] md:text-5xl lg:text-6xl" style={{ fontFamily: '"Inter Tight", sans-serif' }}>
              Gerencie sua clínica com <span className="text-[#4a7c65]">inteligência</span>. <br />
              Atenda com <span className="text-[#4a7c65]">excelência</span>.
            </h1>

            <p className="mb-8 text-lg text-[#6B7280] md:text-xl">
              Agenda automatizada, prontuário compartilhado e IA para economizar seu tempo. Mais de 500 clínicas já transformaram a gestão com HealthSync Pro.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                onClick={onBookingClick}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#4a7c65] px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-[#3d6653] hover:shadow-[#4a7c65]/25"
              >
                Agendar Consulta
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                onClick={onCtaClick}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-8 py-4 text-lg font-medium text-[#374151] transition-all hover:border-[#4a7c65] hover:text-[#4a7c65] hover:bg-[#f0f5f3]"
              >
                Área do Cliente
              </button>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 text-sm font-medium text-[#6B7280]">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[#4a7c65]" />
                LGPD Compliance
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[#4a7c65]" />
                Resolução CFM 1.821
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[#4a7c65]" />
                Assinatura ICP-Brasil
              </div>
            </div>
          </motion.div>

          {/* Visual Content — Desktop: Mockup, Mobile: Feature Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            {/* Desktop Mockup — hidden on mobile */}
            <div className="hidden lg:block relative z-10 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl transition-transform hover:scale-[1.01]">
              <div className="border-b border-gray-100 bg-gray-50/50 p-4 flex gap-2">
                <div className="h-3 w-3 rounded-full bg-red-400"></div>
                <div className="h-3 w-3 rounded-full bg-amber-400"></div>
                <div className="h-3 w-3 rounded-full bg-green-400"></div>
              </div>
              <div className="aspect-[16/10] w-full bg-[#faf9f7] relative group">
                <div className="absolute inset-4 grid grid-cols-12 gap-4">
                  <div className="col-span-3 rounded-xl bg-white shadow-sm p-4 space-y-3">
                    <div className="h-8 w-8 rounded-lg bg-[#dce8e3] mb-6"></div>
                    <div className="h-2 w-20 rounded bg-gray-100"></div>
                    <div className="h-2 w-16 rounded bg-gray-100"></div>
                    <div className="h-2 w-24 rounded bg-gray-100"></div>
                  </div>
                  <div className="col-span-9 space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-24 rounded-xl bg-white shadow-sm p-4">
                        <div className="h-2 w-12 bg-gray-100 rounded mb-2"></div>
                        <div className="h-6 w-16 bg-[#dce8e3] rounded"></div>
                      </div>
                      <div className="h-24 rounded-xl bg-white shadow-sm p-4">
                        <div className="h-2 w-12 bg-gray-100 rounded mb-2"></div>
                        <div className="h-6 w-16 bg-[#dce8e3] rounded"></div>
                      </div>
                      <div className="h-24 rounded-xl bg-white shadow-sm p-4">
                        <div className="h-2 w-12 bg-gray-100 rounded mb-2"></div>
                        <div className="h-6 w-16 bg-[#dce8e3] rounded"></div>
                      </div>
                    </div>
                    <div className="h-64 rounded-xl bg-white shadow-sm p-4">
                      <div className="flex justify-between mb-4">
                        <div className="h-4 w-32 bg-gray-100 rounded"></div>
                        <div className="h-8 w-24 bg-[#4a7c65] rounded text-white text-xs flex items-center justify-center">Novo Agendamento</div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-12 w-full bg-[#f0f5f3] rounded border border-gray-100"></div>
                        <div className="h-12 w-full bg-[#f0f5f3] rounded border border-gray-100"></div>
                        <div className="h-12 w-full bg-[#f0f5f3] rounded border border-gray-100"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="absolute -right-8 top-20 rounded-xl bg-white p-4 shadow-xl border border-gray-100 z-20"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#dcfce7] flex items-center justify-center text-[#166534] font-bold">✓</div>
                    <div>
                      <div className="text-sm font-bold text-gray-800">Consulta Confirmada</div>
                      <div className="text-xs text-gray-500">Via WhatsApp (IA)</div>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                  className="absolute -left-8 bottom-20 rounded-xl bg-white p-4 shadow-xl border border-gray-100 z-20"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#dce8e3] flex items-center justify-center text-[#3d6653] font-bold">DOC</div>
                    <div>
                      <div className="text-sm font-bold text-gray-800">Receita Assinada</div>
                      <div className="text-xs text-gray-500">Enviada para paciente</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
            {/* Glow effect — desktop only */}
            <div className="hidden lg:block absolute -inset-4 -z-10 bg-gradient-to-tr from-[#4a7c65]/20 to-[#3d6653]/20 blur-2xl rounded-[30px]"></div>

            {/* Mobile Feature Cards — visible only on mobile/tablet */}
            <div className="grid grid-cols-3 gap-3 lg:hidden mt-4">
              {[
                {
                  icon: '✓',
                  iconBg: 'bg-[#dcfce7]',
                  iconColor: 'text-[#166534]',
                  title: 'Consulta Confirmada',
                  subtitle: 'Via WhatsApp (IA)',
                  delay: 0.3,
                },
                {
                  icon: 'DOC',
                  iconBg: 'bg-[#dce8e3]',
                  iconColor: 'text-[#3d6653]',
                  title: 'Receita Assinada',
                  subtitle: 'Enviada ao paciente',
                  delay: 0.45,
                },
                {
                  icon: '+',
                  iconBg: 'bg-[#4a7c65]',
                  iconColor: 'text-white',
                  title: 'Novo Agendamento',
                  subtitle: 'Online 24h',
                  delay: 0.6,
                },
              ].map((item) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: item.delay, duration: 0.4 }}
                  className="flex flex-col items-center text-center gap-2 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm"
                >
                  <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${item.iconBg} ${item.iconColor}`}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800 leading-tight">{item.title}</p>
                    <p className="text-[10px] text-gray-500 leading-tight mt-0.5">{item.subtitle}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
