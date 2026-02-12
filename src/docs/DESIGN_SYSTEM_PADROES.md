# Design System - Padrões e Layouts

## 🎨 Padrões de Interface

---

## 1. FORMULÁRIOS

### 1.1 Anatomia de Formulário

```
Estrutura Padrão:

┌─────────────────────────────────────┐
│ [Título do Formulário]              │ ← h2, mb-6
│ [Descrição opcional]                │ ← text-muted, mb-8
├─────────────────────────────────────┤
│ [Seção 1 - Título]                  │ ← h3, mb-6, mt-8
│                                     │
│ [Label]                             │ ← label-base, mb-2
│ [Input field]                       │ ← mb-1
│ [Helper text]                       │ ← text-xs, text-muted, mb-6
│                                     │
│ [Label]                             │
│ [Input field]                       │
│ [Error message]                     │ ← text-xs, danger-700
│                                     │
├─────────────────────────────────────┤
│ [Seção 2 - Título]                  │
│ ...campos...                        │
├─────────────────────────────────────┤
│ [Footer com ações]                  │ ← border-top, pt-6, mt-8
│ [Cancelar] [Salvar]                 │ ← justify-end, gap-3
└─────────────────────────────────────┘
```

### 1.2 Grid de Formulário

```
Layout Responsivo:

Mobile (< md):
- 1 coluna
- Full width
- Stack vertical

Tablet (md - lg):
- 2 colunas para campos curtos (nome/sobrenome)
- 1 coluna para campos longos (endereço)

Desktop (> lg):
- 2-3 colunas conforme necessidade
- Campos relacionados agrupados
- Labels alinhados

Grid:
grid-cols-1 md:grid-cols-2 lg:grid-cols-3
gap: 24px (space-6)
```

### 1.3 Padrões de Validação

#### Validação em Tempo Real
```
Quando validar:
- onBlur: Após campo perder foco (padrão)
- onChange: Após correção de erro
- onSubmit: Sempre antes de enviar

Estados:
1. Pristine (não tocado) - Sem feedback visual
2. Validando - Spinner sutil no campo
3. Válido - Checkmark verde (opcional, não intrusivo)
4. Inválido - Border vermelho + mensagem + ícone
```

#### Mensagens de Erro
```
Posicionamento: Abaixo do campo
Timing: Imediato após validação
Formato: "[Campo] [problema]. [Solução]"

Exemplos:
✅ "Email inválido. Use o formato nome@exemplo.com"
✅ "CPF obrigatório. Digite um CPF válido"
✅ "Senha muito curta. Use pelo menos 8 caracteres"

❌ "Erro"
❌ "Campo inválido"
❌ "Por favor preencha este campo corretamente"
```

### 1.4 Agrupamento de Campos

```html
<!-- Grupo visual -->
<fieldset class="border-2 border-neutral-200 rounded-xl p-6">
  <legend class="text-sm font-semibold text-neutral-700 px-3">
    Endereço
  </legend>
  <!-- Campos relacionados -->
</fieldset>
```

### 1.5 Campos Obrigatórios

```
Indicador: Asterisco vermelho (*)
Posição: Após o label
Cor: danger-500
Alternativa: Badge "obrigatório" (mais acessível)

Não usar:
- Placeholder como label
- Apenas cor para indicar obrigatoriedade
```

### 1.6 Formulários Multi-step

```
Estrutura:

[Progress Bar] ← Topo fixo
┌──────────────────────────┐
│ Step 1 de 4: Dados       │ ← Título do step atual
├──────────────────────────┤
│ [Campos do step atual]   │ ← Apenas campos relevantes
│                          │
│                          │
├──────────────────────────┤
│ [Voltar] [Próximo]       │ ← Navegação entre steps
└──────────────────────────┘

Progress:
- Visual: Dots ou barra
- Numerado: "Passo 2 de 4"
- Labels: Nome de cada step
- Clicável: Apenas steps já visitados
```

---

## 2. LISTAS E GRIDS

### 2.1 Lista Vertical (Stack)

```
Container:
- Display: flex flex-col ou grid
- Gap: 16px (space-4) - compacto
       20px (space-5) - padrão
       24px (space-6) - confortável

Item:
- Background: white (card)
- Padding: 20px-24px
- Border radius: 16px
- Hover: elevation + translateY(-2px)
- Transition: 200ms ease

Uso: Lista de pacientes, consultas, transações
```

