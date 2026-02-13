# Design System - Componentes Específicos do Sistema de Saúde

## 🏥 Componentes Especializados para Gestão Clínica

---

## 1. TIMELINE DE PRONTUÁRIO

### 1.1 Anatomia Visual

```
Característica única do sistema:
Linha vertical ORGÂNICA que muda de cor por especialidade

┌────────────────────────────────────────┐
│                                        │
│  ◉───╮                                 │ ← Medicina (azul)
│      │  [Card Consulta]                │
│      ╰───○                             │
│          │                             │ ← Transição suave
│      ╭───○                             │
│      │  [Card Exame]                   │ ← Fisioterapia (verde)
│  ◉───╯                                 │
│      ╲                                 │
│       ╲  [Card Prescrição]             │ ← Odontologia (roxo)
│        ◉                               │
│                                        │
└────────────────────────────────────────┘
```

### 1.2 Especificações Técnicas

```css
Timeline Container:
- Position: relative
- Padding left: 60px (espaço para linha)

Linha vertical:
- Width: 3px
- Position: absolute, left: 24px
- Background: gradient conforme especialidades
- Border radius: 9999px (suave)
- Animação: Draw from top (path animation)

Dots (Marcadores):
- Size: 16x16px (small) ou 24x24px (emphasis)
- Border: 3px solid [cor-especialidade]
- Background: white
- Box shadow: 0 0 0 4px [cor]/10 (glow)
- Position: absolute, left: 16px
- Z-index: 10 (acima da linha)

Cards:
- Margin left: 40px (após o dot)
- Margin bottom: 32px
- Connector: Linha horizontal de 20px ligando dot ao card
- Hover: Lift + destaque no dot correspondente
```

### 1.3 Gradiente Orgânico

```css
/* Exemplo de gradiente que transiciona entre especialidades */
.timeline-line {
  background: linear-gradient(
    to bottom,
    #3b82f6 0%,      /* Medicina */
    #3b82f6 30%,
    #10b981 30%,     /* Transição */
    #10b981 60%,     /* Fisioterapia */
    #8b5cf6 60%,     /* Transição */
    #8b5cf6 100%     /* Odontologia */
  );
  
  /* Alternativa: SVG path com stroke-dasharray animado */
}
```

### 1.4 Card de Evento

```
Estrutura:

┌─────────────────────────────────────┐
│ [Ícone] Consulta - Cardiologia  [•••]│ ← Header, especialidade color
├─────────────────────────────────────┤
│ Dr. Carlos Silva                    │ ← Profissional
│ 15 de fevereiro de 2026 - 14:30    │ ← Data/hora, ícone clock
├─────────────────────────────────────┤
│ Paciente relata dor no peito...    │ ← Resumo (preview)
│ [Ver detalhes completos]            │ ← Expandir/Link
├─────────────────────────────────────┤
│ 📎 2 anexos  💊 3 prescrições       │ ← Metadados em badges
└─────────────────────────────────────┘

Padding: 20px
Border left: 4px solid [especialidade-color]
Background: white
Hover: Shadow + border-color intensifica
```

### 1.5 Filtros de Timeline

```
Barra de filtros no topo:

[Todas Especialidades ▼] [Período ▼] [Profissional ▼] [Tipo ▼]

Tipos de evento:
- Consulta
- Exame
- Procedimento
- Prescrição
- Atestado
- Retorno
- Evolução

Cada tipo com ícone único e cor semântica
```

---

## 2. AGENDA / CALENDAR

### 2.1 Visualizações

#### Day View (Padrão)
```
Layout:

        07:00 ─────────────────────────
        08:00 ┌─────────────────────┐
              │ Dr. Carlos Silva    │ ← Slot ocupado
              │ Paciente: João      │
        09:00 └─────────────────────┘
        10:00 ─────────────────────────  ← Slot livre
        11:00 ┌─────────────────────┐
              │ Dra. Ana Costa      │
              │ Paciente: Maria     │
        12:00 └─────────────────────┘

Grid:
- Intervalo: 30 ou 60 min (configurável)
- Colunas: Por profissional ou sala
- Height por slot: 60px (1h) ou 30px (30min)
- Snap to grid: Drag & drop de agendamentos
```

#### Week View
```
Grid 7 colunas (Seg - Dom):

        │ SEG │ TER │ QUA │ QUI │ SEX │ SÁB │ DOM │
08:00 ─┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
        │ ░░░ │     │     │ ░░░ │     │     │     │
10:00 ─┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤

Slot:
- Width: auto (100% / 7)
- Height: 40px (compacto)
- Tooltip on hover: detalhes
```

