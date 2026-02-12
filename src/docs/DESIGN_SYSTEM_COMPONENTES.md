# Design System - Biblioteca de Componentes

## 📦 Componentes Fundamentais

---

## 1. BUTTONS (Botões)

### 1.1 Anatomia

```
Estrutura:
[Icon (opcional)] + [Label] + [Badge/Counter (opcional)]

Padding:
- Horizontal: 24px (space-6)
- Vertical: 12px (space-3)
- Gap entre elementos: 10px (space-2.5)

Altura mínima: 44px (acessibilidade - área de toque)
Border radius: 16px (radius-lg)
Font: Darker Grotesque, 600 weight, 14px (button-base)
```

### 1.2 Variantes

#### **Primary Button** (Ação principal)
```
Background: linear-gradient(135deg, primary-500 → primary-600)
Text: White
Shadow: shadow-primary
Hover: translateY(-2px) + shadow-lg
Active: translateY(0) + inset shadow
Disabled: opacity 50%

Uso: Salvar, Confirmar, Criar, Ações principais
Max. 1 por tela/seção
```

#### **Secondary Button** (Ação secundária)
```
Background: White
Text: primary-500
Border: 2px solid neutral-200
Shadow: shadow-xs
Hover: bg neutral-100, border primary-500, translateY(-1px)
Active: bg neutral-200

Uso: Cancelar, Voltar, Editar, Ações alternativas
```

#### **Ghost Button** (Ação terciária)
```
Background: Transparent
Text: neutral-600
Border: None
Hover: bg neutral-100, translateY(-1px)
Active: bg neutral-200

Uso: Fechar, Expandir, Ações discretas
```

#### **Danger Button** (Ações destrutivas)
```
Background: linear-gradient(135deg, danger-500 → danger-600)
Text: White
Shadow: shadow-danger
Hover: translateY(-1px) + shadow-lg

Uso: Excluir, Remover, Cancelar permanentemente
Sempre exigir confirmação dupla
```

#### **Icon Button** (Apenas ícone)
```
Size: 44x44px (square)
Padding: 12px
Icon size: 20px
Border radius: 12px (radius-md)
Background: Transparent
Hover: bg neutral-100

Uso: Ações rápidas, toolbar, menu actions
```

### 1.3 Tamanhos

```
Large:
- Height: 52px
- Padding: 16px 32px
- Font: 16px
- Icon: 24px
Uso: CTAs principais, hero sections

Default: ⭐
- Height: 44px
- Padding: 12px 24px
- Font: 14px
- Icon: 20px
Uso: Padrão geral

Small:
- Height: 36px
- Padding: 8px 16px
- Font: 13px
- Icon: 16px
Uso: Tabelas, cards compactos, inline actions
```

### 1.4 Estados

```
Default:    Repouso, aguardando interação
Hover:      Cursor sobre o botão (desktop)
Focus:      Foco via teclado - ring de 4px primary-500/10
Active:     Pressionado (mouse down)
Disabled:   Não interativo - opacity 50%, cursor not-allowed
Loading:    Spinner animado, texto opcional "Salvando..."
```

### 1.5 Acessibilidade

```html
<!-- Exemplo de implementação acessível -->
<button 
  type="button"
  class="btn-primary"
  aria-label="Salvar informações do paciente"
  aria-describedby="hint-save"
>
  <svg aria-hidden="true">...</svg>
  <span>Salvar</span>
</button>
<span id="hint-save" class="sr-only">
  As informações serão salvas permanentemente
</span>
```

---

## 2. INPUTS (Campos de entrada)

### 2.1 Text Input

#### Anatomia
```
Estrutura:
[Label] (obrigatório visualmente ou sr-only)
[Input field]
[Helper text / Error message] (opcional)

Dimensões:
- Height: 48px
- Padding: 14px 16px
- Border: 2px solid neutral-200
- Border radius: 12px (radius-md)
- Font: Karla, 400, 16px
```