### 2.2 Grid de Cards

```
Responsive Grid:

grid-cols-1                    (< sm) Mobile
sm:grid-cols-2                 (≥ 640px)
md:grid-cols-2                 (≥ 768px)
lg:grid-cols-3                 (≥ 1024px) ⭐ Padrão
xl:grid-cols-4                 (≥ 1280px)

Gap: 24px (space-6)

Auto-fill (ajuste automático):
grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));

Uso: Dashboard, galeria, catálogo
```

### 2.3 Lista com Ações

```
Estrutura por item:
┌─────────────────────────────────────┐
│ [Avatar] [Conteúdo Principal] [···] │
│          [Metadados]                 │
└─────────────────────────────────────┘

Avatar: 48x48px, left aligned
Conteúdo: flex-1, truncate se necessário
Ações: Dropdown menu (···) ou botões inline
Metadados: Texto pequeno, muted, icones
```

### 2.4 Infinite Scroll vs Paginação

```
Infinite Scroll:
- Uso: Feeds, timeline, redes sociais
- Implementar: Observer API
- Loading: Skeleton no final
- Voltar ao topo: Botão flutuante após 3 scrolls

Paginação:
- Uso: Tabelas, resultados de busca, dados estruturados
- Posição: Abaixo da lista
- Mostrar: Total de resultados + páginas
- Preservar: Scroll position ao voltar
```

---

## 3. DASHBOARD LAYOUTS

### 3.1 Layout de Dashboard

```
Estrutura geral:

┌──────────────────────────────────────────┐
│ [Top Bar] - 64px height, sticky          │
├────────┬─────────────────────────────────┤
│        │ [Page Header]                   │
│ Sidebar│ ├──────────────────────────────┤
│ 280px  │ [KPI Cards Grid] - 4 colunas   │
│        │ ├──────────────────────────────┤
│        │ [Main Content] - Charts, listas│
│        │ ├──────────────────────────────┤
│        │ [Secondary Content]             │
└────────┴─────────────────────────────────┘

Padding do conteúdo: 32px (space-8)
Gap entre seções: 32px (space-8)
Max width: 1400px (centralizado)
```

### 3.2 KPI Cards

```
Grid: 4 colunas em desktop, 2 em tablet, 1 em mobile
Height: Uniforme (160-200px)
Gap: 24px

Estrutura interna:
┌─────────────────────┐
│ [Ícone]    [Badge]  │ ← Topo, space-between
│                     │
│ [Label]             │ ← Uppercase, small
│ [Valor Grande]      │ ← Display, bold
│ [Tendência/Meta]    │ ← Small, com ícone
│                     │
│ [─────────]         │ ← Progress bar (opcional)
└─────────────────────┘

Animação:
- Count-up nos valores
- Fade in sequencial (delay 100ms entre cards)
- Hover: Lift + shadow
```

### 3.3 Chart Container

```
Card com chart:
- Padding: 24px
- Header: Título + filtros/ações
- Body: Chart (Recharts, Chart.js)
- Footer: Legenda ou metadados (opcional)

Aspect ratio sugerido:
- Line/Area: 16:9 ou 21:9 (landscape)
- Bar: 4:3 ou 16:9
- Pie/Donut: 1:1 (square)
- Gauge: 1:1 ou 4:3

Responsivo:
- Width: 100% do container
- Height: Fixo em desktop, auto em mobile
- Rerender no resize
```

---

## 4. LAYOUTS DE PÁGINA

### 4.1 Page Header Padrão

```
┌─────────────────────────────────────────┐
│ [Breadcrumbs]                           │
│                                         │
│ [Título da Página]    [Ações Primárias]│
│ [Descrição/Stats]                       │
│                                         │
│ [Tabs ou Filtros] (opcional)            │
└─────────────────────────────────────────┘

Padding: 0 32px
Min height: 120px (sem tabs) / 180px (com tabs)
Background: neutral-50 (opcional)
Border bottom: 1px solid neutral-200
```

### 4.2 Página de Listagem

```
Estrutura:

[Page Header]
  ├─ Título + Botão "Novo"
  ├─ Stats resumidas (X itens)
  └─ Busca + Filtros

[Lista/Grid]
  ├─ Loading state (skeleton)
  ├─ Empty state (se vazio)
  └─ Items

[Paginação]

Gap entre seções: 32px
```

### 4.3 Página de Detalhes