#### Month View
```
Grid 7x5 (semanas):

Cada dia:
- Número do dia: Top left
- Dots: Indicam consultas (max 3 visible + "+X")
- Click: Abre day view ou popover com lista

Hoje: Border highlight, background sutil
Fim de semana: Background neutral-50
```

### 2.2 Slot de Agendamento

```
Estados:

Livre:
- Background: white
- Border: 1px dashed neutral-200
- Hover: bg neutral-50, cursor pointer
- Click: Abre modal de novo agendamento

Ocupado:
- Background: gradient por especialidade
- Text: Contraste adequado (white se escuro)
- Shadow: sm
- Hover: Lift + shadow md
- Click: Abre detalhes

Bloqueado:
- Background: neutral-100
- Pattern: Diagonal stripes
- Text: "Bloqueado - Almoço" (exemplo)
- Cursor: not-allowed

Passado:
- Opacity: 60%
- Background: grayscale
- Não interativo
```

### 2.3 Drag & Drop

```
Comportamento:

1. Drag start:
   - Card torna-se ghost (opacity 50%)
   - Cursor: grabbing
   - Valid drop zones: highlight com border dashed

2. Drag over:
   - Drop zone: bg primary-50
   - Preview do slot: ghost card na posição

3. Drop:
   - Animação: Snap to grid (300ms ease)
   - Atualiza dados
   - Toast: "Agendamento movido para [nova data/hora]"

4. Validação:
   - Conflito de horário: Alert + rejeita
   - Fora do horário: Confirma exceção
```

---

## 3. CARD DE PACIENTE

### 3.1 Compact View (Lista)

```
┌─────────────────────────────────────────────┐
│ [Avatar]  Maria Silva Santos           [···]│
│  48x48    28 anos • A+ • 📞 (11) 99999     │
│                                             │
│  💊 2 alergias  ⚠️ 1 condição               │
│                                             │
│  Última consulta: há 15 dias                │
└─────────────────────────────────────────────┘

Layout: flex row
Gap: 16px
Padding: 20px
Height: ~120px
```

### 3.2 Expanded View (Detalhes)

```
┌─────────────────────────────────────────────┐
│ ┌───────┐  Maria Silva Santos          [···]│
│ │Avatar │  28 anos • Feminino • A+          │
│ │ 80x80 │  CPF: 123.456.789-00              │
│ └───────┘                                   │
├─────────────────────────────────────────────┤
│ 📞 (11) 99999-9999                          │
│ ✉️ maria.silva@email.com                    │
│ 📍 Rua Exemplo, 123 - São Paulo, SP         │
├─────────────────────────────────────────────┤
│ [Alertas Clínicos]                          │
│  ⚠️ Alergia a Penicilina                    │
│  ⚠️ Alergia a Dipirona                      │
│  💊 Diabetes Tipo 2                         │
│  💊 Hipertensão                             │
├─────────────────────────────────────────────┤
│ [Prontuário] [Agendar] [Editar] [Excluir]  │
└─────────────────────────────────────────────┘

Padding: 32px
Min height: 400px
```

### 3.3 Quick Actions

```
Botões de ação rápida:

[Prontuário]     - btn-primary
[Agendar]        - btn-secondary
[Editar]         - btn-secondary
[Excluir]        - btn-ghost danger (com confirmação)

Layout: flex row
Gap: 12px
Justify: flex-end (alinhado à direita)

Mobile: Stack vertical, full width
```

### 3.4 Alertas Clínicos (Critical Info)

```
Badge destacado:

┌─────────────────────────────────┐
│ ⚠️ ATENÇÃO: Paciente alérgico  │
│                                 │
│ • Penicilina                    │
│ • Dipirona                      │
└─────────────────────────────────┘

Background: danger-50
Border: 2px solid danger-500
Padding: 16px
Border radius: 12px
Icon: AlertTriangle, danger-600
Font weight: 600

Sempre visível no topo do card/página
```

---

## 4. STATUS BADGES (Sistema de Saúde)

### 4.1 Status de Agendamento

```
Confirmado:
- Color: success-500
- Icon: CheckCircle
- Text: "Confirmado"

Pendente:
- Color: warning-500
- Icon: Clock
- Text: "Pendente"

Cancelado:
- Color: neutral-500
- Icon: XCircle
- Text: "Cancelado"

Realizado:
- Color: info-500
- Icon: CheckCircle
- Text: "Realizado"

Faltou:
- Color: danger-500
- Icon: AlertCircle
- Text: "Faltou"

Em atendimento:
- Color: primary-500
- Icon: Activity
- Text: "Em atendimento"
- Animation: Pulse (breathing)
```

