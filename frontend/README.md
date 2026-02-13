# Frontend - Sistema de Gestão Clínica

Interface web construída com React, TypeScript e Tailwind CSS.

## 🚀 Tecnologias

- **React 18+** com TypeScript
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Radix UI** - Componentes acessíveis
- **Framer Motion** - Animações
- **Axios** - HTTP client

## 📁 Estrutura

```
frontend/
├── src/
│   ├── components/     # Componentes reutilizáveis
│   ├── lib/
│   │   └── api/        # API client layer
│   ├── styles/         # Estilos globais
│   ├── App.tsx
│   └── main.tsx
├── public/             # Assets estáticos
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

## 🔧 Instalação

```bash
npm install
```

## 🏃 Executar

```bash
# Development
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 🎨 Design System

O projeto segue um design system humanizado e acessível. Veja [DESIGN_SYSTEM.md](./src/DESIGN_SYSTEM.md) para detalhes.

### Cores Principais
- **Primary:** Verde suave (#10b981)
- **Accent:** Azul (#3b82f6)
- **Warning:** Dourado (#f59e0b)
- **Danger:** Vermelho (#ef4444)

### Componentes
- Formulários acessíveis
- Cards informativos
- Modais e dialogs
- Navegação responsiva

## 🌐 API Integration

O frontend se comunica com o backend via REST API.

### Configuração

Crie um arquivo `.env`:

```env
VITE_API_URL=http://localhost:3001/api
```

### API Client

```typescript
import { patientsAPI, professionalsAPI } from '@/lib/api';

// Buscar pacientes
const patients = await patientsAPI.getAll();

// Criar agendamento
const appointment = await appointmentsAPI.create({
  patient_id: '...',
  professional_id: '...',
  // ...
});
```

## 📦 Módulos

- **Dashboard** - Visão geral
- **Pacientes** - Cadastro e gestão
- **Agendamentos** - Calendário e marcações
- **Prontuários** - Registros médicos
- **Financeiro** - Controle financeiro
- **Profissionais** - Equipe

## 🎯 Features

- ✅ Design responsivo
- ✅ Dark mode
- ✅ Acessibilidade (ARIA)
- ✅ Validação de formulários
- ✅ Animações suaves
- ✅ TypeScript completo

## 🚀 Build

```bash
npm run build
```

O build otimizado será criado em `dist/`.

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- Desktop (1920px+)
- Laptop (1280px+)
- Tablet (768px+)
- Mobile (320px+)
