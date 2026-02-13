# Guia de Implementação no Figma - Design System

## 🎨 Como Traduzir esta Documentação para o Figma

Este guia fornece instruções passo-a-passo para criar o Design System completo no Figma.

---

## 📁 ESTRUTURA DE ARQUIVOS NO FIGMA

### Organização Recomendada

```
📂 Sistema de Gestão Clínica - Design System
  │
  ├─ 📄 00 - Cover & Index
  │    └─ Página de apresentação + índice clicável
  │
  ├─ 📄 01 - Foundations
  │    ├─ Colors
  │    ├─ Typography
  │    ├─ Spacing
  │    ├─ Elevation
  │    └─ Grid & Layout
  │
  ├─ 📄 02 - Components - Atoms
  │    ├─ Buttons
  │    ├─ Inputs
  │    ├─ Badges
  │    ├─ Avatars
  │    └─ Icons
  │
  ├─ 📄 03 - Components - Molecules
  │    ├─ Cards
  │    ├─ Forms
  │    ├─ Dropdowns
  │    └─ Alerts
  │
  ├─ 📄 04 - Components - Organisms
  │    ├─ Navigation
  │    ├─ Modals
  │    ├─ Tables
  │    └─ Timeline
  │
  ├─ 📄 05 - Components - Saúde
  │    ├─ Prontuário Timeline
  │    ├─ Card Paciente
  │    ├─ Agenda
  │    └─ Status Badges
  │
  ├─ 📄 06 - Patterns
  │    ├─ Page Layouts
  │    ├─ Dashboard
  │    ├─ Forms
  │    └─ Empty States
  │
  └─ 📄 07 - Examples
       ├─ Dashboard Completo
       ├─ Página de Pacientes
       ├─ Prontuário
       └─ Agenda
```

---

## 🎨 PASSO 1: CRIAR VARIABLES (TOKENS)

### 1.1 Color Variables

**Criar Collections separadas para Light e Dark Mode**

#### No Figma: Settings → Variables → Create collection

**Collection 1: "Colors - Light Mode"**

```
Criar grupos (use o símbolo "/" para hierarquia):

Primary/
  primary/50    = #f0f5f3
  primary/100   = #dce8e3
  primary/200   = #b9d1c7
  primary/300   = #8fb5a4
  primary/400   = #6b9985
  primary/500   = #4a7c65  ← Marcar como "Base"
  primary/600   = #3d6653
  primary/700   = #325143
  primary/800   = #283f35
  primary/900   = #1f332b

Neutral/
  neutral/50    = #faf9f7  ← Marcar como "Background"
  neutral/100   = #f5f3ef
  neutral/200   = #e8e5df
  neutral/300   = #d4cfc5
  neutral/400   = #a8a199
  neutral/500   = #7a7369  ← Marcar como "Text Secondary"
  neutral/600   = #5c5650
  neutral/700   = #3f3d38
  neutral/800   = #2b2926  ← Marcar como "Text Primary"
  neutral/900   = #1a1816

Accent/
  accent/50     = #fef5f3
  accent/100    = #fde8e3
  ... (continuar com todos os valores)

Semantic/
  success/50
  success/500
  success/700
  warning/50
  warning/500
  warning/700
  danger/50
  danger/500
  danger/700
  info/50
  info/500
  info/700

Especialidades/
  medicina        = #3b82f6
  fisioterapia    = #10b981
  odontologia     = #8b5cf6
  psicologia      = #f59e0b
  nutricao        = #84cc16
```

**Como criar:**
1. Clicar em "+ Create variable"
2. Nome: usar "/" para hierarquia (ex: "primary/500")
3. Type: Color
4. Value: Inserir HEX code
5. Descrição: Uso recomendado
6. Scopes: Definir onde pode ser usado (All, Fill, Stroke, Text)

---

### 1.2 Typography Variables

**Collection 2: "Typography"**

