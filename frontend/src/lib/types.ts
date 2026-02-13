export interface Paciente {
  id: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  email: string;
  foto?: string;
  alergias: string[];
  condicoes: string[];
  grupoSanguineo: string;
}

export interface Profissional {
  id: string;
  nome: string;
  especialidade: 'medicina' | 'fisioterapia' | 'odontologia' | 'psicologia';
  foto?: string;
  conselho: string;
  numeroConselho: string;
}

export interface Agendamento {
  id: string;
  pacienteId: string;
  profissionalId: string;
  data: string;
  horaInicio: string;
  horaFim: string;
  duracao: number; // Duration in minutes
  tipo: 'primeira-consulta' | 'retorno' | 'sessao-terapeutica' | 'teleconsulta' | 'telemedicina';
  status: 'confirmado' | 'pendente' | 'em-atendimento' | 'concluido' | 'faltou' | 'cancelado';
  sala?: string;
  observacoes?: string;
}

export interface RegistroProntuario {
  id: string;
  pacienteId: string;
  profissionalId: string;
  data: string;
  especialidade: 'medicina' | 'fisioterapia' | 'odontologia' | 'psicologia';
  tipo: 'consulta' | 'evolucao' | 'exame' | 'prescricao';
  titulo: string;
  conteudo: string;
  anexos?: {
    id: string;
    nome: string;
    tipo: string;
    url: string;
  }[];
}

export interface Medicamento {
  id: string;
  nome: string;
  principioAtivo: string;
  classe: string;
  interacoes: string[];
}

// Mock Data
export const pacientesMock: Paciente[] = [
  {
    id: '1',
    nome: 'Maria Silva Santos',
    cpf: '123.456.789-00',
    dataNascimento: '1985-03-15',
    telefone: '(11) 98765-4321',
    email: 'maria.silva@email.com',
    alergias: ['Dipirona', 'Penicilina'],
    condicoes: ['Hipertensão', 'Diabetes tipo 2'],
    grupoSanguineo: 'A+',
  },
  {
    id: '2',
    nome: 'João Pedro Oliveira',
    cpf: '987.654.321-00',
    dataNascimento: '1992-07-22',
    telefone: '(11) 97654-3210',
    email: 'joao.oliveira@email.com',
    alergias: [],
    condicoes: ['Asma'],
    grupoSanguineo: 'O+',
  },
  {
    id: '3',
    nome: 'Ana Carolina Ferreira',
    cpf: '456.789.123-00',
    dataNascimento: '1978-11-30',
    telefone: '(11) 96543-2109',
    email: 'ana.ferreira@email.com',
    alergias: ['Ibuprofeno'],
    condicoes: ['Fibromialgia', 'Ansiedade'],
    grupoSanguineo: 'B+',
  },
];

export const profissionaisMock: Profissional[] = [
  {
    id: '1',
    nome: 'Dr. Carlos Eduardo Mendes',
    especialidade: 'medicina',
    conselho: 'CRM-SP',
    numeroConselho: '123456',
  },
  {
    id: '2',
    nome: 'Dra. Juliana Costa',
    especialidade: 'fisioterapia',
    conselho: 'CREFITO-SP',
    numeroConselho: '234567',
  },
  {
    id: '3',
    nome: 'Dr. Roberto Almeida',
    especialidade: 'odontologia',
    conselho: 'CRO-SP',
    numeroConselho: '345678',
  },
  {
    id: '4',
    nome: 'Dra. Patricia Souza',
    especialidade: 'psicologia',
    conselho: 'CRP-SP',
    numeroConselho: '456789',
  },
];

export const agendamentosMock: Agendamento[] = [
  {
    id: '1',
    pacienteId: '1',
    profissionalId: '1',
    data: '2026-02-13',
    horaInicio: '09:00',
    horaFim: '09:30',
    duracao: 30,
    tipo: 'retorno',
    status: 'confirmado',
    sala: 'Consultório 1',
  },
  {
    id: '2',
    pacienteId: '2',
    profissionalId: '2',
    data: '2026-02-13',
    horaInicio: '10:00',
    horaFim: '11:00',
    duracao: 60,
    tipo: 'sessao-terapeutica',
    status: 'confirmado',
    sala: 'Sala de Fisioterapia',
  },
  {
    id: '3',
    pacienteId: '3',
    profissionalId: '4',
    data: '2026-02-13',
    horaInicio: '14:00',
    horaFim: '15:00',
    duracao: 60,
    tipo: 'primeira-consulta',
    status: 'pendente',
    sala: 'Consultório 3',
  },
  {
    id: '4',
    pacienteId: '1',
    profissionalId: '3',
    data: '2026-02-14',
    horaInicio: '11:00',
    horaFim: '11:45',
    duracao: 45,
    tipo: 'retorno',
    status: 'confirmado',
    sala: 'Consultório Odontológico',
  },
  {
    id: '5',
    pacienteId: '2',
    profissionalId: '1',
    data: '2026-02-14',
    horaInicio: '15:30',
    horaFim: '16:00',
    duracao: 30,
    tipo: 'teleconsulta',
    status: 'pendente',
  },
];

