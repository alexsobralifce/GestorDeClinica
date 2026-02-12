# 🧪 Teste de Novo Agendamento - Web e Mobile

## 📍 Como Acessar

Navegue para: **http://localhost:5173/teste-agendamento**

---

## ✅ O QUE FOI IMPLEMENTADO

### **1. Versão Web (Desktop)** 💻

**Componente:** `/components/agenda/NovoAgendamentoModal.tsx`

**Features:**
- ✅ Modal centralizado com backdrop blur
- ✅ Stepper horizontal com 3 etapas animadas
- ✅ Step 1: Seleção de paciente com busca
- ✅ Step 2: Seleção de data, profissional e horário (grid layout)
- ✅ Step 3: Confirmação com resumo visual e campos adicionais
- ✅ Validação em tempo real (botão "Próximo" habilitado dinamicamente)
- ✅ Loading state no botão final (simula requisição de 1.5s)
- ✅ Animações suaves com Motion (transições entre steps)
- ✅ Ícones visuais (User, Clock, Check)
- ✅ Cores e tipografia do Design System

---

### **2. Versão Mobile** 📱

**Componente:** `/components/mobile/NovoAgendamentoMobile.tsx`

**Features:**
- ✅ Bottom Sheet full-screen
- ✅ StepperMobile horizontal no topo
- ✅ Step 1: Busca e seleção de paciente
- ✅ Step 2: Date picker horizontal scroll + seleção de profissional e horário
- ✅ Step 3: Resumo e confirmação
- ✅ Touch-friendly (todos os botões >= 48px)
- ✅ Safe area support (iOS notch)
- ✅ Botões fixos no footer (sticky bottom)
- ✅ Grid otimizado para mobile (3 colunas para horários)
- ✅ Scroll horizontal para dates
- ✅ Font-size 16px nos inputs (evita zoom iOS)

---

### **3. Página de Teste** 🧪

**Componente:** `/pages/TesteAgendamento.tsx`

**Features:**
- ✅ Interface visual para testar ambas versões
- ✅ Comparação lado a lado (Web vs Mobile)
- ✅ Detecção automática de mobile (hook useIsMobile)
- ✅ Tabela comparativa de features
- ✅ Instruções passo a passo
- ✅ Feedback de sucesso após agendamento
- ✅ Design System completo aplicado

---

## 🎯 FLUXO DE TESTE

### **Passo 1: Abrir Teste**
1. Navegue para `/teste-agendamento`
2. Veja a página com cards de teste

### **Passo 2: Testar Versão Web**
1. Clique em "Testar Versão Web"
2. Modal aparece centralizado
3. **Step 1 - Paciente:**
   - Busque por "Maria" ou "João"
   - Clique em um paciente
   - Botão "Próximo" fica habilitado
4. **Step 2 - Horário:**
   - Selecione uma data (próximos 7 dias)
   - Escolha um profissional
   - Selecione um horário disponível
   - Ajuste a duração (15, 30, 45 ou 60 min)
5. **Step 3 - Confirmação:**
   - Revise o resumo com ícones coloridos
   - Selecione tipo de consulta
   - Escolha convênio
   - Adicione observações (opcional)
   - Marque/desmarque WhatsApp
   - Clique "Confirmar Agendamento"
6. Loading de 1.5s
7. Mensagem de sucesso aparece no topo

### **Passo 3: Testar Versão Mobile**
1. Clique em "Testar Versão Mobile"
2. Bottom sheet desliza de baixo
3. **Step 1 - Paciente:**
   - Use a search bar
   - Selecione um paciente
   - Botão "Próximo" no footer
4. **Step 2 - Horário:**
   - Scroll horizontal de datas
   - Lista de profissionais
   - Grid 3x6 de horários
   - Select de duração
5. **Step 3 - Confirmação:**
   - Resumo compacto
   - Selects de tipo e convênio
   - Textarea de observações
   - Checkbox de WhatsApp
   - Botão "Confirmar Agendamento"
6. Loading
7. Mensagem de sucesso

---

## 🎨 VALIDAÇÕES IMPLEMENTADAS

### **Validação por Step**

**Step 1:**
- ✅ Botão "Próximo" desabilitado até selecionar paciente
- ✅ Paciente selecionado fica destacado (border verde)

**Step 2:**
- ✅ Botão "Próximo" desabilitado até selecionar profissional E horário
- ✅ Data padrão: hoje
- ✅ Horários só aparecem após selecionar profissional

**Step 3:**
- ✅ Todos os campos são opcionais exceto os já preenchidos
- ✅ Botão "Confirmar" sempre habilitado

### **Estados Visuais**

