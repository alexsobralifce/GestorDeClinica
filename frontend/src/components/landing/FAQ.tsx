import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  { q: "O sistema é seguro e compatível com LGPD?", a: "Sim. Todos os dados são criptografados ponta a ponta e armazenados em servidores seguros no Brasil, em total conformidade com a LGPD e resoluções do CFM." },
  { q: "Posso usar em clínica multiprofissional?", a: "Absolutamente. O sistema foi desenhado para integrar médicos, dentistas, fisios e outros profissionais com prontuários compartilhados e permissões granulares." },
  { q: "Funciona sem internet?", a: "O aplicativo mobile permite acessar agenda e visualizar prontuários offline, sincronizando tudo assim que a conexão retornar." },
  { q: "Como funciona a migração de dados?", a: "Oferecemos importação facilitada de planilhas para cadastros. Para migrações complexas de outros sistemas, nossa equipe técnica pode auxiliar no processo." }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-[#faf9f7] py-20" id="faq">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="mb-12 text-center text-3xl font-bold text-[#1F2937]" style={{ fontFamily: '"Inter Tight", sans-serif' }}>
          Perguntas Frequentes
        </h2>

        <div className="space-y-4">
          {faqs.map((item, i) => (
            <div key={i} className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between p-6 text-left"
              >
                <span className="font-semibold text-[#1F2937]">{item.q}</span>
                {openIndex === i ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-0 text-[#6B7280]">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