#### Estados
```
Default:
- Border: neutral-200
- Background: white
- Text: neutral-800

Focus:
- Border: primary-500 (2px)
- Ring: 0 0 0 4px primary-500/10
- Background: white

Filled:
- Border: neutral-300
- Background: white

Error:
- Border: danger-500 (2px)
- Ring: danger-500/10
- Icon: AlertCircle (danger-500)
- Message: danger-700 text

Disabled:
- Border: neutral-200
- Background: neutral-100
- Text: neutral-400
- Cursor: not-allowed
- Opacity: 60%
```

#### Variações
```
Text:           type="text"
Email:          type="email" + validação
Password:       type="password" + toggle visibility
Number:         type="number" + spinners opcionais
Tel:            type="tel" + mask (xx) xxxxx-xxxx
CPF:            type="text" + mask xxx.xxx.xxx-xx
Date:           type="date" ou date picker custom
Search:         type="search" + ícone de lupa
```

### 2.2 Textarea

```
Min height: 120px (5 linhas)
Max height: 400px com scroll
Resize: vertical apenas
Contador de caracteres: opcional (ex: 500/1000)
```

### 2.3 Select / Dropdown

```
Trigger:
- Igual ao input (48px height)
- Ícone: ChevronDown (20px) à direita
- Padding right: 40px (espaço para ícone)

Dropdown Menu:
- Max height: 320px (8 items visíveis)
- Overflow: scroll suave
- Shadow: shadow-lg
- Border radius: 12px
- Padding: 8px
- Gap entre items: 4px

Item:
- Height: 40px
- Padding: 8px 12px
- Border radius: 8px
- Hover: bg primary-50
- Selected: bg primary-100, font weight 500
- Icon/Avatar: 20px à esquerda
```

### 2.4 Checkbox

```
Tamanho: 20x20px
Border: 2px solid neutral-300
Border radius: 4px (radius-sm)
Background checked: primary-500
Checkmark: White, 12px

Estados:
- Unchecked: white bg, neutral border
- Checked: primary bg, white checkmark
- Indeterminate: primary bg, white dash
- Disabled: neutral-100 bg, neutral-300 border
- Focus: ring de 4px primary-500/10

Label:
- Font: Karla, 400, 14px
- Color: neutral-700
- Gap: 12px do checkbox
- Clicável (todo o conjunto)
```

### 2.5 Radio Button

```
Tamanho: 20x20px (círculo)
Border: 2px solid neutral-300
Inner circle: 10x10px quando selecionado

Estados:
- Unselected: white bg, neutral border
- Selected: primary-500 border, primary-500 inner circle
- Disabled: neutral-100 bg
- Focus: ring de 4px

Uso: Opções mutuamente exclusivas (grupo)
```

### 2.6 Switch / Toggle

```
Tamanho: 44x24px (largura x altura)
Border radius: 9999px (pill)
Circle: 20x20px
Padding interno: 2px

Off:
- Background: neutral-200
- Circle: white, position left
- Transition: 200ms ease

On:
- Background: primary-500
- Circle: white, position right
- Transition: 200ms ease

Label: À esquerda ou direita, 12px gap
Uso: Configurações on/off, feature flags
```

---

## 3. CARDS

### 3.1 Card Padrão

```
Background: white
Border: 1px solid neutral-200/80
Border radius: 20px (radius-xl)
Padding: 24px (space-6) - card-content
Shadow: shadow-sm (repouso)
Hover: shadow-md + border neutral-200 100%
Transition: 300ms ease-smooth

Grid gap sugerido: 24px (space-6)
```

### 3.2 Card Anatomia

