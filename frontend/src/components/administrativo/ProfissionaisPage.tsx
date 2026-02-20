import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, UserPlus, Power, PowerOff, Edit2, AlertCircle } from 'lucide-react';
import { professionalsApi, Professional } from '../../lib/api/professionals';
import { especialidadeConfig } from '../../lib/types';
import { ProfissionalModal } from './ProfissionalModal';

export function ProfissionaisPage() {
  const [profissionais, setProfissionais] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [selectedProfissional, setSelectedProfissional] = useState<Professional | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await professionalsApi.getAdminAll();
      setProfissionais(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar profissionais');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleActive = async (profissional: Professional) => {
    try {
      if (profissional.active) {
        await professionalsApi.delete(profissional.id);
      } else {
        await professionalsApi.update(profissional.id, { active: true });
      }
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Erro ao alterar status do profissional');
    }
  };

  const handleEdit = (profissional: Professional) => {
    setSelectedProfissional(profissional);
    setShowModal(true);
  };

  const handleNew = () => {
    setSelectedProfissional(null);
    setShowModal(true);
  };

  const filtered = profissionais.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.registration_number && p.registration_number.toLowerCase().includes(search.toLowerCase())) ||
    p.specialty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#2b2926]" style={{ fontFamily: 'var(--font-heading)' }}>
            Profissionais
          </h1>
          <p className="mt-2 text-[#7a7369]">Gestão de médicos, dentistas, psicólogos e fisioterapeutas</p>
        </div>

        <button className="btn-primary" onClick={handleNew}>
          <Plus className="w-5 h-5 mr-2" />
          Novo Profissional
        </button>
      </div>

      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a7369] w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nome, especialidade ou registro..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10 w-full md:w-[400px]"
          />
        </div>
      </div>

      {error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold">Erro</h4>
            <p className="text-sm">{error}</p>
            <button onClick={fetchData} className="mt-2 text-sm font-semibold underline">Tentar novamente</button>
          </div>
        </div>
      ) : loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin h-8 w-8 border-4 border-[#4a7c65] border-t-transparent rounded-full" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center flex flex-col items-center">
          <div className="h-16 w-16 bg-[#f5f3ef] rounded-full flex items-center justify-center mb-4">
            <UserPlus className="w-8 h-8 text-[#7a7369]" />
          </div>
          <h3 className="text-xl font-bold text-[#2b2926] mb-2">Nenhum profissional encontrado</h3>
          <p className="text-[#7a7369] mb-4">
            {search ? 'Tente outros termos de busca.' : 'Você ainda não cadastrou nenhum profissional no sistema.'}
          </p>
          {!search && (
            <button className="btn-primary" onClick={handleNew}>
              <Plus className="w-5 h-5 mr-2" />
              Cadastrar Agora
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filtered.map((prof, i) => {
              const espConfig = especialidadeConfig[prof.specialty as keyof typeof especialidadeConfig];
              const badgeColor = espConfig?.cor || '#6b7280';
              const badgeBg = espConfig?.corClara || '#f3f4f6';
              const label = espConfig?.label || prof.specialty;

              const initiais = prof.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

              return (
                <motion.div
                  key={prof.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className={`card p-6 border-l-4 transition-all hover:shadow-md ${!prof.active ? 'opacity-60 bg-gray-50' : ''}`}
                  style={{ borderLeftColor: prof.color || badgeColor }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-sm"
                        style={{ backgroundColor: prof.color || badgeColor }}
                      >
                        {initiais}
                      </div>
                      <div>
                        <h3 className={`font-bold ${!prof.active ? 'text-gray-500 line-through' : 'text-[#2b2926]'}`}>
                          {prof.name}
                        </h3>
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full inline-block mt-1"
                          style={{ backgroundColor: badgeBg, color: badgeColor }}
                        >
                          {label}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    {prof.registration_number && (
                      <div className="flex items-center text-sm text-[#7a7369]">
                        <span className="font-medium mr-2">Registro:</span>
                        {prof.registration_number}
                      </div>
                    )}
                    {prof.phone && (
                      <div className="flex items-center text-sm text-[#7a7369]">
                        <span className="font-medium mr-2">Telefone:</span>
                        {prof.phone}
                      </div>
                    )}
                    {prof.email && (
                      <div className="flex items-center text-sm text-[#7a7369] truncate" title={prof.email}>
                        <span className="font-medium mr-2">E-mail:</span>
                        {prof.email}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-[#e8e5df]">
                    <button
                      className="flex-1 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 bg-white border border-[#e8e5df] text-[#5c5650] hover:bg-[#f5f3ef]"
                      onClick={() => handleEdit(prof)}
                    >
                      <Edit2 className="w-4 h-4" />
                      Editar
                    </button>
                    <button
                      className={`flex-1 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border ${prof.active
                        ? 'bg-red-50 text-red-600 hover:bg-red-100 border-red-200'
                        : 'bg-green-50 text-green-600 hover:bg-green-100 border-green-200'
                        }`}
                      onClick={() => handleToggleActive(prof)}
                    >
                      {prof.active ? (
                        <>
                          <PowerOff className="w-4 h-4" />
                          Desativar
                        </>
                      ) : (
                        <>
                          <Power className="w-4 h-4" />
                          Reativar
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {showModal && (
        <ProfissionalModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          profissional={selectedProfissional}
          onSuccess={() => {
            fetchData();
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
