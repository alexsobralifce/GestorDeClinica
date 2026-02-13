import { Search, X } from 'lucide-react';
import { useState } from 'react';

interface SearchBarMobileProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function SearchBarMobile({
  placeholder = 'Buscar...',
  value,
  onChange,
  onFocus,
  onBlur,
}: SearchBarMobileProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className={`search-bar-mobile ${isFocused ? 'focused' : ''}`}>
      <Search className="search-bar-mobile-icon" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className="search-bar-mobile-input"
      />
      {value && (
        <button onClick={handleClear} className="search-bar-mobile-clear" aria-label="Limpar">
          <X />
        </button>
      )}
    </div>
  );
}
