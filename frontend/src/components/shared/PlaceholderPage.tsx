import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface PlaceholderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  features?: string[];
}

export function PlaceholderPage({ title, description, icon: Icon, features }: PlaceholderProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-[#2b2926]" style={{ fontFamily: 'var(--font-heading)' }}>
          {title}
        </h1>
        <p className="mt-2 text-[#7a7369]">
          {description}
        </p>
      </div>

      {/* Coming Soon Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-12 text-center bg-gradient-to-br from-[#4a7c65]/5 to-[#6b9dd8]/5 border-2 border-[#4a7c65]/20"
      >
        <div className="flex justify-center mb-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4a7c65] to-[#3d6653]">
            <Icon className="h-12 w-12 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-[#2b2926] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
          Módulo em Desenvolvimento
        </h2>
        <p className="text-lg text-[#7a7369] mb-8 max-w-2xl mx-auto">
          Este módulo está sendo desenvolvido seguindo as melhores práticas de UX e com 
          foco na experiência humanizada do usuário.
        </p>

        {features && features.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="px-4 py-2 rounded-xl bg-white border-2 border-[#e8e5df] text-sm font-medium text-[#5c5650]"
              >
                {feature}
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-12 p-6 rounded-xl bg-white/50 inline-block">
          <p className="text-sm text-[#7a7369]">
            💡 <strong>Documentação técnica completa disponível em:</strong>
          </p>
          <p className="text-sm font-mono text-[#4a7c65] mt-2">
            /docs/ESPECIFICACAO_MODULOS_FINANCEIRO_BI_ADMIN.md
          </p>
        </div>
      </motion.div>
    </div>
  );
}