```
Layout 2 colunas (desktop):

┌─────────────────┬───────────────┐
│                 │               │
│ Coluna Principal│ Sidebar       │
│ (8 cols)        │ (4 cols)      │
│                 │               │
│ - Info geral    │ - Ações       │
│ - Timeline      │ - Metadados   │
│ - Histórico     │ - Relacionado │
│                 │               │
└─────────────────┴───────────────┘

Mobile: Stack vertical (sidebar abaixo)
Gap: 24px
```

### 4.4 Página de Formulário

```
Layout centralizado:

┌─────────────────────────────────┐
│         [Page Header]           │
├─────────────────────────────────┤
│                                 │
│   ┌─────────────────────────┐  │
│   │                         │  │
│   │  [Formulário]           │  │ ← Max width: 800px
│   │                         │  │    Centralizado
│   │                         │  │    Padding: 32px
│   └─────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

---

## 5. ESTADOS DE INTERFACE

### 5.1 Empty State (Estado Vazio)

```
Estrutura centralizada:

┌─────────────────────────────────┐
│                                 │
│      [Ilustração/Ícone]         │ ← 120-160px
│                                 │
│      Nenhum item encontrado     │ ← h3, neutral-800
│                                 │
│   Descrição do que fazer ou     │ ← body-sm, neutral-600
│   por que está vazio             │
│                                 │
│      [Botão de Ação]            │ ← CTA relevante
│                                 │
└─────────────────────────────────┘

Variações:
- Lista vazia: "Adicione o primeiro item"
- Busca sem resultados: "Tente outros termos"
- Filtro sem resultados: "Ajuste os filtros"
- Erro: "Não foi possível carregar"
```

### 5.2 Loading State

```
Skeleton Loading (preferido):
- Substitui layout exato do conteúdo
- Shimmer animation
- Mantém estrutura visual

Spinner Loading:
- Uso: Ações específicas (botão, modal)
- Centralizado no container
- Com label opcional

Full page loading:
- Overlay com backdrop blur
- Spinner grande centralizado
- Mensagem "Carregando..."
```

### 5.3 Error State

```
Estrutura:

┌─────────────────────────────────┐
│                                 │
│   [Ícone de Erro]               │ ← XCircle, danger-500
│                                 │
│   Algo deu errado               │ ← h3
│                                 │
│   [Mensagem técnica em         │ ← body-sm, collapsible
│    accordion para devs]         │
│                                 │
│   [Tentar Novamente] [Voltar]   │ ← Ações de recuperação
│                                 │
└─────────────────────────────────┘

Error Boundary (React):
- Captura erros não tratados
- Log no console/Sentry
- UI amigável para usuário
```

### 5.4 Success State

```
Feedback visual imediato:

1. Toast notification (preferido)
   - "Item salvo com sucesso"
   - Auto dismiss em 5s
   - Ícone CheckCircle

2. Inline success
   - Border green no campo
   - Checkmark animado
   - Texto de confirmação

3. Modal de confirmação
   - Uso: Ações críticas
   - Ícone grande
   - Botão "Continuar" ou auto-redirect
```

---

## 6. MICROINTERAÇÕES

### 6.1 Hover States

```
Cards:
  - Transform: translateY(-4px)
  - Shadow: sm → lg
  - Border: neutral-200 → primary-500/20
  - Duration: 200-300ms
  - Easing: ease-smooth

Buttons:
  - Transform: translateY(-2px)
  - Shadow: aumenta
  - Background: slightly lighter
  - Easing: ease-out

Links:
  - Color: primary-600 → primary-700
  - Underline: opacity animation
  - No transform (mantém fluxo)
```

### 6.2 Click/Tap Feedback

```
Active state:
  - Transform: scale(0.98) ou translateY(0)
  - Shadow: reduz
  - Duration: 100ms (instant)
  - Visual: "pressionado"

Ripple effect (opcional):
  - Origem: ponto do click
  - Radius: cresce de 0 → 100%
  - Opacity: 0.2 → 0
  - Duration: 600ms
  - Uso: Botões flat, list items
```

### 6.3 Focus States

```
Keyboard navigation:
  - Outline: none (remover padrão)
  - Ring: 0 0 0 4px primary-500/10
  - Offset: 2px (opcional)
  - Border: primary-500 (2px)
  - Transition: instant (0ms)