### 4.2 Status de Pagamento

```
Pago:
- Color: success-500
- Icon: CheckCircle
- Text: "Pago"

Pendente:
- Color: warning-500
- Icon: Clock
- Text: "Pendente"

Atrasado:
- Color: danger-500
- Icon: AlertTriangle
- Text: "Atrasado"

Parcial:
- Color: info-500
- Icon: TrendingUp
- Text: "Parcial"

Isento:
- Color: neutral-500
- Icon: Gift
- Text: "Isento"
```

### 4.3 Prioridade

```
Alta:
- Background: danger-500
- Text: white
- Icon: AlertTriangle
- Bold weight

Média:
- Background: warning-500
- Text: warning-900
- Icon: AlertCircle

Baixa:
- Background: neutral-200
- Text: neutral-700
- Icon: Minus

Urgente:
- Background: danger-600
- Text: white
- Icon: Zap
- Animation: Pulse fast
- Font size: Larger
```

---

## 5. FORMULÁRIOS MÉDICOS

### 5.1 Anamnese (Coleta de Histórico)

```
Estrutura multi-step:

Step 1: Identificação
- Nome, data nascimento, CPF, contatos
- Avatar upload

Step 2: Dados Clínicos
- Tipo sanguíneo (select)
- Alergias (multi-select com search)
- Condições pré-existentes (multi-select)
- Medicamentos em uso (lista editável)

Step 3: Estilo de Vida
- Fumante (switch)
- Etilista (switch)
- Atividade física (select)
- Alimentação (textarea)

Step 4: Contato de Emergência
- Nome, telefone, parentesco

Progress: 
- Visual: Stepper com 4 steps
- Validação: Por step
- Salvar: Auto-save em cada step
```

### 5.2 Prescrição Médica

```
Layout:

┌─────────────────────────────────────────┐
│ Cabeçalho (Dados do profissional)       │
├─────────────────────────────────────────┤
│ Paciente: [Autocomplete]                │
│ Data: [Date picker]                     │
├─────────────────────────────────────────┤
│ [Lista de Medicamentos]                 │
│                                         │
│ + Adicionar medicamento                 │
│   ├─ Nome [Autocomplete]                │
│   ├─ Dosagem [Input]                    │
│   ├─ Frequência [Select]                │
│   ├─ Duração [Input + Select]           │
│   └─ Observações [Textarea]             │
│                                         │
│ [Medicamento 1]          [Remover]      │
│ [Medicamento 2]          [Remover]      │
├─────────────────────────────────────────┤
│ Observações gerais: [Textarea]          │
├─────────────────────────────────────────┤
│ [Cancelar] [Salvar rascunho] [Emitir]  │
└─────────────────────────────────────────┘

Auto-complete de medicamentos:
- Integração com banco de medicamentos
- Mostra nome genérico + comercial
- Sugere dosagens comuns
- Alerta interações medicamentosas
```

### 5.3 Evolução/SOAP

```
Formato SOAP:

[S] Subjetivo (o que o paciente relata):
- Textarea, min 50 chars
- Placeholder: "Paciente relata..."

[O] Objetivo (exame físico):
- Sinais vitais:
  • PA: [___] / [___] mmHg
  • FC: [___] bpm
  • Temp: [___] °C
  • SpO2: [___] %
  • Peso: [___] kg
  • Altura: [___] cm
- Textarea para exame físico

[A] Avaliação (diagnóstico):
- Autocomplete CID-10
- Multi-select
- Possibilidade de texto livre

[P] Plano (conduta):
- Checkboxes:
  ☐ Manter tratamento
  ☐ Solicitar exames
  ☐ Prescrever medicamento
  ☐ Encaminhar especialista
  ☐ Retorno em [__] dias
- Textarea para detalhes

[Salvar evolução]
```

---

## 6. GRÁFICOS E VISUALIZAÇÕES

### 6.1 Gráfico de Evolução (Linha)

```
Uso: Peso, pressão, glicemia ao longo do tempo

Config:
- Library: Recharts
- Type: LineChart com área gradient
- Points: Dot markers nos valores
- Tooltip: Custom com data + valor + referência
- Grid: Horizontal lines, subtle
- Axes: 
  • X: Datas (formatado)
  • Y: Valores com unidade
- Responsive: Ajusta para mobile
- Colors: Por tipo de medida
  • Peso: primary-500
  • PA: danger-500
  • Glicemia: warning-500

Interação:
- Hover: Highlight linha + tooltip
- Click point: Modal com detalhes do registro
- Zoom: Brush para selecionar período
```

