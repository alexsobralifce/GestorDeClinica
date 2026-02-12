import { useState } from 'react';
import { Plus, Phone, MessageCircle } from 'lucide-react';
import {
  BottomNavigation,
  MobileAppBar,
  FAB,
  SearchBarMobile,
  MobileListCard,
} from '../mobile';
import { motion } from 'motion/react';

export function PacientesMobile() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('todos');

  // Dados de exemplo
  const pacientes = [
    {
      id: '1',
      nome: 'Maria Silva',
      idade: 45,
      cpf: '***.***.***-01',
      convenio: 'Unimed',
      ultimaConsulta: 'Há 3 dias',
      telefone: '(85) 99999-9999',
    },
    {
      id: '2',
      nome: 'Carlos Oliveira',
      idade: 32,
      convenio: 'Particular',
      ultimaConsulta: 'Há 1 semana',
      telefone: '(85) 98888-8888',
    },
    {
      id: '3',
      nome: 'Beatriz Almeida',
      idade: 58,
      convenio: 'Amil',
      ultimaConsulta: 'Há 2 semanas',
      telefone: '(85) 97777-7777',
    },
    {
      id: '4',
      nome: 'Rafael Santos',
      idade: 28,
      convenio: 'Particular',
      ultimaConsulta: 'Há 1 mês',
      telefone: '(85) 96666-6666',
    },
    {
      id: '5',
      nome: 'Juliana Costa',
      idade: 35,
      convenio: 'Bradesco',
      ultimaConsulta: 'Há 2 meses',
      telefone: '(85) 95555-5555',
    },
    {
      id: '6',
      nome: 'Pedro Ferreira',
      idade: 42,
      convenio: 'Unimed',
      ultimaConsulta: 'Há 3 meses',
      telefone: '(85) 94444-4444',
    },
  ];

  const filters = [
    { id: 'todos', label: 'Todos' },
    { id: 'convenio', label: 'Convênio' },
    { id: 'particular', label: 'Particular' },
    { id: 'inadimplentes', label: 'Inadimplentes' },
  ];

  const filteredPacientes = pacientes.filter((p) =>
    p.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (nome: string) => {
    const names = nome.split(' ');
    return names[0][0] + (names[1]?.[0] || '');
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] pb-nav">
      {/* App Bar */}
      <MobileAppBar title="Pacientes" />

      {/* Search Bar */}
      <SearchBarMobile
        placeholder="Buscar por nome, CPF..."
        value={searchQuery}
        onChange={setSearchQuery}
      />

      {/* Filter Chips */}
      <div className="flex gap-2 px-4 py-2 overflow-x-auto scrollbar-hide">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setSelectedFilter(filter.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedFilter === filter.id
                ? 'bg-[#4a7c65] text-white'
                : 'bg-white text-[#5c5650] border border-[#e8e5df]'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Header com contador */}
      <div className="px-4 py-3 bg-white border-b border-[#e8e5df]">
        <div className="text-sm text-[#7a7369]">
          {filteredPacientes.length} {filteredPacientes.length === 1 ? 'paciente' : 'pacientes'}
        </div>
      </div>

      {/* Lista de Pacientes */}
      <div className="bg-white">
        {filteredPacientes.map((paciente, index) => (
          <motion.div
            key={paciente.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <MobileListCard
              avatar={getInitials(paciente.nome)}
              title={paciente.nome}
              subtitle={`${paciente.idade} anos • ${paciente.convenio}`}
              trailing={
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-[#7a7369]">{paciente.ultimaConsulta}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `tel:${paciente.telefone}`;
                      }}
                      className="w-8 h-8 rounded-full bg-[#10b981]/10 flex items-center justify-center"
                      aria-label="Ligar"
                    >
                      <Phone size={16} className="text-[#10b981]" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `https://wa.me/${paciente.telefone.replace(/\D/g, '')}`;
                      }}
                      className="w-8 h-8 rounded-full bg-[#10b981]/10 flex items-center justify-center"
                      aria-label="WhatsApp"
                    >
                      <MessageCircle size={16} className="text-[#10b981]" />
                    </button>
                  </div>
                </div>
              }
              showChevron={false}
              onClick={() => {
                // Navigate to patient details
              }}
            />
          </motion.div>
        ))}
      </div>

      {filteredPacientes.length === 0 && (
        <div className="text-center py-12 px-4">
          <div className="w-16 h-16 bg-[#f5f3ef] rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus size={32} className="text-[#a8a199]" />
          </div>
          <div className="text-lg font-semibold text-[#2b2926] mb-2">
            Nenhum paciente encontrado
          </div>
          <div className="text-sm text-[#7a7369]">
            Tente ajustar sua busca ou adicione um novo paciente
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* FAB */}
      <FAB onClick={() => {}} label="Novo Paciente" variant="extended" />
    </div>
  );
}