Regra de ouro:
- Focus sempre visível
- Contraste suficiente (WCAG)
- Não remover sem substituir
```

### 6.4 Transições de Página

```
Page enter:
  - Opacity: 0 → 1
  - Transform: translateY(20px) → translateY(0)
  - Duration: 400ms
  - Easing: ease-smooth
  - Stagger children: +50ms cada

Page exit:
  - Opacity: 1 → 0
  - Transform: scale(0.98)
  - Duration: 200ms
  - Easing: ease-in
```

### 6.5 Animações de Lista

```
Enter (item novo):
  - Opacity: 0 → 1
  - Transform: translateX(-20px) → translateX(0)
  - Scale: 0.95 → 1
  - Duration: 300ms
  - Easing: ease-bounce

Exit (item removido):
  - Opacity: 1 → 0
  - Transform: translateX(20px)
  - Height: auto → 0 (collapse)
  - Duration: 200ms
  - Easing: ease-in

Reorder:
  - Layout animation (Framer Motion)
  - Duration: 300ms
  - Easing: ease-smooth
```

---

## 7. TIPOGRAFIA EM CONTEXTO

### 7.1 Hierarquia Visual

```
Página:
├─ h1 (Page Title)          - 39px, bold, primary color
├─ Lead paragraph           - 20px, regular, neutral-700
├─ h2 (Section)             - 31px, semibold, 48px margin-top
│  ├─ h3 (Subsection)       - 25px, semibold, 32px margin-top
│  │  ├─ Body text          - 16px, regular, line-height 1.6
│  │  ├─ Small text         - 14px, regular, neutral-600
│  │  └─ Caption            - 12px, regular, neutral-500
│  └─ ...
└─ ...

Espaçamento vertical:
- Entre h1 e conteúdo: 24px
- Entre h2 e conteúdo: 20px
- Entre parágrafos: 16px
- Entre seções: 48px
```

### 7.2 Comprimento de Linha

```
Ideal: 50-75 caracteres (ótimo para leitura)
Máximo: 85 caracteres
Implementação: max-width: 65ch

