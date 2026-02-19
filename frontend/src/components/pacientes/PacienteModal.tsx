import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, Mail, Calendar, Droplet, AlertTriangle, Loader2 } from 'lucide-react';
import { usePacientes } from '../../lib/contexts/PacienteContext';
import { Patient } from '../../lib/api/patients';

interface PacienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  paciente?: Patient;
  mode: 'create' | 'edit';
}

export function PacienteModal({ isOpen, onClose, paciente, mode }: PacienteModalProps) {
  const { addPaciente, updatePaciente } = usePacientes();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    dataNascimento: '',
    telefone: '',
    email: '',
    // grupoSanguineo: '', // Removing as api/patients.ts doesn't support it yet
    alergias: '',
    condicoes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (paciente && mode === 'edit') {
      setFormData({
        nome: paciente.name,
        cpf: paciente.cpf || '',
        dataNascimento: paciente.birth_date ? paciente.birth_date.split('T')[0] : '',
        telefone: paciente.phone || '',
        email: paciente.email || '',
        // grupoSanguineo: paciente.blood_type || '', // Not in interface
        alergias: paciente.allergies ? paciente.allergies.join(', ') : '',
        condicoes: paciente.medical_conditions ? paciente.medical_conditions.join(', ') : '',
      });
    } else {
      setFormData({
        nome: '',
        cpf: '',
        dataNascimento: '',
        telefone: '',
        email: '',
        // grupoSanguineo: '',
        alergias: '',
        condicoes: '',
      });
    }
    setErrors({});
  }, [paciente, mode, isOpen]);

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    let formattedValue = value;
    if (name === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (name === 'telefone') {
      formattedValue = formatPhone(value);
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));

    // Limpar erro do campo
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (formData.cpf.replace(/\D/g, '').length !== 11) {
      newErrors.cpf = 'CPF inválido';
    }
    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }
    if (!formData.dataNascimento) {
      newErrors.dataNascimento = 'Data de nascimento é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);
    try {
      const pacienteData = {
        name: formData.nome,
        cpf: formData.cpf,
        birth_date: formData.dataNascimento,
        phone: formData.telefone,
        email: formData.email,
        // blood_type: formData.grupoSanguineo,
        allergies: formData.alergias ? formData.alergias.split(',').map(a => a.trim()).filter(Boolean) : [],
        medical_conditions: formData.condicoes ? formData.condicoes.split(',').map(c => c.trim()).filter(Boolean) : [],
      };

      if (mode === 'edit' && paciente) {
        await updatePaciente(paciente.id, pacienteData);
      } else {
        await addPaciente(pacienteData);
      }
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      // Could set a general error state here
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => !submitting && onClose()}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white border-b-2 border-[#e8e5df]">
            <div className="px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="heading-secondary mb-2">
                    {mode === 'edit' ? 'Editar Paciente' : 'Novo Paciente'}
                  </h2>
                  <p className="text-sm text-muted">
                    {mode === 'edit' ? 'Atualize as informações do paciente' : 'Preencha os dados para cadastrar novo paciente'}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="btn-icon flex-shrink-0 ml-4"
                  disabled={submitting}
                >
                  <X className="h-5 w-5 text-[#7a7369]" />
                </button>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-8">
            {/* Dados Pessoais */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#4a7c65] to-[#3d6653]">
                  <User className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#2b2926]" style={{ fontFamily: 'var(--font-heading)' }}>
                  Dados Pessoais
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-[#2b2926] mb-2.5">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    className={`input-field ${errors.nome ? 'border-[#e85d3f] focus:ring-[#e85d3f]/10' : ''}`}
                    placeholder="Digite o nome completo"
                    disabled={submitting}
                  />
                  {errors.nome && (
                    <p className="text-xs text-[#e85d3f] mt-2 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {errors.nome}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#2b2926] mb-2.5">
                    CPF *
                  </label>
                  <input
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    maxLength={14}
                    className={`input-field ${errors.cpf ? 'border-[#e85d3f] focus:ring-[#e85d3f]/10' : ''}`}
                    placeholder="000.000.000-00"
                    disabled={submitting}
                  />
                  {errors.cpf && (
                    <p className="text-xs text-[#e85d3f] mt-2 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {errors.cpf}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#2b2926] mb-2.5">
                    Data de Nascimento *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#7a7369] pointer-events-none" />
                    <input
                      type="date"
                      name="dataNascimento"
                      value={formData.dataNascimento}
                      onChange={handleChange}
                      className={`input-field pl-12 ${errors.dataNascimento ? 'border-[#e85d3f] focus:ring-[#e85d3f]/10' : ''}`}
                      disabled={submitting}
                    />
                  </div>
                  {errors.dataNascimento && (
                    <p className="text-xs text-[#e85d3f] mt-2 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {errors.dataNascimento}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Contato */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#6b9dd8] to-[#5a8bc7]">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#2b2926]" style={{ fontFamily: 'var(--font-heading)' }}>
                  Contato
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-[#2b2926] mb-2.5">
                    Telefone *
                  </label>
                  <input
                    type="text"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    maxLength={15}
                    className={`input-field ${errors.telefone ? 'border-[#e85d3f] focus:ring-[#e85d3f]/10' : ''}`}
                    placeholder="(00) 00000-0000"
                    disabled={submitting}
                  />
                  {errors.telefone && (
                    <p className="text-xs text-[#e85d3f] mt-2 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {errors.telefone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#2b2926] mb-2.5">
                    E-mail *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#7a7369] pointer-events-none" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`input-field pl-12 ${errors.email ? 'border-[#e85d3f] focus:ring-[#e85d3f]/10' : ''}`}
                      placeholder="email@exemplo.com"
                      disabled={submitting}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-[#e85d3f] mt-2 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Dados Clínicos */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#e85d3f] to-[#d54426]">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#2b2926]" style={{ fontFamily: 'var(--font-heading)' }}>
                  Dados Clínicos
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-5">
                {/* 
                <div>
                  <label className="block text-sm font-semibold text-[#2b2926] mb-2.5 flex items-center gap-2">
                    <Droplet className="h-4 w-4 text-[#e85d3f]" />
                    Grupo Sanguíneo
                  </label>
                  <select
                    name="grupoSanguineo"
                    value={formData.grupoSanguineo}
                    onChange={(e) => setFormData(prev => ({ ...prev, grupoSanguineo: e.target.value }))}
                    className="input-field"
                    disabled={submitting}
                  >
                    <option value="">Selecione</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                */}

                <div>
                  <label className="block text-sm font-semibold text-[#2b2926] mb-2.5">
                    Alergias
                  </label>
                  <input
                    type="text"
                    name="alergias"
                    value={formData.alergias}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Ex: Dipirona, Penicilina (separar por vírgula)"
                    disabled={submitting}
                  />
                  <p className="text-xs text-[#a8a199] mt-2">
                    Separe múltiplas alergias por vírgula
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#2b2926] mb-2.5">
                    Condições Pré-existentes
                  </label>
                  <textarea
                    name="condicoes"
                    value={formData.condicoes}
                    onChange={handleChange}
                    rows={3}
                    className="input-field resize-none"
                    placeholder="Ex: Hipertensão, Diabetes (separar por vírgula)"
                    disabled={submitting}
                  />
                  <p className="text-xs text-[#a8a199] mt-2">
                    Separe múltiplas condições por vírgula
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-6 border-t-2 border-[#e8e5df]">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                disabled={submitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-premium flex items-center gap-2"
                disabled={submitting}
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {mode === 'edit' ? 'Salvar Alterações' : 'Cadastrar Paciente'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}