### 6.2 Gráfico de Distribuição (Pizza)

```
Uso: Distribuição de especialidades, status

Config:
- Type: Doughnut (donut)
- Center label: Total + descrição
- Legend: Bottom ou right (responsivo)
- Colors: Paleta de especialidades
- Hover: Destaca fatia + tooltip com %
- Animation: Entrada sequencial (stagger)

Tamanho:
- Desktop: 320x320px
- Mobile: 240x240px
- Inner radius: 60% (donut hole)
```

### 6.3 Gráfico de Barras

```
Uso: Comparação de valores, receitas mensais

Config:
- Type: BarChart
- Orientation: Vertical (padrão), horizontal (muitos items)
- Colors: Gradient primary
- Border radius: Top corners (8px)
- Spacing: 20% de gap entre barras
- Axes:
  • X: Categorias
  • Y: Valores formatados (R$, qty)
- Grid: Horizontal, neutral-200
- Hover: Darken + tooltip

Responsivo:
- Mobile: Horizontal orientation (melhor scroll)
- Desktop: Vertical
```

### 6.4 KPI com Sparkline

```
Card KPI + mini gráfico:

┌─────────────────────────┐
│ Consultas este mês      │
│                         │
│ 156                     │ ← Valor grande
│ +12% vs mês anterior    │ ← Tendência
│                         │
│ ─╱─╲─╱╲──╱─            │ ← Sparkline
└─────────────────────────┘

Sparkline:
- Height: 40px
- Width: 100%
- Stroke: 2px
- Color: success-500 (positivo), danger-500 (negativo)
- No axes, no grid (minimalista)
- Tooltip no hover (opcional)
```

---

## 7. FILTROS E BUSCA

### 7.1 Busca Global

```
Barra no header:

┌─────────────────────────────────────┐
│ 🔍 Buscar pacientes, consultas...  │
└─────────────────────────────────────┘

Features:
- Autocomplete com resultados agrupados
- Highlight do termo buscado
- Navegação por teclado (arrows)
- Atalho: Cmd/Ctrl + K
- Resultados recentes (últimas buscas)

Dropdown de resultados:
┌─────────────────────────────────┐
│ Pacientes (3)                   │
│  • Maria Silva Santos           │
│  • João Pedro Oliveira          │
│                                 │
│ Consultas (2)                   │
│  • 15/02 - Cardiologia          │
│                                 │
│ Ver todos resultados →          │
└─────────────────────────────────┘
```

### 7.2 Filtros Avançados

```
Panel lateral ou popover:

┌─────────────────────────────────┐
│ Filtros                     [X] │
├─────────────────────────────────┤
│                                 │
│ Especialidade                   │
│ ☐ Medicina                      │
│ ☐ Fisioterapia                  │
│ ☐ Odontologia                   │
│ ☐ Psicologia                    │
│                                 │
│ Período                         │
│ [__/__/____] até [__/__/____]   │
│                                 │
│ Status                          │
│ ☐ Confirmado                    │
│ ☐ Pendente                      │
│ ☐ Cancelado                     │
│                                 │
│ Profissional                    │
│ [Select com busca]              │
│                                 │
├─────────────────────────────────┤
│ [Limpar] [Aplicar filtros]      │
└─────────────────────────────────┘

Comportamento:
- Aplicação: Ao clicar "Aplicar"
- Feedback: Badge com count de filtros ativos
- Persistência: Salvar estado no URL
- Reset: Botão "Limpar" visível se houver filtros
```

### 7.3 Filtros Quick (Chips)

```
Barra de filtros rápidos:

[Todos] [Hoje] [Esta semana] [Este mês] [Medicina] [Confirmados]
  ↑        ↑                                ↑            ↑
 ativo  hover                           removível    toggle

Comportamento:
- Toggle on/off
- Multi-select (podem ter vários ativos)
- Visual: Badge pill
- Active: primary-500 bg, white text
- Hover: scale(1.05)
- Remove: X button no hover (filtros removíveis)
```

---

## 8. NOTIFICAÇÕES E ALERTAS

### 8.1 Toast Notification (Sistema)

```
Posição: Top right (desktop), top center (mobile)
Stack: Máximo 3 visíveis

Tipos:

Success:
┌─────────────────────────────────┐
│ ✅  Paciente salvo com sucesso  │
│     João Silva foi adicionado   │
│     à lista de pacientes.  [X]  │
└─────────────────────────────────┘

Error:
┌─────────────────────────────────┐
│ ❌  Erro ao salvar              │
│     Verifique os campos e       │
│     tente novamente.       [X]  │
└─────────────────────────────────┘

Warning:
┌─────────────────────────────────┐
│ ⚠️  Atenção                     │
│     Paciente tem consulta       │
│     marcada amanhã.        [X]  │
└─────────────────────────────────┘

Info:
┌─────────────────────────────────┐
│ ℹ️  Nova funcionalidade         │
│     Agora você pode exportar    │
│     relatórios em PDF.     [X]  │
└─────────────────────────────────┘

Auto-dismiss: 5s (padrão)
Action button: Opcional (Desfazer, Ver detalhes)
```