```
Estrutura interna:
┌─────────────────────────────────┐
│ [Card Header] (opcional)        │ ← px-6 py-5, border-bottom
├─────────────────────────────────┤
│ [Card Content]                  │ ← p-6 (padrão) ou p-8 (lg)
│   • Título (h3)                 │
│   • Conteúdo principal          │
│   • Metadados                   │
├─────────────────────────────────┤
│ [Card Footer] (opcional)        │ ← px-6 py-5, border-top, bg-neutral-50
└─────────────────────────────────┘
```

### 3.3 Variantes

#### Card Interativo (Clicável)
```
Cursor: pointer
Hover: 
  - translateY(-4px)
  - shadow-lg
  - border-color: primary-500/20
Transition: 300ms
Uso: Navegação, seleção, links
```

#### Card com Badge/Status
```
Gradiente de topo: 4px height
Cores: Especialidade ou status semântico
Position: absolute, top 0
Border radius: inherit (cantos superiores arredondados)
```

#### Card Destaque/Premium
```
Border: 2px solid primary-500/30
Shadow: shadow-md (sempre elevado)
Glow: 0 0 0 4px primary-500/10 (opcional)
Background: Linear gradient sutil
```

---

## 4. MODAIS / DIALOGS

### 4.1 Estrutura

```
Backdrop:
- Background: rgba(42, 41, 38, 0.75)
- Backdrop blur: 4px
- z-index: z-40
- Click para fechar: opcional

Modal Container:
- Background: white
- Border radius: 24px (radius-2xl)
- Shadow: shadow-2xl
- Max width: 600px (padrão), 900px (large)
- Max height: 90vh
- Overflow: auto (scroll interno)
- z-index: z-50
```

### 4.2 Anatomia Interna

```
┌──────────────────────────────────┐
│ [Header]                      [X]│ ← p-6, border-bottom
│  Título (h2)                     │
│  Descrição curta (opcional)      │
├──────────────────────────────────┤
│ [Body]                           │ ← p-6 ou p-8
│  Conteúdo principal              │
│  Formulários, listas, etc        │
│                                  │
├──────────────────────────────────┤
│ [Footer]                         │ ← p-6, border-top, bg-neutral-50
│  [Botão Cancelar] [Botão Ação]  │ ← Gap 12px, justify-end
└──────────────────────────────────┘
```

### 4.3 Animação de Entrada/Saída

```css
/* Entrada */
@keyframes modalEnter {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
Duration: 300ms
Easing: ease-smooth

/* Saída */
@keyframes modalExit {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}
Duration: 200ms
Easing: ease-in
```

### 4.4 Variantes

#### Modal de Confirmação
```
Largura: 400px (estreito)
Ícone grande: 64x64px, colorido
Título: Centralizado
Descrição: 2-3 linhas, text-center
Botões: Full width no mobile, inline no desktop
```

#### Modal de Formulário
```
Largura: 600px (padrão) ou 900px (extenso)
Campos: Empilhados, full width
Validação: Em tempo real
Scroll: Interno se > viewport
```

---

## 5. BADGES & TAGS

### 5.1 Badge Padrão

```
Padding: 6px 12px (space-1.5 space-3)
Border radius: 8px (radius-base)
Font: Karla, 500, 12px
Letter spacing: 0.01em
Line height: 1
Border: 1px solid (mesma cor, 20% opacity)
Gap interno (icon + text): 6px
```

### 5.2 Variantes Semânticas

```
Primary:
- Background: primary-500/10
- Text: primary-700
- Border: primary-500/20

Success:
- Background: success-500/10
- Text: success-700
- Border: success-500/20

Warning:
- Background: warning-500/10
- Text: warning-700
- Border: warning-500/20

Danger:
- Background: danger-500/10
- Text: danger-700
- Border: danger-500/20

Info:
- Background: info-500/10
- Text: info-700
- Border: info-500/20

Neutral:
- Background: neutral-200
- Text: neutral-700
- Border: neutral-300
```

### 5.3 Tamanhos