**Web:**
- ✅ Stepper circular com ícones
- ✅ Checkmark verde nos steps completos
- ✅ Step atual: verde (#4a7c65) com shadow
- ✅ Steps futuros: cinza (#e8e5df)
- ✅ Linha conectora animada

**Mobile:**
- ✅ StepperMobile horizontal
- ✅ Círculos numerados
- ✅ Step ativo: verde
- ✅ Step completo: checkmark
- ✅ Labels abaixo dos círculos

---

## 📊 DADOS MOCKADOS

### **Pacientes:**
```typescript
[
  { id: '1', nome: 'Maria Silva', cpf: '123.456.789-00', telefone: '(85) 99999-9999' },
  { id: '2', nome: 'João Santos', cpf: '987.654.321-00', telefone: '(85) 98888-8888' },
  { id: '3', nome: 'Ana Costa', cpf: '456.789.123-00', telefone: '(85) 97777-7777' },
]
```

### **Profissionais:**
```typescript
[
  { id: '1', nome: 'Dr. João Santos', especialidade: 'Cardiologia', cor: '#3b82f6' },
  { id: '2', nome: 'Dra. Ana Costa', especialidade: 'Clínica Geral', cor: '#8b5cf6' },
  { id: '3', nome: 'Dr. Pedro Lima', especialidade: 'Ortopedia', cor: '#10b981' },
]
```

### **Horários Disponíveis:**
```typescript
['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30']
```

---

## 🔧 INTEGRAÇÃO COM BACKEND

### **Onde Conectar API:**

**No componente `NovoAgendamentoModal.tsx` (Web):**
```typescript
const handleSubmit = async () => {
  setIsSubmitting(true);
  
  // SUBSTITUIR ESTA LINHA:
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // POR:
  try {
    const response = await fetch('/api/agendamentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    if (!response.ok) throw new Error('Erro ao criar agendamento');
    
    const data = await response.json();
    console.log('Agendamento criado:', data);
    
    onSuccess?.();
    onClose();
  } catch (error) {
    console.error(error);
    // Mostrar toast de erro
  } finally {
    setIsSubmitting(false);
  }
};
```

**No componente `NovoAgendamentoMobile.tsx` (Mobile):**
```typescript
// Mesma lógica acima
```

---

## 🎯 CHECKLIST DE FEATURES

### **Wizard de 3 Etapas**
- [x] Step 1: Seleção de Paciente
- [x] Step 2: Seleção de Horário
- [x] Step 3: Confirmação
- [x] Navegação entre steps (Próximo/Voltar)
- [x] Validação em tempo real
- [x] Progress indicator visual

### **Componentes**
- [x] Search bar de pacientes
- [x] Date picker (grid web / scroll mobile)
- [x] Seleção de profissional
- [x] Grid de horários disponíveis
- [x] Select de duração
- [x] Select de tipo de consulta
- [x] Select de convênio
- [x] Textarea de observações
- [x] Checkbox de confirmação WhatsApp

### **UX/UI**
- [x] Animações suaves (Motion)
- [x] Loading states
- [x] Success feedback
- [x] Disabled states
- [x] Hover states (web)
- [x] Active states (mobile)
- [x] Ícones visuais
- [x] Cores do Design System

### **Responsividade**
- [x] Web: Modal centralizado
- [x] Mobile: Bottom sheet full
- [x] Touch targets >= 48px
- [x] Font-size >= 16px em inputs
- [x] Safe area support
- [x] Scroll otimizado

---

## 🐛 TROUBLESHOOTING

### **Modal não abre:**
- ✅ Verificar se `isOpen={true}`
- ✅ Verificar z-index (deve ser 50+)
- ✅ Verificar overflow do parent

### **Botão "Próximo" sempre desabilitado:**
- ✅ Verificar função `isStepValid()`
- ✅ Console.log do `formData` para debug
- ✅ Verificar se paciente/profissional/horário foram selecionados

### **Bottom Sheet não aparece em mobile:**
- ✅ Verificar se BottomSheet está importado corretamente
- ✅ Verificar propriedade `size="full"`
- ✅ Verificar z-index (deve ser 2000+)

### **Animações não funcionam:**
- ✅ Verificar se Motion está instalado
- ✅ Verificar import: `import { motion } from 'motion/react'`
- ✅ Verificar `<AnimatePresence mode="wait">`

---

## 📱 TESTANDO EM DISPOSITIVOS REAIS

### **Web:**
1. Abra Chrome DevTools (F12)
2. Clique em "Toggle device toolbar" (Ctrl+Shift+M)
3. Selecione um dispositivo (iPhone 12, Galaxy S21, etc.)
4. Navegue para `/teste-agendamento`
5. Teste a versão mobile

### **Mobile Real:**
1. Conecte seu smartphone na mesma rede Wi-Fi
2. Encontre o IP do seu computador (cmd: `ipconfig`)
3. No smartphone, acesse: `http://SEU_IP:5173/teste-agendamento`
4. Teste gestos nativos (scroll, tap, etc.)

---

## ✅ RESULTADO ESPERADO

**Ao finalizar o agendamento:**
1. ✅ Modal fecha automaticamente
2. ✅ Mensagem de sucesso aparece no topo da página teste
3. ✅ Console.log mostra objeto completo do agendamento
4. ✅ Form reseta para estado inicial

**Estrutura do objeto:**
```typescript
{
  pacienteId: string,
  pacienteNome: string,
  data: Date,
  profissionalId: string,
  profissionalNome: string,
  especialidade: string,
  horario: string,
  duracao: number,
  tipo: string,
  convenio: string,
  observacoes: string,
  enviarConfirmacao: boolean
}
```

---

## 🎓 PRÓXIMOS PASSOS

1. **Conectar com Backend:**
   - Criar endpoint POST `/api/agendamentos`
   - Validar dados no servidor
   - Retornar ID do agendamento criado

2. **Adicionar Features:**
   - Validar disponibilidade real de horários
   - Integração com WhatsApp API
   - Validação de conflitos de horário
   - Notificações push

3. **Melhorias UX:**
   - Salvar rascunho (localStorage)
   - Histórico de últimos agendamentos
   - Sugestões de horários baseadas em ML
   - Agendamento recorrente

---

**Status:** ✅ **PRONTO PARA TESTE**

**Versão:** 1.0.0  
**Data:** Janeiro 2026  
**Autor:** Sistema de Gestão Clínica
