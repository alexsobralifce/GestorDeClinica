# 📱 Sistema Mobile - Gestão Clínica "Saúde Humanizada Contemporânea"

## 📋 Índice
- [Visão Geral](#visão-geral)
- [Fundações Mobile](#fundações-mobile)
- [Componentes Implementados](#componentes-implementados)
- [Telas Mobile](#telas-mobile)
- [Guia de Uso](#guia-de-uso)
- [Boas Práticas](#boas-práticas)

---

## 🎯 Visão Geral

Sistema mobile completo implementado seguindo as diretrizes do **Design System "Saúde Humanizada Contemporânea"** com foco em:

- ✅ **Mobile-First Design**
- ✅ **Touch-Friendly Interfaces** (48px+ touch targets)
- ✅ **Safe Area Support** (iOS notch)
- ✅ **Responsive Typography** (16px+ para evitar zoom iOS)
- ✅ **Bottom Navigation** (padrão Android/iOS)
- ✅ **Gestos e Animações Suaves**
- ✅ **Offline-First Ready**

---

## 🏗️ Fundações Mobile

### Breakpoints
```css
Small Phone:  320px - 374px  (iPhone SE, Android compactos)
Medium Phone: 375px - 413px  (iPhone padrão, maioria Android)
Large Phone:  414px - 428px  (iPhone Plus/Max)
Tablet:       769px - 1024px
Desktop:      1025px+
```

### Touch Targets
```css
Mínimo:      48x48px (WCAG AAA)
Confortável: 56x56px (recomendado)
```

### Safe Areas (iOS)
```css
--safe-area-top: env(safe-area-inset-top);
--safe-area-bottom: env(safe-area-inset-bottom);
```

### Tipografia Mobile
```css
Display: 32px (reduzido de 48px desktop)
H1:      24px (reduzido de 39px)
H2:      20px (reduzido de 31px)
H3:      18px (reduzido de 25px)
Body:    16px (MANTIDO - mínimo para evitar zoom iOS)
Small:   14px
Caption: 12px
```

---

## 🧩 Componentes Implementados

### 1. **BottomNavigation**
Navegação principal inferior com 4-5 itens.

```tsx
import { BottomNavigation } from '@/components/mobile';

<BottomNavigation />
```

**Features:**
- Ícones 24x24px
- Labels 11px
- Badge de notificações
- Active state visual
- Touch area 48px+

---

### 2. **MobileAppBar**
Barra superior com título e ações.

```tsx
import { MobileAppBar } from '@/components/mobile';

<MobileAppBar 
  title="Agenda"
  showBack
  actions={<button>...</button>}
/>
```

**Features:**
- Safe area support (notch)
- Back button opcional
- Ações customizáveis
- Sticky positioning

---

### 3. **FAB (Floating Action Button)**
Botão de ação principal flutuante.

```tsx
import { FAB } from '@/components/mobile';

<FAB 
  onClick={() => setShowModal(true)}
  label="Nova Consulta"
  variant="extended"
/>
```

**Variants:**
- `default`: Circular 56x56px
- `mini`: Circular 48x48px
- `extended`: Com label expandido

---

### 4. **BottomSheet**
Modal que desliza de baixo para cima (preferir ao invés de modal central).

```tsx
import { BottomSheet } from '@/components/mobile';

<BottomSheet
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Filtros"
  size="medium"
  footer={<button>Aplicar</button>}
>
  {/* Conteúdo */}
</BottomSheet>
```

**Sizes:**
- `small`: 40vh
- `medium`: 60vh
- `large`: 90vh
- `full`: 100vh

---

### 5. **Toast**
Notificação temporária na parte inferior.

```tsx
import { Toast, useToast } from '@/components/mobile';

const { showToast } = useToast();

showToast({
  message: 'Paciente cadastrado com sucesso',
  type: 'success',
  action: {
    label: 'Desfazer',
    onClick: () => {}
  }
});
```

---

### 6. **SearchBarMobile**
Barra de busca com estilo mobile.

```tsx
import { SearchBarMobile } from '@/components/mobile';

<SearchBarMobile
  placeholder="Buscar pacientes..."
  value={search}
  onChange={setSearch}
/>
```

---

### 7. **MobileListCard**
Card de lista otimizado para mobile.

```tsx
import { MobileListCard } from '@/components/mobile';

<MobileListCard
  avatar="MS"
  title="Maria Silva"
  subtitle="45 anos • Unimed"
  trailing={<Badge>Ativo</Badge>}
  onClick={() => navigate(`/paciente/${id}`)}
/>
```

---

### 8. **TabsMobile**
Tabs horizontais com scroll.

```tsx
import { TabsMobile } from '@/components/mobile';

<TabsMobile
  tabs={[
    { id: 'dados', label: 'Dados' },
    { id: 'historico', label: 'Histórico' }
  ]}
  activeTab={activeTab}
  onChange={setActiveTab}
/>
```

---

### 9. **DatePickerScroll**
Seletor de data horizontal com scroll.

```tsx
import { DatePickerScroll } from '@/components/mobile';

<DatePickerScroll
  selectedDate={date}
  onSelectDate={setDate}
  daysToShow={14}
  hasEventsOn={[new Date()]}
/>
```

---

### 10. **StepperMobile**
Indicador de passos para formulários multi-etapa.

```tsx
import { StepperMobile } from '@/components/mobile';

<StepperMobile
  steps={[
    { id: 'paciente', label: 'Paciente' },
    { id: 'horario', label: 'Horário' },
    { id: 'confirmacao', label: 'Confirmação' }
  ]}
  currentStep="paciente"
/>
```

---

## 📱 Telas Mobile Implementadas

### 1. **DashboardMobile**
Dashboard mobile com:
- Header com gradiente
- Summary cards (horizontal scroll)
- Próximas consultas
- Quick actions (grid 2x2)
- Alertas e notificações
- Bottom navigation
- FAB

```tsx
import { DashboardMobile } from '@/components/mobile';

<Route path="/" element={<DashboardMobile />} />
```

---

### 2. **AgendaMobile**
Agenda com:
- Date picker horizontal
- Consultas agrupadas (manhã, tarde, noite)
- Cards de consulta coloridos
- Filtros (bottom sheet)
- Empty state
- FAB para nova consulta

```tsx
import { AgendaMobile } from '@/components/mobile';

<Route path="/agenda" element={<AgendaMobile />} />
```

---

### 3. **PacientesMobile**
Lista de pacientes com:
- Search bar sticky
- Filter chips
- Lista infinita
- Ações rápidas (ligar, WhatsApp)
- FAB para novo paciente

```tsx
import { PacientesMobile } from '@/components/mobile';

<Route path="/pacientes" element={<PacientesMobile />} />
```

---

### 4. **DetalhePacienteMobile**
Detalhes do paciente com:
- Header com avatar
- Tabs (Dados, Histórico, Documentos)
- Informações agrupadas
- Ações sticky no footer

```tsx
import { DetalhePacienteMobile } from '@/components/mobile';

<Route path="/paciente/:id" element={<DetalhePacienteMobile />} />
```

---

## 📖 Guia de Uso

### 1. Detectar Mobile
Use o hook `useIsMobile`:

```tsx
import { useIsMobile } from '@/hooks/useIsMobile';

function MyComponent() {
  const isMobile = useIsMobile();
  
  return isMobile ? <MobileView /> : <DesktopView />;
}
```

### 2. Usar Wrapper Responsivo
Use o `ResponsiveWrapper` para alternar automaticamente:

```tsx
import { ResponsiveWrapper } from '@/components/shared/ResponsiveWrapper';
import { AgendaMobile } from '@/components/mobile';
import { AgendaProfissional } from '@/components/agenda';

function AgendaPage() {
  return (
    <ResponsiveWrapper
      mobileComponent={AgendaMobile}
      desktopComponent={AgendaProfissional}
    />
  );
}
```

### 3. Aplicar Classes Mobile
Use as classes CSS mobile definidas em `/styles/mobile.css`:

```tsx
// Esconder no mobile
<div className="hide-mobile">Desktop only</div>

// Mostrar apenas no mobile
<div className="show-mobile hide-desktop">Mobile only</div>

// Safe area padding
<div className="pb-safe">Content com padding bottom safe</div>

// Margin para Bottom Nav
<div className="mb-nav">Content acima do bottom nav</div>

// Touch feedback
<button className="touch-feedback">Botão com feedback</button>
```

---

## ✨ Boas Práticas

### 1. **Touch Targets**
✅ **SEMPRE use mínimo 48x48px para elementos tocáveis**

```tsx
// ❌ ERRADO
<button className="w-8 h-8">Icon</button>

// ✅ CORRETO
<button className="w-12 h-12">Icon</button>
```

### 2. **Font Size**
✅ **Use 16px+ para inputs (evita zoom automático no iOS)**

```tsx
// ❌ ERRADO
<input className="text-sm" /> // 14px - iOS vai dar zoom

// ✅ CORRETO
<input className="text-base" /> // 16px - sem zoom
```

### 3. **Safe Areas**
✅ **Sempre considere safe areas do iOS**

```tsx
// ✅ CORRETO
<div className="pb-safe">
  <button>Salvar</button>
</div>
```

### 4. **Bottom Navigation**
✅ **Reserve espaço para o bottom nav em todas as páginas**

```tsx
// ✅ CORRETO
<div className="pb-nav">
  {/* Conteúdo da página */}
</div>
```

### 5. **Scroll**
✅ **Permita scroll suave e natural**

```tsx
// ✅ CORRETO - Scroll horizontal com snap
<div className="flex overflow-x-auto scrollbar-hide snap-x">
  <div className="snap-start">Item 1</div>
  <div className="snap-start">Item 2</div>
</div>
```

### 6. **Performance**
✅ **Use animações de Motion com moderação**

```tsx
// ✅ CORRETO - Animação sutil
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.2 }}
>
  Content
</motion.div>
```

### 7. **Gestos**
✅ **Implemente gestos nativos (swipe, pull-to-refresh)**

```tsx
// ✅ CORRETO - Swipe actions em lista
<SwipeableListItem
  onSwipeLeft={() => deleteItem()}
  onSwipeRight={() => editItem()}
>
  Content
</SwipeableListItem>
```

---

## 🎨 Design Tokens Mobile

### Cores
```css
Primary:   #4a7c65
Secondary: #e85d3f
Success:   #10b981
Warning:   #f59e0b
Error:     #e85d3f
```

### Espaçamento
```css
Space/1:  4px
Space/2:  8px   (mais usado)
Space/3:  12px  (padding botões)
Space/4:  16px  (PADRÃO - padding tela)
Space/6:  24px  (separação seções)
```

### Border Radius
```css
rounded-lg:  8px  (botões pequenos)
rounded-xl:  12px (cards)
rounded-2xl: 16px (modais)
rounded-full: 50% (avatares, FAB)
```

---

## 📦 Arquivos Criados

```
/styles/
  └── mobile.css                       # CSS mobile completo

/components/mobile/
  ├── index.ts                         # Exportações
  ├── BottomNavigation.tsx             # Navegação inferior
  ├── MobileAppBar.tsx                 # Barra superior
  ├── FAB.tsx                          # Floating Action Button
  ├── BottomSheet.tsx                  # Modal bottom sheet
  ├── Toast.tsx                        # Notificações toast
  ├── SearchBarMobile.tsx              # Busca mobile
  ├── MobileListCard.tsx               # Card de lista
  ├── TabsMobile.tsx                   # Tabs horizontais
  ├── DatePickerScroll.tsx             # Seletor de data
  ├── StepperMobile.tsx                # Indicador de passos
  ├── DashboardMobile.tsx              # Dashboard mobile
  ├── AgendaMobile.tsx                 # Agenda mobile
  ├── PacientesMobile.tsx              # Lista pacientes
  └── DetalhePacienteMobile.tsx        # Detalhes paciente

/hooks/
  └── useIsMobile.ts                   # Hook detecção mobile

/components/shared/
  └── ResponsiveWrapper.tsx            # Wrapper responsivo
```

---

## 🚀 Próximos Passos

### Telas Pendentes
- [ ] FormularioAgendamentoMobile (com stepper)
- [ ] ProntuarioMobile (timeline vertical)
- [ ] FinanceiroMobile (dashboard financeiro)
- [ ] ConfiguracoesMobile (página "Mais")
- [ ] PerfilProfissionalMobile

### Features Pendentes
- [ ] Pull-to-refresh
- [ ] Infinite scroll
- [ ] Swipe actions em listas
- [ ] Offline mode
- [ ] Push notifications
- [ ] Biometria (Face ID / Touch ID)
- [ ] Camera para upload de documentos
- [ ] Share API
- [ ] Geolocalização

---

## 📞 Suporte

Para dúvidas ou problemas com o sistema mobile, consulte a documentação do Design System ou entre em contato com a equipe de desenvolvimento.

**Versão:** 1.0.0  
**Data:** Janeiro 2026  
**Design System:** "Saúde Humanizada Contemporânea" v1.0.0