```
Small:
- Padding: 4px 8px
- Font: 11px
- Height: 20px
Uso: Contadores, micro status

Default: ⭐
- Padding: 6px 12px
- Font: 12px
- Height: 24px
Uso: Status, categorias

Large:
- Padding: 8px 16px
- Font: 13px
- Height: 32px
Uso: Destaque, filtros
```

### 5.4 Badge com Ícone

```html
<span class="badge badge-success">
  <CheckCircle size="14" />
  <span>Confirmado</span>
</span>
```

### 5.5 Badge Pill (Contador)

```
Border radius: 9999px (full)
Tamanho: 20x20px (small) ou 24x24px (base)
Centralizado: flex center
Uso: Notificações, contadores
Posição: Absolute no canto superior direito do elemento pai
```

---

## 6. ALERTS / NOTIFICATIONS

### 6.1 Alert Banner (Inline)

```
Padding: 16px 20px
Border radius: 12px (radius-md)
Border left: 4px solid (cor semântica)
Gap: 16px entre ícone, texto e ação
Font: Karla, 400, 14px
Min height: 60px

Estrutura:
[Ícone] [Título + Descrição] [Ação/Dismiss]
```

### 6.2 Variantes

```
Success:
- Background: success-50
- Border: success-500
- Icon: CheckCircle (success-600)
- Text: success-900

Warning:
- Background: warning-50
- Border: warning-500
- Icon: AlertTriangle (warning-600)
- Text: warning-900

Danger/Error:
- Background: danger-50
- Border: danger-500
- Icon: XCircle (danger-600)
- Text: danger-900

Info:
- Background: info-50
- Border: info-500
- Icon: Info (info-600)
- Text: info-900
```

### 6.3 Toast Notification

```
Position: Fixed
Location: Top right (desktop), top center (mobile)
Offset: 24px from edges
Width: 400px (desktop), 90vw (mobile)
Max stack: 3 notifications
z-index: z-70

Estrutura:
- Background: white
- Shadow: shadow-xl
- Border radius: 16px
- Padding: 16px
- Border left: 4px (cor semântica)

Auto dismiss: 5s (padrão), 8s (error), indefinido (critical)
```

### 6.4 Animação de Toast

```css
/* Entrada - slide from right */
@keyframes toastEnter {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Saída - fade out */
@keyframes toastExit {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100%);
  }
}
```

---

## 7. NAVIGATION (Navegação)

### 7.1 Sidebar (Navegação Principal)

```
Width: 280px (desktop), 72px (collapsed)
Background: white
Border right: 1px solid neutral-200
Shadow: shadow-sm
z-index: z-30

Header:
- Logo: 160px width, 48px height
- Padding: 24px
- Border bottom: 1px solid neutral-200

Nav Items:
- Height: 48px
- Padding: 12px 20px
- Border radius: 12px
- Gap: 12px (icon to text)
- Font: Karla, 500, 14px
- Margin: 4px 12px

Estados:
- Default: transparent, neutral-700 text
- Hover: neutral-100 bg, neutral-900 text
- Active: primary-100 bg, primary-700 text, border-left 3px primary-500
- Focus: ring 2px primary-500/20
```

### 7.2 Top Navigation Bar

```
Height: 64px
Background: white
Border bottom: 1px solid neutral-200
Shadow: shadow-sm (on scroll)
z-index: z-30
Sticky: top 0

Layout:
[Logo/Menu] [Search] [Actions] [User Menu]
Padding: 0 24px
Gap: 24px
```

### 7.3 Breadcrumbs

```
Height: 40px
Font: Karla, 400, 14px
Color: neutral-600
Gap: 8px entre items
Separator: "/" ou ChevronRight icon (16px, neutral-400)

Home/Link: 
- Color: neutral-600
- Hover: primary-500, underline

Current:
- Color: neutral-800
- Font weight: 500
- Not clickable
```

### 7.4 Tabs

