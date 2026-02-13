import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  FileText,
  User,
  Phone,
  Mail,
  AlertTriangle,
  Heart,
  ChevronRight,
  Loader2,
  ClipboardList,
} from 'lucide-react';
import { patientsApi, Patient } from '../../lib/api/patients';

export function ProntuarioListing() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const data = await patientsApi.getAll();
        setPatients(data);
      } catch (err) {
        setError('Erro ao carregar pacientes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const filteredPatients = useMemo(() => {
    if (!searchTerm.trim()) return patients;
    const term = searchTerm.toLowerCase();
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.cpf?.includes(term) ||
        p.phone?.includes(term) ||
        p.email?.toLowerCase().includes(term)
    );
  }, [patients, searchTerm]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter((_, i, arr) => i === 0 || i === arr.length - 1)
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const getAge = (birthDate?: string) => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="h-8 w-8 text-[#4a7c65]" />
        </motion.div>
        <p className="ml-3 text-[#7a7369]">Carregando pacientes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center">
        <AlertTriangle className="h-12 w-12 text-red-400 mb-3" />
        <p className="text-[#5c5650]">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#4a7c65] to-[#3d6653]">
            <ClipboardList className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1
              className="text-2xl font-bold text-[#2b2926]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Prontuário Eletrônico
            </h1>
            <p className="text-sm text-[#a8a199]">
              Selecione um paciente para acessar o prontuário
            </p>
          </div>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-6"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#a8a199]" />
          <input
            type="text"
            placeholder="Buscar por nome, CPF, telefone ou e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-[#e8e5df] bg-white py-3.5 pl-12 pr-4 text-[#2b2926] placeholder-[#a8a199] shadow-sm transition-all focus:border-[#4a7c65] focus:outline-none focus:ring-2 focus:ring-[#4a7c65]/20"
            style={{ fontFamily: 'var(--font-heading)' }}
          />
        </div>
        {searchTerm && (
          <p className="mt-2 text-sm text-[#a8a199]">
            {filteredPatients.length} paciente(s) encontrado(s)
          </p>
        )}
      </motion.div>

      {/* Patient Cards */}
      {filteredPatients.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16"
        >
          <User className="h-16 w-16 text-[#ddd8d0] mb-4" />
          <p className="text-[#7a7369] font-medium">Nenhum paciente encontrado</p>
          <p className="text-sm text-[#a8a199] mt-1">
            {searchTerm ? 'Tente outro termo de busca' : 'Cadastre pacientes para acessar prontuários'}
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredPatients.map((patient, index) => {
              const age = getAge(patient.birth_date);
              const allergies = patient.allergies || [];
              const conditions = patient.medical_conditions || [];

              return (
                <motion.div
                  key={patient.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  layout
                >
                  <Link
                    to={`/prontuario/${patient.id}`}
                    className="group block rounded-2xl border border-[#e8e5df] bg-white p-5 shadow-sm transition-all hover:shadow-lg hover:border-[#4a7c65]/30 hover:-translate-y-0.5"
                  >
                    {/* Patient Header */}
                    <div className="flex items-start gap-4 mb-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#4a7c65] to-[#3d6653] text-white font-semibold text-sm">
                        {getInitials(patient.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3
                          className="font-semibold text-[#2b2926] truncate group-hover:text-[#4a7c65] transition-colors"
                          style={{ fontFamily: 'var(--font-heading)' }}
                        >
                          {patient.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-[#a8a199]">
                          {age !== null && (
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {age} anos
                            </span>
                          )}
                          {patient.gender && (
                            <span>• {patient.gender}</span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-[#ddd8d0] group-hover:text-[#4a7c65] transition-colors shrink-0 mt-1" />
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-1.5 mb-3">
                      {patient.phone && (
                        <div className="flex items-center gap-2 text-xs text-[#7a7369]">
                          <Phone className="h-3 w-3 text-[#a8a199]" />
                          <span className="truncate">{patient.phone}</span>
                        </div>
                      )}
                      {patient.email && (
                        <div className="flex items-center gap-2 text-xs text-[#7a7369]">
                          <Mail className="h-3 w-3 text-[#a8a199]" />
                          <span className="truncate">{patient.email}</span>
                        </div>
                      )}
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {allergies.slice(0, 2).map((allergy) => (
                        <span
                          key={allergy}
                          className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700 border border-amber-200"
                        >
                          <AlertTriangle className="h-2.5 w-2.5" />
                          {allergy}
                        </span>
                      ))}
                      {conditions.slice(0, 2).map((condition) => (
                        <span
                          key={condition}
                          className="inline-flex items-center gap-1 rounded-full bg-[#f0f5f3] px-2 py-0.5 text-[10px] font-medium text-[#4a7c65] border border-[#dce8e3]"
                        >
                          <Heart className="h-2.5 w-2.5" />
                          {condition}
                        </span>
                      ))}
                      {(allergies.length > 2 || conditions.length > 2) && (
                        <span className="text-[10px] text-[#a8a199] px-1">
                          +{allergies.length - 2 + conditions.length - 2} mais
                        </span>
                      )}
                    </div>

                    {/* Action hint */}
                    <div className="mt-3 pt-3 border-t border-[#f0ede8] flex items-center gap-2 text-xs text-[#a8a199] group-hover:text-[#4a7c65] transition-colors">
                      <FileText className="h-3.5 w-3.5" />
                      <span>Acessar prontuário</span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