```
Font Family/
  heading     = "Darker Grotesque"
  body        = "Karla"
  mono        = "JetBrains Mono"

Font Size/
  display/2xl = 76.29px
  display/xl  = 61.04px
  display/lg  = 48.83px
  heading/h1  = 39.06px  ← Default para títulos de página
  heading/h2  = 31.25px
  heading/h3  = 25.00px
  heading/h4  = 20.00px
  heading/h5  = 16.00px
  body/xl     = 20.00px
  body/lg     = 18.00px
  body/base   = 16.00px  ← Default para texto corrido
  body/sm     = 14.00px
  body/xs     = 12.00px
  label/base  = 13.00px
  button/base = 14.00px

Font Weight/
  regular     = 400
  medium      = 500
  semibold    = 600
  bold        = 700
  extrabold   = 800

Line Height/
  tight       = 1.15  (115%)
  snug        = 1.25  (125%)
  normal      = 1.5   (150%)
  relaxed     = 1.6   (160%)

Letter Spacing/
  tight       = -0.02em
  normal      = 0em
  relaxed     = 0.01em
  wide        = 0.05em
```

---

### 1.3 Spacing Variables

**Collection 3: "Spacing"**

```
Space/
  0   = 0px
  1   = 4px
  2   = 8px    ← Base
  3   = 12px
  4   = 16px   ← Padrão entre elementos
  5   = 20px
  6   = 24px   ← Padding de cards
  8   = 32px   ← Gap entre seções
  10  = 40px
  12  = 48px   ← Entre seções principais
  16  = 64px
  20  = 80px
  24  = 96px
  32  = 128px
```

---

### 1.4 Radius Variables

**Collection 4: "Border Radius"**

```
Radius/
  none  = 0px
  sm    = 4px
  base  = 8px
  md    = 12px   ← Inputs
  lg    = 16px   ← Botões
  xl    = 20px   ← Cards principais
  2xl   = 24px   ← Cards destacados
  3xl   = 32px
  full  = 9999px ← Círculos e pills
```

---

### 1.5 Elevation (Shadows) - Criar como Styles

**No Figma: Design panel → Effects → + Create style**

```
shadow-none
  (sem efeito)

shadow-xs
  Type: Drop shadow
  X: 0, Y: 1, Blur: 2, Spread: 0
  Color: #2a2926 @ 5% opacity

shadow-sm (Cards em repouso) ⭐
  Effect 1:
    X: 0, Y: 1, Blur: 3, Spread: 0
    Color: #2a2926 @ 10%
  Effect 2:
    X: 0, Y: 1, Blur: 2, Spread: 0
    Color: #2a2926 @ 6%

shadow-md (Cards hover)
  Effect 1:
    X: 0, Y: 4, Blur: 6, Spread: -1
    Color: #2a2926 @ 8%
  Effect 2:
    X: 0, Y: 2, Blur: 4, Spread: -1
    Color: #2a2926 @ 4%

shadow-lg (Modais, Dropdowns)
  Effect 1:
    X: 0, Y: 10, Blur: 15, Spread: -3
    Color: #2a2926 @ 10%
  Effect 2:
    X: 0, Y: 4, Blur: 6, Spread: -2
    Color: #2a2926 @ 5%

shadow-xl
  Effect 1:
    X: 0, Y: 20, Blur: 25, Spread: -5
    Color: #2a2926 @ 10%
  Effect 2:
    X: 0, Y: 10, Blur: 10, Spread: -5
    Color: #2a2926 @ 4%

shadow-2xl (Máxima elevação)
  Effect:
    X: 0, Y: 25, Blur: 50, Spread: -12
    Color: #2a2926 @ 15%

shadow-primary (Botões primários)
  Effect 1:
    X: 0, Y: 4, Blur: 12, Spread: -2
    Color: #4a7c65 @ 25%
  Effect 2:
    X: 0, Y: 2, Blur: 6, Spread: -1
    Color: #4a7c65 @ 15%
  Effect 3 (Inset - Brilho):
    X: 0, Y: 1, Blur: 0, Spread: 0
    Color: #ffffff @ 15%
    Type: Inner shadow
```

---

## 🧩 PASSO 2: CRIAR COMPONENTES BÁSICOS