```
Container:
- Border bottom: 2px solid neutral-200
- Gap: 32px entre tabs

Tab Item:
- Padding: 12px 0
- Font: Karla, 500, 14px
- Position: relative
- Min width: 80px
- Text align: center

Estados:
- Inactive: neutral-600 text
- Hover: neutral-800 text
- Active: primary-700 text, border-bottom 2px primary-500

Indicator:
- Width: 100%
- Height: 2px
- Background: primary-500
- Position: absolute bottom -2px
- Transition: 300ms ease
```

---

## 8. TABLES (Tabelas)

### 8.1 Estrutura

```
Container:
- Background: white
- Border: 1px solid neutral-200
- Border radius: 16px
- Overflow: hidden

Header Row:
- Background: neutral-50
- Border bottom: 2px solid neutral-200
- Height: 52px
- Padding: 12px 20px
- Font: Karla, 600, 13px
- Color: neutral-700
- Text transform: uppercase
- Letter spacing: 0.05em

Body Row:
- Height: 64px (padrão)
- Padding: 16px 20px
- Border bottom: 1px solid neutral-100
- Hover: bg neutral-50
- Transition: 150ms

Last Row:
- Border bottom: none
```

### 8.2 Células

```
Text Alignment:
- Texto: left
- Números: right
- Ações: center ou right
- Status/Badges: center

Overflow:
- Max width: definir por coluna
- Overflow: hidden
- Text overflow: ellipsis
- Tooltip on hover: mostrar texto completo
```

### 8.3 Ordenação

```
Sortable Header:
- Cursor: pointer
- Ícone: Arrows vertical (16px)
- Hover: bg neutral-100

Estados:
- Unsorted: neutral-400 icons
- Ascending: primary-500 arrow up
- Descending: primary-500 arrow down
```

### 8.4 Paginação

```
Container:
- Padding: 16px 20px
- Border top: 1px solid neutral-200
- Justify: space-between
- Align: center

Info Text:
- "Exibindo 1-10 de 156 resultados"
- Font: Karla, 400, 14px
- Color: neutral-600

Controls:
- Botões: 36x36px
- Border radius: 8px
- Gap: 8px
- Numbers: mostrar 5 páginas (1 ... 5 6 7 ... 20)
- Active: primary-500 bg, white text
```

---

## 9. AVATARES

### 9.1 Tamanhos

```
xs:   24x24px  | Menções inline, micro cards
sm:   32x32px  | Listas compactas, comentários
md:   40x40px  | ⭐ Padrão - Listas, cards
lg:   56x56px  | Headers, perfis destacados
xl:   80x80px  | Perfis de usuário
2xl:  120x120px| Páginas de perfil, hero
```

### 9.2 Variações

```
Circular: ⭐ Padrão
- Border radius: 9999px (full)
- Uso: Pessoas, usuários

Rounded:
- Border radius: 12px (radius-md)
- Uso: Empresas, organizações, grupos

Square:
- Border radius: 8px (radius-base)
- Uso: Documentos, arquivos
```

### 9.3 Estados

```
Com Imagem:
- Object fit: cover
- Background: neutral-100 (loading)

Fallback (Iniciais):
- Background: gradient por especialidade ou primary
- Text: white, uppercase, bold
- Font size: 40% do tamanho do avatar
- Align: center

Status Indicator:
- Size: 25% do avatar
- Position: absolute bottom-right
- Border: 2px solid white
- Options:
  • Online: success-500
  • Offline: neutral-400
  • Busy: danger-500
  • Away: warning-500
```

### 9.4 Avatar Group

```
Overlap: -8px (cada avatar sobrepõe o anterior)
Z-index: Decrescente (primeiro na frente)
Border: 2px solid white (separar)
Max visible: 4 avatares
Overflow: "+5" badge no último
```

---

## 10. LOADING STATES

### 10.1 Spinner