export const prontuariosMock: RegistroProntuario[] = [
  {
    id: '1',
    pacienteId: '1',
    profissionalId: '1',
    data: '2026-02-05T09:30:00',
    especialidade: 'medicina',
    tipo: 'consulta',
    titulo: 'Consulta de Rotina - Controle de Hipertensão',
    conteudo: 'Paciente comparece para consulta de rotina. Relata adesão ao tratamento com Losartana 50mg. PA aferida: 130/85 mmHg. Ausculta cardíaca sem alterações. Solicitados exames de rotina (hemograma, glicemia, perfil lipídico).',
  },
  {
    id: '2',
    pacienteId: '1',
    profissionalId: '2',
    data: '2026-01-28T14:00:00',
    especialidade: 'fisioterapia',
    tipo: 'evolucao',
    titulo: 'Avaliação Fisioterapêutica - Dor Lombar',
    conteudo: 'Paciente com queixa de lombalgia há 3 semanas. EVA: 7/10. Amplitude de movimento: flexão lombar limitada (60°). Teste de Lasègue negativo bilateral. Iniciado protocolo de fortalecimento de CORE e alongamento de cadeia posterior.',
  },
  {
    id: '3',
    pacienteId: '1',
    profissionalId: '3',
    data: '2026-01-15T10:00:00',
    especialidade: 'odontologia',
    tipo: 'consulta',
    titulo: 'Avaliação Odontológica Preventiva',
    conteudo: 'Paciente com boa higiene oral. Presença de cálculo leve em região inferior anterior. Realizada profilaxia e raspagem. Orientações de escovação reforçadas. Retorno em 6 meses.',
    anexos: [
      {
        id: 'a1',
        nome: 'Radiografia Panorâmica.jpg',
        tipo: 'image/jpeg',
        url: '#',
      },
    ],
  },
  {
    id: '4',
    pacienteId: '2',
    profissionalId: '2',
    data: '2026-02-01T10:00:00',
    especialidade: 'fisioterapia',
    tipo: 'evolucao',
    titulo: 'Sessão de Fisioterapia Respiratória - Asma',
    conteudo: '5ª sessão. Paciente apresenta melhora da capacidade respiratória. Realizado exercícios de expansão pulmonar e técnicas de higiene brônquica. Peak flow: 380 L/min (melhora de 15% em relação à sessão anterior).',
  },
  {
    id: '5',
    pacienteId: '3',
    profissionalId: '4',
    data: '2026-01-20T16:00:00',
    especialidade: 'psicologia',
    tipo: 'consulta',
    titulo: 'Primeira Consulta Psicológica',
    conteudo: 'Paciente busca acompanhamento para manejo de ansiedade. Relata preocupações excessivas, dificuldade para dormir e tensão muscular. GAD-7: 14 (ansiedade moderada). PHQ-9: 8 (sintomas depressivos leves). Proposta abordagem TCC com foco em reestruturação cognitiva.',
  },
];

export const especialidadeConfig = {
  medicina: {
    cor: '#3b82f6',
    corClara: '#dbeafe',
    label: 'Medicina',
  },
  fisioterapia: {
    cor: '#10b981',
    corClara: '#d1fae5',
    label: 'Fisioterapia',
  },
  odontologia: {
    cor: '#8b5cf6',
    corClara: '#ede9fe',
    label: 'Odontologia',
  },
  psicologia: {
    cor: '#f59e0b',
    corClara: '#fef3c7',
    label: 'Psicologia',
  },
};

export const statusConfig = {
  confirmado: {
    cor: '#4a7c65',
    corFundo: '#dce8e3',
    label: 'Confirmado',
  },
  pendente: {
    cor: '#f59e0b',
    corFundo: '#fef3c7',
    label: 'Pendente',
  },
  'em-atendimento': {
    cor: '#3b82f6',
    corFundo: '#dbeafe',
    label: 'Em Atendimento',
  },
  concluido: {
    cor: '#10b981',
    corFundo: '#d1fae5',
    label: 'Concluído',
  },
  faltou: {
    cor: '#6b7280',
    corFundo: '#f3f4f6',
    label: 'Faltou',
  },
  cancelado: {
    cor: '#e85d3f',
    corFundo: '#fde8e3',
    label: 'Cancelado',
  },
};
