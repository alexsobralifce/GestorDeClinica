import { motion } from 'framer-motion';

export function HowItWorks() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-[#1F2937]" style={{ fontFamily: '"Inter Tight", sans-serif' }}>
            Comece em minutos. Sem complicação.
          </h2>
        </div>

        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="absolute left-0 top-12 hidden h-0.5 w-full bg-gray-100 lg:block"></div>

          <div className="grid gap-12 lg:grid-cols-4">
            {[
              { title: "1. Cadastre", desc: "Informações da clínica e profissionais em 5 min." },
              { title: "2. Configure", desc: "Defina horários e regras da agenda inteligente." },
              { title: "3. Atenda", desc: "Agenda, prontuário e prescrição num só lugar." },
              { title: "4. Evolua", desc: "Acompanhe métricas de crescimento em tempo real." }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="relative text-center"
              >
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border-8 border-white bg-[#f0f5f3] text-2xl font-bold text-[#4a7c65] shadow-sm relative z-10">
                  {i + 1}
                </div>
                <h3 className="mb-2 text-xl font-bold text-[#1F2937]">{step.title}</h3>
                <p className="text-sm text-[#6B7280]">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