```
Tamanhos:
- sm: 16x16px
- md: 24x24px ⭐
- lg: 32x32px
- xl: 48x48px

Animação:
- Rotation: 360deg
- Duration: 800ms
- Easing: linear
- Infinite loop

Cores:
- Primary: primary-500
- White: white (em botões escuros)
- Neutral: neutral-400
```

### 10.2 Skeleton

```
Background: linear-gradient shimmer
  Base: neutral-200
  Shimmer: neutral-100
  Animation: 1.5s ease-in-out infinite

Formas:
- Texto: altura 12-16px, width variável, radius-sm
- Avatar: círculo ou quadrado, tamanho do avatar
- Imagem: retângulo, aspect ratio preservado
- Card: altura completa do card

Uso: Carregar conteúdo assíncrono, melhorar perceived performance
```

### 10.3 Progress Bar

```
Container:
- Height: 8px
- Background: neutral-200
- Border radius: 9999px (full)
- Overflow: hidden

Fill:
- Background: primary-500
- Height: 100%
- Transition: width 300ms ease
- Border radius: inherit

Com Label:
- Position: acima ou ao lado
- Font: Karla, 500, 14px
- Format: "45%" ou "45 de 100"
```

### 10.4 Overlay Loading

```
Backdrop:
- Background: rgba(255, 255, 255, 0.9)
- Backdrop blur: 4px
- z-index: z-80
- Position: absolute ou fixed

Content:
- Spinner (lg ou xl)
- Text: "Carregando..." (opcional)
- Gap: 16px
- Center: absolute center
```

---

## 11. TOOLTIPS

### 11.1 Estrutura

```
Background: neutral-900
Text: white
Font: Karla, 400, 13px
Padding: 8px 12px
Border radius: 8px (radius-base)
Shadow: shadow-lg
Max width: 240px
z-index: z-60

Arrow:
- Size: 8x8px
- Color: neutral-900
- Position: dinâmica (top, bottom, left, right)
```

### 11.2 Comportamento

```
Trigger: Hover (desktop) ou Long press (mobile)
Delay: 300ms (entrada), 0ms (saída)
Offset: 8px do trigger
Position: Auto (flip se não couber)
Pointer events: none (não bloqueia hover)
```

### 11.3 Variantes

```
Default (Dark):
- Background: neutral-900
- Text: white

Light:
- Background: white
- Text: neutral-900
- Border: 1px solid neutral-200
- Shadow: shadow-md

Colored:
- Background: primary-500/success/warning/danger
- Text: white
- Uso: Validações, status específicos
```

---

## 12. DROPDOWNS / POPOVERS

### 12.1 Menu Dropdown

```
Container:
- Background: white
- Border: 1px solid neutral-200
- Border radius: 12px (radius-md)
- Shadow: shadow-lg
- Padding: 8px
- Min width: 200px
- Max height: 400px
- Overflow: auto
- z-index: z-20

Item:
- Height: 40px
- Padding: 8px 12px
- Border radius: 8px
- Gap: 12px (icon to text)
- Font: Karla, 400, 14px

Estados:
- Default: transparent
- Hover: neutral-100
- Active: primary-100, primary-700 text
- Disabled: neutral-400 text, cursor not-allowed
- Focus: ring 2px primary-500/10
```

### 12.2 Divider

```
Margin: 8px 0
Height: 1px
Background: neutral-200
```

### 12.3 Section Header

```
Padding: 8px 12px
Font: Karla, 600, 11px
Color: neutral-600
Text transform: uppercase
Letter spacing: 0.05em
Not clickable
```

### 12.4 Menu Item com Shortcut

```
Layout: space-between
Shortcut:
- Font: Karla, 400, 12px
- Color: neutral-400
- Background: neutral-100
- Padding: 2px 6px
- Border radius: 4px
Exemplo: "⌘K", "Ctrl+S"
```

---

**Continua em DESIGN_SYSTEM_PADROES.md...**

---

**Versão:** 1.0.0  
**Componentes documentados:** 12/25  
**Status:** 🚧 Em desenvolvimento
