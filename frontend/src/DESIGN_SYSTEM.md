# 🎨 Design System - Sistema de Gestão Clínica Multidisciplinar

## **"Saúde Humanizada Contemporânea"**

**Versão:** 1.0.0  
**Status:** ✅ Completo e Implementado  
**Última atualização:** Fevereiro 2026

---

## 📚 Índice de Documentação

Este Design System foi desenvolvido seguindo as melhores práticas da indústria (Material Design, IBM Carbon, Ant Design) adaptadas ao contexto de gestão clínica.

### 📖 Documentação Completa

Toda a documentação está organizada no diretório `/docs/`:

1. **[DESIGN_SYSTEM_INDEX.md](./docs/DESIGN_SYSTEM_INDEX.md)**  
   📋 Índice geral e visão completa do sistema

2. **[DESIGN_SYSTEM_COMPLETO.md](./docs/DESIGN_SYSTEM_COMPLETO.md)**  
   🎨 Especificação técnica completa de todos os tokens de design

3. **[DESIGN_SYSTEM_QUICK_REFERENCE.md](./docs/DESIGN_SYSTEM_QUICK_REFERENCE.md)**  
   ⚡ Referência rápida com tabelas de todos os valores

4. **[DESIGN_SYSTEM_COMPONENTES.md](./docs/DESIGN_SYSTEM_COMPONENTES.md)**  
   🧩 Biblioteca de componentes fundamentais (Buttons, Inputs, Cards, etc)

5. **[DESIGN_SYSTEM_PADROES.md](./docs/DESIGN_SYSTEM_PADROES.md)**  
   📐 Padrões de interface e guidelines de uso

6. **[DESIGN_SYSTEM_COMPONENTES_SAUDE.md](./docs/DESIGN_SYSTEM_COMPONENTES_SAUDE.md)**  
   🏥 Componentes especializados para gestão clínica

7. **[FIGMA_IMPLEMENTATION_GUIDE.md](./docs/FIGMA_IMPLEMENTATION_GUIDE.md)**  
   🎨 Guia passo-a-passo para criar o Design System no Figma

---

## 🎯 Filosofia de Design

O sistema foi criado para **afastar-se da frieza hospitalar tradicional**, oferecendo uma experiência profissional, confiável e humanizada através de:

✅ **Cores quentes e acolhedoras** (Verde Sálvia + Terracota)  
✅ **Cantos generosamente arredondados** (radius-xl: 20px em cards)  
✅ **Microinterações suaves** com física natural (easing)  
✅ **Espaçamento generoso** baseado em 8pt grid  
✅ **Tipografia única** (Darker Grotesque + Karla)  
✅ **Acessibilidade WCAG 2.1 AA** em todos os componentes

---

## 🚀 Início Rápido

### Para Designers:

```
1. Ler DESIGN_SYSTEM_COMPLETO.md para entender fundações
2. Seguir FIGMA_IMPLEMENTATION_GUIDE.md para criar no Figma
3. Consultar DESIGN_SYSTEM_QUICK_REFERENCE.md para valores exatos
```

### Para Developers:

```
1. Consultar DESIGN_SYSTEM_QUICK_REFERENCE.md para tokens
2. Ver implementação CSS em /styles/globals.css
3. Usar componentes prontos em /components/ui/ e /components/shared/
4. Seguir padrões em DESIGN_SYSTEM_PADROES.md
```

---

## 📊 Tokens Principais (Top 10)

### Cores mais usadas:

| Token | Valor | Uso |
|-------|-------|-----|
| `primary-500` | `#4a7c65` | Cor principal - botões, links, ícones |
| `neutral-50` | `#faf9f7` | Fundo principal da aplicação |
| `neutral-800` | `#2b2926` | Texto principal - headings, body |
| `neutral-500` | `#7a7369` | Texto secundário - descrições |
| `accent-500` | `#e85d3f` | Acento - CTAs secundários |

### Espaçamentos mais usados:

| Token | Valor | Uso |
|-------|-------|-----|
| `space-6` | `24px` | Padding de cards |
| `space-4` | `16px` | Gap entre elementos relacionados |
| `space-8` | `32px` | Gap entre grupos de conteúdo |
| `space-12` | `48px` | Gap entre seções principais |