### 2.1 Button Component

**Criar Component Set** (para agrupar variantes)

#### Propriedades (Properties):

```
Variant = Primary | Secondary | Ghost | Danger
Size = Large | Default | Small
State = Default | Hover | Active | Disabled | Loading
Icon = True | False
```

#### Estrutura do componente:

```
Button [Component Set]
├─ Frame (Auto Layout - Horizontal)
│  ├─ Icon [Instance] (opcional, visible quando Icon=True)
│  ├─ Label [Text]
│  └─ Badge [Instance] (opcional)
│
└─ Properties:
   • Padding: Usar variables (space/6 horizontal, space/3 vertical)
   • Gap: Variable (space/2.5)
   • Border radius: Variable (radius/lg = 16px)
   • Min height: 44px
   • Fill: Variable (primary/500 para Primary)
   • Effects: Style (shadow-primary)
```

#### Configuração de variantes:

**Primary + Default + Default:**
- Fill: Variable primary/500
- Text: White
- Shadow: shadow-primary

**Primary + Default + Hover:**
- Fill: Gradient (primary/500 → primary/600)
- Text: White
- Transform: Y = -2px (usar plugin ou manual)
- Shadow: shadow-lg

**Primary + Default + Disabled:**
- Opacity: 50%
- Cursor: not-allowed (adicionar na descrição)

**Secondary + Default + Default:**
- Fill: White
- Stroke: 2px, Variable neutral/200
- Text: Variable primary/500
- Shadow: shadow-xs

... (criar todas as combinações)

---

### 2.2 Input Component

#### Estrutura:

```
Input [Component Set]
├─ Label [Text] (opcional)
├─ Input Container [Frame - Auto Layout]
│  ├─ Leading Icon [Instance] (opcional)
│  ├─ Input Text [Text]
│  ├─ Trailing Icon [Instance] (opcional, ex: clear button)
│  └─ Properties:
│     • Padding: 14px 16px
│     • Gap: 12px
│     • Border: 2px solid
│     • Radius: radius/md (12px)
│     • Height: 48px
└─ Helper/Error Text [Text] (opcional)

Properties:
  State = Default | Focus | Filled | Error | Disabled
  Leading Icon = True | False
  Trailing Icon = True | False
  Type = Text | Email | Password | Search | Number
```

#### Estados:

**Default:**
- Border: Variable neutral/200
- Background: White
- Text: Variable neutral/800

**Focus:**
- Border: Variable primary/500 (2px)
- Effects: 
  • Adicionar efeito de glow:
    Drop shadow: 0, 0, 0, 4px blur
    Color: primary/500 @ 10%

**Error:**
- Border: Variable danger/500
- Effects: danger/500 @ 10% glow
- Helper text: danger/700 color
- Trailing icon: AlertCircle (danger)

---

### 2.3 Card Component

```
Card [Component Set]
├─ Card Container [Frame - Auto Layout Vertical]
│  ├─ Badge/Status Bar [Frame] (opcional, 4px height)
│  ├─ Card Header [Frame] (opcional)
│  ├─ Card Content [Frame - Auto Layout Vertical]
│  │  └─ (Slot para conteúdo variável)
│  └─ Card Footer [Frame] (opcional)
│
└─ Properties:
   Variant = Default | Hover | Interactive
   Has Header = True | False
   Has Footer = True | False
   Has Status = True | False
   Elevation = Low | Medium | High

Configuration:
  • Border radius: Variable radius/xl (20px)
  • Border: 1px solid, Variable neutral/200 @ 80%
  • Padding: Variable space/6 (24px)
  • Shadow: 
    - Default: shadow-sm
    - Hover: shadow-md
  • Auto Layout: Vertical, gap space/4
```

---

### 2.4 Badge Component