### 8.2 Banner de Alerta (Persistente)

```
Topo da página ou seção:

┌────────────────────────────────────────┐
│ ⚠️ Você tem 3 consultas não confirmadas│
│    [Ver consultas] [Lembrar depois][X] │
└────────────────────────────────────────┘

Cores: Por severidade (info, warning, danger)
Dismissível: Sim (X), mas pode reaparecer
Ações: 1-2 botões inline
Padding: 16px 24px
Border: 1px bottom
```

### 8.3 Badge de Notificação

```
Contador no ícone:

   🔔
  ┌─┐
  │3│  ← Badge pill
  └─┘

Tamanho: 20x20px
Background: danger-500
Text: white, 11px, bold
Position: Absolute top-right
Animation: Scale pulse quando novo
Max display: 9+ (para números > 9)
```

---

## 9. IMPRESSÃO / EXPORT

### 9.1 Layout de Impressão

```css
/* CSS para impressão */
@media print {
  /* Ocultar elementos de navegação */
  header, nav, .sidebar, .no-print {
    display: none !important;
  }
  
  /* Ajustar layout */
  body {
    font-size: 12pt;
    color: black;
    background: white;
  }
  
  /* Evitar quebra de página */
  .card, table, .keep-together {
    page-break-inside: avoid;
  }
  
  /* Forçar quebra antes */
  .page-break-before {
    page-break-before: always;
  }
  
  /* Remover sombras e cores de fundo */
  * {
    box-shadow: none !important;
    background: transparent !important;
  }
  
  /* Links: mostrar URL */
  a[href]:after {
    content: " (" attr(href) ")";
    font-size: 0.8em;
    color: #666;
  }
}
```

### 9.2 Cabeçalho de Documento

```
Prescrição / Atestado / Receita:

┌─────────────────────────────────────┐
│ [Logo da Clínica]                   │
│                                     │
│ Clínica Saúde Integrada             │
│ CNPJ: 12.345.678/0001-99            │
│ Tel: (11) 3456-7890                 │
│ Rua Exemplo, 123 - São Paulo        │
│                                     │
│ Dr. Carlos Alberto Silva            │
│ CRM-SP 123.456                      │
│ Cardiologia                         │
├─────────────────────────────────────┤
│ PRESCRIÇÃO MÉDICA                   │
├─────────────────────────────────────┤
│ Paciente: Maria Silva Santos        │
│ Data: 15/02/2026                    │
│                                     │
│ [Conteúdo do documento]             │
│                                     │
├─────────────────────────────────────┤
│                                     │
│ ____________________________        │
│ Assinatura e Carimbo                │
└─────────────────────────────────────┘

Formato: A4 (210mm x 297mm)
Margens: 20mm todas as direções
Font: Serif para impressão (Times, Georgia)
```

---

## 10. ESTADOS ESPECÍFICOS

### 10.1 Primeiro Uso (Onboarding)

```
Empty state especial com tutorial:

┌─────────────────────────────────────┐
│                                     │
│         🎉 Bem-vindo!               │
│                                     │
│ Comece cadastrando seu primeiro     │
│ paciente para começar a usar        │
│ o sistema.                          │
│                                     │
│ [Tour guiado] [Adicionar paciente]  │
│                                     │
└─────────────────────────────────────┘

Tour guiado:
- Tooltips sequenciais
- Spotlight em elementos
- Overlay com backdrop
- 5-7 steps máximo
- Skip sempre disponível
```

### 10.2 Manutenção / Offline

```
┌─────────────────────────────────────┐
│              🔧                      │
│                                     │
│ Sistema em manutenção               │
│                                     │
│ Estaremos de volta em breve.        │
│ Previsão: 15:00                     │
│                                     │
│ Em caso de emergência, entre       │
│ em contato: (11) 99999-9999         │
│                                     │
└─────────────────────────────────────┘

Full page, centralizado
Ilustração ou animação
Informações de contato
Estimativa de retorno
```

---

**Versão:** 1.0.0  
**Componentes específicos:** 10 categorias documentadas  
**Status:** ✅ Completo  
**Foco:** Contexto de saúde e gestão clínica
