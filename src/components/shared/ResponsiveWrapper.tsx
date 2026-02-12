import { useIsMobile } from '../../hooks/useIsMobile';

interface ResponsiveWrapperProps {
  mobileComponent: React.ComponentType;
  desktopComponent: React.ComponentType;
}

/**
 * Componente wrapper que renderiza a versão mobile ou desktop
 * baseado no tamanho da tela
 */
export function ResponsiveWrapper({
  mobileComponent: MobileComponent,
  desktopComponent: DesktopComponent,
}: ResponsiveWrapperProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileComponent />;
  }

  return <DesktopComponent />;
}