```
Badge [Component Set]
├─ Badge Container [Frame - Auto Layout]
│  ├─ Icon [Instance] (opcional)
│  └─ Label [Text]
│
└─ Properties:
   Variant = Primary | Success | Warning | Danger | Info | Neutral
   Size = Small | Default | Large
   Has Icon = True | False

Configuration:
  • Padding: 6px 12px (default)
  • Gap: 6px
  • Border radius: Variable radius/base (8px)
  • Border: 1px solid
  • Font size: 12px (variable body/xs)
  • Font weight: 500 (medium)

Variants por cor:
  Primary:
    Fill: primary/500 @ 10%
    Text: primary/700
    Border: primary/500 @ 20%
```

---

### 2.5 Avatar Component

```
Avatar [Component Set]
├─ Container [Frame ou Circle]
│  ├─ Image [Image fill] (quando tem imagem)
│  ├─ Initials [Text] (fallback)
│  └─ Status Dot [Circle] (opcional)
│
└─ Properties:
   Size = xs (24) | sm (32) | md (40) | lg (56) | xl (80) | 2xl (120)
   Shape = Circle | Rounded | Square
   Has Status = True | False
   Status = Online | Offline | Busy | Away
   Has Image = True | False

Configuration:
  • Circle: Width/Height igual, clip content
  • Rounded: Border radius 12px
  • Square: Border radius 8px
  • Initials: 
    - Font size: 40% do tamanho
    - Center aligned
    - Uppercase
    - Bold
  • Status dot:
    - Size: 25% do avatar
    - Position: Bottom right, absolute
    - Border: 2px white
```

---

## 🎨 PASSO 3: CRIAR TEXT STYLES

**No Figma: Text tool → Design panel → Text section → + Create style**

### Nomear seguindo a hierarquia:

```
Display/2xl
  Font: Darker Grotesque
  Size: 76.29px
  Weight: 800 (ExtraBold)
  Line height: 115%
  Letter spacing: -0.02em

Display/xl
  Font: Darker Grotesque
  Size: 61.04px
  Weight: 800
  Line height: 115%

Heading/H1 ⭐ (Títulos de página)
  Font: Darker Grotesque
  Size: 39.06px
  Weight: 700 (Bold)
  Line height: 125%
  Color: Variable neutral/800

Heading/H2
  Font: Darker Grotesque
  Size: 31.25px
  Weight: 600 (SemiBold)
  Line height: 130%
  Color: Variable neutral/800

... (continuar com todos)

Body/Base ⭐ (Texto padrão)
  Font: Karla
  Size: 16px
  Weight: 400 (Regular)
  Line height: 160%
  Color: Variable neutral/800

Body/Small
  Font: Karla
  Size: 14px
  Weight: 400
  Line height: 150%
  Color: Variable neutral/600

Label/Base
  Font: Karla
  Size: 13px
  Weight: 500 (Medium)
  Line height: 140%
  Color: Variable neutral/700

Button/Base
  Font: Darker Grotesque
  Size: 14px
  Weight: 600 (SemiBold)
  Line height: 100%
  Letter spacing: 0.01em
```

**Dica:** Usar "/" na nomenclatura cria hierarquia visual no menu

---

## 📐 PASSO 4: CRIAR GRID SYSTEM

### Layout Grid

**Criar frame base: 1440x1024px (Desktop padrão)**

#### Grid configuration:

```
Columns:
  Count: 12
  Type: Stretch
  Margin: 32px
  Gutter: 24px
  Color: primary/500 @ 5%

Rows (opcional):
  Count: Auto
  Height: 8px (8pt grid)
  Gutter: 0px
  Color: neutral/200 @ 3%
```

**Salvar como Layout Grid Style:**
- Nome: "Desktop 12-col"
- Aplicar em templates de página

#### Criar também:

```
"Tablet 8-col"
  Width: 768px
  Columns: 8
  Margin: 24px
  Gutter: 20px

"Mobile 4-col"
  Width: 375px
  Columns: 4
  Margin: 16px
  Gutter: 16px
```

---

## 🎯 PASSO 5: COMPONENTES ESPECÍFICOS DE SAÚDE

### 5.1 Timeline de Prontuário

**Criar componente complexo:**

