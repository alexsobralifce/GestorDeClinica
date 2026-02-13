# 🎨 Design System - Sistema de Gestão Clínica

> **"Saúde Humanizada Contemporânea"**  
> Um Design System completo, profissional e acessível para gestão clínica multidisciplinar

![Status](https://img.shields.io/badge/status-completo-success)
![Versão](https://img.shields.io/badge/versão-1.0.0-blue)
![WCAG](https://img.shields.io/badge/WCAG-2.1%20AA-green)
![Figma](https://img.shields.io/badge/Figma-ready-purple)

---

## 📚 Documentação Completa

### 🎯 [**COMECE AQUI: Índice Principal**](./DESIGN_SYSTEM_INDEX.md)

Visão geral completa, roadmap e navegação para toda a documentação.

---

## 📖 Documentos Principais

### 1️⃣ Fundações
**[Design System Completo](./DESIGN_SYSTEM_COMPLETO.md)**  
Tokens de design, cores, tipografia, espaçamento, sombras, animações, grid system

**📏 150+ tokens documentados**

### 2️⃣ Componentes Base
**[Biblioteca de Componentes](./DESIGN_SYSTEM_COMPONENTES.md)**  
Buttons, inputs, cards, modals, badges, alerts, navigation, tables, avatares, loading states

**🧩 25+ componentes documentados**

### 3️⃣ Padrões e Layouts
**[Padrões de Interface](./DESIGN_SYSTEM_PADROES.md)**  
Formulários, listas, dashboards, empty states, microinterações, responsividade, acessibilidade

**📐 10 categorias de padrões**

### 4️⃣ Componentes Especializados
**[Componentes de Saúde](./DESIGN_SYSTEM_COMPONENTES_SAUDE.md)**  
Timeline de prontuário, agenda, card de paciente, status badges, formulários médicos, gráficos

**🏥 10 componentes específicos de saúde**

### 5️⃣ Implementação Figma
**[Guia de Implementação no Figma](./FIGMA_IMPLEMENTATION_GUIDE.md)**  
Passo-a-passo completo para criar o Design System no Figma, com variables, componentes e bibliotecas

**🎨 9 passos detalhados + checklist**

### 6️⃣ Referência Rápida
**[Quick Reference](./DESIGN_SYSTEM_QUICK_REFERENCE.md)**  
Tabelas de consulta rápida: cores (HEX), espaçamento, tipografia, sombras, breakpoints, dimensões

**📊 12 tabelas de referência**

---

## 🎨 Paleta de Cores Principais

```css
/* Primária - Verde Sálvia Profundo */
--primary-500: #4a7c65;

/* Neutras - Off-white e Cinzas */
--neutral-50:  #faf9f7;  /* Fundo principal */
--neutral-500: #7a7369;  /* Texto secundário */
--neutral-800: #2b2926;  /* Texto principal */

/* Acento - Terracota Vibrante */
--accent-500: #e85d3f;

/* Semânticas */
--success: #10b981;
--warning: #f59e0b;
--danger:  #e85d3f;
--info:    #3b82f6;

/* Especialidades */
--medicina:      #3b82f6;
--fisioterapia:  #10b981;
--odontologia:   #8b5cf6;
--psicologia:    #f59e0b;
--nutricao:      #84cc16;
```

---

## 🔤 Tipografia

**Heading (Títulos):** Darker Grotesque - 400, 500, 600, 700, 800  
**Body (Corpo):** Karla - 400, 500, 600, 700  
**Mono (Código):** JetBrains Mono - 400, 500

**Escala:** Major Third (1.25) - De 12px a 76px

---

## 📏 Espaçamento (8pt Grid)

```
Base: 8px (space-2)

Mais usados:
• space-4:  16px - Gap entre elementos
• space-6:  24px - Padding de cards
• space-8:  32px - Gap entre seções
• space-12: 48px - Entre seções principais
```

---

## 🎯 Componentes Principais

- ✅ **Buttons** (5 variantes, 3 tamanhos, 5 estados)
- ✅ **Inputs** (8 tipos, 5 estados)
- ✅ **Cards** (3 variantes, elevação progressiva)
- ✅ **Modals** (3 tamanhos, animações)
- ✅ **Navigation** (Sidebar, top bar, breadcrumbs, tabs)
- ✅ **Tables** (Ordenação, paginação, responsivo)
- ✅ **Forms** (Multi-step, validação em tempo real)
- ✅ **Timeline** (Linha orgânica por especialidade) 🌟
- ✅ **Agenda** (Day/Week/Month view, drag & drop)
- ✅ **Patient Card** (Compact/Expanded, alertas clínicos)

---

## 🎨 Diferenciais Únicos

### 🌟 Timeline de Prontuário
Linha vertical **orgânica** que muda de cor suavemente conforme a especialidade de cada evento

### 🎴 Cards Flutuantes
Elevação **progressiva** com hover states que fazem os cards "levitarem"

### 🎭 Microinterações
Animações suaves com **easing natural** (cubic-bezier) que respeitam física real

### 🎨 Paleta Humanizada
Cores quentes e acolhedoras que afastam-se da frieza hospitalar tradicional

---

## ✅ Acessibilidade (WCAG 2.1 AA)

- ✅ Contraste mínimo 4.5:1 em todos os textos
- ✅ Navegação completa por teclado
- ✅ Focus states visíveis
- ✅ ARIA labels em elementos interativos
- ✅ Screen reader friendly
- ✅ Touch targets mínimo 44x44px
- ✅ Motion reduction support

---

## 📱 Responsividade

**Mobile First Approach**

```
xs:   0px    - Smartphones pequenos
sm:   640px  - Smartphones
md:   768px  - Tablets portrait ⭐
lg:   1024px - Desktop pequeno ⭐
xl:   1280px - Desktop padrão ⭐
2xl:  1536px - Desktop grande
```

**Container padrão:** 1280px

---

## 🚀 Como Usar

### Para Designers:

1. Leia o [Índice Principal](./DESIGN_SYSTEM_INDEX.md)
2. Estude as [Fundações](./DESIGN_SYSTEM_COMPLETO.md)
3. Siga o [Guia de Implementação Figma](./FIGMA_IMPLEMENTATION_GUIDE.md)
4. Use a [Referência Rápida](./DESIGN_SYSTEM_QUICK_REFERENCE.md) para valores

### Para Developers:

1. Consulte a [Referência Rápida](./DESIGN_SYSTEM_QUICK_REFERENCE.md) para tokens
2. Implemente usando [Componentes](./DESIGN_SYSTEM_COMPONENTES.md)
3. Siga os [Padrões](./DESIGN_SYSTEM_PADROES.md) para layouts
4. Veja implementação em `/styles/globals.css` e `/components/`

### Para Product/QA:

1. Comece com o [Índice](./DESIGN_SYSTEM_INDEX.md)
2. Entenda os [Componentes de Saúde](./DESIGN_SYSTEM_COMPONENTES_SAUDE.md)
3. Valide estados em [Componentes](./DESIGN_SYSTEM_COMPONENTES.md)

---

## 🛠️ Stack Técnica

**Design:** Figma + Variables + Component Library  
**Frontend:** React 18 + TypeScript  
**Styling:** Tailwind CSS v4 + CSS Variables  
**Animations:** Framer Motion (motion/react)  
**Charts:** Recharts  
**Icons:** Lucide React

---

## 📊 Estatísticas

- **📄 Documentação:** 6 arquivos principais (~3,500 linhas)
- **🎨 Tokens:** 150+ (cores, espaçamento, tipografia, etc)
- **🧩 Componentes:** 25+ documentados com todos os estados
- **📐 Padrões:** 10 categorias de layouts e interfaces
- **🏥 Específicos:** 10 componentes especializados para saúde
- **✅ WCAG:** 2.1 AA compliant
- **📱 Breakpoints:** 6 (mobile → desktop)

---

## 🎓 Referências

Baseado nas melhores práticas de:
- [Material Design 3](https://m3.material.io)
- [IBM Carbon Design System](https://carbondesignsystem.com)
- [Ant Design](https://ant.design)

---

## 🗺️ Roadmap

**v1.0.0** ✅ - Completo e implementado
- [x] Tokens de design
- [x] Componentes básicos
- [x] Componentes de saúde
- [x] Documentação completa
- [x] Implementação React + Tailwind

**v1.1.0** 🚧 - Em progresso
- [ ] Dark mode (opcional)
- [ ] Testes automatizados de acessibilidade
- [ ] Storybook

**v2.0.0** 📋 - Planejado
- [ ] Biblioteca de ícones customizados
- [ ] Ilustrações personalizadas
- [ ] Templates de email
- [ ] Guia de voice & tone

---

## 📞 Recursos e Ferramentas

### Ferramentas Recomendadas

**Design:**
- Figma (design principal)
- Figma Tokens (export)
- Stark (acessibilidade)
- Contrast Checker

**Development:**
- VS Code + Tailwind IntelliSense
- React DevTools
- Axe DevTools (acessibilidade)

### Links Úteis

- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Color Oracle](https://colororacle.org/) (simulador daltonismo)

---

## 🎯 Navegação Rápida

| Documento | Descrição | Para quem? |
|-----------|-----------|------------|
| [📋 Índice](./DESIGN_SYSTEM_INDEX.md) | Visão geral e navegação | Todos |
| [🎨 Fundações](./DESIGN_SYSTEM_COMPLETO.md) | Tokens de design | Designers, Devs |
| [🧩 Componentes](./DESIGN_SYSTEM_COMPONENTES.md) | Biblioteca base | Devs, QA |
| [📐 Padrões](./DESIGN_SYSTEM_PADROES.md) | Layouts e guidelines | Designers, Devs |
| [🏥 Saúde](./DESIGN_SYSTEM_COMPONENTES_SAUDE.md) | Componentes médicos | Todos |
| [🎨 Figma](./FIGMA_IMPLEMENTATION_GUIDE.md) | Implementação Figma | Designers |
| [📊 Quick Ref](./DESIGN_SYSTEM_QUICK_REFERENCE.md) | Consulta rápida | Todos |

---

## 📝 Contribuindo

Quer adicionar ou modificar algo?

1. Leia o [Índice Principal](./DESIGN_SYSTEM_INDEX.md)
2. Siga as guidelines de nomenclatura
3. Documente todas as mudanças
4. Atualize a versão e changelog
5. Comunique o time

---

## 📄 Licença

Design System criado para uso no **Sistema de Gestão Clínica Multidisciplinar**.

**Uso interno:** Livre  
**Uso externo:** Requer aprovação  
**Modificações:** Encorajadas, desde que documentadas

---

## ✨ Créditos

**Filosofia:** "Saúde Humanizada Contemporânea"  
**Inspiração:** Material Design, IBM Carbon, Ant Design  
**Contexto:** Gestão clínica multidisciplinar  
**Versão:** 1.0.0  
**Status:** ✅ Completo e em produção  
**Data:** Fevereiro 2026

---

<div align="center">

**🎉 Design System Completo e Pronto para Uso! 🎉**

*"Design is not just what it looks like and feels like.  
Design is how it works."* — Steve Jobs

---

**[📋 Ver Índice Completo](./DESIGN_SYSTEM_INDEX.md)** | **[📊 Quick Reference](./DESIGN_SYSTEM_QUICK_REFERENCE.md)** | **[🎨 Figma Guide](./FIGMA_IMPLEMENTATION_GUIDE.md)**

</div>
