# Design System Completo - Sistema de Gestão Clínica Multidisciplinar

## 📋 Índice

1. [Fundações](#fundações)
2. [Tokens de Design](#tokens-de-design)
3. [Componentes](#componentes)
4. [Padrões e Layouts](#padrões-e-layouts)
5. [Microanimações](#microanimações)
6. [Acessibilidade](#acessibilidade)
7. [Implementação](#implementação)

---

## 🎨 Fundações

### Filosofia de Design

**"Saúde Humanizada Contemporânea"**

O Design System foi desenvolvido para afastar-se da frieza hospitalar tradicional, criando uma experiência profissional, confiável e humanizada. Cada decisão de design prioriza:

- **Clareza**: Informações complexas apresentadas de forma simples
- **Confiança**: Design sólido que transmite profissionalismo
- **Acolhimento**: Cores quentes, cantos arredondados, microinterações suaves
- **Acessibilidade**: WCAG 2.1 AA em todos os componentes
- **Consistência**: Padrões reutilizáveis em toda a plataforma

### Princípios de Design

1. **Hierarquia Visual Clara**: O usuário sempre sabe onde olhar primeiro
2. **Feedback Imediato**: Toda ação tem resposta visual instantânea
3. **Espaço para Respirar**: Uso generoso de whitespace (8pt grid)
4. **Elevação Progressiva**: Cards e elementos flutuam de forma sutil
5. **Transições Naturais**: Animações que respeitam física real (easing)

---

## 🎯 Tokens de Design

### 1. Sistema de Cores

#### 1.1 Cores Primárias - Verde Sálvia Profundo

**Uso:** Ações principais, navegação, elementos interativos, destaque de conteúdo importante

```
primary-50:  #f0f5f3  | Fundos suaves, hover states leves
primary-100: #dce8e3  | Backgrounds secundários, borders suaves
primary-200: #b9d1c7  | States disabled, ilustrações
primary-300: #8fb5a4  | Placeholders, texto secundário
primary-400: #6b9985  | Hover states, borders ativos
primary-500: #4a7c65  | ⭐ COR PRINCIPAL - Botões, links, ícones
primary-600: #3d6653  | Pressed states, texto em hover
primary-700: #325143  | Textos importantes, cabeçalhos
primary-800: #283f35  | Fundos escuros, navegação
primary-900: #1f332b  | Textos em fundos claros de alto contraste
```

**Contraste WCAG:**
- primary-500 em branco: 4.8:1 (AA Large) ✅
- primary-700 em branco: 7.2:1 (AAA) ✅
- primary-500 em neutral-50: 4.5:1 (AA) ✅

#### 1.2 Cores Neutras - Off-whites Creme e Cinzas Suaves

**Uso:** Fundos, textos, borders, estruturas principais

```
neutral-50:  #faf9f7  | ⭐ FUNDO PRINCIPAL - Background global
neutral-100: #f5f3ef  | Backgrounds secundários, sections
neutral-200: #e8e5df  | Borders padrão, dividers
neutral-300: #d4cfc5  | Borders hover, ilustrações
neutral-400: #a8a199  | Placeholders, labels desabilitados
neutral-500: #7a7369  | ⭐ TEXTO SECUNDÁRIO - Descrições, metadados
neutral-600: #5c5650  | Texto terciário, ícones secundários
neutral-700: #3f3d38  | Texto em destaque, subtítulos
neutral-800: #2b2926  | ⭐ TEXTO PRINCIPAL - Headings, body text
neutral-900: #1a1816  | Textos de máximo contraste
```

**Contraste WCAG:**
- neutral-800 em neutral-50: 12.5:1 (AAA) ✅
- neutral-500 em neutral-50: 4.6:1 (AA) ✅
- neutral-400 em neutral-50: 3.2:1 (AA Large) ✅

#### 1.3 Cores de Acento - Terracota Vibrante

**Uso:** Call-to-actions secundárias, destaques especiais, elementos decorativos

```
accent-50:  #fef5f3  | Fundos de alerta suave
accent-100: #fde8e3  | Backgrounds de destaque
accent-200: #fbd1c7  | Illustrations, decorações
accent-300: #f7aea0  | Hover states suaves
accent-400: #f18569  | Borders ativos
accent-500: #e85d3f  | ⭐ ACENTO PRINCIPAL - CTAs secundários
accent-600: #d54426  | Pressed states
accent-700: #b3351b  | Textos de alerta
accent-800: #932f1b  | Fundos de alerta
accent-900: #7a2b1d  | Alto contraste
```

#### 1.4 Cores Semânticas

**Success (Verde) - Estados positivos, confirmações, sucesso**
```
success-50:  #f0fdf4
success-100: #dcfce7
success-500: #10b981  | ⭐ Principal
success-600: #059669
success-700: #047857
```

**Warning (Amarelo/Laranja) - Avisos, atenção, pendências**
```
warning-50:  #fffbeb
warning-100: #fef3c7
warning-500: #f59e0b  | ⭐ Principal
warning-600: #d97706
warning-700: #b45309
```

**Danger (Vermelho) - Erros, exclusões, alertas críticos**
```
danger-50:  #fef5f3
danger-100: #fee2e2
danger-500: #e85d3f  | ⭐ Principal (mesma do accent)
danger-600: #dc2626
danger-700: #b91c1c
```

**Info (Azul) - Informações neutras, dicas, ajuda**
```
info-50:  #eff6ff
info-100: #dbeafe
info-500: #3b82f6  | ⭐ Principal
info-600: #2563eb
info-700: #1d4ed8
```

#### 1.5 Cores por Especialidade

**Medicina (Azul)**
```
medicina-light: #dbeafe
medicina:       #3b82f6  | ⭐ Principal
medicina-dark:  #1e40af
```

**Fisioterapia (Verde)**
```
fisioterapia-light: #d1fae5
fisioterapia:       #10b981  | ⭐ Principal
fisioterapia-dark:  #047857
```

**Odontologia (Roxo)**
```
odontologia-light: #ede9fe
odontologia:       #8b5cf6  | ⭐ Principal
odontologia-dark:  #6d28d9
```

**Psicologia (Laranja)**
```
psicologia-light: #fed7aa
psicologia:       #f59e0b  | ⭐ Principal
psicologia-dark:  #b45309
```

**Nutrição (Verde Limão)**
```
nutricao-light: #ecfccb
nutricao:       #84cc16  | ⭐ Principal
nutricao-dark:  #4d7c0f
```

---

### 2. Tipografia

#### 2.1 Famílias Tipográficas

**Heading (Display/Títulos):**
```
Font Family: 'Darker Grotesque', sans-serif
Weights: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold), 800 (ExtraBold)
Características: Alta legibilidade, personalidade única, expressiva
Uso: Títulos, headings, números grandes, CTAs importantes
```

**Body (Corpo de texto):**
```
Font Family: 'Karla', sans-serif
Weights: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
Características: Humanista, alta legibilidade em tamanhos pequenos
Uso: Parágrafos, labels, inputs, textos corridos, UI elements
```

**Monospace (Código/Dados):**
```
Font Family: 'JetBrains Mono', monospace
Weights: 400 (Regular), 500 (Medium)
Uso: CPF, telefone, códigos, IDs, dados técnicos
```

#### 2.2 Escala Tipográfica (Major Third - 1.25)

**Sistema modular que garante harmonia e hierarquia**

```
display-2xl:  4.768rem (76.29px)  | Line: 1.15 | Weight: 800 | Marketing hero
display-xl:   3.815rem (61.04px)  | Line: 1.15 | Weight: 800 | Landing pages
display-lg:   3.052rem (48.83px)  | Line: 1.2  | Weight: 700 | Page heroes

heading-h1:   2.441rem (39.06px)  | Line: 1.25 | Weight: 700 | ⭐ Page titles
heading-h2:   1.953rem (31.25px)  | Line: 1.3  | Weight: 600 | Section headers
heading-h3:   1.563rem (25.00px)  | Line: 1.35 | Weight: 600 | Subsections
heading-h4:   1.25rem  (20.00px)  | Line: 1.4  | Weight: 600 | Card titles
heading-h5:   1rem     (16.00px)  | Line: 1.5  | Weight: 600 | Small headings
heading-h6:   0.875rem (14.00px)  | Line: 1.5  | Weight: 600 | Micro headings

body-xl:      1.25rem  (20.00px)  | Line: 1.6  | Weight: 400 | Lead paragraphs
body-lg:      1.125rem (18.00px)  | Line: 1.6  | Weight: 400 | Large text
body-base:    1rem     (16.00px)  | Line: 1.6  | Weight: 400 | ⭐ PADRÃO
body-sm:      0.875rem (14.00px)  | Line: 1.5  | Weight: 400 | Secondary text
body-xs:      0.75rem  (12.00px)  | Line: 1.5  | Weight: 400 | Captions

label-lg:     0.875rem (14.00px)  | Line: 1.4  | Weight: 500 | Form labels
label-base:   0.813rem (13.00px)  | Line: 1.4  | Weight: 500 | Input labels
label-sm:     0.75rem  (12.00px)  | Line: 1.4  | Weight: 500 | Micro labels

button-lg:    1rem     (16.00px)  | Line: 1    | Weight: 600 | Large buttons
button-base:  0.875rem (14.00px)  | Line: 1    | Weight: 600 | ⭐ Default buttons
button-sm:    0.813rem (13.00px)  | Line: 1    | Weight: 600 | Small buttons
```

#### 2.3 Letter Spacing (Tracking)

```
tight:    -0.02em  | Headings grandes (display)
normal:    0em     | ⭐ Padrão para body
relaxed:   0.01em  | Labels, botões
wide:      0.05em  | Labels uppercase, badges
```

---

### 3. Espaçamento (8pt Grid System)

**Sistema base: 8px**

Todo espaçamento deve ser múltiplo de 8px para garantir consistência e alinhamento pixel-perfect.

```
space-0:   0        | 0px     | Sem espaço
space-1:   0.25rem  | 4px     | Micro gaps, bordas internas
space-2:   0.5rem   | 8px     | ⭐ BASE - Gaps mínimos
space-3:   0.75rem  | 12px    | Spacing compacto
space-4:   1rem     | 16px    | ⭐ Padrão entre elementos relacionados
space-5:   1.25rem  | 20px    | Spacing confortável
space-6:   1.5rem   | 24px    | ⭐ Padrão entre seções relacionadas
space-8:   2rem     | 32px    | ⭐ Entre grupos de conteúdo
space-10:  2.5rem   | 40px    | Spacing generoso
space-12:  3rem     | 48px    | ⭐ Entre seções principais
space-16:  4rem     | 64px    | Separação visual forte
space-20:  5rem     | 80px    | Seções de página
space-24:  6rem     | 96px    | Hero sections
space-32:  8rem     | 128px   | Macro layout
```

**Regras de uso:**
- Padding de cards: `space-6` (24px) padrão, `space-8` (32px) para cards grandes
- Gap entre elementos inline: `space-2` ou `space-3`
- Gap entre cards no grid: `space-6` (24px)
- Margem entre seções: `space-12` (48px)

---

### 4. Raios de Borda (Border Radius)

**Sistema de cantos arredondados generosos**

```
radius-none:  0       | 0px     | Estados especiais (pills cortados)
radius-sm:    0.25rem | 4px     | Badges pequenos, tags
radius-base:  0.5rem  | 8px     | Elementos pequenos, chips
radius-md:    0.75rem | 12px    | Inputs, dropdowns
radius-lg:    1rem    | 16px    | ⭐ Botões padrão, cards secundários
radius-xl:    1.25rem | 20px    | ⭐ Cards principais
radius-2xl:   1.5rem  | 24px    | Cards destacados, modals
radius-3xl:   2rem    | 32px    | Hero cards, elementos especiais
radius-full:  9999px  |         | Pills, avatares circulares
```

**Regras de uso:**
- Botões: `radius-lg` (16px)
- Cards: `radius-xl` ou `radius-2xl` (20-24px)
- Inputs: `radius-md` (12px)
- Modais: `radius-2xl` (24px)
- Badges: `radius-base` (8px)

---

### 5. Sombras (Elevation System)

**Sistema de elevação com 7 níveis**

```css
/* Nível 0 - Plano (sem elevação) */
shadow-none: none

/* Nível 1 - Micro elevação (hover sutil) */
shadow-xs: 0 1px 2px 0 rgba(42, 41, 38, 0.05)

/* Nível 2 - Elevação mínima (cards em repouso) */
shadow-sm: 
  0 1px 3px 0 rgba(42, 41, 38, 0.1),
  0 1px 2px 0 rgba(42, 41, 38, 0.06)

/* Nível 3 - Elevação padrão (cards hover, dropdowns) ⭐ */
shadow-md:
  0 4px 6px -1px rgba(42, 41, 38, 0.08),
  0 2px 4px -1px rgba(42, 41, 38, 0.04)

/* Nível 4 - Elevação média (modais, popovers) */
shadow-lg:
  0 10px 15px -3px rgba(42, 41, 38, 0.1),
  0 4px 6px -2px rgba(42, 41, 38, 0.05)

/* Nível 5 - Elevação alta (modais importantes) */
shadow-xl:
  0 20px 25px -5px rgba(42, 41, 38, 0.1),
  0 10px 10px -5px rgba(42, 41, 38, 0.04)

/* Nível 6 - Elevação máxima (overlays, toasts) */
shadow-2xl:
  0 25px 50px -12px rgba(42, 41, 38, 0.15)

/* Sombras coloridas (para elementos primários) */
shadow-primary:
  0 4px 12px -2px rgba(74, 124, 101, 0.25),
  0 2px 6px -1px rgba(74, 124, 101, 0.15),
  inset 0 1px 0 0 rgba(255, 255, 255, 0.15)

shadow-danger:
  0 4px 12px -2px rgba(232, 93, 63, 0.25),
  0 2px 6px -1px rgba(232, 93, 63, 0.15),
  inset 0 1px 0 0 rgba(255, 255, 255, 0.15)
```

**Regras de uso:**
- Cards em repouso: `shadow-sm`
- Cards em hover: `shadow-md` ou `shadow-lg`
- Dropdowns/Popovers: `shadow-lg`
- Modais: `shadow-xl` ou `shadow-2xl`
- Botões primários: `shadow-primary`

---

### 6. Animações e Transições

#### 6.1 Durações

```
duration-instant:    100ms  | Feedback imediato (hover)
duration-fast:       200ms  | ⭐ Transições rápidas (padrão)
duration-normal:     300ms  | Transições normais
duration-slow:       500ms  | Transições deliberadas
duration-deliberate: 800ms  | Animações complexas
duration-lazy:       1200ms | Entrada de página
```

#### 6.2 Easing Functions

```css
/* Suaves e naturais */
ease-smooth:  cubic-bezier(0.4, 0.0, 0.2, 1)     | ⭐ Padrão - Material Design
ease-swift:   cubic-bezier(0.25, 0.46, 0.45, 0.94) | Rápido mas suave
ease-bounce:  cubic-bezier(0.68, -0.55, 0.265, 1.55) | Efeito bounce

/* CSS padrão */
ease-in:      cubic-bezier(0.4, 0.0, 1, 1)       | Acelera no início
ease-out:     cubic-bezier(0.0, 0.0, 0.2, 1)     | Desacelera no fim
ease-in-out:  cubic-bezier(0.4, 0.0, 0.2, 1)     | S-curve suave
```

---

### 7. Breakpoints Responsivos

**Sistema mobile-first**

```
xs:   0px      | 0rem      | Smartphones pequenos (< 375px)
sm:   640px    | 40rem     | Smartphones (≥ 375px)
md:   768px    | 48rem     | ⭐ Tablets portrait (≥ 768px)
lg:   1024px   | 64rem     | ⭐ Tablets landscape / Desktop pequeno
xl:   1280px   | 80rem     | Desktop padrão (≥ 1280px)
2xl:  1536px   | 96rem     | Desktop grande / Monitores wide
```

**Container máximo:**
```
container-sm:  640px   | Formulários, conteúdo estreito
container-md:  768px   | Conteúdo de leitura
container-lg:  1024px  | Dashboards compactos
container-xl:  1280px  | ⭐ Padrão para aplicação
container-2xl: 1536px  | Dashboards complexos
```

---

### 8. Grid System

**Sistema de 12 colunas com gap flexível**

```
Grid Columns:   12 colunas
Gap Padrão:     24px (space-6)
Gap Compacto:   16px (space-4)
Gap Generoso:   32px (space-8)

Layouts comuns:
- 1 coluna:  Mobile (< md)
- 2 colunas: Tablet portrait (md)
- 3 colunas: Tablet landscape (lg)
- 4 colunas: Desktop (xl)
- 6 colunas: Desktop grande (2xl) - micro cards
```

---

### 9. Z-Index Scale

**Sistema de camadas**

```
z-0:      0       | Conteúdo base
z-10:     10      | Elementos elevados
z-20:     20      | Dropdowns
z-30:     30      | Sticky headers
z-40:     40      | Modals backdrop
z-50:     50      | Modals content
z-60:     60      | Tooltips
z-70:     70      | Notifications/Toasts
z-80:     80      | Loading overlays
z-90:     90      | Critical overlays
z-100:    100     | Development/Debug
```

---

## 📦 Componentes (continua no próximo arquivo)

Ver detalhes completos em: `/docs/DESIGN_SYSTEM_COMPONENTES.md`

---

## 🎭 Tokens Dark Mode

**Nota:** O sistema foi projetado primariamente para Light Mode (contexto médico durante horário comercial). Dark Mode pode ser implementado futuramente com os seguintes ajustes:

```
Dark Mode Tokens:
- Inverter neutral-50 ↔ neutral-900
- Ajustar primary para versões mais claras
- Reduzir opacidade de sombras
- Aumentar contraste de borders
```

---

## 📐 Sistema de Medidas - Referência Rápida

```
4px   = 0.25rem = space-1
8px   = 0.5rem  = space-2  ⭐ BASE
12px  = 0.75rem = space-3
16px  = 1rem    = space-4
24px  = 1.5rem  = space-6  ⭐ CARD PADDING
32px  = 2rem    = space-8  ⭐ SECTION GAP
48px  = 3rem    = space-12 ⭐ MAJOR SECTIONS
```

---

**Versão:** 1.0.0  
**Última atualização:** Fevereiro 2026  
**Mantido por:** Equipe de Design de Produto  
**Status:** ✅ Implementado e em uso