```
Timeline Container [Frame - Auto Layout Vertical]
├─ Timeline Line [Frame]
│  • Width: 3px
│  • Height: 100% (auto)
│  • Fill: Linear gradient vertical
│    (medicina → fisioterapia → odontologia)
│  • Border radius: 9999px
│  • Position: Absolute, left: 24px
│
├─ Timeline Item 1 [Component]
│  ├─ Dot [Circle]
│  │  • Size: 24x24px
│  │  • Border: 3px solid Variable medicina
│  │  • Fill: White
│  │  • Shadow: 0 0 0 4px medicina @ 10%
│  │  • Position: Absolute, left: 12px
│  │
│  ├─ Connector [Line]
│  │  • Width: 20px
│  │  • Stroke: 2px, medicina
│  │  • Position: Horizontal do dot até o card
│  │
│  └─ Event Card [Card Component]
│     • Margin left: 40px
│     • Border left: 4px solid medicina
│
├─ Timeline Item 2 [Component]
│  (Fisioterapia - cor verde)
│
└─ Timeline Item 3 [Component]
   (Odontologia - cor roxa)
```

**Criar variantes para cada especialidade**

---

### 5.2 Card de Paciente

```
Patient Card [Component Set]
├─ Container [Frame - Auto Layout]
│  ├─ Avatar Section
│  │  ├─ Avatar [Avatar Component]
│  │  └─ Status Indicator [Badge]
│  │
│  ├─ Info Section
│  │  ├─ Name [Text - Heading/H3]
│  │  ├─ Demographics [Frame - Horizontal]
│  │  │  ├─ Age Badge
│  │  │  ├─ Blood Type Badge
│  │  │  └─ ID
│  │  ├─ Contact Info [Frame - Vertical]
│  │  │  ├─ Phone [Icon + Text]
│  │  │  └─ Email [Icon + Text]
│  │  └─ Clinical Alerts [Frame - Wrap]
│  │     ├─ Allergy Badge
│  │     └─ Condition Badge
│  │
│  └─ Actions Section
│     ├─ Prontuário Button
│     ├─ Agendar Button
│     ├─ Editar Button
│     └─ Excluir Button
│
└─ Properties:
   View = Compact | Expanded
   Has Alerts = True | False
```

---

### 5.3 Agenda Day View

```
Agenda Container [Frame]
├─ Time Column [Frame - Auto Layout Vertical]
│  ├─ 07:00 [Text]
│  ├─ 08:00 [Text]
│  └─ ... (cada hora)
│
├─ Slots Column [Frame - Auto Layout Vertical]
│  ├─ Appointment Slot [Component Set]
│  │  Properties:
│  │    Status = Free | Occupied | Blocked | Past
│  │    Specialty = Medicina | Fisio | Odonto | Psico
│  │    Duration = 30min | 1h | 2h
│  │
│  │  Occupied:
│  │    • Fill: Gradient por especialidade
│  │    • Shadow: sm
│  │    • Border radius: 12px
│  │    • Padding: 12px
│  │    • Content:
│  │      - Professional name
│  │      - Patient name
│  │      - Time
│  │
│  │  Free:
│  │    • Border: 1px dashed neutral/200
│  │    • Fill: Transparent
│  │    • Hover: Fill neutral/50
│  │
│  └─ ... (múltiplos slots)
│
└─ Grid lines [Strokes - neutral/100]
```

---

## 🎨 PASSO 6: CRIAR PÁGINAS DE EXEMPLO

### Dashboard Page

```
Frame: 1440x1024px (Desktop)
Grid: Desktop 12-col

Structure:
├─ Sidebar (280px fixed)
├─ Main Content
│  ├─ Header (64px)
│  │  ├─ Page Title
│  │  └─ Actions
│  │
│  ├─ KPI Cards Grid (4 columns)
│  │  ├─ KPI Card 1 [Component]
│  │  ├─ KPI Card 2
│  │  ├─ KPI Card 3
│  │  └─ KPI Card 4
│  │
│  ├─ Charts Section
│  │  ├─ Line Chart Card (8 cols)
│  │  └─ Pie Chart Card (4 cols)
│  │
│  └─ Recent Activity List
│     └─ Cards with timeline
```

