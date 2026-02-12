interface TabMobileProps {
  tabs: Array<{
    id: string;
    label: string;
  }>;
  activeTab: string;
  onChange: (tabId: string) => void;
}

export function TabsMobile({ tabs, activeTab, onChange }: TabMobileProps) {
  return (
    <div className="tabs-mobile">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`tab-mobile ${activeTab === tab.id ? 'active' : ''}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