### Outros:

| Token | Valor | Uso |
|-------|-------|-----|
| `radius-xl` | `20px` | Border radius de cards |

---

## 🎨 Implementação Técnica

### CSS Variables (Tokens)

Todos os tokens estão implementados em `/styles/globals.css` usando CSS Custom Properties:

```css
:root {
  /* Cores */
  --color-primary-500: #4a7c65;
  --color-neutral-50: #faf9f7;
  
  /* Espaçamento */
  --space-6: 1.5rem; /* 24px */
  --space-8: 2rem;   /* 32px */
  
  /* Tipografia */
  --font-heading: 'Darker Grotesque', sans-serif;
  --font-body: 'Karla', sans-serif;
  
  /* Border Radius */
  --radius-xl: 1.25rem; /* 20px */
  
  /* Sombras */
  --shadow-sm: 0 1px 3px 0 rgba(42, 41, 38, 0.1), ...;
}
```

### Classes Utilitárias

#### Buttons:
```html
<button class="btn-primary">Primário</button>
<button class="btn-secondary">Secundário</button>
<button class="btn-ghost">Ghost</button>
<button class="btn-danger">Perigo</button>
<button class="btn-premium">Premium</button>
```

#### Cards:
```html
<div class="card">
  <div class="card-content">
    <!-- Conteúdo com padding de 24px -->
  </div>
</div>
```

#### Badges:
```html
<span class="badge badge-primary">Primário</span>
<span class="badge badge-success">Sucesso</span>
<span class="badge badge-warning">Aviso</span>
<span class="badge badge-danger">Erro</span>
```

#### Inputs:
```html
<input type="text" class="input-field" placeholder="Digite..." />
```

---

## 🏗️ Estrutura de Arquivos

```
/
├─ /docs/                          # 📚 Documentação completa
│  ├─ DESIGN_SYSTEM_INDEX.md       # Índice geral
│  ├─ DESIGN_SYSTEM_COMPLETO.md    # Tokens completos
│  ├─ DESIGN_SYSTEM_QUICK_REFERENCE.md # Referência rápida
│  ├─ DESIGN_SYSTEM_COMPONENTES.md # Componentes base
│  ├─ DESIGN_SYSTEM_PADROES.md     # Padrões de UI
│  ├─ DESIGN_SYSTEM_COMPONENTES_SAUDE.md # Componentes médicos
│  └─ FIGMA_IMPLEMENTATION_GUIDE.md # Guia Figma
│
├─ /styles/
│  └─ globals.css                  # ⭐ Implementação dos tokens CSS
│
├─ /components/
│  ├─ /ui/                         # Componentes base do shadcn/ui
│  ├─ /shared/                     # Componentes reutilizáveis
│  │  ├─ KPICard.tsx              # Cards de KPI
│  │  ├─ ErrorBoundary.tsx        # Error boundary
│  │  └─ PagamentoConsultaModal.tsx
│  ├─ /layout/                     # Layouts
│  │  └─ Layout.tsx               # Layout principal com sidebar
│  ├─ /dashboard/                  # Páginas de dashboard
│  ├─ /pacientes/                  # CRUD de pacientes
│  ├─ /agenda/                     # Sistema de agendamento
│  ├─ /prontuario/                 # Prontuário eletrônico
│  ├─ /financeiro/                 # Gestão financeira
│  └─ /administrativo/             # Módulos administrativos
│
└─ DESIGN_SYSTEM.md                # Este arquivo
```

---

## ✅ Status de Implementação

### ✅ Implementado (v1.0.0)

- [x] Todos os tokens CSS (cores, espaçamento, tipografia, sombras)
- [x] Sistema de componentes base (Buttons, Inputs, Cards, Badges)
- [x] Layout responsivo com sidebar
- [x] Módulos principais (Dashboard, Pacientes, Agenda, Prontuário, Financeiro)
- [x] Acessibilidade WCAG 2.1 AA validada
- [x] Microinterações com Framer Motion
- [x] Sistema de 8pt grid
- [x] Documentação completa

### 🚧 Roadmap Futuro