**Usar Auto Layout em todos os frames para facilitar responsividade**

---

## 🔧 PASSO 7: CONFIGURAÇÕES AVANÇADAS

### 7.1 Component Properties (Interatividade)

**Exemplo: Button com variants interativas**

1. Criar variantes: Default, Hover, Active
2. Usar plugin "Figma Prototype" ou criar protótipos
3. Configurar interações:
   - On hover → Mudar para variant "Hover"
   - On mouse down → "Active"
   - On mouse up → "Default"

### 7.2 Smart Animate

Para microanimações:
1. Criar frame inicial e frame final
2. Prototype: Conectar com "Smart animate"
3. Duration: 200-300ms
4. Easing: Ease out

### 7.3 Variantes Condicionais

```
Button Icon visibility:
  Usar property "Has Icon" (boolean)
  Configurar layer visibility baseada na property
```

---

## 📱 PASSO 8: RESPONSIVIDADE

### Auto Layout Configuration

**Para componentes responsivos:**

```
Desktop Frame:
  ├─ Auto Layout: Horizontal
  ├─ Constraints: Left & Top
  ├─ Resizing: Hug contents ou Fill container
  
Mobile Frame:
  ├─ Auto Layout: Vertical (stack)
  ├─ Max width: 375px
  ├─ Padding: 16px
```

**Criar breakpoint variants:**
- Desktop (1440px)
- Tablet (768px)
- Mobile (375px)

---

## ✅ CHECKLIST FINAL

### Antes de publicar:

- [ ] Todas as variables criadas e organizadas
- [ ] Text styles completos (10+ estilos)
- [ ] Color styles completos (50+ cores)
- [ ] Effect styles (shadows) criados (6+ níveis)
- [ ] Componentes básicos (Button, Input, Card, Badge, Avatar)
- [ ] Componentes específicos de saúde (Timeline, Patient Card, Agenda)
- [ ] Layout grids configurados (Desktop, Tablet, Mobile)
- [ ] Páginas de exemplo (Dashboard, Pacientes, Prontuário)
- [ ] Documentação inline (descriptions nos componentes)
- [ ] Cover page com índice navegável
- [ ] Nomenclatura consistente (usar "/" para hierarquia)
- [ ] Organização em frames/sections clara

---

## 🚀 PUBLICAÇÃO E COMPARTILHAMENTO

### 1. Publicar biblioteca:

```
Figma menu → Libraries → Publish
- Adicionar descrição e changelog
- Versioning: 1.0.0
- Notify team members
```

### 2. Criar documentação visual:

- Usar FigJam para criar guia visual
- Adicionar exemplos de uso correto/incorreto
- Link para documentação técnica (markdown files)

### 3. Exportar assets:

```
Para developers:
- Exportar ícones como SVG
- Gerar tokens JSON (plugin Figma Tokens)
- CSS variables (export manual ou plugin)
```

---

## 🎓 RECURSOS E PLUGINS RECOMENDADOS

### Plugins úteis:

1. **Figma Tokens** - Exportar variables como JSON
2. **Content Reel** - Preencher com dados mockados
3. **Stark** - Testar contraste e acessibilidade
4. **Unsplash** - Imagens placeholder
5. **Iconify** - Biblioteca de ícones
6. **Auto Layout** - Facilitar criação de layouts
7. **Instance Finder** - Encontrar instâncias de componentes
8. **Style Organizer** - Organizar styles
9. **Design Lint** - Validar consistência
10. **A11y - Color Contrast Checker** - WCAG compliance

### Referências:

- Material Design 3: https://m3.material.io
- IBM Carbon: https://carbondesignsystem.com
- Ant Design: https://ant.design
- Figma Best Practices: https://www.figma.com/best-practices

---

**🎉 Pronto! Seu Design System está completo e pronto para uso.**

---

**Versão:** 1.0.0  
**Criado para:** Sistema de Gestão Clínica Multidisciplinar  
**Última atualização:** Fevereiro 2026  
**Status:** ✅ Guia completo e pronto para implementação
