import { motion } from 'framer-motion';

const professionals = [
  {
    name: "Dra. Ana Carolina",
    role: "Cardiologista",
    crm: "CRM-SP 145.892",
    quote: "Reduzi 40% do tempo administrativo. Agora foco no que importa: meus pacientes.",
    color: "bg-[#dce8e3] text-[#1f332b]",
    initials: "AC"
  },
  {
    name: "Dr. Roberto Almeida",
    role: "Fisioterapeuta",
    crm: "CREFITO-3 98.765-F",
    quote: "O prontuário compartilhado facilita o trabalho em equipe. Atendimento integrado.",
    color: "bg-[#e8e5df] text-[#3f3d38]",
    initials: "RA"
  },
  {
    name: "Dra. Juliana Costa",
    role: "Dentista",
    crm: "CRO-RJ 32.451",
    quote: "Agendamento inteligente eliminou faltas. Minha agenda está sempre otimizada.",
    color: "bg-[#f0f5f3] text-[#4a7c65]",
    initials: "JC"
  },
  {
    name: "Dr. Marcos Silva",
    role: "Ortopedista",
    crm: "CRM-MG 78.123",
    quote: "Prescrição digital com assinatura ICP-Brasil agilizou tudo.",
    color: "bg-[#dce8e3] text-[#1f332b]",
    initials: "MS"
  }
];

export function SocialProof() {
  return (
    <section className="bg-white py-20" id="testimonials">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-[#1F2937]" style={{ fontFamily: '"Inter Tight", sans-serif' }}>
            Profissionais que confiam no HealthSync
          </h2>
          <p className="text-[#6B7280]">
            Junte-se a especialistas de diversas áreas que transformaram sua gestão
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {professionals.map((prof, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group rounded-2xl border border-gray-100 bg-[#FAFAFA] p-6 transition-all hover:bg-white hover:shadow-lg"
            >
              <div className="mb-4 flex items-center gap-4">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center font-bold ${prof.color}`}>
                  {prof.initials}
                </div>
                <div>
                  <h3 className="font-semibold text-[#1F2937]">{prof.name}</h3>
                  <p className="text-xs font-medium text-[#6B7280]">{prof.role}</p>
                  <p className="text-[10px] text-gray-400">{prof.crm}</p>
                </div>
              </div>
              <p className="italic text-[#4B5563]">"{prof.quote}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