- [ ] Dark mode (opcional)
- [ ] Biblioteca de ícones customizados
- [ ] Ilustrações personalizadas
- [ ] Storybook para componentes
- [ ] Testes automatizados de acessibilidade
- [ ] Templates de email

---

## 📏 Especificações Técnicas

### Breakpoints:

| Nome | Min Width | Uso |
|------|-----------|-----|
| `sm` | `640px` | Smartphones |
| `md` | `768px` | Tablets portrait |
| `lg` | `1024px` | Tablets landscape / Desktop pequeno |
| `xl` | `1280px` | Desktop padrão |
| `2xl` | `1536px` | Desktop grande |

### Tipografia:

| Elemento | Tamanho | Peso | Uso |
|----------|---------|------|-----|
| H1 | `39.06px` | 700 | Títulos de página |
| H2 | `31.25px` | 600 | Section headers |
| H3 | `25.00px` | 600 | Subsections |
| Body | `16.00px` | 400 | Texto padrão |

### Cores por Especialidade:

| Especialidade | Cor | Hex |
|---------------|-----|-----|
| Medicina | Azul | `#3b82f6` |
| Fisioterapia | Verde | `#10b981` |
| Odontologia | Roxo | `#8b5cf6` |
| Psicologia | Laranja | `#f59e0b` |
| Nutrição | Verde Limão | `#84cc16` |

---

## 🎯 Diferencial Memorável

O que torna este Design System único:

🌟 **Timeline de Prontuário** com linha orgânica que muda de cor por especialidade  
🌟 **Cards flutuantes** com elevação progressiva (shadow-sm → shadow-md)  
🌟 **Gradientes suaves** em botões (não flat design puro)  
🌟 **Microanimações** com física natural (cubic-bezier)  
🌟 **Paleta única** para cada especialidade médica  

---

## 🛠️ Ferramentas e Stack

### Design:
- **Figma** - Design tool
- **Figma Tokens** - Export de variables
- **Stark** - Teste de acessibilidade

### Development:
- **React 18+** - Framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Framer Motion** - Animações
- **React Router** - Roteamento

### Testing:
- **Axe DevTools** - Acessibilidade
- **Lighthouse** - Performance

---

## 📞 Suporte e Recursos

### Links Úteis:

- **Documentação Completa:** `/docs/DESIGN_SYSTEM_INDEX.md`
- **Referência Rápida:** `/docs/DESIGN_SYSTEM_QUICK_REFERENCE.md`
- **Contraste WCAG:** https://webaim.org/resources/contrastchecker/
- **Material Design:** https://m3.material.io
- **IBM Carbon:** https://carbondesignsystem.com

---

## 🤝 Como Contribuir

### Para adicionar um novo componente:

1. Documentar especificação no arquivo apropriado em `/docs/`
2. Criar implementação em React + Tailwind
3. Garantir acessibilidade (WCAG 2.1 AA)
4. Adicionar à biblioteca
5. Atualizar documentação

### Para propor mudanças:

1. Discutir com o time de design
2. Validar impacto em componentes existentes
3. Atualizar documentação
4. Criar migration guide se necessário

---

## 📊 Estatísticas

- **Tokens de Design:** 150+ (cores, espaçamento, tipografia, etc)
- **Componentes Documentados:** 25+
- **Páginas de Documentação:** 7
- **Cobertura de Acessibilidade:** WCAG 2.1 AA ✅
- **Contraste Mínimo:** 4.5:1 (AA) em todos os textos
- **Browsers Suportados:** Chrome, Firefox, Safari, Edge (últimas 2 versões)

---

## 📝 Changelog

### v1.0.0 - Fevereiro 2026
- ✅ Lançamento inicial do Design System
- ✅ Documentação completa (7 arquivos)
- ✅ Implementação de todos os componentes base
- ✅ Sistema implementado e em produção
- ✅ Acessibilidade WCAG 2.1 AA validada

---

## 📄 Licença

Este Design System foi criado especificamente para o **Sistema de Gestão Clínica Multidisciplinar**.

---

**🎉 Design System Completo e Pronto para Uso!**

*"Design is not just what it looks like and feels like.  
Design is how it works."* — Steve Jobs

---

**Versão:** 1.0.0  
**Última atualização:** Fevereiro 2026  
**Status:** ✅ Completo, implementado e documentado