Formulários: max-width: 800px
Artigos/Docs: max-width: 720px
Dashboard: sem limite (usa grid)
```

### 7.3 Contraste e Legibilidade

```
Texto principal:
- Cor: neutral-800 (#2b2926)
- Background: neutral-50 (#faf9f7)
- Ratio: 12.5:1 (AAA) ✅

Texto secundário:
- Cor: neutral-500 (#7a7369)
- Background: neutral-50
- Ratio: 4.6:1 (AA) ✅

Texto sobre cores:
- Sempre testar contraste
- Mínimo: 4.5:1 (AA)
- Ideal: 7:1 (AAA)
```

### 7.4 Números e Dados

```
Números grandes (KPIs):
- Font: Darker Grotesque
- Weight: 700-800
- Size: 48-64px
- Color: neutral-900
- Tabular nums: font-variant-numeric: tabular-nums

Moeda:
- Format: R$ 1.234,56
- Align: right em tabelas
- Negativo: danger-500 color

Datas:
- Format: DD/MM/YYYY ou "15 de fev. 2026"
- Relativo: "há 2 horas", "ontem"
- Consistência no formato em toda app
```

---

## 8. RESPONSIVIDADE

### 8.1 Mobile First Approach

```
Desenvolver sempre de mobile → desktop:

1. Base (mobile): 
   - Layout vertical
   - Navegação hamburger
   - Cards full-width
   - Padding 16px

2. Tablet (md):
   - Grid 2 colunas
   - Sidebar overlay ou dock
   - Padding 24px

3. Desktop (lg+):
   - Grid 3-4 colunas
   - Sidebar permanente
   - Padding 32px
   - Hover states ativos
```

### 8.2 Breakpoint Strategy

```
Componente Card:
<div class="
  w-full                    /* Mobile: full width */
  sm:w-1/2                  /* Small: 2 cols */
  lg:w-1/3                  /* Large: 3 cols */
  xl:w-1/4                  /* XL: 4 cols */
  p-4 sm:p-6 lg:p-8        /* Padding responsivo */
">

Esconder/Mostrar:
- hidden lg:block          /* Só desktop */
- block lg:hidden          /* Só mobile */
```

### 8.3 Touch Targets

```
Tamanho mínimo: 44x44px (Apple HIG, Material Design)

Aplicar em:
- Botões
- Checkboxes/radios
- Ícones clicáveis
- Links em listas
- Tab triggers

Espaçamento: Mínimo 8px entre targets
```

### 8.4 Navegação Mobile

```
Bottom Tab Bar (Mobile):
- Height: 64px
- Safe area: padding-bottom conforme device
- Items: 4-5 máximo
- Icons: 24px
- Labels: 11px (opcional)
- Active: primary-500
- Inactive: neutral-400

Hamburger Menu:
- Overlay full screen ou slide-in
- Backdrop: rgba(0,0,0,0.5)
- Width: 280px (slide-in) ou 100vw
- Animação: translateX ou fade
- Fechar: tap fora ou botão X
```

---

## 9. ACESSIBILIDADE (WCAG 2.1 AA)

### 9.1 Contraste de Cores

```
Requisitos:
- Texto normal (< 18px): 4.5:1 mínimo
- Texto grande (≥ 18px ou ≥ 14px bold): 3:1 mínimo
- Componentes UI: 3:1 mínimo
- Gráficos: 3:1 mínimo

Ferramentas:
- Contrast Checker (WebAIM)
- Color Oracle (simulador daltonismo)
- Built-in DevTools
```

### 9.2 Navegação por Teclado

```
Tab order lógico:
1. Header (logo, nav)
2. Main content (sequencial)
3. Sidebar (se existir)
4. Footer

Atalhos:
- Tab: Próximo elemento
- Shift+Tab: Elemento anterior
- Enter/Space: Ativar botão/link
- Esc: Fechar modal/dropdown
- Arrow keys: Navegação em menus/listas

Skip links:
<a href="#main-content" class="sr-only focus:not-sr-only">
  Pular para conteúdo principal
</a>
```

### 9.3 ARIA Labels

```html
<!-- Botão com ícone apenas -->
<button aria-label="Fechar modal">
  <X aria-hidden="true" />
</button>

<!-- Input com erro -->
<input 
  aria-invalid="true"
  aria-describedby="error-email"
/>
<span id="error-email" role="alert">
  Email inválido
</span>

<!-- Loading state -->
<div aria-live="polite" aria-busy="true">
  Carregando dados...
</div>

<!-- Navegação -->
<nav aria-label="Navegação principal">
  ...
</nav>
```

### 9.4 Screen Readers

```
Boas práticas:
- Usar HTML semântico (<nav>, <main>, <article>)
- Headings hierárquicos (h1 → h2 → h3)
- Alt text descritivo em imagens
- Labels em todos os inputs
- aria-live para atualizações dinâmicas
- Landmarks: role="banner", "main", "complementary"

Testar com:
- VoiceOver (Mac/iOS)
- NVDA (Windows)
- JAWS (Windows)
- TalkBack (Android)
```

### 9.5 Motion Reduction

```css
/* Respeitar preferência do usuário */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Ou desabilitar animações específicas */
@media (prefers-reduced-motion: reduce) {
  .animated-card {
    animation: none;
    transform: none;
  }
}
```

---

## 10. PERFORMANCE

### 10.1 Code Splitting

```jsx
// Lazy load de rotas
const Pacientes = lazy(() => import('./Pacientes'));
const Agenda = lazy(() => import('./Agenda'));

// Suspense boundary
<Suspense fallback={<PageSkeleton />}>
  <Routes>
    <Route path="/pacientes" element={<Pacientes />} />
    <Route path="/agenda" element={<Agenda />} />
  </Routes>
</Suspense>
```

### 10.2 Otimização de Imagens

```
Formatos modernos:
- WebP para fotos (fallback JPG)
- SVG para ícones e ilustrações
- PNG apenas quando necessário (transparência)

Responsive images:
<img 
  src="avatar-400.webp"
  srcset="
    avatar-200.webp 200w,
    avatar-400.webp 400w,
    avatar-800.webp 800w
  "
  sizes="
    (max-width: 640px) 200px,
    (max-width: 1024px) 400px,
    800px
  "
  alt="Foto do Dr. Carlos"
  loading="lazy"
/>
```

### 10.3 Debounce e Throttle

```jsx
// Search input com debounce
const debouncedSearch = useMemo(
  () => debounce((value) => {
    fetchResults(value);
  }, 300),
  []
);

// Scroll listener com throttle
useEffect(() => {
  const handleScroll = throttle(() => {
    setScrollY(window.scrollY);
  }, 100);
  
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

---

**Versão:** 1.0.0  
**Última atualização:** Fevereiro 2026  
**Status:** ✅ Completo
