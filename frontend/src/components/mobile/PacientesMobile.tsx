import { useState, useMemo } from 'react';
import { Plus, Phone, MessageCircle, Filter, Search } from 'lucide-react';
import {
  MobileAppBar,
  FAB,
  MobileListCard,
} from '../mobile';
import { motion, AnimatePresence } from 'framer-motion';
import { pacientesMock } from '../../lib/types';

export function PacientesMobile() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('todos');


  const filters = [
    { id: 'todos', label: 'Todos' },
    { id: 'recentes', label: 'Recentes' },
    { id: 'ativos', label: 'Ativos' },
    { id: 'inativos', label: 'Inativos' },
  ];

  const filteredPacientes = useMemo(() => {
    return pacientesMock.filter((p) =>
      p.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.cpf.includes(searchQuery)
    );
  }, [searchQuery]);

  const getInitials = (nome: string) => {
    const names = nome.split(' ');
    return names[0][0] + (names[1]?.[0] || '');
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] pb-nav">
      {/* App Bar */}
      <MobileAppBar
        title="Pacientes"
        actions={
          <button className="p-2 text-[#4a7c65]">
            <Filter size={20} />
          </button>
        }
      />

      {/* Search Bar & Filters */}
      <div className="bg-white px-4 py-3 border-b border-[#e8e5df] sticky top-[56px] z-20">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a8a199]" size={20} />
          <input
            type="text"
            placeholder="Buscar por nome ou CPF..."
            className="w-full bg-[#f5f3ef] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#2b2926] placeholder:text-[#a8a199] outline-none focus:ring-2 focus:ring-[#4a7c65]/20 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${selectedFilter === filter.id
                ? 'bg-[#4a7c65] text-white shadow-sm'
                : 'bg-[#f5f3ef] text-[#5c5650] border border-transparent'
                }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Pacientes */}
      <div className="p-4 space-y-3">
        <div className="text-xs font-semibold text-[#7a7369] uppercase tracking-wider mb-2 ml-1">
          {filteredPacientes.length} {filteredPacientes.length === 1 ? 'paciente encontrado' : 'pacientes encontrados'}
        </div>

        <AnimatePresence mode="popLayout">
          {filteredPacientes.map((paciente, index) => (
            <motion.div
              key={paciente.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
            >
              <MobileListCard
                avatar={getInitials(paciente.nome)}
                title={paciente.nome}
                subtitle={
                  <div className="flex flex-col gap-0.5">
                    <span>{paciente.cpf}</span>
                    {/* Mock data fields */}
                    <span className="text-[10px] bg-[#e8e5df] px-1.5 py-0.5 rounded w-fit mt-1">
                      {paciente.condicoes[0] || 'Sem condições'}
                    </span>
                  </div>
                }
                trailing={
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `tel:${paciente.telefone}`;
                      }}
                      className="w-9 h-9 rounded-full bg-[#10b981]/10 flex items-center justify-center active:scale-95 transition-transform"
                      aria-label="Ligar"
                    >
                      <Phone size={18} className="text-[#10b981]" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `https://wa.me/${paciente.telefone.replace(/\D/g, '')}`;
                      }}
                      className="w-9 h-9 rounded-full bg-[#10b981]/10 flex items-center justify-center active:scale-95 transition-transform"
                      aria-label="WhatsApp"
                    >
                      <MessageCircle size={18} className="text-[#10b981]" />
                    </button>
                  </div>
                }
                onClick={() => {
                  // Navigate to patient details
                  // navigate(/dashboard/pacientes/${paciente.id})
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredPacientes.length === 0 && (
        <div className="text-center py-20 px-4">
          <div className="w-20 h-20 bg-[#f5f3ef] rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={32} className="text-[#a8a199]" />
          </div>
          <div className="text-lg font-bold text-[#2b2926] mb-2">
            Nenhum paciente encontrado
          </div>
          <div className="text-sm text-[#7a7369] max-w-[200px] mx-auto">
            Verifique o termo buscado ou adicione um novo cadastro.
          </div>
        </div>
      )}


      {/* FAB */}
      <FAB onClick={() => { }} label="Novo" variant="extended" icon={<Plus size={20} />} />
    </div>
  );
}
